const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_EXPIRES_IN = '1h';
const JWT_REFRESH_EXPIRES_IN = '7d';

// Token blacklist için basit bir in-memory çözüm (production'da Redis kullanılmalı)
const tokenBlacklist = new Set();

// Blacklist temizleme fonksiyonu (24 saatte bir çalışır)
const cleanupBlacklist = () => {
  const now = Date.now();
  for (const token of tokenBlacklist) {
    try {
      const decoded = jwt.decode(token);
      if (decoded && decoded.exp * 1000 < now) {
        tokenBlacklist.delete(token);
      }
    } catch (error) {
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
      if (tokenBlacklist.has(token)) {
        throw new Error('Token geçersiz kılınmış');
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      
      if (decoded.type !== 'access') {
        throw new Error('Geçersiz token tipi');
      }

      return decoded;
    } catch (error) {
      throw new Error('Geçersiz veya süresi dolmuş token');
    }
  },

  verifyRefreshToken: (token) => {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
      
      if (decoded.type !== 'refresh') {
        throw new Error('Geçersiz token tipi');
      }

      return decoded;
    } catch (error) {
      throw new Error('Geçersiz refresh token');
    }
  },

  invalidateToken: (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      tokenBlacklist.add(token);
      return true;
    } catch (error) {
      throw new Error('Geçersiz token');
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