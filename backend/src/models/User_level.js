const { DataTypes } = require("sequelize");
const { sequelize_game } = require("../config/db.js");
const User = require("./User.js");
const Level = require("./Level.js");

const User_level = sequelize_game.define(
    "User_level",
    {
        user_id: {
            type: DataTypes.UUID,
            primaryKey: true, // Clave primaria única por usuario
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        user_level: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Level,
                key: "level_number",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        }
    },
    {
        timestamps: true
    }
);

// Definir la relación 1:N en Sequelize
Level.hasMany(User_level, {
    foreignKey: "user_level",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

User_level.belongsTo(Level, {
    foreignKey: "user_level",
});

User.hasOne(User_level, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

User_level.belongsTo(User, {
    foreignKey: "user_id",
});

module.exports = User_level;
