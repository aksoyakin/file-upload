import asyncHandler from 'express-async-handler';
import * as uploadService from '../services/uploadService.js';
import { responseFormatter } from '../utils/responseFormatter.js';

export const uploadFile = asyncHandler(async (req, res) => {
    const file = req.file;
    const { modul, firmaGuid, fisTurId, satirGuid } = req.body;

    if (!file) {
        return res.status(400).json(responseFormatter.error('Dosya bulunamadı'));
    }

    file.modul = modul;
    file.firmaGuid = firmaGuid;
    file.fisTurId = fisTurId;
    file.satirGuid = satirGuid;

    const result = await uploadService.saveFile(file);
    res.status(201).json(responseFormatter.success(result));
});

export const getAllFiles = asyncHandler(async (req, res) => {
    const files = await uploadService.getAllFiles();
    res.json(responseFormatter.success(files));
});

export const getFileById = asyncHandler(async (req, res) => {
    const file = await uploadService.getFileById(req.params.id);

    if (!file) {
        return res.status(404).json(responseFormatter.error('Dosya bulunamadı'));
    }

    res.json(responseFormatter.success(file));
});

export const deleteFile = asyncHandler(async (req, res) => {
    const success = await uploadService.deleteFile(req.params.id);

    if (!success) {
        return res.status(404).json(responseFormatter.error('Dosya bulunamadı'));
    }

    res.json(responseFormatter.success({ message: 'Dosya başarıyla silindi' }));
});