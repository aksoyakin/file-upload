import 'dotenv/config';
import { createServer } from 'http';
import app from './src/app.js';
import { port } from './src/config/server.js';
import { logger } from './src/utils/logger.js';

const server = createServer(app);

server.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
    server.close(() => {
        process.exit(1);
    });
});