const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const FileService = require('../../services/fileService');
const fileRepository = require('../../repositories/fileRepository');
const { convertTurkishToEnglish } = require('../../helpers/stringHelper');

// Mocklar
jest.mock('fs');
//jest.mock('path');
jest.mock('bcryptjs');
jest.mock('../../repositories/fileRepository', () => ({
  createFile: jest.fn(),
  getUserFiles: jest.fn(),
  updateFile: jest.fn(),
  getFileById: jest.fn(),
  deleteFile: jest.fn(),
}));
jest.mock('../../helpers/stringHelper', () => ({
  convertTurkishToEnglish: jest.fn((str) => str)
}));

describe('FileService', () => {
  let fileService;
  const mockFile = {
    originalname: 'test.jpg',
    path: 'C:\\app\\storage\\uploads\\test.jpg'
  };

  const mockFileData = {
    userId: 1
  };

  beforeEach(() => {
    fileService = new FileService();
    jest.clearAllMocks();
  });

  describe('validateFile', () => {
    it('should validate a correct file', () => {
      expect(() => fileService.validateFile(mockFile)).not.toThrow();
    });

    it('should throw error if no file provided', () => {
      expect(() => fileService.validateFile(null)).toThrow('Dosya bulunamadı');
    });

    it('should throw error for unsupported file format', () => {
      const wrongFile = { originalname: 'test.exe' };
      expect(() => fileService.validateFile(wrongFile)).toThrow('Desteklenmeyen dosya formatı');
    });
  });

  describe('createFile', () => {
    it('should create file and return saved data', async () => {
      fileRepository.createFile.mockResolvedValue({ id: 1, url: '/storage/uploads/test.jpg' });

      const result = await fileService.createFile(mockFileData, mockFile);
      expect(result).toHaveProperty('id');
      expect(fileRepository.createFile).toHaveBeenCalled();
    });

    it('should throw error if repository throws', async () => {
      fileRepository.createFile.mockRejectedValue(new Error('DB error'));
      await expect(fileService.createFile(mockFileData, mockFile)).rejects.toThrow('DB error');
    });
  });

  describe('getUserFiles', () => {
    it('should return user files', async () => {
      const files = [{ id: 1 }, { id: 2 }];
      fileRepository.getUserFiles.mockResolvedValue(files);

      const result = await fileService.getUserFiles(1);
      expect(result).toEqual(files);
    });
  });

  describe('updateFile', () => {
    it('should update existing file and return it', async () => {
      fileRepository.getFileById.mockResolvedValue({ id: 1, url: 'storage/uploads/old.jpg' });
      fs.existsSync.mockReturnValue(true);
      fs.unlinkSync.mockReturnValue();
      fileRepository.updateFile.mockResolvedValue(true);
      fileRepository.getFileById.mockResolvedValue({ id: 1, url: 'storage/uploads/test.jpg' });

      const updated = await fileService.updateFile(1, mockFileData, mockFile);
      expect(updated).toHaveProperty('url');
    });

    it('should throw error if old file not found', async () => {
      fileRepository.getFileById.mockResolvedValue(null);
      await expect(fileService.updateFile(1, mockFileData, mockFile)).rejects.toThrow('Dosya bulunamadı');
    });

    it('should throw error if update fails', async () => {
      fileRepository.getFileById.mockResolvedValue({ id: 1, url: 'storage/uploads/old.jpg' });
      fileRepository.updateFile.mockResolvedValue(false);
      await expect(fileService.updateFile(1, mockFileData, mockFile)).rejects.toThrow('Dosya güncellenemedi');
    });
  });

  describe('getFileById', () => {
    it('should return file by ID', async () => {
      fileRepository.getFileById.mockResolvedValue({ id: 1 });
      const result = await fileService.getFileById(1);
      expect(result).toHaveProperty('id');
    });

    it('should throw error if file not found', async () => {
      fileRepository.getFileById.mockResolvedValue(null);
      await expect(fileService.getFileById(1)).rejects.toThrow('Dosya bulunamadı');
    });
  });

  describe('deleteFile', () => {
    it('should delete file and return info', async () => {
      fileRepository.getFileById.mockResolvedValue({ id: 1, url: 'storage/uploads/test.jpg', uploadedFilename: 'test.jpg' });
      fs.existsSync.mockReturnValue(true);
      fs.unlinkSync.mockReturnValue();
      fileRepository.deleteFile.mockResolvedValue(true);

      const result = await fileService.deleteFile(1);
      expect(result).toHaveProperty('id');
    });

    it('should throw error if DB deletion fails', async () => {
      fileRepository.getFileById.mockResolvedValue({ id: 1, url: 'storage/uploads/test.jpg', uploadedFilename: 'test.jpg' });
      fileRepository.deleteFile.mockResolvedValue(false);

      await expect(fileService.deleteFile(1)).rejects.toThrow('Dosya veritabanından silinemedi');
    });
  });
});
