import { getUserByEmail, updateUserPassword } from '../models/user.model';

interface AuthUserResponse {
    id: number;
    email: string;
}

export const authenticateUser = async (
    email: string, 
    password: string
): Promise<AuthUserResponse> => {
    const user = await getUserByEmail(email);

    if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
    }

    return { 
        id: user.id, 
        email: user.email 
    };
};

export const changePassword = async (
    userId: number, 
    newPassword: string
): Promise<string> => {
    const user = await updateUserPassword(userId, newPassword);
    if (!user)   throw new Error('User not found');
    
    return 'Password updated successfully';
};
