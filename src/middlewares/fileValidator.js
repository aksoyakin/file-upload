import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import * as storageConfig from '../config/storage.js';
import { responseFormatter } from '../utils/responseFormatter.js';
import { logger } from '../utils/logger.js';

if (!fs.existsSync(storageConfig.storagePath)) {
    fs.mkdirSync(storageConfig.storagePath, { recursive: true });
}

const createFolderStructure = (modul, firmaGuid, fisTurId) => {
    if (!modul || !firmaGuid || !fisTurId) {
        throw new Error('Modul, firmaGuid ve fisTurId parametreleri gereklidir');
    }

    const basePath = storageConfig.storagePath;

    const modulPath = path.join(basePath, modul);
    if (!fs.existsSync(modulPath)) {
        fs.mkdirSync(modulPath, { recursive: true });
        logger.info(`Modül klasörü oluşturuldu: ${modul}`);
    }

    const firmaPath = path.join(modulPath, firmaGuid);
    if (!fs.existsSync(firmaPath)) {
        fs.mkdirSync(firmaPath, { recursive: true });
        logger.info(`Firma klasörü oluşturuldu: ${firmaGuid}`);
    }

    const fisTurPath = path.join(firmaPath, fisTurId);
    if (!fs.existsSync(fisTurPath)) {
        fs.mkdirSync(fisTurPath, { recursive: true });
        logger.info(`Fiş Tür klasörü oluşturuldu: ${fisTurId}`);
    }

    return fisTurPath;
};

export const validateFile  = (req, res, next) => {
    const upload = multer({
        storage: multer.diskStorage({
            destination: function(req, file, cb) {
                logger.info(`Dosya bilgileri: ${file.originalname}, ${file.mimetype}`);
                cb(null, storageConfig.storagePath);
            },
            filename: function(req, file, cb) {
                // Filename will be set later using satirGuid
                const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
                cb(null, uniqueFilename);
            }
        }),
        limits: {
            fileSize: 100 * 1024 * 1024 // 100MB
        },
        fileFilter: function(req, file, cb) {
            // Kabul edilen dosya tipleri: PDF, SVG, PNG, JPG, JPEG
            const allowedMimeTypes = [
                'application/pdf',
                'image/svg+xml',
                'image/png',
                'image/jpeg',
                'image/jpg'
            ];

            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Sadece PDF, SVG, PNG, JPG ve JPEG dosyaları kabul edilmektedir'), false);
            }
        }
    }).single('file');

    upload(req, res, async function(err) {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json(responseFormatter.error('Dosya boyutu 100MB\'dan büyük olamaz'));
            }
            return res.status(400).json(responseFormatter.error(err.message));
        }

        if (!req.file) {
            return res.status(400).json(responseFormatter.error('Dosya bulunamadı. Lütfen "file" alanıyla geçerli bir dosya gönderin.'));
        }

        const { modul, firmaGuid, fisTurId, satirGuid } = req.body;
        logger.info(`Form parametreleri: modul=${modul}, firmaGuid=${firmaGuid}, fisTurId=${fisTurId}, satirGuid=${satirGuid}`);

        if (!modul || !firmaGuid || !fisTurId) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                logger.error(`Dosya silme hatası: ${error.message}`);
            }

            return res.status(400).json(responseFormatter.error('Eksik parametreler: modul, firmaGuid ve fisTurId parametreleri gereklidir'));
        }

        if (!satirGuid) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                logger.error(`Dosya silme hatası: ${error.message}`);
            }

            return res.status(400).json(responseFormatter.error('Eksik parametre: satirGuid parametresi gereklidir'));
        }

        try {
            const targetPath = createFolderStructure(modul, firmaGuid, fisTurId);

            // Use satirGuid as the filename with original extension
            const fileExtension = path.extname(req.file.originalname);
            const newFilename = `${satirGuid}${fileExtension}`;
            const targetFilePath = path.join(targetPath, newFilename);

            fs.renameSync(req.file.path, targetFilePath);

            const relativeDirectory = path.join(modul, firmaGuid, fisTurId);
            const relativePath = path.join(relativeDirectory, newFilename);

            // Update file properties with new values
            req.file.path = targetFilePath;
            req.file.filename = newFilename;
            req.file.relativeDirectory = relativeDirectory;
            req.file.relativePath = relativePath;
            req.file.modul = modul;
            req.file.firmaGuid = firmaGuid;
            req.file.fisTurId = fisTurId;
            req.file.satirGuid = satirGuid;

            logger.info(`Dosya başarıyla yüklendi: ${newFilename}, Klasör: ${relativeDirectory}`);

            next();
        } catch (error) {
            logger.error(`Dosya taşıma hatası: ${error.message}`);
            return res.status(500).json(responseFormatter.error(`Dosya yükleme hatası: ${error.message}`));
        }
    });
};