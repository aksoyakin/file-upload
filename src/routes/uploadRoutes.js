import express from 'express';
import * as uploadController from '../controllers/uploadController.js';
import * as fileValidator from '../middlewares/fileValidator.js';

const router = express.Router();

router.post('/', fileValidator.validatePdfFile, uploadController.uploadFile);
router.get('/', uploadController.getAllFiles);
router.get('/:id', uploadController.getFileById);
router.delete('/:id', uploadController.deleteFile);

export default router;