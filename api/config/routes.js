const authRoutes = require('../routes/authRoutes'); // ✅ Doğru router
const userRoutes = require('../routes/userRoutes');
const adminRoutes = require('../routes/adminRoutes');

const configureRoutes = (app) => {
  // Auth routes - Kimlik doğrulama işlemleri için
  app.use('/auth', authRoutes);
  app.use('/user', userRoutes);
  app.use('/admin', adminRoutes);
};

module.exports = configureRoutes;
