'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Ensure repliesCount is correctly updated when replies are deleted
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION decrement_replies_count()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE "Posts"
        SET "repliesCount" = "repliesCount" - 1
        WHERE "id" = OLD."postId";
        RETURN OLD;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER after_reply_delete
      AFTER DELETE ON "Replies"
      FOR EACH ROW
      EXECUTE FUNCTION decrement_replies_count();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS after_reply_delete ON "Replies";
      DROP FUNCTION IF EXISTS decrement_replies_count;
    `);
  }
};
