const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Like = sequelize.define("Like", {
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    postId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ["userId", "postId"]
        }
    ]
});

Like.associate = function (models) {
    Like.belongsTo(models.User, { foreignKey: "userId", onDelete: "CASCADE" });  // Cascade on user delete
    Like.belongsTo(models.Post, { foreignKey: "postId", onDelete: "CASCADE" });  // Cascade on post delete
}

module.exports = Like;