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
    allowedHeaders: ['Content-Type', 'Authorization', 'User-Agent', 'X-Requested-With']
}));

app.options('*', function(req, res) {
  res.sendStatus(200);
});

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.json({
        message: 'PDF Yükleme API Servisi',
        endpoints: {
            uploadFile: 'POST /api/uploads (parametreler: modul, firmaGuid, fisTurId, satirGuid ve file)',
            getAllFiles: 'GET /api/uploads',
            getFileById: 'GET /api/uploads/:id',
            deleteFile: 'DELETE /api/uploads/:id'
        },
        description: 'Bu API, PDF dosyalarını yüklemek için kullanılır. Dosyalar belirtilen modül, firma ve fiş türüne göre klasörlendirilir ve satirGuid dosya adı olarak kullanılır.'
    });
});

app.use('/api', routes);

app.use(errorHandler);

export default app;
