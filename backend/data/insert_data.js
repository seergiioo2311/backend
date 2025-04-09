const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Level = require("../src/models/Level.js");
const User = require("../src/models/User.js");
const Shop = require("../src/models/Shop.js");
const { Item, ItemType } = require("../src/models/Item.js");
const ShopItem = require("../src/models/Shop_item.js"); 
const User_item = require("../src/models/User_item.js");
const { Achievement, AchievementType } = require("../src/models/Achievement.js");
const User_achievement = require("../src/models/User_achievement.js");
const SeasonPass = require("../src/models/SeasonPass.js");
const SP_item = require("../src/models/SP_item.js");
const Item_level = require("../src/models/Item_level.js");

/**
 * Función para validar y convertir UUID.
 */
function parseUUID(value) {
  const cleanedValue = value.trim(); 
  if (!cleanedValue || typeof cleanedValue !== 'string' || cleanedValue.length !== 36) {
    console.warn(`[ ! ] UUID inválido detectado: "${cleanedValue}"`);
    return null;
  }
  return cleanedValue;
}


/**
 * Función para convertir valores a string asegurando su limpieza.
 */
function parseString(value) {
  return value && typeof value === 'string' ? value.trim() : '';
}

/**
 * Función para convertir valores numéricos.
 */
function parseIntValue(value) {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Función para convertir fechas en formato DD/MM/YYYY a objetos Date.
 */
function parseDate(value) {
  const dateParts = value.split('/');
  if (dateParts.length !== 3) return null;

  const [day, month, year] = dateParts.map(Number);
  const parsedDate = new Date(year, month - 1, day); // Meses en JS van de 0-11
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
}

/**
 * Esta función es encargada de introducir los usuarios en la tabla Users.
 */
async function importUsers() {
  const filePath = path.resolve(__dirname, 'users.csv');
  const users = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';', headers: ['id', 'username', 'description', 'experience', 'lastConnection'] }))
      .on('data', (row) => {      
        // Convertir y limpiar los valores
        const id = parseUUID(row.id);
        const username = parseString(row.username);
        const description = parseString(row.description);
        const experience = parseIntValue(row.experience);
        const lastConnection = parseDate(row.lastConnection);
        
        if (id) { // Solo agregamos usuarios con UUID válido
          users.push({
            id,
            username,
            description,
            experience,
            lastConnection
          });
        } else {
          console.warn('[ ! ] Usuario con ID inválido omitido.');
        }
      })
      .on('end', async () => {
        if (users.length === 0) {
          console.error('[ - ] No se encontraron datos válidos en el archivo CSV.');
          return resolve(); 
        }

        try {
          await User.bulkCreate(users);
          console.log('[ + ] Usuarios insertados correctamente en PostgreSQL.');
        } catch (error) {
          console.error('[ - ] Error al insertar usuarios:', error);
        }
        resolve();
      })
      .on('error', (err) => {
        console.error('[ - ] Error al leer el archivo CSV:', err);
        reject(err);
      });
  });
}

/**
 * Esta función es encargada de introducir los niveles en la tabla Levels.
 */
async function importLevels() {
  const filePath = path.resolve(__dirname, 'levels.csv');
  const levels = [];

  fs.createReadStream(filePath)
    .pipe(csv({ separator: ';', headers: ['level_number', 'experience_required'] }))
    .on('data', (row) => {      
      // Convertir y limpiar los valores
      const levelNumber = parseInt(row.level_number.trim(), 10);
      const experienceRequired = parseInt(row.experience_required.trim(), 10);

      levels.push({
        level_number: levelNumber,
        experience_required: experienceRequired
      });
    })
    .on('end', async () => {
      if (levels.length === 0) {
        console.error('[ - ] No se encontraron datos válidos en el archivo CSV.');
        return;
      }

      try {
        await Level.bulkCreate(levels);
        console.log('[ + ] Niveles insertados correctamente en PostgreSQL.');
      } catch (error) {
        console.error('[ - ] Error al insertar niveles:', error);
      }
    })
    .on('error', (err) => {
      console.error('[ - ] Error al leer el archivo CSV:', err);
    });
}

async function importTestsForShop() {
  try {
    await Shop.create({ name: "Tienda de skins" });
    await Item.create({ name: "Skin galaxy", type: "skin" });
    await Item.create({ name: "Skin fire", type: "skin" });
    await ShopItem.create({ id_shop: 1, id_item: 1, item_price: 100 });
    await ShopItem.create({ id_shop: 1, id_item: 2, item_price: 200 });
    console.log('[ + ] Datos de prueba insertados correctamente en PostgreSQL.');
  } catch (error) {
    console.error('[ - ] Error al insertar tests:', error);
  }
}

/**
  * @description Esta función es encargada de introducir los logros en la tabla Achievements.
  * @returns {Promise<void>}
  * @throws {Error} - Si ocurre un error al insertar los logros en la base de datos
  */
