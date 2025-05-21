'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Users', 'firstname', 'first_name');
    await queryInterface.renameColumn('Users', 'lastname', 'last_name');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('Users', 'first_name', 'firstname');
    await queryInterface.renameColumn('Users', 'last_name', 'lastname');
  }
};
