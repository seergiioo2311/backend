const { DataTypes } = require("sequelize");
const { sequelize_game } = require("../config/db.js");
const User = require("./User.js");

const FRIEND_STATUS = {
    PENDING: "Pending",
    DENIED: "Denied",
    ACCEPTED: "Accepted"
};

const Friend = sequelize_game.define(
    "Friend",
    {
        id_friend_1: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true, 
            references: {
                model: User,
                key: "id"
            }, 
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        id_friend_2: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true, 
            references: {
                model: User,
                key: "id"
            }, 
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        status: {
            type: DataTypes.ENUM(...Object.values(FRIEND_STATUS)),
            allowNull: false
        }
    },
    {
        timestamps: true
    }
);

User.belongsToMany(User, {
    through: Friend,
    as: "friends",  
    foreignKey: "id_friend_1",
    otherKey: "id_friend_2"
});

module.exports = { Friend, FRIEND_STATUS };
