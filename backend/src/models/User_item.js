const { DataTypes } = require("sequelize");
const { sequelize_game } = require("../config/db.js");
const Item = require("./Item.js");
const User = require("./User.js");

const User_item = sequelize_game.define(
    "User_item",
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
        id_user: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: User,
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

Item.belongsToMany(User, { 
    through: User_item,
    foreignKey: "id_item" }); 
User.belongsToMany(Item, { 
    through: User_item,
    foreignKey: "id_user" });

module.exports = User_item;