async function importAchievements() {
  const filePath = path.resolve(__dirname, 'logros.csv'); // Ruta del archivo CSV
  const achievements = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ',', headers: ['name', 'type', 'experience_otorgued', 'objective_value'] })) // Usando headers apropiados
      .on('data', (row) => {
        // Validación y conversión de tipos
        const experience = parseInt(row.experience_otorgued, 10);
        const objective_value = parseInt(row.objective_value, 10);

        if (!isNaN(experience) && !isNaN(objective_value) && row.name && row.type) {
          achievements.push({
            name: row.name.trim(),
            type: row.type.trim(),
            experience_otorgued: experience,
            objective_value: objective_value
          });
        }
      })
      .on('end', async () => {
        if (achievements.length === 0) {
          console.error('[ - ] Archivo CSV vacío o datos inválidos');
          return reject(new Error('Datos inválidos'));
        }

        try {
          await Achievement.bulkCreate(achievements, { validate: true });
          console.log(`[ + ] ${achievements.length} logros insertados correctamente`);
          resolve();
        } catch (error) {
          console.error('[ - ] Error en la base de datos:', error);
          reject(error);
        }
      })
      .on('error', (err) => {
        console.error('[ - ] Error de lectura de CSV:', err);
        reject(err);
      });
  });
}

/**
  * @description Esta función es encargada de introducir las relaciones entre usuarios y logros en la tabla User_achievements.
  * @returns {Promise<void>} - Promesa que se resuelve al finalizar la inserción de los datos
  * @throws {Error} - Si ocurre un error al insertar los datos en la base de datos
  */
async function importUserAch() {
  const filePath = path.resolve(__dirname, 'user_ach.csv');
  const userAchievements = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';', headers: ['id_user', 'id_achievement', 'achieved'] }))
      .on('data', (row) => {
        const idUser = parseUUID(row.id_user);
        const idAchievement = parseInt(row.id_achievement, 10);
        
        // Conversión a booleano
        const achieved = String(row.achieved).toLowerCase() === 'true';

        // Validación mejorada
        if (idUser && !isNaN(idAchievement && typeof achieved === 'boolean')) {
          userAchievements.push({
            id_user: idUser,
            id_achievement: idAchievement,
            achieved: achieved
          });
        }
      })
      .on('end', async () => {
        try {
          await User_achievement.bulkCreate(userAchievements, {
            validate: true,
            ignoreDuplicates: true
          });
          console.log(`[ + ] ${userAchievements.length} relaciones insertadas`);
          resolve();
        } catch (error) {
          console.error('[ - ] Error al insertar relaciones:', error);
          reject(error);
        }
      })
      .on('error', (err) => {
        console.error('[ - ] Error de lectura CSV:', err);
        reject(err);
      });
  });
}


async function importItems() {
  const filePath = path.resolve(__dirname, 'items.csv');
  const items = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath).pipe(csv({ separator: ',', headers: ['name', 'type'] })).on('data', (row) => {
      const name = parseString(row.name);
      const type = parseString(row.type);
       items.push({
          name: name,
          type: type
        });
    }).on('end', async () => {
      try {
        const insertedItems = await Item.bulkCreate(items);
          
        // Aquí estamos accediendo a los ids asignados
        insertedItems.forEach(item => {
          console.log(`Item insertado: ${item.name} con ID: ${item.id}`);
        });
        console.log('[ + ] Items insertados correctamente en PostgreSQL.');
        resolve();
      } catch (error) {
        console.error('[ - ] Error al insertar items:', error);
        reject(error);
      }
    }).on('error', (err) => {
      console.error('[ - ] Error al leer el archivo CSV:', err);
      reject(err);
    });
  });
}

async function importItemsToSP() {
  try {
    await SeasonPass.create({ id: 1, name: "First season pass", start: new Date(), end: new Date(), price: 1000 });
    await SP_item.create({ id_season: 1, id_item: 1, level_required: 1 });
    await SP_item.create({ id_season: 1, id_item: 2, level_required: 2 });
    console.log('[ + ] Items insertados correctamente en el pase de temporada.');
  } catch (error) {
    console.error('[ - ] Error al insertar items en el pase de temporada:', error);
  }
}

async function importItemsToLevels() {
  try {
    await Item_level.create({ id_item: 10, id_level: 1, season: 1 });
    await Item_level.create({ id_item: 11, id_level: 2, season: 1});
    console.log('[ + ] Items añadidos a los niveles correctamente.');
  } catch (error) {
    console.error('[ - ] Error al añadir items a los niveles:', error);
  }
}

module.exports = { importUsers, importLevels, importTestsForShop, importAchievements, importUserAch, importItems, importItemsToSP, importItemsToLevels };
