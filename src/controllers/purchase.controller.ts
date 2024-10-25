import { Request, Response } from 'express';
import { purchaseItem } from '../services/purchase.service';

export const handlePurchase = async(req: Request, res: Response) => {
    try {
        const { userId, itemId, price } = req.body;
        const result = await purchaseItem(userId, itemId, price);
        res.json(result);
    } catch (error) {
        if (error instanceof Error) 
            res.status(400).json({ message: error.message });
        else 
            res.status(500).json({ message: 'Unknown error occured' });
    }
}