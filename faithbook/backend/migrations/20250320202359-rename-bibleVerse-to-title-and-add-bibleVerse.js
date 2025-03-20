'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename the "bibleVerse" column to "title"
    await queryInterface.renameColumn("Posts", "bibleVerse", "title");

    // Add the new "bibleVerse" column (nullable, only for devotion posts)
    await queryInterface.addColumn("Posts", "bibleVerse", {
      type: Sequelize.TEXT,
      allowNull: true, // Only devotion posts will have data
    });
  },

  async down(queryInterface, Sequelize) {
    // Reverse the changes: Rename "title" back to "bibleVerse"
    await queryInterface.renameColumn("Posts", "title", "bibleVerse");

    // Remove the new "bibleVerse" column
    await queryInterface.removeColumn("Posts", "bibleVerse");
  },
};
