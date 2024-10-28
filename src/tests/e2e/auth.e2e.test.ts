// tests/e2e/auth.e2e.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import jwt from 'jsonwebtoken';
import db from '../../db/postgres';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

describe('Auth E2E Tests', () => {
    let token: string;
    const mockUser = {
        email: 'test1@example.com',
        password: 'password123'
    };

    beforeAll(async () => {
        await db`SELECT 1`;
        // Insert a mock user into the users table if it does not already exist
        await db`
            INSERT INTO users (email, password, balance)
            VALUES (${mockUser.email}, ${mockUser.password}, 100)
            ON CONFLICT (email) DO NOTHING
        `;
    });

    afterAll(async () => {
        // Clean up: Remove the mock user after tests are done
        await db`DELETE FROM users WHERE email = ${mockUser.email}`;
    });

    it('should login successfully and return a JWT token', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: mockUser.email,
                password: mockUser.password
            });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.message).toBe('Login successful');

        token = response.body.token;

        // Verify the token payload
        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        expect(decoded).toMatchObject({
            email: mockUser.email
        });
    });

    it('should reject login with invalid credentials', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: mockUser.email,
                password: 'wrongpassword'
            });
        
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');
    });

    it('should change password successfully with a valid token', async () => {
        const newPassword = 'newPassword456';

        const response = await request(app)
            .put('/auth/password')
            .set('Authorization', `Bearer ${token}`)
            .send({ newPassword });
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Password updated successfully');

        // Verify that the password has been updated in the database
        const user = await db`SELECT * FROM users WHERE email = ${mockUser.email}`;
        console.log("auth test: ", user);
        expect(user[0].password).toBe(newPassword); // Assuming plain text for testing; in real scenarios, passwords should be hashed
    });

    it('should fail to change password with an invalid token', async () => {
        const response = await request(app)
            .put('/auth/password')
            .set('Authorization', 'Bearer invalidtoken')
            .send({ newPassword: 'somePassword' });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden: Invalid token');
    });

    it('should fail to change password when no token is provided', async () => {
        const response = await request(app)
            .put('/auth/password')
            .send({ newPassword: 'somePassword' });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden: Invalid or missing token');
    });
});
