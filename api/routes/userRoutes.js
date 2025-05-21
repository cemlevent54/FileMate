const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/me', UserController.me);
router.put('/update-password', UserController.updatePassword);
router.put('/update-info', UserController.updateUserInfo);
router.delete('/delete-account', UserController.deleteAccount);

module.exports = router; 