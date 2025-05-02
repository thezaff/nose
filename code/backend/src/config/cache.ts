import Redis from 'ioredis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Redis client
const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0'),
    retryStrategy: (times) => {
        // Retry connection with exponential backoff
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

// Handle Redis connection events
redisClient.on('connect', () => {
    console.log('Redis client connected');
});

redisClient.on('error', (err) => {
    console.error('Redis client error:', err);
});

// Cache service
export class CacheService {
    private static instance: CacheService;
    private client: Redis;
    private defaultTTL: number = 3600; // 1 hour in seconds

    private constructor() {
        this.client = redisClient;
    }

    public static getInstance(): CacheService {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }
        return CacheService.instance;
    }

    /**
     * Set a value in the cache
     * @param key Cache key
     * @param value Value to cache
     * @param ttl Time to live in seconds (optional)
     */
    public async set(key: string, value: any, ttl?: number): Promise<void> {
        try {
            const stringValue = JSON.stringify(value);
            if (ttl) {
                await this.client.set(key, stringValue, 'EX', ttl);
            } else {
                await this.client.set(key, stringValue, 'EX', this.defaultTTL);
            }
        } catch (error) {
            console.error(`Error setting cache key ${key}:`, error);
        }
    }

    /**
     * Get a value from the cache
     * @param key Cache key
     * @returns Cached value or null if not found
     */
    public async get<T>(key: string): Promise<T | null> {
        try {
            const value = await this.client.get(key);
            if (!value) return null;
            return JSON.parse(value) as T;
        } catch (error) {
            console.error(`Error getting cache key ${key}:`, error);
            return null;
        }
    }

    /**
     * Delete a value from the cache
     * @param key Cache key
     */
    public async delete(key: string): Promise<void> {
        try {
            await this.client.del(key);
        } catch (error) {
            console.error(`Error deleting cache key ${key}:`, error);
        }
    }

    /**
     * Clear all cache entries with a specific prefix
     * @param prefix Key prefix
     */
    public async clearByPrefix(prefix: string): Promise<void> {
        try {
            const keys = await this.client.keys(`${prefix}:*`);
            if (keys.length > 0) {
                await this.client.del(...keys);
            }
        } catch (error) {
            console.error(`Error clearing cache with prefix ${prefix}:`, error);
        }
    }

    /**
     * Get or set cache value (if not exists)
     * @param key Cache key
     * @param fetchFn Function to fetch data if not in cache
     * @param ttl Time to live in seconds (optional)
     * @returns Cached or fetched value
     */
    public async getOrSet<T>(
        key: string,
        fetchFn: () => Promise<T>,
        ttl?: number
    ): Promise<T> {
        try {
            // Try to get from cache first
            const cachedValue = await this.get<T>(key);
            if (cachedValue !== null) {
                return cachedValue;
            }

            // If not in cache, fetch the data
            const fetchedValue = await fetchFn();

            // Store in cache
            await this.set(key, fetchedValue, ttl);

            return fetchedValue;
        } catch (error) {
            console.error(`Error in getOrSet for key ${key}:`, error);
            // If cache fails, just fetch the data directly
            return await fetchFn();
        }
    }
}

// Export singleton instance
export const cacheService = CacheService.getInstance();

// Export Redis client for direct access if needed
export default redisClient;