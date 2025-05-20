const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı
 *     description: Yeni bir kullanıcı hesabı oluşturur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz istek
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // TODO: Kullanıcı kayıt işlemleri burada yapılacak
        res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Kullanıcı girişi
 *     description: Kullanıcı girişi yapar ve JWT token döner
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Başarılı giriş
 *       401:
 *         description: Geçersiz kimlik bilgileri
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // TODO: Kullanıcı giriş işlemleri burada yapılacak
        res.status(200).json({ message: 'Giriş başarılı', token: 'JWT_TOKEN' });
    } catch (error) {
        res.status(401).json({ error: 'Geçersiz kimlik bilgileri' });
    }
});

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Şifre sıfırlama
 *     description: Kullanıcının şifresini sıfırlamak için e-posta gönderir
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Şifre sıfırlama bağlantısı gönderildi
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        // TODO: Şifre sıfırlama işlemleri burada yapılacak
        res.status(200).json({ message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi' });
    } catch (error) {
        res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
});

module.exports = router; 