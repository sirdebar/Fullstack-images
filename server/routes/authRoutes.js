/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Электронная почта пользователя
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       500:
 *         description: Ошибка сервера
 */


const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Привязка telegram_id к auth_token
router.post('/auth/telegram-login', async (req, res) => {
    const { auth_token, telegram_id } = req.body;

    try {
        // Здесь можно расшифровать и проверить auth_token (если он JWT), например:
        const decoded = jwt.verify(auth_token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Привязка telegram_id к пользователю
        await pool.query(
            'UPDATE users SET telegram_id = $1 WHERE id = $2',
            [telegram_id, userId]
        );

        res.json({ success: true, message: 'Telegram ID успешно привязан.' });
    } catch (error) {
        console.error("Ошибка привязки Telegram ID:", error.message);
        res.status(400).json({ success: false, message: 'Ошибка авторизации.' });
    }
});

module.exports = router;
