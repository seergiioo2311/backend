const { DataTypes } = require("sequelize");
const { sequelize_loggin, connectDB, sequelize_game } = require("../config/db.js");
const SeasonPass = require("./SeasonPass.js");
const { Item, ITEM_TYPE} = require("./Item.js");

const SP_item = sequelize_game.define(
    "SP_item",
    {
        id_season: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: SeasonPass,
                key: "id"
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
        level_required: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, 
    {
        timestamps: true
    }
);

// Relación 1:N entre SeasonPass y SP_item
SeasonPass.hasMany(Item, {
    foreignKey: "id_season"
});

Item.belongsTo(SeasonPass, {
    foreignKey: "id_item"
});

module.exports = SP_item;