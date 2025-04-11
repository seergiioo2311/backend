const { DataTypes } = require("sequelize");
const { sequelize_loggin, connectDB, sequelize_game } = require("../config/db.js");
const SeasonPass = require("./SeasonPass.js");
const User = require("./User.js");

const SP_for_user = sequelize_game.define(
    "SP_for_user",
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
        unlocked: { // Si ha desbloqueado el pase de pago
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, 
    {
        timestamps: true
    }
);

User.belongsToMany(SeasonPass, { 
    through: SP_for_user, 
    foreignKey: "id_user" });
SeasonPass.belongsToMany(User, { 
    through: SP_for_user, 
    foreignKey: "id_season" });


module.exports = SP_for_user;