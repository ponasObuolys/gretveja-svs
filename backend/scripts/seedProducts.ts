import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { Sequelize } from 'sequelize-typescript';
import { Product } from '../models/Product';

// Įkrauname aplinkos kintamuosius
dotenv.config();

// Duomenų bazės konfigūracija
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'gretveja_svs',
  logging: false,
  models: [__dirname + '/../models'],
});

// Funkcija produktų sukūrimui
const seedProducts = async () => {
  try {
    await sequelize.authenticate();
    console.log('Duomenų bazės ryšys sėkmingai sukurtas.');
    
    // Sinchronizuojame modelius
    await sequelize.sync();
    
    // Nuskaitome CSV failą
    const csvFilePath = path.resolve(__dirname, '../../produktai.csv');
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    
    // Išanalizuojame CSV duomenis
    const records = parse(csvData, {
      columns: ['code', 'name', 'nameEn', 'nameRu'],
      skip_empty_lines: true,
      delimiter: ',',
      from_line: 2 // Praleisti antraštės eilutę
    });
    
    // Sekame sukurtus produktus
    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    // Iteruojame per kiekvieną CSV eilutę
    for (const record of records) {
      try {
        // Produkto duomenys be kodo, nes naudosime automatinį ID
        const productData = {
          // Naudojame seną kodą kaip atsarginį, jei reikėtų migracijos
          code: record.code,
          name: record.name,
          nameEn: record.nameEn,
          nameRu: record.nameRu,
          // Nustatome standartinius parametrus
          description: '',
          unit: 'vnt'
        };
        
        // Patikriname, ar produktas jau egzistuoja pagal pavadinimą (visomis kalbomis)
        const existingProduct = await Product.findOne({ 
          where: { name: record.name } 
        });
        
        if (existingProduct) {
          console.log(`Produktas "${record.name}" jau egzistuoja, praleidžiame.`);
          skippedCount++;
        } else {
          // Sukuriame naują produktą
          await Product.create(productData);
          createdCount++;
        }
      } catch (err) {
        console.error(`Klaida kuriant produktą "${record.name}":`, err);
        errorCount++;
      }
    }
    
    console.log(`Importavimas baigtas:`);
    console.log(`- Sukurti produktai: ${createdCount}`);
    console.log(`- Praleisti (jau egzistuojantys): ${skippedCount}`);
    console.log(`- Klaidos: ${errorCount}`);
  } catch (error) {
    console.error('Klaida importuojant produktus:', error);
  } finally {
    await sequelize.close();
  }
};

// Paleidžiame funkciją
seedProducts();
