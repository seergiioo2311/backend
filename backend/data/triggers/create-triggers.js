const { QueryTypes } = require("sequelize");
const { sequelize_game } = require("../config/db");

const createTriggers = async () => {
    try {
        // Función para insertar en SP_FOR_USERS
        await sequelize_game.query(
            `
            CREATE OR REPLACE FUNCTION insert_into_SP_for_users()
            RETURNS TRIGGER AS $$
            BEGIN
                INSERT INTO "SP_FOR_USERS" (id_season, id_user, unlocked)
                VALUES (
                    (SELECT id
                    FROM "SeasonPasses" 
                    WHERE START <= CURRENT_DATE AND
                        END >= CURRENT_DATE
                    ), 
                    NEW.id_user, 
                    false);
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;`
        );

        // Trigger que inserta en SP_FOR_USERS tras insertar en Users
        await sequelize_game.define(
            `
            CREATE TRIGGER insert_SP_for_users_trigger
            AFTER INSERT ON "Users"
            FOR EACH ROW
            EXECUTE FUNCTION insert_into_SP_for_users();
            `
        );
        console.log("[ + ] Se han creado exitosamente los triggers.")
    } catch (error) {
        console.error("[ - ] Error creando los triggers:", error);
    }
}