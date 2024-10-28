import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET:string = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const authenticate = (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader: string | undefined = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(403).json({ message: 'Forbidden: Invalid or missing token' });
        return Promise.resolve();
    }
    
    const token:string = authHeader.split(' ')[1];

    try {
        const decoded: string | JwtPayload = jwt.verify(token, JWT_SECRET);
        res.locals.user = decoded;
        console.log("Middleware executed: ", res.locals.user);
        next();
        return Promise.resolve();
    } catch (err) {
        res.status(403).json({ message: 'Forbidden: Invalid token' });
        return Promise.resolve();
    }
};
