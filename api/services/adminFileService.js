const fileRepository = require('../repositories/fileRepository');
const fs = require('fs');
const path = require('path');
const { convertTurkishToEnglish } = require('../helpers/stringHelper');

class AdminFileService {
    constructor() {
        this.fileRepository = fileRepository;
        this.allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
    }

    validateFile(file) {
        if (!file) {
            throw new Error('Dosya bulunamadı');
        }

        const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
        if (!this.allowedExtensions.includes(fileExtension)) {
            throw new Error('Desteklenmeyen dosya formatı');
        }

        return fileExtension;
    }

    processFileName(file) {
        const originalName = file.originalname;
        const fileNameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
        const fileExtension = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
        return convertTurkishToEnglish(fileNameWithoutExt) + fileExtension;
    }

    processFileUrl(filePath) {
        let url = filePath.replace(/\\/g, '/');
        return url.replace(/^.*storage\//, '/storage/');
    }

    async getAllFiles() {
        try {
            const files = await this.fileRepository.getAllFiles();
            return files;
        } catch (error) {
            console.error('Tüm dosyalar alınamadı:', error);
            throw error;
        }
    }

    async getFileById(fileId) {
        try {
            const file = await this.fileRepository.getFileById(fileId);
            if (!file) {
                throw new Error('Dosya bulunamadı');
            }
            return file;
        } catch (error) {
            console.error('Dosya bulunamadı:', error);
            throw error;
        }
    }

    async updateFile(fileId, fileData, file) {
        try {
            this.validateFile(file);
            const oldFile = await this.getFileById(fileId);
            if (!oldFile) {
                throw new Error('Dosya bulunamadı');
            }

            // Eski dosyayı sil
            const filePath = path.join(__dirname, '..', oldFile.url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            const convertedFileName = this.processFileName(file);
            const url = this.processFileUrl(file.path);

            const updatedData = {
                uploadedFilename: convertedFileName,
                url: url,
                uploadUserId: fileData.userId
            };

            const updated = await this.fileRepository.updateFile(fileId, updatedData);
            if (!updated) {
                throw new Error('Dosya güncellenemedi');
            }

            return await this.getFileById(fileId);
        } catch (error) {
            console.error('Dosya güncellenemedi:', error);
            throw error;
        }
    }

    async deleteFile(fileId) {
        try {
            const file = await this.getFileById(fileId);
            if (!file) {
                throw new Error('Dosya bulunamadı');
            }

            const filePath = path.join(__dirname, '..', file.url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            const deletedFile = await this.fileRepository.deleteFile(fileId);
            if (!deletedFile) {
                throw new Error('Dosya veritabanından silinemedi');
            }

            return {
                id: file.id,
                filename: file.uploadedFilename,
                url: file.url
            };
        } catch (error) {
            console.error('Dosya silinemedi:', error);
            throw error;
        }
    }
}

module.exports = AdminFileService; 