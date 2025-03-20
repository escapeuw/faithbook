const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BibleVerseKr = sequelize.define("BibleVerseKr", {
    book: {
        type: DataTypes.STRING,
        allowNull: false
    },
    chapter: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    verse: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    freezeTableName: true,     // Ensures the table name stays "BibleVerseKr"
    timestamps: false,
    indexes: [
        {
            fields: ["book", "chapter", "verse"]
        }
    ]
});

module.exports = BibleVerseKr;