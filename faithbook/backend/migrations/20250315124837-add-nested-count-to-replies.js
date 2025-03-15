'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Replies", "nestedCount", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });

    await queryInterface.addIndex("Replies", ["postId"]);
    await queryInterface.addIndex("Replies", ["postId", "parentReplyId"]);
    await queryInterface.addIndex("Replies", ["userId"]);
    await queryInterface.addIndex("Replies", ["createdAt"]);
    await queryInterface.addIndex("Replies", ["postId", "likes"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Replies", "nestedCount");
    await queryInterface.removeIndex("Replies", ["postId"]);
    await queryInterface.removeIndex("Replies", ["postId", "parentReplyId"]);
    await queryInterface.removeIndex("Replies", ["userId"]);
    await queryInterface.removeIndex("Replies", ["createdAt"]);
    await queryInterface.removeIndex("Replies", ["postId", "likes"]);
  }
};
