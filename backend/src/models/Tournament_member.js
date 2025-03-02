const { DataTypes } = require("sequelize");
const { sequelize_game } = require("../config/db.js");
const User = require("./User.js");
const Tournament = require("./Tournament.js");

const TournamentMember = sequelize_game.define(
    "TournamentMember",
    {
        id_user: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: {
                model: User,
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        id_tournament: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: Tournament,
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        tournament_score: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: true 
    }
);

User.belongsToMany(Tournament, {
    through: TournamentMember,
    as: "tournaments",
    foreignKey: "id_user",
    otherKey: "id_tournament"
});

Tournament.belongsToMany(User, {
    through: TournamentMember,
    as: "members",
    foreignKey: "id_tournament",
    otherKey: "id_user"
});

module.exports = TournamentMember;
