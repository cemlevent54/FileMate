const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const { Role } = require('../models');
const tokenService = require('./tokenService');

module.exports = {
  register: async (email, password, name) => {
    // E-posta kontrolü
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Bu e-posta adresi zaten kullanımda');
    }

    // Şifre güvenlik kontrolü
    if (password.length < 6) {
      throw new Error('Şifre en az 6 karakter olmalıdır');
    }

    // Varsayılan user rolünü bul
    const userRole = await Role.findOne({ where: { name: 'user' } });
    if (!userRole) {
      throw new Error('Varsayılan rol bulunamadı');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await userRepository.create({ 
      email, 
      password: hashedPassword, 
      firstname: name, 
      isActive: true,
      roleId: userRole.id
    });

    // Access token ve refresh token oluştur
    const accessToken = tokenService.generateAccessToken(newUser);
    const refreshToken = tokenService.generateRefreshToken(newUser.id);

    // Token'ın son kullanma tarihini hesapla
    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 1); // 1 saat sonrası

    return { 
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.firstname
      },
      message: "Kullanıcı başarıyla oluşturuldu",
      userId: newUser.id,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expireDate: expireDate.toISOString()
    };
  },

  login: async (email, password) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    if (!user.isActive) {
      throw new Error('Hesabınız aktif değil');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('Geçersiz şifre');
    }

    const accessToken = tokenService.generateAccessToken(user);
    const refreshToken = tokenService.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.firstname
      },
      accessToken,
      refreshToken,
      expireDate: new Date(Date.now() + 3600000).toISOString() // 1 saat sonrası
    };
  },

  verifyToken: async (token) => {
    try {
      const decoded = tokenService.verifyAccessToken(token);
      const user = await userRepository.findById(decoded.id);
      
      if (!user) {
        throw new Error('Kullanıcı bulunamadı');
      }

      return user;
    } catch (error) {
      throw new Error('Geçersiz veya süresi dolmuş token');
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const decoded = tokenService.verifyRefreshToken(refreshToken);
      const user = await userRepository.findById(decoded.id);
      
      if (!user) {
        throw new Error('Kullanıcı bulunamadı');
      }

      const newAccessToken = tokenService.generateAccessToken(user);

      return {
        accessToken: newAccessToken,
        expireDate: new Date(Date.now() + 3600000).toISOString()
      };
    } catch (error) {
      throw new Error('Geçersiz refresh token');
    }
  },

  logout: async (token) => {
    try {
      return tokenService.invalidateToken(token);
    } catch (error) {
      throw new Error('Geçersiz token');
    }
  },

  forgotPassword: async (email) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    const resetToken = tokenService.generateResetToken(user);
    return { resetToken };
  }
};
