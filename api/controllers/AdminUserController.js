/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Tüm kullanıcıları getir
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı listesi başarıyla getirildi
 *       401:
 *         description: Yetkilendirme hatası
 */

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Kullanıcıyı sil
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla silindi
 *       401:
 *         description: Yetkilendirme hatası
 *       404:
 *         description: Kullanıcı bulunamadı
 */

/**
 * @swagger
 * /admin/users/{id}:
 *   put:
 *     summary: Kullanıcıyı güncelle
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               password:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla güncellendi
 *       401:
 *         description: Yetkilendirme hatası
 *       404:
 *         description: Kullanıcı bulunamadı
 */

/**
 * @swagger
 * /admin/users/{id}/activate:
 *   post:
 *     summary: Kullanıcıyı aktifleştir
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla aktifleştirildi
 *       401:
 *         description: Yetkilendirme hatası
 *       404:
 *         description: Kullanıcı bulunamadı
 */

/**
 * @swagger
 * /admin/users/{id}/block:
 *   post:
 *     summary: Kullanıcıyı engelle
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla engellendi
 *       401:
 *         description: Yetkilendirme hatası
 *       404:
 *         description: Kullanıcı bulunamadı
 */

const adminUserService = require('../services/adminUserService');

module.exports = {
    // Tüm kullanıcıları getir
    getAllUsers: async (req, res) => {
        try {
            const users = await adminUserService.getAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Kullanıcıyı sil
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            await adminUserService.deleteUser(id);
            return res.status(200).json({ message: 'Kullanıcı başarıyla silindi' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Kullanıcıyı güncelle
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const userData = req.body;

            // Boş alanları temizle
            Object.keys(userData).forEach(key => {
                if (userData[key] === '' || userData[key] === null) {
                    delete userData[key];
                }
            });

            // roleId kontrolü ve dönüşümü
            if (userData.role) {
                userData.roleId = userData.role === 'admin' ? 2 : 1;
                delete userData.role;
            }

            // Şifre kontrolü
            if (!userData.password || userData.password === '********') {
                delete userData.password;
            }

            // Güncelleme öncesi kullanıcıyı kontrol et
            const existingUser = await adminUserService.getUserById(id);
            if (!existingUser) {
                return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
            }

            // Güncelleme işlemini gerçekleştir
            const updatedUser = await adminUserService.updateUser(id, userData);
            
            if (!updatedUser) {
                return res.status(500).json({ error: 'Kullanıcı güncellenirken bir hata oluştu' });
            }

            // Frontend için rol bilgisini ekle
            const responseData = {
                ...updatedUser,
                role: updatedUser.roleId === 2 ? 'admin' : 'user'
            };

            return res.status(200).json(responseData);
        } catch (error) {
            console.error('Kullanıcı güncelleme hatası:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    // Kullanıcıyı aktifleştir
    activateUser: async (req, res) => {
        try {
            const { id } = req.params;
            await adminUserService.activateUser(id);
            return res.status(200).json({ message: 'Kullanıcı başarıyla aktifleştirildi' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // Kullanıcıyı engelle
    blockUser: async (req, res) => {
        try {
            const { id } = req.params;
            await adminUserService.blockUser(id);
            return res.status(200).json({ message: 'Kullanıcı başarıyla engellendi' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}; 