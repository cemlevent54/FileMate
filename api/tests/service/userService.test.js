const UserService = require('../../services/userService');
const UserRepository = require('../../repositories/userRepository');

jest.mock('../../repositories/userRepository');

describe('UserService', () => {
  let userService;
  let mockUser;
  const userId = 1;

  beforeEach(() => {
    userService = new UserService();
    mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      isActive: true,
      roleId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: 'hashed',
      get: jest.fn().mockReturnValue({
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        isActive: true,
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: 'hashed'
      })
    };
  });

  describe('getCurrentUser', () => {
    it('should return user info without password', async () => {
      UserRepository.prototype.findById.mockResolvedValue(mockUser);
      const result = await userService.getCurrentUser(userId);
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(result).not.toHaveProperty('password');
    });

    it('should throw error if user not found', async () => {
      UserRepository.prototype.findById.mockResolvedValue(null);
      await expect(userService.getCurrentUser(userId)).rejects.toThrow('Kullanıcı bulunamadı');
    });
  });

  describe('updatePassword', () => {
    it('should update password if old password is valid', async () => {
      UserRepository.prototype.findById.mockResolvedValue(mockUser);
      UserRepository.prototype.validatePassword.mockResolvedValue(true);
      UserRepository.prototype.updatePassword.mockResolvedValue();

      const result = await userService.updatePassword(userId, 'oldPass', 'newPass');
      expect(result).toEqual({ message: 'Şifre başarıyla güncellendi' });
    });

    it('should throw if user not found', async () => {
      UserRepository.prototype.findById.mockResolvedValue(null);
      await expect(userService.updatePassword(userId, 'oldPass', 'newPass')).rejects.toThrow('Kullanıcı bulunamadı');
    });

    it('should throw if old password is incorrect', async () => {
      UserRepository.prototype.findById.mockResolvedValue(mockUser);
      UserRepository.prototype.validatePassword.mockResolvedValue(false);

      await expect(userService.updatePassword(userId, 'wrongPass', 'newPass')).rejects.toThrow('Mevcut şifre yanlış');
    });
  });

  describe('updateUserInfo', () => {
    it('should update user info and return updated user', async () => {
      const newUserData = { firstName: 'Updated', email: 'new@example.com' };

      UserRepository.prototype.findById.mockResolvedValue(mockUser);
      UserRepository.prototype.findByEmail.mockResolvedValue(null);
      UserRepository.prototype.updateUserInfo.mockResolvedValue();

      // getCurrentUser is called again internally
      const updatedMockUser = { ...mockUser };
      updatedMockUser.get = jest.fn().mockReturnValue({
        ...mockUser.get(),
        firstName: 'Updated',
        email: 'new@example.com'
      });
      UserRepository.prototype.findById.mockResolvedValueOnce(mockUser).mockResolvedValueOnce(updatedMockUser);

      const result = await userService.updateUserInfo(userId, newUserData);
      expect(result.message).toBe('Kullanıcı bilgileri başarıyla güncellendi');
      expect(result.user.firstName).toBe('Updated');
    });

    it('should throw if email already exists', async () => {
      const newUserData = { email: 'existing@example.com' };

      UserRepository.prototype.findById.mockResolvedValue(mockUser);
      UserRepository.prototype.findByEmail.mockResolvedValue(mockUser);

      await expect(userService.updateUserInfo(userId, newUserData)).rejects.toThrow('Bu e-posta adresi zaten kullanımda');
    });
  });

  describe('deleteAccount', () => {
    it('should delete the account successfully', async () => {
      UserRepository.prototype.findById.mockResolvedValue(mockUser);
      UserRepository.prototype.deleteUser.mockResolvedValue();

      const result = await userService.deleteAccount(userId);
      expect(result).toEqual({ message: 'Hesap başarıyla silindi' });
    });

    it('should throw error if user not found', async () => {
      UserRepository.prototype.findById.mockResolvedValue(null);
      await expect(userService.deleteAccount(userId)).rejects.toThrow('Kullanıcı bulunamadı');
    });

    it('should throw error if deletion fails', async () => {
      UserRepository.prototype.findById.mockResolvedValue(mockUser);
      UserRepository.prototype.deleteUser.mockRejectedValue(new Error('DB error'));

      await expect(userService.deleteAccount(userId)).rejects.toThrow('Hesap silinirken bir hata oluştu: DB error');
    });
  });
});
