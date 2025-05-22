const authService = require('../../services/authService');
const UserRepository = require('../../repositories/userRepository');
const tokenService = require('../../services/tokenService');

const bcrypt = require('bcrypt');
const { Role } = require('../../models');

jest.mock('../../repositories/userRepository');
jest.mock('../../services/tokenService');
jest.mock('bcrypt');
jest.mock('../../models', () => ({
  Role: {
    findOne: jest.fn()
  }
}));

const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedpassword',
  first_name: 'Test',
  isActive: true,
  roleId: 1
};

describe('authService', () => {
  let userRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      UserRepository.prototype.findByEmail.mockResolvedValue(null);
      Role.findOne.mockResolvedValue({ id: 1 });
      bcrypt.hash.mockResolvedValue('hashedpassword');
      UserRepository.prototype.create.mockResolvedValue({ ...mockUser });
      tokenService.generateAccessToken.mockReturnValue('access-token');
      tokenService.generateRefreshToken.mockReturnValue('refresh-token');

      const result = await authService.register('test@example.com', '123456', 'Test');

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw error if email already exists', async () => {
      UserRepository.prototype.findByEmail.mockResolvedValue(mockUser);

      await expect(authService.register('test@example.com', '123456', 'Test'))
        .rejects
        .toThrow('Bu e-posta adresi zaten kullanımda');
    });

    it('should throw error if password is too short', async () => {
      UserRepository.prototype.findByEmail.mockResolvedValue(null);

      await expect(authService.register('test@example.com', '123', 'Test'))
        .rejects
        .toThrow('Şifre en az 6 karakter olmalıdır');
    });

    it('should throw error if role not found', async () => {
      UserRepository.prototype.findByEmail.mockResolvedValue(null);
      Role.findOne.mockResolvedValue(null);

      await expect(authService.register('test@example.com', '123456', 'Test'))
        .rejects
        .toThrow('Varsayılan rol bulunamadı');
    });
  });

  describe('login', () => {
    it('should log in a user successfully', async () => {
      UserRepository.prototype.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      tokenService.generateAccessToken.mockReturnValue('access-token');
      tokenService.generateRefreshToken.mockReturnValue('refresh-token');

      const result = await authService.login('test@example.com', '123456');

      expect(result).toHaveProperty('user');
      expect(result.accessToken).toBe('access-token');
    });

    

    it('should throw error if user is not active', async () => {
      UserRepository.prototype.findByEmail.mockResolvedValue({ ...mockUser, isActive: false });

      await expect(authService.login('test@example.com', '123456'))
        .rejects
        .toThrow('Hesabınız aktif değil');
    });

    it('should throw error if password is invalid', async () => {
      UserRepository.prototype.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login('test@example.com', 'wrongpassword'))
        .rejects
        .toThrow('Geçersiz şifre');
    });
  });

  describe('verifyToken', () => {
    it('should return user if token is valid', async () => {
      tokenService.verifyAccessToken.mockReturnValue({ id: 1 });
      UserRepository.prototype.findById.mockResolvedValue(mockUser);

      const user = await authService.verifyToken('valid-token');
      expect(user).toEqual(mockUser);
    });

    

    it('should throw error for invalid token', async () => {
      tokenService.verifyAccessToken.mockImplementation(() => { throw new Error(); });

      await expect(authService.verifyToken('invalid-token'))
        .rejects
        .toThrow('Geçersiz veya süresi dolmuş token');
    });
  });

  describe('refreshToken', () => {
    it('should return new access token if refresh token is valid', async () => {
      tokenService.verifyRefreshToken.mockReturnValue({ id: 1 });
      UserRepository.prototype.findById.mockResolvedValue(mockUser);
      tokenService.generateAccessToken.mockReturnValue('new-access-token');

      const result = await authService.refreshToken('refresh-token');
      expect(result.accessToken).toBe('new-access-token');
    });

    it('should throw error if refresh token is invalid', async () => {
      tokenService.verifyRefreshToken.mockImplementation(() => { throw new Error(); });

      await expect(authService.refreshToken('bad-token'))
        .rejects
        .toThrow('Geçersiz refresh token');
    });
  });

  describe('forgotPassword', () => {
    it('should return reset token if user exists', async () => {
      UserRepository.prototype.findByEmail.mockResolvedValue(mockUser);
      tokenService.generateResetToken.mockReturnValue('reset-token');

      const result = await authService.forgotPassword('test@example.com');
      expect(result.resetToken).toBe('reset-token');
    });

    it('should throw error if user not found', async () => {
      UserRepository.prototype.findByEmail.mockResolvedValue(null);

      await expect(authService.forgotPassword('notfound@example.com'))
        .rejects
        .toThrow('Kullanıcı bulunamadı');
    });
  });
});
