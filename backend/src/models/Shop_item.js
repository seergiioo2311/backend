const { DataTypes } = require("sequelize");
const { sequelize_game } = require("../config/db.js");
const Shop = require("./Shop.js");
const {Item, ItemType}= require("./Item.js");

const Shop_item = sequelize_game.define(
    "Shop_item",
    {
        id_shop: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Shop,
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        id_item: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Item,
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        item_price: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, 
    {
        timestamps: true
    }
);

// Definir las asociaciones
Shop.belongsToMany(Item, { 
    through: Shop_item, 
    foreignKey: "id_shop" 
});
Item.belongsToMany(Shop, { 
    through: Shop_item, 
    foreignKey: "id_item" 
});

module.exports = Shop_item;
