module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Posts', 'repliesCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0,  // Set default value for existing rows
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Posts', 'repliesCount');
  }
};
