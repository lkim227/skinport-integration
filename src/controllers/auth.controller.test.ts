// src/controllers/auth.controller.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response } from 'express';
import { login, handleChangePassword } from './auth.controller';
import { authenticateUser, changePassword } from '../services/auth.service';
import jwt from 'jsonwebtoken';

// Mock the imported services and dependencies
vi.mock('../services/auth.service');

describe('Auth Controller', () => {
    const mockRequest = (body: any = {}, headers: any = {}) => ({
        body,
        headers,
    }) as Request;

    const mockResponse = () => {
        const res = {} as Response;
        res.status = vi.fn().mockReturnThis();
        res.json = vi.fn().mockReturnThis();
        return res;
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('login', () => {
        it('should return a token for valid credentials', async () => {
            const req = mockRequest({ email: 'test@example.com', password: 'password' });
            const res = mockResponse();

            // Mock the authenticateUser function to return a user object
            vi.mocked(authenticateUser).mockResolvedValue({
                id: 1,
                email: 'test@example.com',
            });

            // Mock jwt.sign to return a test token
            vi.spyOn(jwt, 'sign').mockReturnValue('test-token' as any);

            await login(req, res);

            expect(authenticateUser).toHaveBeenCalledWith('test@example.com', 'password');
            expect(res.json).toHaveBeenCalledWith({ message: 'Login successful', token: 'test-token' });
        });

        it('should return 401 for invalid credentials', async () => {
            const req = mockRequest({ email: 'test@example.com', password: 'wrongpassword' });
            const res = mockResponse();

            // Mock authenticateUser to throw an error
            vi.mocked(authenticateUser).mockRejectedValue(new Error('Invalid credentials'));

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });
    });

    describe('handleChangePassword', () => {
        it('should change password for a valid user', async () => {
            const req = mockRequest({ newPassword: 'newpassword' });
            const res = mockResponse();

            // Mock res.locals.user to have a user ID
            res.locals = { user: { id: 1 } };

            // Mock changePassword to resolve successfully
            vi.mocked(changePassword).mockResolvedValue('Password updated successfully');

            await handleChangePassword(req, res);

            expect(changePassword).toHaveBeenCalledWith(1, 'newpassword');
            expect(res.json).toHaveBeenCalledWith({ message: 'Password updated successfully' });
        });

        it('should return 403 for missing user token', async () => {
            const req = mockRequest({ newPassword: 'newpassword' });
            const res = mockResponse();

            // Mock res.locals.user as undefined to simulate a missing token
            res.locals = {};

            await handleChangePassword(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: Invalid user token' });
        });

        it('should return 401 for invalid user in change password', async () => {
            const req = mockRequest({ newPassword: 'newpassword' });
            const res = mockResponse();

            // Mock res.locals.user to have a user ID
            res.locals = { user: { id: 1 } };

            // Mock changePassword to throw an error
            vi.mocked(changePassword).mockRejectedValue(new Error('User not found'));

            await handleChangePassword(req, res);

            expect(changePassword).toHaveBeenCalledWith(1, 'newpassword');
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });
    });
});
