const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_EXPIRES_IN = '1h';
const JWT_REFRESH_EXPIRES_IN = '7d';

// Token blacklist için Map kullanımı (daha iyi performans için)
const tokenBlacklist = new Map();

// Blacklist temizleme fonksiyonu (24 saatte bir çalışır)
const cleanupBlacklist = () => {
  const now = Date.now();
  for (const [token, expiry] of tokenBlacklist.entries()) {
    if (expiry < now) {
      tokenBlacklist.delete(token);
    }
  }
};

// Her 24 saatte bir blacklist'i temizle
setInterval(cleanupBlacklist, 24 * 60 * 60 * 1000);

module.exports = {
  generateAccessToken: (user) => {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        type: 'access'
      }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );
  },

  generateRefreshToken: (userId) => {
    return jwt.sign(
      {
        id: userId,
        type: 'refresh'
      },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );
  },

  verifyAccessToken: (token) => {
    try {
      if (!token) {
        throw new Error('Token bulunamadı');
      }

      if (tokenBlacklist.has(token)) {
        throw new Error('Token geçersiz kılınmış');
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      
      if (decoded.type !== 'access') {
        throw new Error('Geçersiz token tipi');
      }

      return decoded;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Geçersiz token');
      } else if (error.name === 'TokenExpiredError') {
        throw new Error('Token süresi dolmuş');
      }
      throw error;
    }
  },

  verifyRefreshToken: (token) => {
    try {
      if (!token) {
        throw new Error('Refresh token bulunamadı');
      }

      const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
      
      if (decoded.type !== 'refresh') {
        throw new Error('Geçersiz refresh token tipi');
      }

      return decoded;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Geçersiz refresh token');
      } else if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token süresi dolmuş');
      }
      throw error;
    }
  },

  invalidateToken: (token) => {
    try {
      if (!token) {
        throw new Error('Token bulunamadı');
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const expiry = decoded.exp * 1000; // Convert to milliseconds
      
      // Token'ı blacklist'e ekle
      tokenBlacklist.set(token, expiry);
      
      return true;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Geçersiz token');
      } else if (error.name === 'TokenExpiredError') {
        throw new Error('Token süresi dolmuş');
      }
      throw error;
    }
  },

  invalidateRefreshToken: (token) => {
    try {
      if (!token) {
        throw new Error('Refresh token bulunamadı');
      }

      const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
      const expiry = decoded.exp * 1000; // Convert to milliseconds
      
      // Refresh token'ı blacklist'e ekle
      tokenBlacklist.set(token, expiry);
      
      return true;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Geçersiz refresh token');
      } else if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token süresi dolmuş');
      }
      throw error;
    }
  },

  generateResetToken: (user) => {
    return jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  }
}; 