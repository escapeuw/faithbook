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

Like.associate = function(models) {
    Like.belongsTo(models.User, { foreignKey: "userId" });
    Like.belongsTo(models.Post, { foreignKey: "postId" });
}

module.exports = Like;