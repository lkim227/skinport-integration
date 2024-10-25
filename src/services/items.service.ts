import axios from 'axios';
import redisClient from '../db/redis';
import { Item } from '../interfaces/item.interface';

interface CachedItem {
    name: string;
    min_price: number | null;
    max_price: number | null;
    tradable_price: number | null;
}

const SKINPORT_API_URL = process.env.SKINPORT_API_URL;

export const fetchItemsFromSkinport = async (): Promise<CachedItem[]> => {
    const cachedItems = await redisClient.get('items');

    if (cachedItems) {
        return JSON.parse(cachedItems) as CachedItem[];
    }

    const response = await axios.get<Item[]>(SKINPORT_API_URL, {
        params: {
            app_id: 730,
            currency: 'EUR',
        },
    });

    const items: CachedItem[] = response.data.map((item: Item) => ({
        name: item.name,
        min_price: item.price_non_tradable || null,
        max_price: item.price_tradable || null,
        tradable_price: item.price_tradable || null,
    }));

    await redisClient.set('items', JSON.stringify(items), { EX: 300 });

    return items;
};
