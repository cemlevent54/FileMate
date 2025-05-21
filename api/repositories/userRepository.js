const { User } = require('../models'); // Sequelize modelin burada olmalı

module.exports = {
  create: async (userData) => {
    return await User.create(userData);
  },

  findByEmail: async (email) => {
    return await User.findOne({ where: { email } });
  }
};
