// src/services/auth.service.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authenticateUser, changePassword } from './auth.service';
import { getUserByEmail, updateUserPassword } from '../models/user.model';

// Mock the user model functions
vi.mock('../models/user.model');

describe('Auth Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('authenticateUser', () => {
        it('should return user data for valid credentials', async () => {
            const mockUser = { 
                id: 1, 
                email: 'test@example.com', 
                password: 'password', 
                balance: 100 };

            // Mock getUserByEmail to return a valid user
            vi.mocked(getUserByEmail).mockResolvedValue(mockUser);

            const result = await authenticateUser('test@example.com', 'password');

            expect(getUserByEmail).toHaveBeenCalledWith('test@example.com');
            expect(result).toEqual({ id: mockUser.id, email: mockUser.email });
        });

        it('should throw an error for invalid credentials', async () => {
            // Mock getUserByEmail to return a user with a different password
            vi.mocked(getUserByEmail).mockResolvedValue({
                id: 1,
                email: 'test@example.com',
                password: 'wrongpassword',
                balance: 100
            });

            await expect(authenticateUser('test@example.com', 'password')).rejects.toThrow('Invalid credentials');
            expect(getUserByEmail).toHaveBeenCalledWith('test@example.com');
        });

        it('should throw an error if user does not exist', async () => {
            // Mock getUserByEmail to return null
            vi.mocked(getUserByEmail).mockResolvedValue(null);

            await expect(authenticateUser('nonexistent@example.com', 'password')).rejects.toThrow('Invalid credentials');
            expect(getUserByEmail).toHaveBeenCalledWith('nonexistent@example.com');
        });
    });

    describe('changePassword', () => {
        it('should update password for a valid user', async () => {
            const mockUser = { 
                id: 1, 
                email: 'test@example.com', 
                password: 'newpassword', 
                balance: 100 
            };

            // Mock updateUserPassword to return a user object
            vi.mocked(updateUserPassword).mockResolvedValue(mockUser);

            const result = await changePassword(1, 'newpassword');

            expect(updateUserPassword).toHaveBeenCalledWith(1, 'newpassword');
            expect(result).toBe('Password updated successfully');
        });

        it('should throw an error if user not found', async () => {
            // Mock updateUserPassword to return null
            vi.mocked(updateUserPassword).mockResolvedValue(null);

            await expect(changePassword(1, 'newpassword')).rejects.toThrow('User not found');
            expect(updateUserPassword).toHaveBeenCalledWith(1, 'newpassword');
        });
    });
});
