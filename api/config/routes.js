const authRoutes = require('../routes/authRoutes'); // ✅ Doğru router
const userRoutes = require('../routes/userRoutes');
const adminRoutes = require('../routes/adminRoutes');
const fileRoutes = require('../routes/fileRoutes');

const configureRoutes = (app) => {
  // Auth routes - Kimlik doğrulama işlemleri için
  app.use('/auth', authRoutes);
  app.use('/user', userRoutes);
  app.use('/admin', adminRoutes);
  app.use('/api/files', fileRoutes);
};

module.exports = configureRoutes;
