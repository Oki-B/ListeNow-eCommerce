"use strict";

const { hashPassword } = require("../helpers/bcyrpt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      require("../data/user.json").map((el) => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        el.password = hashPassword(el.password);
        return el;
      }),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
