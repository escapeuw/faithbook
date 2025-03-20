'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Posts", "type", {
      type: Sequelize.ENUM("devotion", "story"),
      allowNull: false,
      defaultValue: "devotion",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Posts", "type");
  },
};
