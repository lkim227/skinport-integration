// tests/e2e/items.e2e.test.ts
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import app from '../../app';
import redisClient from '../../db/redis';
import axios from 'axios';
import { Item } from '../../interfaces/item.interface';

// Mock data for testing
const mockItems: Item[] = [
    { market_hash_name: "Tradable Item", min_price: 2.5, max_price: 5.0, quantity: 5 },
    { market_hash_name: "Non-Tradable Item", min_price: 1.0, max_price: 3.0, quantity: 0 },
];

describe('Items E2E Tests', () => {
    beforeAll(async () => {
        // Mock the Skinport API response using axios
        vi.spyOn(axios, 'get').mockResolvedValue({
            data: mockItems,
        });

        // Clear any cached data in Redis before starting tests
        await redisClient.del('min_price_items');
    });

    afterAll(async () => {
        // Clear any cached data in Redis after tests
        await redisClient.del('min_price_items');

        // Restore original axios behavior
        vi.restoreAllMocks();
    });

    it('should fetch items from Skinport API and cache the result', async () => {
        const response = await request(app).get('/items');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('tradable');
        expect(response.body).toHaveProperty('nonTradable');

        const { tradable, nonTradable } = response.body;

        // Validate the structure and values of the tradable item
        expect(tradable).toMatchObject({
            market_hash_name: "Tradable Item",
            min_price: 2.5,
            max_price: 5.0,
            quantity: 5,
        });

        // Validate the structure and values of the non-tradable item
        expect(nonTradable).toMatchObject({
            market_hash_name: "Non-Tradable Item",
            min_price: 1.0,
            max_price: 3.0,
            quantity: 0,
        });

        // Verify that the response is cached in Redis
        const cachedItems = await redisClient.get('min_price_items');
        expect(cachedItems).not.toBeNull();
    });

    it('should return cached items from Redis if available', async () => {
        // First, populate the cache by making a request
        await request(app).get('/items');

        // Verify that cached data is used instead of making an API call
        const axiosSpy = vi.spyOn(axios, 'get');
        
        const response = await request(app).get('/items');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('tradable');
        expect(response.body).toHaveProperty('nonTradable');

        // Check that the axios get method was not called again, proving cached data was used
        expect(axiosSpy).not.toHaveBeenCalled();
    });
});
