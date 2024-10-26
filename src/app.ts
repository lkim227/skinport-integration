import express from 'express';
import { authRoutes } from './routes/auth.routes';
import { itemsRoutes } from './routes/items.routes';
import { purchaseRoutes } from './routes/purchase.routes';

const app = express();

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/items', itemsRoutes);
app.use('/purchase', purchaseRoutes);

export default app;
