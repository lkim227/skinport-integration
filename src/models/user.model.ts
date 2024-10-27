import sql from '../db/postgres';
import { User } from '../interfaces/user.interface';

export const getUserByEmail = async (
    email: string
): Promise<User | null> => {
    const user = await sql<User[]>`
        SELECT * FROM users WHERE email = ${email};
    `;

    return user[0] || null;
};

export const updateUserPassword = async (
    userId: number, 
    newPassword: string
): Promise<User | null> => {
    const updatedUser = await sql<User[]>`
        UPDATE users SET password = ${newPassword} WHERE id = ${userId}
        RETURNING *;
    `;

    return updatedUser[0] || null;
};

// Update the user's balance after purchasing
export const updateUserBalance = async (
    userId: number, 
    newBalance: number
): Promise<User | null> => {
    const updatedUser = await sql<User[]>`
        UPDATE users SET balance = ${newBalance} WHERE id = ${userId}
        RETURNING *;
    `;

    return updatedUser[0] || null;
};
