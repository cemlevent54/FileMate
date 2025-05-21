const bcrypt = require('bcrypt');
const { User, Role } = require('../models');

class UserRepository {
    async findById(userId) {
        return await User.findByPk(userId, {
            attributes: [
                'id',
                ['first_name', 'firstName'], // 👈 alias tanımla
                ['last_name', 'lastName'],   // 👈 alias tanımla
                'email',
                'isActive',
                'roleId',
                'createdAt',
                'updatedAt'
              ]
        });
    }

    async validatePassword(userId, password) {
        const user = await User.findByPk(userId);
        if (!user) return false;
        
        return await bcrypt.compare(password, user.password);
    }

    async updatePassword(userId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return await User.update(
            { password: hashedPassword },
            { where: { id: userId } }
        );
    }

    async updateUserInfo(userId, userData) {
        return await User.update(
            {
              firstName: userData.firstName, // 👈 Sequelize model alan adı
              lastName: userData.lastName,
              email: userData.email
            },
            { where: { id: userId } }
          );
    }

    async deleteUser(userId) {
        const result = await User.destroy({ 
            where: { id: userId },
            force: true // Kalıcı silme işlemi
        });
        
        if (result === 0) {
            throw new Error('Kullanıcı silinemedi');
        }
        
        return result;
    }

    async findByEmail(email) {
        return await User.findOne({ 
            where: { email },
            include: [{
                model: Role,
                attributes: ['name'],
                required: true
            }],
            raw: false
        });
    }

    async create(userData) {
        return await User.create(userData);
    }

    async findAll() {
        return await User.findAll({
            attributes: [
                'id',
                ['first_name', 'firstName'], // 👈 alias tanımla
                ['last_name', 'lastName'],   // 👈 alias tanımla
                'email',
                'isActive',
                'roleId',
                'createdAt', 'updatedAt']
        });
    }
}

module.exports = UserRepository;
