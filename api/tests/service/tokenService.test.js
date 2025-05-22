const jwt = require('jsonwebtoken');
const tokenService = require('../../services/tokenService');

jest.mock('jsonwebtoken');

describe('tokenService', () => {
  const mockUser = { id: 1, email: 'test@example.com' };
  const mockToken = 'mockToken';
  const decodedAccess = { id: 1, email: 'test@example.com', type: 'access', exp: Date.now() / 1000 + 3600 };
  const decodedRefresh = { id: 1, type: 'refresh', exp: Date.now() / 1000 + 3600 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAccessToken', () => {
    it('should generate an access token', () => {
      jwt.sign.mockReturnValue(mockToken);
      const token = tokenService.generateAccessToken(mockUser);
      expect(jwt.sign).toHaveBeenCalled();
      expect(token).toBe(mockToken);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token', () => {
      jwt.sign.mockReturnValue(mockToken);
      const token = tokenService.generateRefreshToken(mockUser.id);
      expect(jwt.sign).toHaveBeenCalled();
      expect(token).toBe(mockToken);
    });
  });

  describe('verifyAccessToken', () => {
  beforeEach(() => {
    jwt.verify.mockReset();
    jest.spyOn(Map.prototype, 'has').mockReturnValue(false); // blacklist etkisiz
  });

  it('should verify a valid access token', () => {
    jwt.verify.mockReturnValue(decodedAccess);
    const result = tokenService.verifyAccessToken(mockToken);
    expect(result).toEqual(decodedAccess);
  });

  it('should throw for token with wrong type', () => {
    jwt.verify.mockReturnValue({ ...decodedAccess, type: 'refresh' });
    expect(() => tokenService.verifyAccessToken(mockToken)).toThrow('Geçersiz token tipi');
  });

  it('should throw if token is blacklisted', () => {
    jest.spyOn(Map.prototype, 'has').mockReturnValue(true);
    expect(() => tokenService.verifyAccessToken(mockToken)).toThrow('Token geçersiz kılınmış');
  });

  it('should handle invalid token error', () => {
    jwt.verify.mockImplementation(() => {
      const error = new Error('Invalid');
      error.name = 'JsonWebTokenError';
      throw error;
    });
    expect(() => tokenService.verifyAccessToken(mockToken)).toThrow('Geçersiz token');
  });

  it('should handle expired token error', () => {
    jwt.verify.mockImplementation(() => {
      const error = new Error('Expired');
      error.name = 'TokenExpiredError';
      throw error;
    });
    expect(() => tokenService.verifyAccessToken(mockToken)).toThrow('Token süresi dolmuş');
  });
});


  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      jwt.verify.mockReturnValue(decodedRefresh);
      const result = tokenService.verifyRefreshToken(mockToken);
      expect(result).toEqual(decodedRefresh);
    });

    it('should throw for token with wrong type', () => {
      jwt.verify.mockReturnValue({ ...decodedRefresh, type: 'access' });
      expect(() => tokenService.verifyRefreshToken(mockToken)).toThrow('Geçersiz refresh token tipi');
    });

    it('should handle invalid refresh token error', () => {
      jwt.verify.mockImplementation(() => { throw { name: 'JsonWebTokenError' }; });
      expect(() => tokenService.verifyRefreshToken(mockToken)).toThrow('Geçersiz refresh token');
    });

    it('should handle expired refresh token error', () => {
      jwt.verify.mockImplementation(() => { throw { name: 'TokenExpiredError' }; });
      expect(() => tokenService.verifyRefreshToken(mockToken)).toThrow('Refresh token süresi dolmuş');
    });
  });

  describe('invalidateToken', () => {
    it('should add token to blacklist', () => {
      jwt.verify.mockReturnValue(decodedAccess);
      const result = tokenService.invalidateToken(mockToken);
      expect(result).toBe(true);
    });
  });

  describe('invalidateRefreshToken', () => {
    it('should add refresh token to blacklist', () => {
      jwt.verify.mockReturnValue(decodedRefresh);
      const result = tokenService.invalidateRefreshToken(mockToken);
      expect(result).toBe(true);
    });
  });

  describe('generateResetToken', () => {
    it('should generate a reset token', () => {
      jwt.sign.mockReturnValue(mockToken);
      const result = tokenService.generateResetToken(mockUser);
      expect(result).toBe(mockToken);
    });
  });
});
