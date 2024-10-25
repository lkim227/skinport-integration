import { Request, Response } from "express";
import { fetchItemsFromSkinport } from "../services/items.service";

export const getItems = async (req: Request, res: Response) => {
    try {
        const items = fetchItemsFromSkinport();
        
        res.json(items);
    } catch (error) {
        if (error instanceof Error)
            res.status(401).json({ message: error.message });
        else
            res.status(500).json({ message: 'Unknown error occured' });
    }
}
