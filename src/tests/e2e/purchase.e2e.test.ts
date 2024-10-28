// tests/e2e/purchase.e2e.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../app';
import db from '../../db/postgres';
import { getUserByEmail } from '../../models/user.model';

const mockUser = {
    email: 'test@example.com',
    password: 'password123',
    balance: 100
};

const mockItem = {
    itemId: 1,
    market_hash_name: 'Sample Item',
    min_price: 50, // Only min_price is used as per your requirements
    quantity: 10
};

describe('Purchase E2E Tests', () => {
    beforeAll(async () => {
        await db`
            INSERT INTO users (email, password, balance)
            VALUES (${mockUser.email}, ${mockUser.password}, ${mockUser.balance})
            ON CONFLICT (email) DO NOTHING
        `;

        // Insert a mock item
        await db`
            INSERT INTO items (name, min_price, quantity)
            VALUES (${mockItem.market_hash_name}, ${mockItem.min_price}, ${mockItem.quantity})
            ON CONFLICT (id) DO NOTHING
        `;
    });

    afterAll(async () => {
        await db`DELETE FROM users WHERE email = ${mockUser.email}`;
        await db`DELETE FROM items WHERE id = ${mockItem.itemId}`;
    });

    // it('should successfully purchase an item and update the balance', async () => {
    //     const user = await getUserByEmail(mockUser.email);
    //     if (!user) throw new Error("User setup failed"); // Ensure the user exists

    //     const response = await request(app)
    //         .post('/purchase')
    //         .send({
    //             userEmail: mockUser.email,
    //             itemId: mockItem.itemId,
    //             price: mockItem.min_price
    //         });
    //     expect(response.status).toBe(200);
    //     expect(response.body).toHaveProperty('newBalance');

    //     const newBalance = mockUser.balance - mockItem.min_price;
    //     expect(newBalance).toBe(response);

    //     const updatedUser = await getUserByEmail(mockUser.email);
    //     expect(updatedUser?.balance).toBe(newBalance);
    // });
// there is no sign up an user function now - disable this at this moment
    // it('should fail to purchase an item due to insufficient balance', async () => {
    //     const user = await getUserByEmail(mockUser.email);
    //     if (!user) throw new Error("User setup failed");

    //     const response = await request(app)
    //         .post('/purchase')
    //         .send({
    //             userId: user.id,
    //             itemId: mockItem.itemId,
    //             price: mockUser.balance + 1, // Set price higher than current balance
    //         });

    //     expect(response.status).toBe(400);
    //     expect(response.body.message).toBe('Insufficient balance');
    // });

    it('should return error if user does not exist', async () => {
        const response = await request(app)
            .post('/purchase')
            .send({
                userEmail: "test@gmail.com", // Using a non-existent userId
                itemId: mockItem.itemId,
                price: mockItem.min_price,
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('User not found');
    });
});
