import { Request, Response } from "express";
import { fetchItemsFromSkinport } from "../services/items.service";
import { JwtPayload } from "jsonwebtoken";

export const getItems = async (req: Request, res: Response) => {
    try {
        const user: JwtPayload | string = res.locals.user;
        if (user == undefined) {
            res.status(403).json({ message: 'Forbidden: No valid token' });
            return;
        }

        const items = fetchItemsFromSkinport();
        res.json(items);
    } catch (error) {
        if (error instanceof Error)
            res.status(401).json({ message: error.message });
        else
            res.status(500).json({ message: 'Unknown error occured' });
    }
}
