const { DataTypes } = require("sequelize");
const { sequelize_game } = require("../config/db.js");
const Item = require("./Item.js");
const Achievement = require("./Achievement.js");

const Achievement_item = sequelize_game.define(
    "Achievement_item",
    {
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
        id_achievement: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Achievement,
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }
    }, 
    {
        timestamps: true
    }
);

Item.belongsTo(Achievement, { 
    foreignKey: "id_item" }); 
Achievement.hasMany(Item, { 
    foreignKey: "id_achievement" });

module.exports = Achievement_item;
