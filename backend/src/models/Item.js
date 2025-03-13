const { DataTypes } = require("sequelize");
const { sequelize_loggin, connectDB, sequelize_game } = require("../config/db.js");

const ITEM_TYPE = {
    SKIN: "Skin"
};

const Item = sequelize_game.define(
    "Item", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        type: {
            type: DataTypes.ENUM(...Object.values(ITEM_TYPE)),
            allowNull: false
        }
    }
);

module.exports = { Item, ITEM_TYPE };