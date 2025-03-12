const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");

const User = require("./User");
const Post = require("./Post");
const Like = require("./Like");
const Reply = require("./Reply");
const UserSpecific = require("./UserSpecific");

// Initialize models
const models = { User, Post, Like, Reply, UserSpecific };

// Attach models to Sequelize
Object.values(models).forEach((model) => {
  if (model.init) model.init(sequelize, Sequelize);
});


// Define associations here
// Define relationship between User and UserSpecific
UserSpecific.belongsTo(User, { foreignKey: "userId" }); // UserSpecific belongs to User
User.hasOne(UserSpecific, { foreignKey: "userId" }); // User has one UserSpecific


User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

User.hasMany(Like, { foreignKey: "userId" });
Post.hasMany(Like, { foreignKey: "postId" });
Like.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
Like.belongsTo(Post, { foreignKey: "postId", onDelete: "CASCADE" });

User.hasMany(Reply, { foreignKey: "userId" });
Post.hasMany(Reply, { foreignKey: "postId" });
Reply.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
Reply.belongsTo(Post, { foreignKey: "postId", onDelete: "CASCADE" });

// Reply nesting (parent-child replies)
Reply.hasMany(Reply, { as: "Replies", foreignKey: "parentReplyId" });
Reply.belongsTo(Reply, { as: "Parent", foreignKey: "parentReplyId", onDelete: "CASCADE" });

console.log(Like.associations);
console.log(User.associations);
console.log(Post.associations);

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
