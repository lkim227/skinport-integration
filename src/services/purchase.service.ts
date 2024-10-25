import { makePurchase } from '../models/purchase.model';
import { getUserByEmail } from '../models/user.model';

interface PurchaseResponse {
  newBalance: number;
}

export const purchaseItem = async (userId: number, itemId: number, itemPrice: number): Promise<PurchaseResponse> => {
    const user = await getUserByEmail(userId);

    if (!user) {
        throw new Error('User not found');
    }

    if (user.balance < itemPrice) {
        throw new Error('Insufficient balance');
    }

    const newBalance = user.balance - itemPrice;
    await makePurchase(userId, itemId);

    return { newBalance };
};
