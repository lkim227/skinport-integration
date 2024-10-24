import sql from '../db/postgres';
import { Item } from '../interfaces/item.interface';

export const getItems = async (): Promise<Item[]> => {
    const items = await sql<Item[]>`
        SELECT * FROM items;
    `;
    
    return items;
};
