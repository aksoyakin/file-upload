import { logger } from '../utils/logger.js';
import { responseFormatter } from '../utils/responseFormatter.js';

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    logger.error(`${err.message} - ${err.stack}`);

    /*
    res.status(statusCode).json(responseFormatter.error(
        err.message || 'Sunucu hatası',
        process.env.NODE_ENV === 'production' ? null : err.stack
    ));

     */
};

export default errorHandler;