const { Role } = require('../models');

const isAdmin = async (req, res, next) => {
    try {
        // Kullanıcının roleId'si 2 ise (ADMIN) devam et
        if (req.user.roleId === 2) {
            next();
        } else {
            return res.status(403).json({ error: 'Bu işlem için admin yetkisi gerekiyor' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = isAdmin; 