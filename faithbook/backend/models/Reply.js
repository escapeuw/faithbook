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

// post has many replies, reply belongs to post
Post.hasMany(Reply, { foreignKey: "postId", onDelete: "CASCADE" });
Reply.belongsTo(Post, { foreignKey: "postId" });

// User has many replies, reply belogns to user
User.hasMany(Reply, { foreignKey: "userId", onDelete: "CASCADE" });
Reply.belongsTo(User, { foreignKey: "userId" });

//reply has many replies(nested), reply belongs to reply(parent)
Reply.hasMany(Reply, { as: "Replies", foreignKey: "parentReplyId", onDelete: "CASCADE" });
Reply.belongsTo(Reply, { as: "Parent", foreignKey: "parentReplyId" });

/* beforeDestroy HOOK: Ensures child replies are deleted upon parent */

Reply.beforeDestroy(async (reply, options) => {
    await Reply.destroy({
        where: { parentReplyId: reply.id },
        transaction: options.transaction, // Ensures deletion happens inside transactions
    });
});

module.exports = Reply;