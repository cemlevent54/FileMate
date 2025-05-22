
const AdminFileService = require('../../services/adminFileService');
const fileRepository = require('../../repositories/fileRepository');
const { convertTurkishToEnglish } = require('../../helpers/stringHelper');
const fs = require('fs');
const path = require('path');

jest.mock('../../repositories/fileRepository', () => ({
    getAllFiles: jest.fn(),
    getFileById: jest.fn(),
    updateFile: jest.fn(),
    deleteFile: jest.fn()
}));

jest.mock('../../helpers/stringHelper', () => ({
    convertTurkishToEnglish: jest.fn()
}));

jest.mock('fs');
jest.mock('path');

describe('AdminFileService', () => {
    let adminFileService;

    beforeEach(() => {
        jest.clearAllMocks();
        adminFileService = new AdminFileService();
    });

    describe('validateFile', () => {
        test('should throw if file is missing', () => {
            expect(() => adminFileService.validateFile(null)).toThrow('Dosya bulunamadı');
        });

        test('should throw if file extension is not allowed', () => {
            const file = { originalname: 'file.exe' };
            expect(() => adminFileService.validateFile(file)).toThrow('Desteklenmeyen dosya formatı');
        });

        test('should return extension if valid', () => {
            const file = { originalname: 'image.jpg' };
            const result = adminFileService.validateFile(file);
            expect(result).toBe('.jpg');
        });
    });

    describe('processFileName', () => {
        test('should return converted file name', () => {
            const file = { originalname: 'dosya adı.png' };
            convertTurkishToEnglish.mockReturnValue('dosya_adi');
            const result = adminFileService.processFileName(file);
            expect(result).toBe('dosya_adi.png');
        });
    });

    describe('processFileUrl', () => {
        test('should convert file path to public url', () => {
            const result = adminFileService.processFileUrl('C:\\project\\storage\\images\\image.jpg');
            expect(result).toBe('/storage/images/image.jpg');
        });
    });

    describe('getAllFiles', () => {
        test('should return files from repository', async () => {
            const mockFiles = [{ id: 1 }];
            fileRepository.getAllFiles.mockResolvedValue(mockFiles);
            const result = await adminFileService.getAllFiles();
            expect(result).toEqual(mockFiles);
        });
    });

    describe('getFileById', () => {
        test('should return file if found', async () => {
            const mockFile = { id: 1 };
            fileRepository.getFileById.mockResolvedValue(mockFile);
            const result = await adminFileService.getFileById(1);
            expect(result).toEqual(mockFile);
        });

        test('should throw if file not found', async () => {
            fileRepository.getFileById.mockResolvedValue(null);
            await expect(adminFileService.getFileById(1)).rejects.toThrow('Dosya bulunamadı');
        });
    });

    describe('updateFile', () => {
        test('should update file and return updated file', async () => {
            const file = { originalname: 'newfile.jpg', path: 'some/path/newfile.jpg' };
            const fileData = { userId: 123 };
            const oldFile = { id: 1, url: 'storage/uploads/old.jpg' };

            adminFileService.validateFile = jest.fn();
            fileRepository.getFileById.mockResolvedValue(oldFile);
            fs.existsSync.mockReturnValue(true);
            fs.unlinkSync.mockReturnValue();
            convertTurkishToEnglish.mockReturnValue('newfile');
            fileRepository.updateFile.mockResolvedValue(true);
            fileRepository.getFileById.mockResolvedValue({ id: 1, uploadedFilename: 'newfile.jpg' });

            const result = await adminFileService.updateFile(1, fileData, file);

            expect(result).toEqual({ id: 1, uploadedFilename: 'newfile.jpg' });
        });

        test('should throw if update fails', async () => {
            const file = { originalname: 'newfile.jpg', path: 'some/path/newfile.jpg' };
            const fileData = { userId: 123 };
            const oldFile = { id: 1, url: 'storage/uploads/old.jpg' };

            adminFileService.validateFile = jest.fn();
            fileRepository.getFileById.mockResolvedValue(oldFile);
            fs.existsSync.mockReturnValue(true);
            fs.unlinkSync.mockReturnValue();
            convertTurkishToEnglish.mockReturnValue('newfile');
            fileRepository.updateFile.mockResolvedValue(false);

            await expect(adminFileService.updateFile(1, fileData, file)).rejects.toThrow('Dosya güncellenemedi');
        });
    });

    describe('deleteFile', () => {
        test('should delete file and return summary', async () => {
            const file = { id: 1, uploadedFilename: 'old.jpg', url: 'storage/uploads/old.jpg' };
            fileRepository.getFileById.mockResolvedValue(file);
            fs.existsSync.mockReturnValue(true);
            fs.unlinkSync.mockReturnValue();
            fileRepository.deleteFile.mockResolvedValue(file);

            const result = await adminFileService.deleteFile(1);

            expect(result).toEqual({
                id: 1,
                filename: 'old.jpg',
                url: 'storage/uploads/old.jpg'
            });
        });

        test('should throw if file not found', async () => {
            fileRepository.getFileById.mockResolvedValue(null);
            await expect(adminFileService.deleteFile(1)).rejects.toThrow('Dosya bulunamadı');
        });

        test('should throw if db delete fails', async () => {
            const file = { id: 1, uploadedFilename: 'old.jpg', url: 'storage/uploads/old.jpg' };
            fileRepository.getFileById.mockResolvedValue(file);
            fs.existsSync.mockReturnValue(true);
            fs.unlinkSync.mockReturnValue();
            fileRepository.deleteFile.mockResolvedValue(null);

            await expect(adminFileService.deleteFile(1)).rejects.toThrow('Dosya veritabanından silinemedi');
        });
    });
});
