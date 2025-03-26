const { DataTypes } = require("sequelize");
const { sequelize_game } = require("../config/db.js");
const User = require("./User.js");  // Correctly import User model

const Message = sequelize_game.define(
    "Message",
    {
        id: {
            type: DataTypes.DATE,
            allowNull: false,
            primaryKey: true,
            //defaultValue: DataTypes.UUIDV4  // Auto-generar un ID único
        },
        id_friend_emisor: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        id_friend_receptor: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        content: {
            type: DataTypes.STRING(500),  // Store up to 500 characters for the message
            allowNull: false
        },
        date: {
            type: DataTypes.STRING(10),
            allowNull: false,
           // defaultValue: DataTypes.NOW  // Automatically set to current timestamp
        }
    },
    {
        timestamps: true  // Automatically add `createdAt` and `updatedAt` fields
    }
);

// Correctly define the association
Message.belongsTo(User, { foreignKey: 'id_friend_emisor', as: 'User1' });
Message.belongsTo(User, { foreignKey: 'id_friend_receptor', as: 'User2' });

module.exports = { Message };