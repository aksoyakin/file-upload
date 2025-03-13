import express from 'express';
import { connectDB } from './config/database.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import { logger } from './utils/logger.js';

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/api', routes);
app.use(errorHandler);

export default app;