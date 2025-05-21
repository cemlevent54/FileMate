const express = require('express');
const router = express.Router();
const AdminUserController = require('../controllers/AdminUserController');
const { authenticateToken } = require('../controllers/AuthController');
const isAdmin = require('../middlewares/adminMiddleware');

// Tüm admin route'ları için token ve admin yetkisi kontrolü
router.use(authenticateToken);
router.use(isAdmin);

// Kullanıcı yönetimi route'ları
router.get('/users', AdminUserController.getAllUsers);
router.delete('/users/:id', AdminUserController.deleteUser);
router.put('/users/:id', AdminUserController.updateUser);
router.post('/users/:id/activate', AdminUserController.activateUser);
router.post('/users/:id/block', AdminUserController.blockUser);

module.exports = router; 