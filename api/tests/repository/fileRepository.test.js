
const bcrypt = require('bcrypt');
const { File, User } = require('../../models');
const fileRepository = require('../../repositories/fileRepository');

jest.mock('../../models', () => ({
    File: {
        create: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        findByPk: jest.fn(),
        destroy: jest.fn()
    },
    User: {
        findByPk: jest.fn()
    }
}));

jest.mock('bcrypt', () => ({
    compare: jest.fn(),
    hash: jest.fn()
}));

describe('FileRepository', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createFile', () => {
        test('should create a file', async () => {
            const mockFileData = { name: 'test.txt', size: 1234 };
            File.create.mockResolvedValue(mockFileData);

            const result = await fileRepository.createFile(mockFileData);

            expect(File.create).toHaveBeenCalledWith(mockFileData);
            expect(result).toEqual(mockFileData);
        });
    });

    describe('getUserFiles', () => {
        test('should return user files', async () => {
            const mockFiles = [{ id: 1, name: 'test.txt' }];
            File.findAll.mockResolvedValue(mockFiles);

            const result = await fileRepository.getUserFiles(1);

            expect(File.findAll).toHaveBeenCalledWith(expect.objectContaining({
                where: { uploadUserId: 1 }
            }));
            expect(result).toEqual(mockFiles);
        });

        test('should throw an error if user files cannot be retrieved', async () => {
            File.findAll.mockRejectedValue(new Error('DB error'));

            await expect(fileRepository.getUserFiles(1)).rejects.toThrow('Kullanıcı dosyaları alınamadı');
        });
    });

    describe('updateFile', () => {
        test('should update a file', async () => {
            const mockFileData = { name: 'updated.txt' };
            File.update.mockResolvedValue([1]);

            const result = await fileRepository.updateFile(1, mockFileData);

            expect(File.update).toHaveBeenCalledWith(mockFileData, { where: { id: 1 } });
            expect(result).toBe(true);
        });

        test('should return false if no file is updated', async () => {
            File.update.mockResolvedValue([0]);

            const result = await fileRepository.updateFile(1, { name: 'unchanged.txt' });

            expect(result).toBe(false);
        });

        test('should throw an error if file cannot be updated', async () => {
            File.update.mockRejectedValue(new Error('Error'));

            await expect(fileRepository.updateFile(1, {})).rejects.toThrow('Dosya güncellenemedi');
        });
    });

    describe('getFileById', () => {
        test('should return a file by id', async () => {
            const mockFile = { id: 1, name: 'test.txt' };
            File.findByPk.mockResolvedValue(mockFile);

            const result = await fileRepository.getFileById(1);

            expect(File.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
            expect(result).toEqual(mockFile);
        });
    });

    describe('deleteFile', () => {
        test('should delete a file and return it', async () => {
            const mockFile = { id: 1 };
            File.findByPk.mockResolvedValue(mockFile);
            File.destroy.mockResolvedValue(1);

            const result = await fileRepository.deleteFile(1);

            expect(File.findByPk).toHaveBeenCalledWith(1);
            expect(File.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(mockFile);
        });

        test('should return null if file not found', async () => {
            File.findByPk.mockResolvedValue(null);

            const result = await fileRepository.deleteFile(999);

            expect(result).toBeNull();
        });

        test('should throw an error if deletion fails', async () => {
            File.findByPk.mockResolvedValue({ id: 1 });
            File.destroy.mockRejectedValue(new Error('Delete error'));

            await expect(fileRepository.deleteFile(1)).rejects.toThrow('Dosya silinemedi');
        });
    });

    describe('getAllFiles', () => {
        test('should return all files', async () => {
            const mockFiles = [{ id: 1, name: 'test.txt' }];
            File.findAll.mockResolvedValue(mockFiles);

            const result = await fileRepository.getAllFiles();

            expect(File.findAll).toHaveBeenCalledWith(expect.objectContaining({
                order: [['createdAt', 'DESC']]
            }));
            expect(result).toEqual(mockFiles);
        });
    });
});
