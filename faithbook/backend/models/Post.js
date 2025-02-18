const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");     // Import User to define relationship

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
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,        // optional
    },
    bibleVerse: {
        type: DataTypes.STRING,
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

// Define relationship
User.hasMany(Post, { foreignKey: "userId", onDelete: "CASCADE" });
Post.belongsTo(User, { foreignKey: "userId" });

module.exports = Post;