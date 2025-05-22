const AdminFileService = require('../services/adminFileService');
const adminFileService = new AdminFileService();

/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       required:
 *         - uploadedFilename
 *         - url
 *         - uploadUserId
 *       properties:
 *         id:
 *           type: string
 *           description: Dosyanın benzersiz kimliği
 *         uploadedFilename:
 *           type: string
 *           description: Yüklenen dosyanın adı
 *         url:
 *           type: string
 *           description: Dosyanın URL'i
 *         uploadUserId:
 *           type: integer
 *           description: Dosyayı yükleyen kullanıcının ID'si
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Dosyanın oluşturulma tarihi
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Dosyanın güncellenme tarihi
 */

module.exports = {
    /**
     * @swagger
     * /api/admin/files:
     *   get:
     *     summary: Tüm dosyaları getir
     *     tags: [Admin Files]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Tüm dosyalar başarıyla getirildi
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 files:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/File'
     *       500:
     *         description: Sunucu hatası
     */
    getAllFiles: async (req, res) => {
        try {
            const files = await adminFileService.getAllFiles();
            return res.status(200).json({
                message: 'Tüm dosyalar başarıyla alındı',
                files: files
            });
        } catch (error) {
            console.error('Dosyalar alınamadı:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    /**
     * @swagger
     * /api/admin/files/{fileId}:
     *   get:
     *     summary: Dosya detaylarını getir
     *     tags: [Admin Files]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: fileId
     *         required: true
     *         schema:
     *           type: string
     *         description: Dosya ID'si
     *     responses:
     *       200:
     *         description: Dosya detayları başarıyla getirildi
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 file:
     *                   $ref: '#/components/schemas/File'
     *       404:
     *         description: Dosya bulunamadı
     *       500:
     *         description: Sunucu hatası
     */
    getFileById: async (req, res) => {
        try {
            const { fileId } = req.params;
            const file = await adminFileService.getFileById(fileId);
            
            return res.status(200).json({
                message: 'Dosya başarıyla alındı',
                file: file
            });
        } catch (error) {
            console.error('Dosya alınamadı:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    /**
     * @swagger
     * /api/admin/files/{fileId}:
     *   put:
     *     summary: Dosyayı güncelle
     *     tags: [Admin Files]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: fileId
     *         required: true
     *         schema:
     *           type: string
     *         description: Güncellenecek dosyanın ID'si
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               file:
     *                 type: string
     *                 format: binary
     *                 description: Yeni dosya (jpg, jpeg, png, pdf)
     *               userId:
     *                 type: integer
     *                 description: Dosyayı güncelleyen kullanıcının ID'si
     *     responses:
     *       200:
     *         description: Dosya başarıyla güncellendi
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 file:
     *                   $ref: '#/components/schemas/File'
     *       404:
     *         description: Dosya bulunamadı
     *       500:
     *         description: Sunucu hatası
     */
    updateFile: async (req, res) => {
        try {
            const { fileId } = req.params;
            const userId = req.body.userId;
            const file = req.file;

            if (!userId) {
                return res.status(400).json({ error: 'Kullanıcı ID bulunamadı' });
            }

            const updatedFile = await adminFileService.updateFile(fileId, { userId }, file);
            return res.status(200).json({
                message: 'Dosya başarıyla güncellendi',
                file: updatedFile
            });
        } catch (error) {
            console.error('Dosya güncellenemedi:', error);
            return res.status(500).json({ error: error.message });
        }
    },

    /**
     * @swagger
     * /api/admin/files/{fileId}:
     *   delete:
     *     summary: Dosyayı sil
     *     tags: [Admin Files]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: fileId
     *         required: true
     *         schema:
     *           type: string
     *         description: Silinecek dosyanın ID'si
     *     responses:
     *       200:
     *         description: Dosya başarıyla silindi
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 deletedFile:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: string
     *                     filename:
     *                       type: string
     *                     url:
     *                       type: string
     *       404:
     *         description: Dosya bulunamadı
     *       500:
     *         description: Sunucu hatası
     */
    deleteFile: async (req, res) => {
        try {
            const { fileId } = req.params;
            const deletedFile = await adminFileService.deleteFile(fileId);
            
            return res.status(200).json({
                message: 'Dosya başarıyla silindi',
                deletedFile: deletedFile
            });
        } catch (error) {
            console.error('Dosya silinemedi:', error);
            return res.status(500).json({ error: error.message });
        }
    }
}; 