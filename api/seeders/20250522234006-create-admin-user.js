'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Rol id'yi al (varsayım: admin rolü mevcut)
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM Roles WHERE name = 'admin' LIMIT 1;`
    );

    const adminRoleId = roles[0]?.id;
    if (!adminRoleId) {
      console.log("Admin rolü bulunamadı. Önce rol seeder'ını çalıştırın.");
      return;
    }

    // Zaten admin varsa, ekleme
    const [existingAdmins] = await queryInterface.sequelize.query(
      `SELECT * FROM Users WHERE email = 'admin@gmail.com' LIMIT 1;`
    );

    if (existingAdmins.length > 0) {
      console.log("Admin zaten mevcut, seeder atlandı.");
      return;
    }

    const hashedPassword = await bcrypt.hash('admin', 10);

    return queryInterface.bulkInsert('Users', [{
      email: 'admin@gmail.com',
      password: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      isActive: true,
      roleId: adminRoleId,
      createdAt: now,
      updatedAt: now
    }]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', { email: 'admin@gmail.com' }, {});
  }
};