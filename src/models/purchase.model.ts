import sql from '../db/postgres';
import { Purchase } from '../interfaces/purchase.interface';

export const makePurchase = async (userId: number, itemId: number): Promise<Purchase | null> => {
    const purchase = await sql<Purchase[]>`
        INSERT INTO purchases (user_id, item_id)
        VALUES (${userId}, ${itemId})
        RETURNING *;
    `;
    return purchase[0] || null;
};
