/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { purchaseItem } from './purchase.service';
import { makePurchase } from '../models/purchase.model';
import { getUserByEmail, updateUserBalance } from '../models/user.model';
import { User } from '../interfaces/user.interface';

// Mocking model functions
vi.mock('../models/purchase.model', () => ({
    makePurchase: vi.fn(),
}));
vi.mock('../models/user.model', () => ({
    getUserByEmail: vi.fn(),
    updateUserBalance: vi.fn(),
}));

describe('purchaseItem', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should throw an error if the user is not found', async () => {
        vi.mocked(getUserByEmail).mockResolvedValueOnce(null); // User not found

        await expect(purchaseItem('test@example.com', 101, 50)).rejects.toThrow('User not found');
        
        expect(getUserByEmail).toHaveBeenCalledWith('test@example.com');
        expect(makePurchase).not.toHaveBeenCalled();
        expect(updateUserBalance).not.toHaveBeenCalled();
    });

    it('should throw an error if the user has insufficient balance', async () => {
        // Mock user with insufficient balance
        const mockUser: User = { id: 1, email: 'test@example.com', password: 'password123', balance: 30 };
        vi.mocked(getUserByEmail).mockResolvedValueOnce(mockUser);

        await expect(purchaseItem('test@example.com', 101, 50)).rejects.toThrow('Insufficient balance');
        
        expect(getUserByEmail).toHaveBeenCalledWith('test@example.com');
        expect(makePurchase).not.toHaveBeenCalled();
        expect(updateUserBalance).not.toHaveBeenCalled();
    });

    it('should complete the purchase if the user has sufficient balance', async () => {
        // Mock user with sufficient balance
        const mockUser: User = { id: 1, email: 'test@example.com', password: 'password123', balance: 200 };
        const mockPurchase = { id: 1, user_id: 1, item_id: 101, purchase_date: new Date().toISOString() };
        const newBalance = mockUser.balance - 50;

        vi.mocked(getUserByEmail).mockResolvedValueOnce(mockUser);
        vi.mocked(makePurchase).mockResolvedValueOnce(mockPurchase);
        vi.mocked(updateUserBalance).mockResolvedValueOnce(null); // Assuming update doesn't return anything

        const result = await purchaseItem('test@example.com', 101, 50);

        expect(getUserByEmail).toHaveBeenCalledWith('test@example.com');
        expect(makePurchase).toHaveBeenCalledWith(mockUser.id, 101);
        expect(updateUserBalance).toHaveBeenCalledWith(mockUser.id, newBalance);
        expect(result).toEqual({ newBalance });
    });
});
