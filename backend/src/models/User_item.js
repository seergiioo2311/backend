// En User_item.js (después de definir el modelo)
const { DataTypes } = require("sequelize");
const { sequelize_game } = require("../config/db.js");
const { Item, ITEM_TYPE } = require("./Item.js");
const User = require("./User.js");

const User_item = sequelize_game.define(
    "User_item",
    {
        id_item: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: Item,
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        id_user: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            references: {
                model: User,
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        unlocked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        reclaimed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    }, 
    {
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['id_user', 'id_item'] // Evita duplicados
            }
        ]
    }
);

// Relación User-Item
User.belongsToMany(Item, {
    through: User_item,
    foreignKey: 'id_user',  // Clave del User en User_item
    otherKey: 'id_item'      // Clave del Item en User_item
});

Item.belongsToMany(User, {
    through: User_item,
    foreignKey: 'id_item',   // Clave del Item en User_item
    otherKey: 'id_user'      // Clave del User en User_item
});

module.exports = User_item;
