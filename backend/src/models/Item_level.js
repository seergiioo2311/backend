const { DataTypes } = require("sequelize");
const { sequelize_loggin, connectDB, sequelize_game } = require("../config/db.js");
const Level = require("./Level.js");
const { Item, ITEM_TYPE} = require("./Item.js");

const Item_level = sequelize_game.define(
    "Item_level",
    {
        id_level: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: Level,
                key: "level_number"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
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
        season: {
            type:DataTypes.INTEGER,
            allowNull: false
        }
    }, 
    {
        timestamps: true
    }
);

Item.belongsTo(Level, {
    foreignKey: "id_item" }); 
Level.hasMany(Item, {
    foreignKey: "id_level" }); 

module.exports = Item_level;