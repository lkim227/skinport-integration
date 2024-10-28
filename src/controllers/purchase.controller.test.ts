/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { handlePurchase } from './purchase.controller';
import { purchaseItem } from '../services/purchase.service';

// Mock purchaseItem function from purchase service
vi.mock('../services/purchase.service', () => ({
    purchaseItem: vi.fn(),
}));

describe('Purchase Controller', () => {
    const mockRequest = {
        body: { userEmail: 'test@example.com', itemId: 101, price: 50 },
    } as Partial<Request>;

    const mockResponse = {
        json: vi.fn(),
        status: vi.fn(() => mockResponse), // Chainable method
    } as unknown as Response;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return purchase result on successful purchase', async () => {
        const mockResponseData = { newBalance: 150 };
        vi.mocked(purchaseItem).mockResolvedValueOnce(mockResponseData);
    
        await handlePurchase(mockRequest as Request, mockResponse);
    
        expect(purchaseItem).toHaveBeenCalledWith('test@example.com', 101, 50); 
        expect(mockResponse.json).toHaveBeenCalledWith(mockResponseData);
        expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 400 and error message on known error (e.g., Insufficient balance)', async () => {
        const errorMessage = 'Insufficient balance';
        vi.mocked(purchaseItem).mockRejectedValueOnce(new Error(errorMessage));

        await handlePurchase(mockRequest as Request, mockResponse);

        expect(purchaseItem).toHaveBeenCalledWith('test@example.com', 101, 50);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    });

    it('should return 500 and unknown error message for non-error objects', async () => {
        vi.mocked(purchaseItem).mockRejectedValueOnce('Some unexpected error');

        await handlePurchase(mockRequest as Request, mockResponse);

        expect(purchaseItem).toHaveBeenCalledWith('test@example.com', 101, 50);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Unknown error occurred' });
    });
});
