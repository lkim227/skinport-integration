import axios from 'axios';
import redisClient from '../db/redis';
import { Item } from '../interfaces/item.interface';

const SKINPORT_API_URL = process.env.SKINPORT_API_URL || '';

if (!SKINPORT_API_URL) {
    throw new Error('SKINPORT_API_URL is not defined in environment variables');
}

export const fetchItemsFromSkinport = async (): Promise<Item[]> => {
    const cachedItems = await redisClient.get('items');

    if (cachedItems) {
        return JSON.parse(cachedItems) as Item[];
    }

    const response = await axios.get<Item[]>(
        SKINPORT_API_URL, 
        {
            params: {
                app_id: 730,
                currency: 'EUR',
            }
        }
    );

    if (!Array.isArray(response.data)) {
        throw new Error('Invalid data format from Skinport API');
    }

    const items: Item[] = response.data.map((item: Item) => ({
        id: item.id,
        name: item.name,
        min_price: item.non_tradable_price || null,
        max_price: item.tradable_price || null,
        tradable_price: item.tradable_price || null,
        non_tradable_price: item.non_tradable_price || null
    }));

    await redisClient.set('items', JSON.stringify(items), { EX: 300 });

    return items;
};
