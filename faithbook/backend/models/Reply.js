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
    }
});

// Relationships

// Post has many replies, Reply belongs to Post
Post.hasMany(Reply, { foreignKey: "postId" });  
Reply.belongsTo(Post, { foreignKey: "postId", onDelete: "CASCADE" }); 

// User has many replies, Reply belongs to User
User.hasMany(Reply, { foreignKey: "userId" }); // 
Reply.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// Reply has many replies (nested replies), Reply belongs to Reply (parent reply)
Reply.hasMany(Reply, { as: "Replies", foreignKey: "parentReplyId" }); 
Reply.belongsTo(Reply, { as: "Parent", foreignKey: "parentReplyId", onDelete: "CASCADE" }); 


/* beforeDestroy HOOK: Ensures child replies are deleted upon parent */

Reply.beforeDestroy(async (reply, options) => {
    await Reply.destroy({
        where: { parentReplyId: reply.id },
        transaction: options.transaction, // Ensures deletion happens inside transactions
    });
});


// Hook to update `repliesCount` when a reply is deleted
Reply.afterDestroy(async (reply, options) => {
    await Post.decrement("repliesCount", {
        by: 1,
        where: { id: reply.postId },
    });
});
module.exports = Reply;