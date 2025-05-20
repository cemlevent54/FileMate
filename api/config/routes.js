/**
 * Route yapılandırma dosyası
 * Bu dosya, uygulamanın tüm route'larını yapılandırır.
 * 
 * Kullanım:
 * 1. Yeni bir route eklemek için configureRoutes fonksiyonu içine ekleyin
 * 2. Her route için ilgili controller'ı import edin
 * 3. Route'ları mantıksal gruplara ayırın (auth, user, admin vb.)
 */

/**
 * Route yapılandırma fonksiyonu
 * @param {Express} app - Express uygulama instance'ı
 * 
 * Kullanım:
 * 1. Her route grubu için ayrı bir controller kullanın
 * 2. Route'ları anlamlı prefix'lerle gruplandırın
 * 3. Middleware'leri route seviyesinde uygulayabilirsiniz
 * 
 * Örnek:
 * app.use('/auth', authMiddleware, authRoutes);
 * app.use('/users', userMiddleware, userRoutes);
 */
const configureRoutes = (app) => {
    // Auth routes - Kimlik doğrulama işlemleri için
    const authRoutes = require('../controllers/authController');
    app.use('/auth', authRoutes);
};

module.exports = configureRoutes; 