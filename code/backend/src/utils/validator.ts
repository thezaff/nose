/**
 * Utility functions for request validation
 */

// Email validation
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation (at least 8 characters, including at least one number and one letter)
export const isValidPassword = (password: string): boolean => {
    if (password.length < 8) return false;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasLetter && hasNumber;
};

// UUID validation
export const isValidUUID = (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};

// Validate required fields in an object
export const validateRequiredFields = (obj: any, requiredFields: string[]): string[] => {
    const missingFields: string[] = [];

    for (const field of requiredFields) {
        if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
            missingFields.push(field);
        }
    }

    return missingFields;
};

// Sanitize an object by removing specified fields
export const sanitizeObject = <T>(obj: T, fieldsToRemove: string[]): Partial<T> => {
    const sanitized = { ...obj as object } as any;

    for (const field of fieldsToRemove) {
        delete sanitized[field];
    }

    return sanitized as Partial<T>;
};