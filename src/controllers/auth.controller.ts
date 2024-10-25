import { Request, Response } from 'express';
import { authenticateUser, changePassword } from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await authenticateUser(email, password);
        res.json(result);
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