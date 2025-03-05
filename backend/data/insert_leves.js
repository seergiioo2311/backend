const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Level = require("../src/models/Level.js");

async function importarDatos() {
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

module.exports = importarDatos;
