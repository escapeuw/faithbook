'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Likes', {
      id: {
        allowNull: false,
        autoIncrement: true,  // Use auto-increment or use UUID if you prefer
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.UUID, // Use UUID if your User IDs are UUIDs; change to INTEGER if not
        allowNull: false
      },
      postId: {
        type: Sequelize.UUID, // Use UUID if your Post IDs are UUIDs; change to INTEGER if not
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add a composite unique index to enforce one like per user per post
    await queryInterface.addIndex('Likes', ['userId', 'postId'], {
      unique: true,
      name: 'unique_like_per_user_per_post'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Likes');
  }
};