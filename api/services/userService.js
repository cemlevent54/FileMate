const UserRepository = require('../repositories/userRepository');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async getCurrentUser(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('Kullanıcı bulunamadı');
        }
        console.log('User from database:', user);
        console.log('User plain object:', user.get({ plain: true }));

        const userObj = user.get({ plain: true });
        delete userObj.password;
        
        return {
            id: userObj.id,
            firstName: userObj.firstname,
            lastName: userObj.lastname,
            email: userObj.email,
            isActive: userObj.isActive || false,
            roleId: userObj.roleId || 0,
            createdAt: userObj.createdAt || '',
            updatedAt: userObj.updatedAt || ''
        };
    }

    async updatePassword(userId, oldPassword, newPassword) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('Kullanıcı bulunamadı');
        }

        const isPasswordValid = await this.userRepository.validatePassword(userId, oldPassword);
        if (!isPasswordValid) {
            throw new Error('Mevcut şifre yanlış');
        }

        await this.userRepository.updatePassword(userId, newPassword);
        return { message: 'Şifre başarıyla güncellendi' };
    }

    async updateUserInfo(userId, userData) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('Kullanıcı bulunamadı');
        }

        // E-posta değişikliği varsa kontrol et
        if (userData.email && userData.email !== user.email) {
            const existingUser = await this.userRepository.findByEmail(userData.email);
            if (existingUser) {
                throw new Error('Bu e-posta adresi zaten kullanımda');
            }
        }

        await this.userRepository.updateUserInfo(userId, userData);
        return { message: 'Kullanıcı bilgileri başarıyla güncellendi' };
    }

    async deleteAccount(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('Kullanıcı bulunamadı');
        }

        try {
            await this.userRepository.deleteUser(userId);
            return { message: 'Hesap başarıyla silindi' };
        } catch (error) {
            throw new Error('Hesap silinirken bir hata oluştu: ' + error.message);
        }
    }
}

module.exports = UserService; 