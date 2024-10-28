import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
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
        // Get the user payload from the decoded token
        const user = res.locals.user as JwtPayload;

        if (!user || typeof user.id !== 'number') {
            res.status(403).json({ message: 'Forbidden: Invalid user token' });
            return;
        }

        const { newPassword } = req.body;
        const result = await changePassword(user.id, newPassword);

        res.json({ message: result });
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unknown error occurred' });
        }
    }
}