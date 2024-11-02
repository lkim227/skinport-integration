import axios from 'axios';
import redisClient from '../db/redis';
import { Item } from '../interfaces/item.interface';

const SKINPORT_API_URL = process.env.SKINPORT_API_URL || '';
const SKINPORT_CLIENT_ID = process.env.SKINPORT_CLIENT_ID || '';
const SKINPORT_CLIENT_SECRET = process.env.SKINPORT_CLIENT_SECRET || '';

if (!SKINPORT_API_URL || !SKINPORT_CLIENT_ID || !SKINPORT_CLIENT_SECRET) {
    throw new Error('Skinport API credentials are not defined in environment variables');
}

const encodedAuth = Buffer.from(`${SKINPORT_CLIENT_ID}:${SKINPORT_CLIENT_SECRET}`).toString('base64');
const AUTH_HEADER = `Basic ${encodedAuth}`;

export const fetchItemsFromSkinport = async () => {
    const cachedItems = await redisClient.get('min_price_items');

    if (cachedItems) {
        return JSON.parse(cachedItems) as { tradable: Item | null; nonTradable: Item | null };
    }

    const response = await axios.get<Item[]>(
        SKINPORT_API_URL, 
        {
            headers: {
                'Authorization': AUTH_HEADER
            },
            params: {
                app_id: 730,
                currency: 'EUR'
            }
        }
    );
    // if (!Array.isArray(response.data)) {
    //     throw new Error('Invalid data format from Skinport API');
    // }

    // /**
    //  * Find the item with the lowest price in the specified category
    //  * @param items - list of items
    //  * @param isTradable - condition to check tradability
    //  */
    // const findMinPriceItem = (items: Item[], isTradable: boolean): Item | null => {
    //     const filteredItems = items.filter(item => 
    //         (isTradable ? item.quantity > 0 : item.quantity === 0)
    //     );

    //     if (filteredItems.length === 0) {
    //         return null;
    //     }

    //     return filteredItems.reduce((minItem, item) => 
    //         minItem.min_price !== null && 
    //         item.min_price !== null && 
    //         minItem.min_price < item.min_price ? minItem : item
    //     );
    // };

    // // Retrieve the items with minimum prices for both tradable and non-tradable items
    // const tradableItem = findMinPriceItem(response.data, true);
    // const nonTradableItem = findMinPriceItem(response.data, false);

    // const result = { tradable: tradableItem, nonTradable: nonTradableItem };

    // // Cache the result for 5 minutes
    // await redisClient.set('min_price_items', JSON.stringify(result), { EX: 300 });

    return response;
};
