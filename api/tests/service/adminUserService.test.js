const adminUserService = require('../../services/adminUserService');
const bcrypt = require('bcrypt');
const { Role } = require('../../models');
const UserRepository = require('../../repositories/userRepository');

jest.mock('../../repositories/userRepository');
jest.mock('../../models', () => ({
  Role: {
    findOne: jest.fn()
  }
}));
jest.mock('bcrypt', () => ({
  hash: jest.fn()
}));

describe('AdminUserService', () => {
  let userMock;

  beforeEach(() => {
    jest.clearAllMocks();
    userMock = {
      id: 1,
      firstName: 'Ali',
      lastName: 'Yılmaz',
      email: 'ali@example.com',
      isActive: true,
      roleId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: 'hashed-password',
      get: jest.fn().mockReturnValue({
        id: 1,
        firstName: 'Ali',
        lastName: 'Yılmaz',
        email: 'ali@example.com',
        isActive: true,
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: 'hashed-password'
      })
    };
  });

  describe('getAllUsers', () => {
    it('should return all users without passwords', async () => {
      UserRepository.prototype.findAll.mockResolvedValue([userMock]);
      const users = await adminUserService.getAllUsers();

      expect(users[0].password).toBeUndefined();
      expect(users[0]).toMatchObject({
        id: 1,
        firstName: 'Ali',
        lastName: 'Yılmaz',
        email: 'ali@example.com'
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user if found', async () => {
      UserRepository.prototype.findById.mockResolvedValue(userMock);
      UserRepository.prototype.deleteUser.mockResolvedValue(true);

      const result = await adminUserService.deleteUser(1);
      expect(result).toBe(true);
    });

    it('should throw error if user not found', async () => {
      UserRepository.prototype.findById.mockResolvedValue(null);
      await expect(adminUserService.deleteUser(1)).rejects.toThrow('Kullanıcı bulunamadı');
    });
  });

  describe('updateUser', () => {
    it('should update user email and password', async () => {
      const userData = { email: 'new@example.com', password: 'newpass' };
      UserRepository.prototype.findById.mockResolvedValue({ ...userMock, email: 'old@example.com' });
      UserRepository.prototype.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('new-hashed-pass');
      UserRepository.prototype.updateUserInfo.mockResolvedValue(true);
      UserRepository.prototype.findById.mockResolvedValue(userMock);

      const result = await adminUserService.updateUser(1, userData);
      expect(result).toHaveProperty('email');
    });

    it('should throw if email is taken by another user', async () => {
      UserRepository.prototype.findById.mockResolvedValue(userMock);
      UserRepository.prototype.findByEmail.mockResolvedValue({ id: 2 });

      await expect(adminUserService.updateUser(1, { email: 'taken@example.com' }))
        .rejects.toThrow('Bu e-posta adresi zaten kullanımda');
    });

    it('should set roleId if role provided', async () => {
      const userData = { role: 'admin' };
      UserRepository.prototype.findById.mockResolvedValue(userMock);
      Role.findOne.mockResolvedValue({ id: 3 });
      UserRepository.prototype.updateUserInfo.mockResolvedValue(true);
      UserRepository.prototype.findById.mockResolvedValue(userMock);

      const result = await adminUserService.updateUser(1, userData);
      expect(result).toHaveProperty('roleId');
    });

    it('should throw if role is invalid', async () => {
      UserRepository.prototype.findById.mockResolvedValue(userMock);
      Role.findOne.mockResolvedValue(null);

      await expect(adminUserService.updateUser(1, { role: 'ghost' }))
        .rejects.toThrow('Geçersiz rol');
    });
  });

  describe('activateUser & blockUser', () => {
    it('should activate user', async () => {
      UserRepository.prototype.findById.mockResolvedValue(userMock);
      UserRepository.prototype.updateUserInfo.mockResolvedValue(true);
      const result = await adminUserService.activateUser(1);
      expect(result).toBe(true);
    });

    it('should block user', async () => {
      UserRepository.prototype.findById.mockResolvedValue(userMock);
      UserRepository.prototype.updateUserInfo.mockResolvedValue(true);
      const result = await adminUserService.blockUser(1);
      expect(result).toBe(true);
    });

    it('should throw if user not found on activate', async () => {
      UserRepository.prototype.findById.mockResolvedValue(null);
      await expect(adminUserService.activateUser(1)).rejects.toThrow('Kullanıcı bulunamadı');
    });

    it('should throw if user not found on block', async () => {
      UserRepository.prototype.findById.mockResolvedValue(null);
      await expect(adminUserService.blockUser(1)).rejects.toThrow('Kullanıcı bulunamadı');
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      UserRepository.prototype.findById.mockResolvedValue(userMock);
      const result = await adminUserService.getUserById(1);
      expect(result).toHaveProperty('email');
      expect(result.password).toBeUndefined();
    });

    it('should throw if user not found', async () => {
      UserRepository.prototype.findById.mockResolvedValue(null);
      await expect(adminUserService.getUserById(1)).rejects.toThrow('Kullanıcı bulunamadı');
    });
  });
});
