/**
 * NLP Service
 * Provides natural language processing capabilities for the agent system
 */

import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

// Load environment variables
dotenv.config();

// Configure OpenAI API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export class NLPService {
    /**
     * Extract entities from text
     * @param text The text to extract entities from
     * @returns A map of entity types to entity values
     */
    async extractEntities(text: string): Promise<Record<string, string[]>> {
        try {
            const prompt = `
                Extract named entities from the following text. Return a JSON object where keys are entity types 
                (person, organization, location, date, concept, topic) and values are arrays of entity strings.
                Only include entity types that are present in the text.
                
                Text: "${text}"
                
                JSON:
            `;

            const response = await openai.createChatCompletion({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are an AI assistant that extracts named entities from text and returns them in JSON format." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.3,
                max_tokens: 500
            });

            const content = response.data.choices[0]?.message?.content?.trim();
            if (!content) {
                return {};
            }

            // Extract JSON from the response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                return {};
            }

            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error('Error extracting entities:', error);
            return {};
        }
    }

    /**
     * Extract topics from text
     * @param text The text to extract topics from
     * @returns An array of topics
     */
    async extractTopics(text: string): Promise<string[]> {
        try {
            const prompt = `
                Extract the main topics from the following text. Return a JSON array of topic strings.
                Limit to 3-5 most important topics.
                
                Text: "${text}"
                
                JSON:
            `;

            const response = await openai.createChatCompletion({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are an AI assistant that extracts main topics from text and returns them in JSON format." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.3,
                max_tokens: 200
            });

            const content = response.data.choices[0]?.message?.content?.trim();
            if (!content) {
                return [];
            }

            // Extract JSON from the response
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                return [];
            }

            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error('Error extracting topics:', error);
            return [];
        }
    }

    /**
     * Calculate semantic similarity between two texts
     * @param text1 First text
     * @param text2 Second text
     * @returns Similarity score between 0 and 1
     */
    async calculateSimilarity(text1: string, text2: string): Promise<number> {
        try {
            const prompt = `
                Calculate the semantic similarity between these two texts on a scale from 0 to 1,
                where 0 means completely unrelated and 1 means identical in meaning.
                
                Text 1: "${text1}"
                Text 2: "${text2}"
                
                Similarity score (just the number):
            `;

            const response = await openai.createChatCompletion({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are an AI assistant that calculates semantic similarity between texts." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.1,
                max_tokens: 10
            });

            const content = response.data.choices[0]?.message?.content?.trim();
            if (!content) {
                return 0;
            }

            // Extract the number from the response
            const scoreMatch = content.match(/([0-9]*[.])?[0-9]+/);
            if (!scoreMatch) {
                return 0;
            }

            return parseFloat(scoreMatch[0]);
        } catch (error) {
            console.error('Error calculating similarity:', error);
            return 0;
        }
    }

    /**
     * Generate a summary of text
     * @param text The text to summarize
     * @param maxLength Maximum length of the summary in characters
     * @returns The summary
     */
    async generateSummary(text: string, maxLength: number = 200): Promise<string> {
        try {
            const prompt = `
                Summarize the following text in a concise way, capturing the main points.
                Keep the summary under ${maxLength} characters.
                
                Text: "${text}"
                
                Summary:
            `;

            const response = await openai.createChatCompletion({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are an AI assistant that generates concise summaries of text." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.5,
                max_tokens: Math.ceil(maxLength / 4)  // Approximate tokens based on characters
            });

            return response.data.choices[0]?.message?.content?.trim() || '';
        } catch (error) {
            console.error('Error generating summary:', error);
            return '';
        }
    }

    /**
     * Answer a question based on provided context
     * @param question The question to answer
     * @param context The context to use for answering
     * @returns The answer
     */
    async answerQuestion(question: string, context: string): Promise<string> {
        try {
            const prompt = `
                Answer the following question based on the provided context.
                If the context doesn't contain enough information to answer the question,
                say "I don't have enough information to answer this question."
                
                Context: "${context}"
                
                Question: "${question}"
                
                Answer:
            `;

            const response = await openai.createChatCompletion({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are an AI assistant that answers questions based on provided context." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.5,
                max_tokens: 500
            });

            return response.data.choices[0]?.message?.content?.trim() || '';
        } catch (error) {
            console.error('Error answering question:', error);
            return 'Sorry, I encountered an error while processing your question.';
        }
    }
}