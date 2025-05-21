const auth = require('../middleware/auth');
const UserService = require('../services/userService');

const userService = new UserService();

/**
 * @swagger
 * /user/me:
 *   get:
 *     tags:
 *       - [User Controller]
 *     summary: Giriş yapmış kullanıcının bilgilerini getirir
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı bilgileri başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *                 roleId:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *       401:
 *         description: Yetkilendirme hatası
 */
const UserController = {
    me: [auth, async (req, res) => {
        try {
            const user = await userService.getCurrentUser(req.user.id);
            return res.status(200).json(user);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }],

    /**
     * @swagger
     * /user/update-password:
     *   put:
     *     tags:
     *       - [User Controller]
     *     summary: Kullanıcı şifresini günceller
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: body
     *         name: body
     *         schema:
     *           type: object
     *           required:
     *             - oldPassword
     *             - newPassword
     *           properties:
     *             oldPassword:
     *               type: string
     *               description: Mevcut şifre
     *             newPassword:
     *               type: string
     *               description: Yeni şifre
     *     responses:
     *       200:
     *         description: Şifre başarıyla güncellendi
     *       401:
     *         description: Yetkilendirme hatası
     */
    updatePassword: [auth, async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        try {
            const result = await userService.updatePassword(req.user.id, oldPassword, newPassword);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }],

    /**
     * @swagger
     * /user/update-info:
     *   put:
     *     tags:
     *       - [User Controller]
     *     summary: Kullanıcı bilgilerini günceller
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: body
     *         name: body
     *         schema:
     *           type: object
     *           required:
     *             - firstName
     *             - lastName
     *             - email
     *           properties:
     *             firstName:
     *               type: string
     *               description: Kullanıcının adı
     *             lastName:
     *               type: string
     *               description: Kullanıcının soyadı
     *             email:
     *               type: string
     *               format: email
     *               description: Kullanıcının e-posta adresi
     *     responses:
     *       200:
     *         description: Kullanıcı bilgileri başarıyla güncellendi
     *       400:
     *         description: Geçersiz istek veya e-posta adresi zaten kullanımda
     *       401:
     *         description: Yetkilendirme hatası
     */
    updateUserInfo: [auth, async (req, res) => {
        const { firstName, lastName, email } = req.body;
        try {
            const result = await userService.updateUserInfo(req.user.id, { firstName, lastName, email });
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }],

    /**
     * @swagger
     * /user/delete-account:
     *   delete:
     *     tags:
     *       - [User Controller]
     *     summary: Kullanıcı hesabını siler
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Hesap başarıyla silindi
     *       401:
     *         description: Yetkilendirme hatası
     *       404:
     *         description: Kullanıcı bulunamadı
     */
    deleteAccount: [auth, async (req, res) => {
        try {
            const result = await userService.deleteAccount(req.user.id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }]
};

module.exports = UserController;
