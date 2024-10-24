import axios from 'axios';
import redisClient from '../db/redis';
import { Item } from '../interfaces/item.interface';

const SKINPORT_API_URL = process.env.SKINPORT_API_URL;

export const fetchItemsFromSkinport = async (): Promise<Item[]> => {
    const cachedItems = await redisClient.get('items');

    if (cachedItems) {
        return JSON.parse(cachedItems) as Item[];
    }

    const response = await axios.get<Item[]>(SKINPORT_API_URL, {
        params: {
            app_id: 730,
            currency: 'EUR',
        },
    });

    const items: Item[] = response.data.map((item: Item) => ({
        name: item.name,
        min_price: item.non_tradable_price || null,
        max_price: item.tradable_price || null,
        tradable_price: item.tradable_price || null,
    }));

    await redisClient.set('items', JSON.stringify(items), { EX: 300 });

    return items;
};
