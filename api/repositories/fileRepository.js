const bcrypt = require('bcrypt');
const { File, User } = require('../models');

class FileRepository {
    async createFile(fileData) {
        try {
            const file = await File.create(fileData);
            return file;
        } catch (error) {
            console.error('Dosya oluşturma hatası:', error);
            throw new Error('Dosya oluşturma hatası');
        }
    }

    async getUserFiles(userId) {
        try {
            const files = await File.findAll({
                where: { uploadUserId: userId },
                include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }]
            });
            return files;
        } catch (error) {
            console.error('Kullanıcı dosyaları alınamadı:', error);
            throw new Error('Kullanıcı dosyaları alınamadı');
        }
    }
    
    async updateFile(fileId, fileData) {
        try {
            const [updated] = await File.update(fileData, {
                where: { id: fileId }
            });
            return updated ? true : false;
        } catch (error) {
            console.error('Dosya güncellenemedi:', error);
            throw new Error('Dosya güncellenemedi');
        }
    }
    
    async getFileById(fileId) {
        try {
            const file = await File.findByPk(fileId, {
                include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }]
            });
            return file;
        } catch (error) {
            console.error('Dosya bulunamadı:', error);
            throw new Error('Dosya bulunamadı');
        }
    }
    
    async deleteFile(fileId) {
        try {
            const file = await File.findByPk(fileId);
            if (!file) {
                return null;
            }
            
            await File.destroy({
                where: { id: fileId }
            });
            
            return file;
        } catch (error) {
            console.error('Dosya silinemedi:', error);
            throw new Error('Dosya silinemedi');
        }
    }

    async getAllFiles() {
        try {
            const files = await File.findAll({
                order: [['createdAt', 'DESC']]
            });
            return files;
        } catch (error) {
            console.error('Tüm dosyalar alınamadı:', error);
            throw error;
        }
    }
}

module.exports = new FileRepository();