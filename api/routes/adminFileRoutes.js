const express = require('express');
const router = express.Router();
const adminFileController = require('../controllers/AdminFileController');
const upload = require('../config/multer');

// Admin dosya rotaları
router.get('/', adminFileController.getAllFiles);
router.get('/:fileId', adminFileController.getFileById);
router.put('/:fileId', upload.single('file'), adminFileController.updateFile);
router.delete('/:fileId', adminFileController.deleteFile);

module.exports = router; 