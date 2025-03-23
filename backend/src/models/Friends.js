const { DataTypes } = require("sequelize");
const { sequelize_game } = require("../config/db.js");
const User = require("./User");  // Correctly import User model

const FRIEND_STATUS = {
    PENDING: "Pending",
    DENIED: "Denied",
    ACCEPTED: "Accepted"
};

const Friends = sequelize_game.define(
    "Friends",
    {
        id_friend_1: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Users',  // Ensure that this refers to the 'Users' table
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
                model: 'Users',
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

// Correctly define the association
Friends.belongsTo(User, { foreignKey: 'id_friend_1', as: 'User1' });
Friends.belongsTo(User, { foreignKey: 'id_friend_2', as: 'User2' });

module.exports = { Friends, FRIEND_STATUS };



