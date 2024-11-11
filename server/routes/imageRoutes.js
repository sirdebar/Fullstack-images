const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { uploadImage, getImages, deleteImage } = require('../controllers/imageController');

router.post('/images', authenticateToken, (req, res, next) => {
    uploadImage[0](req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'Файл слишком большой' });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        uploadImage[1](req, res, next);
    });
});
router.get('/images', authenticateToken, getImages);
router.delete('/images/:id', authenticateToken, deleteImage);

module.exports = router;
