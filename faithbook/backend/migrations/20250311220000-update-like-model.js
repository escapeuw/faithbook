'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Likes", "userId", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "Users",  // Make sure this matches the actual table name
        key: "id",
      },
      onDelete: "CASCADE",
    });

    await queryInterface.changeColumn("Likes", "postId", {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "Posts",
        key: "id",
      },
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // If you need to revert changes
    await queryInterface.changeColumn("Likes", "userId", {
      type: Sequelize.UUID,
      allowNull: false,
    });

    await queryInterface.changeColumn("Likes", "postId", {
      type: Sequelize.UUID,
      allowNull: false,
    });
  }
};
