const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Post = require("./Post");

const Reply = sequelize.define("Reply", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    postId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Posts",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    parentReplyId: {
        type: DataTypes.UUID,
        allowNull: true, // null means direct comment (top level replies)
        references: {
            model: "Replies",
            key: "id",
        },
        onDelete: "CASCADE"
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    reports: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    nestedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
}, {
    indexes: [
        { fields: ["postId"] },      // Index for fetching all replies of a post
        { fields: ["postId", "parentReplyId"] },   // Fetching nested replies
        { fields: ["userId"] },   // Index for fetching replies by a user
        { fields: ["createdAt"] },  // Index for sorting by creation time
        { fields: ["postId", "likes"] },
    ]
});

Post.hasMany(Reply, { foreignKey: "postId" });
Reply.belongsTo(Post, { foreignKey: "postId", onDelete: "CASCADE" });

// User has many replies, Reply belongs to User
User.hasMany(Reply, { foreignKey: "userId" }); // 
Reply.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// Reply has many replies (nested replies), Reply belongs to Reply (parent reply)
Reply.hasMany(Reply, { as: "Replies", foreignKey: "parentReplyId" });
Reply.belongsTo(Reply, { as: "Parent", foreignKey: "parentReplyId", onDelete: "CASCADE" });


module.exports = Reply;