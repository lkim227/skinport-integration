import express from 'express';
// import { authRoutes } from './routes/auth.routes';
// import { itemsRoutes } from './routes/items.routes';
// import { purchaseRoutes } from './routes/purchase.routes';

const app = express();

app.use(express.json());

export default app;
