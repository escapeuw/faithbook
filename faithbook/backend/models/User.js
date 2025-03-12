const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // require automatically looks for .js file

const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        /* unique: true, */ //shouldnt be unique?? because actual name
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // validates the email format
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNULL: false,
    },
});

const Post = require("./Post"); // Import the Post model
const Like = require("./Like");


// hooks for user removal with error handling
User.afterDestroy(async (user, options) => {
    try {
        // Find all likes associated with deleted user
        const likes = await Like.findAll({
            where: { userId: user.id }
        });

        // Decrement likes for each post the deleted user liked
        for (let like of likes) {
            await Post.decrement("likes", {
                by: 1,
                where: { id: like.postId }
            });
        }

        // Find all replies associated with deleted user
        const replies = await Reply.findAll({
            where: { userId: user.id }
        });

        // Decrement repliesCount for each post the user replied to
        for (let reply of replies) {
            await Post.decrement("repliesCount", {
                by: 1,
                where: { id: reply.postId }
            });
        }

    } catch (err) {
        console.error("Error handling user deletion:", err);
    }
});

// Define relationship
User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

User.hasMany(Like, { foreignKey: "userId" })

module.exports = User;