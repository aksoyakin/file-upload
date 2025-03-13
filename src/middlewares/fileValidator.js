import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import * as storageConfig from '../config/storage.js';
import { responseFormatter } from '../utils/responseFormatter.js';

// Ensure upload directory exists
if (!fs.existsSync(storageConfig.storagePath)) {
    fs.mkdirSync(storageConfig.storagePath, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, storageConfig.storagePath);
    },
    filename: (req, file, cb) => {
        const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    }
});

// PDF Dosya Filtresi
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Sadece PDF dosyaları kabul edilmektedir'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

export const validatePdfFile = (req, res, next) => {
    const multerUpload = upload.single('file');

    multerUpload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json(responseFormatter.error('Dosya boyutu 10MB\'dan büyük olamaz'));
            }
            return res.status(400).json(responseFormatter.error(err.message));
        } else if (err) {
            return res.status(400).json(responseFormatter.error(err.message));
        }
        next();
    });
};