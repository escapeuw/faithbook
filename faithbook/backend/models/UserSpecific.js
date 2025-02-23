const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User"); // Import the User model

const UserSpecific = sequelize.define("UserSpecific", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true, // A user can only have one specific data record
        references: {
            model: "Users", // The table that holds user data
            key: "id", // The column in the Users table that we reference
        },
        onDelete: "CASCADE", // If the user is deleted, the corresponding UserSpecific record is also deleted
    },
    profilePic: {
        type: DataTypes.STRING,
        defaultValue: 'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=1024x1024&w=is&k=20&c=oGqYHhfkz_ifeE6-dID6aM7bLz38C6vQTy1YcbgZfx8=', // Default profile picture URL
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    currentCity: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    friendsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // Start with zero friends
    },
});

// Define relationship between User and UserSpecific
UserSpecific.belongsTo(User, { foreignKey: "userId" }); // UserSpecific belongs to User
User.hasOne(UserSpecific, { foreignKey: "userId" }); // User has one UserSpecific

module.exports = UserSpecific;
