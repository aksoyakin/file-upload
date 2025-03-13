import { promises as fsPromises } from 'fs';
import path from 'path';
import * as fileRepository from '../repositories/fileRepository.js';
import * as storageConfig from '../config/storage.js';
import { logger } from '../utils/logger.js';

export const saveFile = async (file) => {
    try {
        // Dosyanın URL'ini oluştur (parametreler klasör yapısını içerecek şekilde)
        const fileUrl = `${storageConfig.baseUrl}/uploads/${file.relativePath}`;

        const fileData = {
            originalName: file.originalname,
            filename: file.filename,
            path: file.path,
            url: fileUrl,
            size: file.size,
            mimeType: file.mimetype,
            // Ek bilgileri kaydet
            directory: file.relativeDirectory || '',
            relativePath: file.relativePath || '',
            // Parametre bilgileri
            modul: file.modul || '',
            firmaGuid: file.firmaGuid || '',
            fisTurId: file.fisTurId || ''
        };

        const savedFile = await fileRepository.create(fileData);
        logger.info(`Dosya başarıyla kaydedildi: ${file.filename}, Klasör: ${file.relativeDirectory}`);

        return savedFile;
    } catch (error) {
        logger.error(`Dosya kaydedilirken hata oluştu: ${error.message}`);
        throw new Error('Dosya kaydedilirken bir hata oluştu');
    }
};

export const getAllFiles = async () => {
    return await fileRepository.findAll();
};

export const getFileById = async (id) => {
    return await fileRepository.findById(id);
};

export const deleteFile = async (id) => {
    try {
        const file = await fileRepository.findById(id);

        if (!file) {
            return false;
        }

        await fsPromises.unlink(file.path);
        await fileRepository.deleteById(id);

        logger.info(`Dosya silindi: ${file.filename}`);
        return true;
    } catch (error) {
        logger.error(`Dosya silinirken hata oluştu: ${error.message}`);
        throw new Error('Dosya silinirken bir hata oluştu');
    }
};