const { Json } = require("sequelize/lib/utils");
const { where } = require("sequelize");
const { QueryTypes } = require('sequelize');
const { sequelize_game } = require("../config/db");
const { Op } = require("sequelize");
const { Tournament, TOURNAMENT_STATUS} = require("../models/Tournament.js");
const Tournament_member = require("../models/Tournament_member.js");

/**
 * 
 * @param {*} tournament_name 
 * @returns 
 */
async function createTournament(tournament_name) {
    try {
        const newTournament = await Tournament.create({
            name: tournament_name, 
            description: tournament_description,
            status: TOURNAMENT_STATUS.ACTIVE
        });
        return newTournament;
    } catch (error) {
        console.error(error);
        throw new Error(`Error creando torneo: ${error.message}`);
    }
}

/**
 * 
 * @param {*} tournamentId 
 * @returns 
 */
async function stopTournament(tournamentId) {
    try {
        const tournament = await Tournament.findOne({
            where: {
                id: tournamentId,
                status: TOURNAMENT_STATUS.ACTIVE
            }
        });

        if (!tournament) {
            throw new Error("Torneo no encontrado o ya detenido.");
        }

        tournament.status = TOURNAMENT_STATUS.FINISH;
        await tournament.save();

        return tournament;
    } catch (error) {
        console.error(error);
        throw new Error(`Error deteniendo torneo: ${error.message}`);
    }
}

/**
 * 
 * @param {*} tournamentId 
 * @returns 
 */
async function activateTournament(tournamentId) {
    try {
        const tournament = await Tournament.findOne({
            where: {
                id: tournamentId,
                status: TOURNAMENT_STATUS.PENDING
            }
        });

        if (!tournament) {
            throw new Error("Torneo no encontrado o ya activo.");
        }

        tournament.status = TOURNAMENT_STATUS.ACTIVE;
        await tournament.save();

        return tournament;
    } catch (error) {
        console.error(error);
        throw new Error(`Error activando torneo: ${error.message}`);
    }
}

/**
 * 
 * @param {*} tournamentId 
 * @returns 
 */
async function deleteTournament(tournamentId) {
    try {
        const tournament = await Tournmanet.destroy({
            where: {
                id: tournamentId
            }
        });

        console.log(tournament);
        
        if (!tournament) {
            return null;
        }

        return tournament;
    } catch (error) {
        console.error(error);
        throw new Error(`Error eliminando torneo: ${error.message}`);
    }
}


async function getTournamentMembers(tournamentId) {
    try {
        const members = await Tournament_member.findAll({
            attributes: 'id_user',
            where: {
                id_tournament: tournamentId
            }
        });
        
        if (!result) {
            return null;
        }

        return members;
    } catch (error) {
        console.error(error);
        throw new Error(`Error obteniendo los miembros del torneo`);
    }
}

/** RANKING DE TODOS **/