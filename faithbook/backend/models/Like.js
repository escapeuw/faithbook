const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Post = require("./Post");
const User = require("./User");

const Like = sequelize.define("Like", {
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Users", // Explicitly reference the Users table for db level integrity + prevent invalid data
            key: "id"
        },
        onDelete: "CASCADE"
    },
    postId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Posts",
            key: "id"
        },
        onDelete: "CASCADE"
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ["userId", "postId"]
        }
    ]
});

/*
Like.associate = function (models) {
    Like.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });  // Cascade on user delete
    Like.belongsTo(models.Post, { foreignKey: "postId", onDelete: "CASCADE" });  // Cascade on post delete
} */

Like.afterDestroy(async (like, options) => {
    const postId = like.postId;

    // Decrement likes for the post accordingly when like is destroyed
    await Post.decrement("likes", {
        by: 1,
        where: { id: postId }
    });
});

module.exports = Like;