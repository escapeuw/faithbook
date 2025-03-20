const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Post = sequelize.define("Post", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "Users",       // referencing the User(s) table
            key: "id"
        },
        onDelete: "CASCADE",
    },
    type: {
        type: DataTypes.ENUM("devotion", "story"),
        allowNull: false,
        defaultValue: "devotion"
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,        // optional
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,        // Rename from bibleVerse (for both devotion and story posts)
    },
    bibleVerse: {
        type: DataTypes.TEXT,
        allowNull: true,           // Only for devotion posts
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    reports: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    repliesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
});

const Like = require("./Like");

Post.hasMany(Like, { foreignKey: "postId" });

Post.associate = function (models) {
    Post.hasMany(models.Like, { foreignKey: 'postId' });
}


module.exports = Post;