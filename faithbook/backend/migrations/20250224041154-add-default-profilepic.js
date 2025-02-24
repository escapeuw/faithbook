'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('UserSpecifics', 'profilePic', {
      type: Sequelize.STRING,
      defaultValue: "https://faithbookbucket.s3.amazonaws.com/empty_profile.jpg", // Update default value
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('UserSpecifics', 'profilePic', {
      type: Sequelize.STRING,
      defaultValue: null, // Revert to previous state, if needed
    });
  }
};
