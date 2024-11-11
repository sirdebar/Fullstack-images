const pool = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

exports.uploadImage = [
    upload.single('image'),
    async (req, res) => {
        const { title } = req.body;
        const userId = req.user.userId;
        const imageUrl = `/uploads/${req.file.filename}`;
        
        try {
            const result = await pool.query(
                "INSERT INTO images (user_id, image_url, title) VALUES ($1, $2, $3) RETURNING *",
                [userId, imageUrl, title]
            );
            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
];

exports.getImages = async (req, res) => {
    const userId = req.user.userId;
    try {
        const result = await pool.query("SELECT * FROM images WHERE user_id = $1", [userId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteImage = async (req, res) => {
    const imageId = req.params.id;
    const userId = req.user.userId;

    try {
        const result = await pool.query("DELETE FROM images WHERE id = $1 AND user_id = $2 RETURNING *", [imageId, userId]);
        if (result.rowCount === 0) return res.status(404).json({ message: "Image not found" });

        fs.unlinkSync(path.join(__dirname, `../uploads/${result.rows[0].image_url}`));
        res.json({ message: "Image deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
