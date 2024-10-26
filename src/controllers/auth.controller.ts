import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authenticateUser, changePassword } from '../services/auth.service';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await authenticateUser(email, password);

        const token: string = jwt.sign(
            { 
                id: user.id, 
                email: user.email 
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token });
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
}

export const handleChangePassword = async (req: Request, res: Response) => {
    try {
        const { userId, newPassword } = req.body;
        const result = await changePassword(userId, newPassword);
        res.json(result);
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
}