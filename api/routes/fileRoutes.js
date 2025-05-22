const express = require('express');
const router = express.Router();
const fileController = require('../controllers/FileController');
const upload = require('../config/multer');

// Dosya yükleme
router.post('/upload', upload.single('file'), fileController.uploadFile);

// Kullanıcıya ait dosyaları getir
router.get('/user', fileController.getUserFiles);

// Dosya güncelle
router.put('/:fileId', upload.single('file'), fileController.updateUploadedFile);

// Dosya detaylarını getir
router.get('/:fileId', fileController.getFileById);

// Dosya sil
router.delete('/:fileId', fileController.deleteFile);

module.exports = router;

