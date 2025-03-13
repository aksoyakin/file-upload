import express from 'express';
import uploadRoutes from './uploadRoutes.js';

const router = express.Router();

router.use('/uploads', uploadRoutes);
router.use('/', (req, res) => {
    res.json({ message: 'PDF Yükleme API çalışıyor' });
});

export default router;