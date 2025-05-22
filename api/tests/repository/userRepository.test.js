const bcrypt = require('bcrypt');
const { User, Role } = require('../../models');
const UserRepository = require('../../repositories/userRepository');

jest.mock('../../models', () => ({
  User: {
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn()
  },
  Role: {}
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn()
}));

describe('UserRepository', () => {
  let userRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    jest.clearAllMocks();
  });

  describe('findById', () => {
    test('should return user with selected attributes', async () => {
      const mockUser = { id: 1, firstName: 'Test', lastName: 'User' };
      User.findByPk.mockResolvedValue(mockUser);

      const result = await userRepository.findById(1);

      expect(User.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
      expect(result).toEqual(mockUser);
    });
  });

  describe('validatePassword', () => {
    test('should return true if password is valid', async () => {
      const mockUser = { password: 'hashed' };
      User.findByPk.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const result = await userRepository.validatePassword(1, 'plain');
      expect(result).toBe(true);
    });

    test('should return false if user not found', async () => {
      User.findByPk.mockResolvedValue(null);

      const result = await userRepository.validatePassword(999, 'any');
      expect(result).toBe(false);
    });
  });

  describe('updatePassword', () => {
    test('should hash the new password and update the user', async () => {
      bcrypt.hash.mockResolvedValue('hashedPass');
      User.update.mockResolvedValue([1]);

      const result = await userRepository.updatePassword(1, 'newPass');
      expect(bcrypt.hash).toHaveBeenCalledWith('newPass', 10);
      expect(User.update).toHaveBeenCalledWith({ password: 'hashedPass' }, { where: { id: 1 } });
      expect(result).toEqual([1]);
    });
  });

  describe('updateUserInfo', () => {
    test('should update user info', async () => {
      const userData = {
        firstName: 'Updated',
        lastName: 'User',
        email: 'updated@example.com',
        roleId: 2,
        isActive: true,
        password: 'pass'
      };
      User.update.mockResolvedValue([1]);

      const result = await userRepository.updateUserInfo(1, userData);
      expect(User.update).toHaveBeenCalledWith(expect.objectContaining(userData), { where: { id: 1 } });
      expect(result).toEqual([1]);
    });
  });

  describe('deleteUser', () => {
    test('should delete user successfully', async () => {
      User.destroy.mockResolvedValue(1);
      const result = await userRepository.deleteUser(1);
      expect(User.destroy).toHaveBeenCalledWith({ where: { id: 1 }, force: true });
      expect(result).toBe(1);
    });

    test('should throw error if no user deleted', async () => {
      User.destroy.mockResolvedValue(0);
      await expect(userRepository.deleteUser(1)).rejects.toThrow('Kullanıcı silinemedi');
    });
  });

  describe('findByEmail', () => {
    test('should return user with role', async () => {
      const mockUser = { id: 1, email: 'test@example.com', Role: { name: 'admin' } };
      User.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.findByEmail('test@example.com');
      expect(User.findOne).toHaveBeenCalledWith(expect.objectContaining({ where: { email: 'test@example.com' } }));
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    test('should create a new user', async () => {
      const newUser = { email: 'new@example.com', password: 'pass' };
      User.create.mockResolvedValue(newUser);

      const result = await userRepository.create(newUser);
      expect(User.create).toHaveBeenCalledWith(newUser);
      expect(result).toEqual(newUser);
    });
  });

  describe('findAll', () => {
    test('should return all users with selected attributes', async () => {
      const users = [{ id: 1, firstName: 'Test' }];
      User.findAll.mockResolvedValue(users);

      const result = await userRepository.findAll();
      expect(User.findAll).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toEqual(users);
    });
  });
});