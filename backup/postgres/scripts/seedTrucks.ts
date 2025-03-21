import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { Sequelize } from 'sequelize-typescript';
import { Company } from '../models/Company';
import { Truck } from '../models/Truck';

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

// Funkcija vilkikų sukūrimui
const seedTrucks = async () => {
  try {
    await sequelize.authenticate();
    console.log('Duomenų bazės ryšys sėkmingai sukurtas.');
    
    // Sinchronizuojame modelius
    await sequelize.sync();
    
    // Nuskaitome CSV failą
    const csvFilePath = path.resolve(__dirname, '../../Vilkikai.csv');
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    
    // Išanalizuojame CSV duomenis
    const records = parse(csvData, {
      columns: false,
      skip_empty_lines: true,
      delimiter: ',',
    });
    
    // Sukuriame objektą, kuris laikys įmonių ID pagal pavadinimą
    const companiesMap = new Map();
    
    // Gauname visas įmones iš duomenų bazės
    const companies = await Company.findAll();
    companies.forEach(company => {
      companiesMap.set(company.name, company.id);
    });
    
    // Sekame sukurtus vilkikus
    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    // Iteruojame per kiekvieną CSV eilutę
    for (const record of records) {
      const plateNumber = record[0].trim();
      const companyName = record[1].trim();
      
      // Patikriname, ar radome įmonę
      if (!companiesMap.has(companyName)) {
        console.error(`Įmonė "${companyName}" nerasta duomenų bazėje. Vilkikas ${plateNumber} nebus sukurtas.`);
        errorCount++;
        continue;
      }
      
      const companyId = companiesMap.get(companyName);
      
      try {
        // Patikriname, ar vilkikas jau egzistuoja
        const existingTruck = await Truck.findOne({ where: { plateNumber } });
        
        if (existingTruck) {
          console.log(`Vilkikas ${plateNumber} jau egzistuoja, praleidžiame.`);
          skippedCount++;
        } else {
          // Sukuriame naują vilkiką
          await Truck.create({
            plateNumber,
            companyId,
            model: '' // Nurodome tuščią modelį, nes neturime šio duomens CSV faile
          });
          createdCount++;
        }
      } catch (err) {
        console.error(`Klaida kuriant vilkiką ${plateNumber}:`, err);
        errorCount++;
      }
    }
    
    console.log(`Importavimas baigtas:`);
    console.log(`- Sukurti vilkikai: ${createdCount}`);
    console.log(`- Praleisti (jau egzistuojantys): ${skippedCount}`);
    console.log(`- Klaidos: ${errorCount}`);
  } catch (error) {
    console.error('Klaida importuojant vilkikus:', error);
  } finally {
    await sequelize.close();
  }
};

// Paleidžiame funkciją
seedTrucks();
