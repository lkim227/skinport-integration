import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { getItems } from './items.controller';
import { fetchItemsFromSkinport } from '../services/items.service';

vi.mock('../services/items.service', () => ({
    fetchItemsFromSkinport: vi.fn(),
}));

describe('Items Controller', () => {
    const mockRequest = {} as Request;
    const mockResponse = {
        json: vi.fn(),
        status: vi.fn(() => mockResponse),
        locals: {
            user: { id: 1, email: 'test@example.com' },  // Mock user object
        },
    } as unknown as Response;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return items when fetchItemsFromSkinport is successful', async () => {
        const mockItems = {
            tradable: { market_hash_name: 'AK-47', min_price: 10, max_price: 100, quantity: 20 },
            nonTradable: { market_hash_name: 'M4A1', min_price: 5, max_price: 50, quantity: 0 }
        };

        // Set up the mock implementation to return data
        vi.mocked(fetchItemsFromSkinport).mockResolvedValueOnce(mockItems);

        await getItems(mockRequest, mockResponse);

        expect(fetchItemsFromSkinport).toHaveBeenCalled(); // Check if called
        expect(mockResponse.json).toHaveBeenCalledWith(mockItems);
    });

    it('should return 401 with an error message if fetchItemsFromSkinport throws an error', async () => {
        vi.mocked(fetchItemsFromSkinport).mockRejectedValueOnce(new Error('Service error'));

        await getItems(mockRequest, mockResponse);

        expect(fetchItemsFromSkinport).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Service error' });
    });

    it('should return 500 for unknown errors', async () => {
        vi.mocked(fetchItemsFromSkinport).mockRejectedValueOnce('Unknown error');

        await getItems(mockRequest, mockResponse);

        expect(fetchItemsFromSkinport).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unknown error occurred' });
    });
});
