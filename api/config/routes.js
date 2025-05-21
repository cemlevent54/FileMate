const authRoutes = require('../routes/authRoutes'); // ✅ Doğru router
const userRoutes = require('../routes/userRoutes');

const configureRoutes = (app) => {
  // Auth routes - Kimlik doğrulama işlemleri için
  app.use('/auth', authRoutes);
  app.use('/user', userRoutes);
};

module.exports = configureRoutes;
