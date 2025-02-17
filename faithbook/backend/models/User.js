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

module.exports = User;