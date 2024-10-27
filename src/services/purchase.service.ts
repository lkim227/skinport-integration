import { makePurchase } from '../models/purchase.model';
import { getUserByEmail, updateUserBalance } from '../models/user.model';

interface PurchaseResponse {
  newBalance: number;
}

export const purchaseItem = async (
    email: string, 
    itemId: number, 
    itemPrice: number
): Promise<PurchaseResponse> => {

    const user = await getUserByEmail(email);
    const userId = user?.id || 0;

    if (!user) {
        throw new Error('User not found');
    }

    if (user.balance < itemPrice) {
        throw new Error('Insufficient balance');
    }

    const newBalance = user.balance - itemPrice;
    await makePurchase(userId, itemId);
    // Deduct balance by purchasing
    await updateUserBalance(userId, newBalance);

    return { newBalance };
};
