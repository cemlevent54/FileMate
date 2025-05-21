const UserRepository = require('../repositories/userRepository');
const { Role } = require('../models');
const bcrypt = require('bcrypt');

class AdminUserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll();
        return users.map(user => {
            const userObj = user.get({ plain: true });
            delete userObj.password;
            return {
                id: userObj.id,
                firstName: userObj.firstName,
                lastName: userObj.lastName,
                email: userObj.email,
                isActive: userObj.isActive,
                roleId: userObj.roleId,
                createdAt: userObj.createdAt,
                updatedAt: userObj.updatedAt
            };
        });
    }

    async deleteUser(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('Kullanıcı bulunamadı');
        }
        await this.userRepository.deleteUser(userId);
        return true;
    }

    async updateUser(userId, userData) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('Kullanıcı bulunamadı');
        }

        // E-posta değişikliği varsa kontrol et
        if (userData.email && userData.email !== user.email) {
            const existingUser = await this.userRepository.findByEmail(userData.email);
            if (existingUser && existingUser.id !== userId) {
                throw new Error('Bu e-posta adresi zaten kullanımda');
            }
        }

        // Şifre değişikliği varsa hash'le
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 12);
        }

        // Role değişikliği varsa roleId'yi güncelle
        if (userData.role) {
            const role = await Role.findOne({ where: { name: userData.role.toLowerCase() } });
            if (!role) {
                throw new Error('Geçersiz rol');
            }
            userData.roleId = role.id;
            delete userData.role;
        }

        await this.userRepository.updateUserInfo(userId, userData);
        return this.getUserById(userId);
    }

    async activateUser(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('Kullanıcı bulunamadı');
        }
        await this.userRepository.updateUserInfo(userId, { isActive: true });
        return true;
    }

    async blockUser(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('Kullanıcı bulunamadı');
        }
        await this.userRepository.updateUserInfo(userId, { isActive: false });
        return true;
    }

    async getUserById(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('Kullanıcı bulunamadı');
        }
        const userObj = user.get({ plain: true });
        delete userObj.password;
        return {
            id: userObj.id,
            firstName: userObj.first_name,
            lastName: userObj.last_name,
            email: userObj.email,
            isActive: userObj.isActive,
            roleId: userObj.roleId,
            createdAt: userObj.createdAt,
            updatedAt: userObj.updatedAt
        };
    }
}

module.exports = new AdminUserService(); 