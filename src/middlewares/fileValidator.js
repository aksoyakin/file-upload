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

export const validatePdfFile = (req, res, next) => {
    const upload = multer({
        storage: multer.diskStorage({
            destination: function(req, file, cb) {
                logger.info(`Dosya bilgileri: ${file.originalname}, ${file.mimetype}`);

                cb(null, storageConfig.storagePath);
            },
            filename: function(req, file, cb) {
                const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
                cb(null, uniqueFilename);
            }
        }),
        limits: {
            fileSize: 10 * 1024 * 1024 // 10MB
        },
        fileFilter: function(req, file, cb) {
            if (file.mimetype === 'application/pdf') {
                cb(null, true);
            } else {
                cb(new Error('Sadece PDF dosyaları kabul edilmektedir'), false);
            }
        }
    }).single('file');

    upload(req, res, async function(err) {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json(responseFormatter.error('Dosya boyutu 10MB\'dan büyük olamaz'));
            }
            return res.status(400).json(responseFormatter.error(err.message));
        }

        if (!req.file) {
            return res.status(400).json(responseFormatter.error('Dosya bulunamadı. Lütfen "file" alanıyla bir PDF dosyası gönderin.'));
        }

        const { modul, firmaGuid, fisTurId } = req.body;
        logger.info(`Form parametreleri: modul=${modul}, firmaGuid=${firmaGuid}, fisTurId=${fisTurId}`);

        if (!modul || !firmaGuid || !fisTurId) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (error) {
                logger.error(`Dosya silme hatası: ${error.message}`);
            }

            return res.status(400).json(responseFormatter.error('Eksik parametreler: modul, firmaGuid ve fisTurId parametreleri gereklidir'));
        }

        try {
            const targetPath = createFolderStructure(modul, firmaGuid, fisTurId);

            const targetFilePath = path.join(targetPath, req.file.filename);

            fs.renameSync(req.file.path, targetFilePath);

            const relativeDirectory = path.join(modul, firmaGuid, fisTurId);
            const relativePath = path.join(relativeDirectory, req.file.filename);

            req.file.path = targetFilePath;
            req.file.relativeDirectory = relativeDirectory;
            req.file.relativePath = relativePath;
            req.file.modul = modul;
            req.file.firmaGuid = firmaGuid;
            req.file.fisTurId = fisTurId;

            logger.info(`Dosya başarıyla yüklendi: ${req.file.filename}, Klasör: ${relativeDirectory}`);

            next();
        } catch (error) {
            logger.error(`Dosya taşıma hatası: ${error.message}`);
            return res.status(500).json(responseFormatter.error(`Dosya yükleme hatası: ${error.message}`));
        }
    });
};