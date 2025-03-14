import express from 'express';
import { connectDB } from './config/database.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import { logger } from './utils/logger.js';
import cors from 'cors';

const app = express();

connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*', // Herhangi bir domain'e izin verir
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.json({
        message: 'PDF Yükleme API Servisi',
        endpoints: {
            uploadFile: 'POST /api/uploads (parametreler: modul, firmaGuid, fisTurId ve file)',
            getAllFiles: 'GET /api/uploads',
            getFileById: 'GET /api/uploads/:id',
            deleteFile: 'DELETE /api/uploads/:id'
        },
        description: 'Bu API, PDF dosyalarını yüklemek için kullanılır. Dosyalar belirtilen modül, firma ve fiş türüne göre klasörlendirilir.'
    });
});

app.use('/api', routes);

app.use(errorHandler);

export default app;