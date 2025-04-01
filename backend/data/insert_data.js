const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Level = require("../src/models/Level.js");
const User = require("../src/models/User.js");
const Shop = require("../src/models/Shop.js");
const { Item, ItemType } = require("../src/models/Item.js");
const ShopItem = require("../src/models/Shop_item.js"); 
const User_item = require("../src/models/User_item.js");

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
    await Item.create({ name: "Skin galaxy", type: "Skin" });
    await Item.create({ name: "Skin fire", type: "Skin" });
    await ShopItem.create({ id_shop: 1, id_item: 1, item_price: 100 });
    await ShopItem.create({ id_shop: 1, id_item: 2, item_price: 200 });
    console.log('[ + ] Datos de prueba insertados correctamente en PostgreSQL.');
  } catch (error) {
    console.error('[ - ] Error al insertar tests:', error);
  }
}

module.exports = { importUsers, importLevels, importTestsForShop };
