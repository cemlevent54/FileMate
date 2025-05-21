const authRoutes = require('../routes/authRoutes'); // ✅ Doğru router

const configureRoutes = (app) => {
  // Auth routes - Kimlik doğrulama işlemleri için
  app.use('/auth', authRoutes);
};

module.exports = configureRoutes;
