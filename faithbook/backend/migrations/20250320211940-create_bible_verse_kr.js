'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("BibleVerseKr", {
      book: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true  // Part of composite primary key
      },
      chapter: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true  // Part of composite primary key
      },
      verse: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true  // Part of composite primary key
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false
      }
    });

    // Optional: Add an index for faster searching
    await queryInterface.addIndex("BibleVerseKr", ["book", "chapter", "verse"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("BibleVerseKr");
  }
};
