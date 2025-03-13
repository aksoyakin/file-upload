import express from 'express';
import { connectDB } from './config/database.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import { logger } from './utils/logger.js';

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - uploads dizinindeki tüm dosyaları erişilebilir yap
app.use('/uploads', express.static('uploads'));

// Ana dizin route'u
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

// API Routes
app.use('/api', routes);

// Error handler
app.use(errorHandler);

export default app;