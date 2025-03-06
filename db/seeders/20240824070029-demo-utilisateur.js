'use strict';

const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const salt = await bcrypt.genSalt(10)
    const PASSWORD = await bcrypt.hash('12345678', salt)

    await queryInterface.bulkInsert('utilisateurs', [{
      USERNAME: "ngoie",
      EMAIL: "admin@agence.com",
      PASSWORD,
      NOM: "Ngoie",
      PRENOM: "Franssen",
      TELEPHONE1: "62334566",
      ADRESSE: "Kabondo",
    }])
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('utilisateurs', null, {});

  }
};
