const { QueryTypes } = require("sequelize");
const { sequelize_game } = require("../../src/config/db.js");


const triggersSeasonPass = async () => {
    try {
        // Este trigger actualiza la relación User_levels cada vez que el usuario reclama un logro o aumenta la experiencia
        await sequelize_game.query(
            `
            CREATE OR REPLACE FUNCTION update_user_levels()
            RETURNS TRIGGER AS $$
            BEGIN
                UPDATE "User_levels"
                SET user_level = COALESCE((
                    SELECT level_number
                    FROM "Levels"
                    WHERE experience_required <= (
                        SELECT experience
                        FROM "Users"
                        WHERE id = NEW.id
                    )
                    ORDER BY experience_required DESC
                    LIMIT 1
                ), 1) + 1
                WHERE user_id = NEW.id;

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER update_user_levels_trigger
            AFTER INSERT OR UPDATE ON "Users"
            FOR EACH ROW
            EXECUTE FUNCTION update_user_levels();`
        );

        // Este trigger se activa cada vez que el usuario sube de nivel, para desbloquear los items del pase de pago
        await sequelize_game.query(
            `
            CREATE OR REPLACE FUNCTION update_user_items_premium()
            RETURNS TRIGGER AS $$
            BEGIN
                UPDATE "User_items"
                SET unlocked = TRUE
                WHERE id_user = NEW.user_id 
                AND id_item  <= NEW.user_level + 16; -- Compara directamente el nivel del item con el nivel del usuario

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER update_user_items_premium_trigger
            AFTER INSERT OR UPDATE ON "User_levels"
            FOR EACH ROW
            EXECUTE FUNCTION update_user_items_premium();`
        );
        // Este trigger se activa cada vez que el usuario consigue un logro, para poner en la relacion User_achievement el valor de completed a TRUE
        // Hay que comprobar que el campo current_value sea igual o superior al objective_value del logro
        await sequelize_game.query(
            `
            CREATE OR REPLACE FUNCTION update_user_achievement()
            RETURNS TRIGGER AS $$
            BEGIN
                -- Deshabilitar el trigger para evitar recursión infinita
                PERFORM pg_catalog.set_config('session_replication_role', 'replica', true);

                UPDATE "User_achievements"
                SET completed = TRUE
                WHERE id_user = NEW.id_user 
                AND id_achievement = NEW.id_achievement 
                AND current_value >= (
                    SELECT objective_value 
                    FROM "Achievements" 
                    WHERE id = NEW.id_achievement
                );

                -- Rehabilitar el trigger
                PERFORM pg_catalog.set_config('session_replication_role', 'origin', true);

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
            CREATE TRIGGER update_user_achievement_trigger
            AFTER INSERT OR UPDATE ON "User_achievements"
            FOR EACH ROW
            EXECUTE FUNCTION update_user_achievement();`
        );

        // Trigger para desbloquear los items del pase gratuito
        await sequelize_game.query(
            `
            CREATE OR REPLACE FUNCTION update_user_items_free()
            RETURNS TRIGGER AS $$
            BEGIN
                UPDATE "User_items"
                SET unlocked = TRUE
                WHERE id_user = NEW.user_id 
                AND (
                    (id_item = 37 AND NEW.user_level >= 3) OR
                    (id_item = 38 AND NEW.user_level >= 8) OR
                    (id_item = 39 AND NEW.user_level >= 13) OR
                    (id_item = 40 AND NEW.user_level >= 18)
                );

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER update_user_items_free_trigger
            AFTER INSERT OR UPDATE ON "User_levels"
            FOR EACH ROW
            EXECUTE FUNCTION update_user_items_free();`
        );

        console.log("[ + ] Trigger para actualizar los items funcionando correctamente.")
    } catch (error) {
        console.error("[ - ] Error creando los triggers:", error);
    }
}

module.exports = { triggersSeasonPass };