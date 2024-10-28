import { Request, Response } from 'express';
import { purchaseItem } from '../services/purchase.service';

export const handlePurchase = async(req: Request, res: Response) => {
    try {
        console.log("test:::", req.body);
        const { userEmail, itemId, price } = req.body;
        const result = await purchaseItem(userEmail, itemId, price);

        res.json(result);
    } catch (error) {
        if (error instanceof Error) 
            res.status(400).json({ message: error.message });
        else 
            res.status(500).json({ message: 'Unknown error occurred' });
    }
}
