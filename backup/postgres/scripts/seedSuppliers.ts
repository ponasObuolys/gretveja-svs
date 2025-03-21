import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { Sequelize } from 'sequelize-typescript';
import { Supplier } from '../models/Supplier';

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

// Funkcija tiekėjų sukūrimui
const seedSuppliers = async () => {
  try {
    await sequelize.authenticate();
    console.log('Duomenų bazės ryšys sėkmingai sukurtas.');
    
    // Sinchronizuojame modelius
    await sequelize.sync();
    
    // Nuskaitome CSV failą
    const csvFilePath = path.resolve(__dirname, '../../Tiekejai.csv');
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    
    // Išanalizuojame CSV duomenis
    const records = parse(csvData, {
      columns: ['name', 'phone', 'email'],
      skip_empty_lines: true,
      delimiter: ',',
      from_line: 2 // Praleisti antraštės eilutę
    });
    
    // Sekame sukurtus tiekėjus
    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    // Iteruojame per kiekvieną CSV eilutę
    for (const record of records) {
      try {
        // Tiekėjo duomenys
        const supplierData = {
          name: record.name.trim(),
          phone: record.phone.trim(),
          email: record.email.trim(),
          contactPerson: '' // Nurodome tuščią kontaktinį asmenį, nes neturime šio duomens CSV faile
        };
        
        // Patikriname, ar tiekėjas jau egzistuoja
        const existingSupplier = await Supplier.findOne({ 
          where: { name: supplierData.name } 
        });
        
        if (existingSupplier) {
          console.log(`Tiekėjas "${supplierData.name}" jau egzistuoja, praleidžiame.`);
          skippedCount++;
        } else {
          // Sukuriame naują tiekėją
          await Supplier.create(supplierData);
          console.log(`Tiekėjas "${supplierData.name}" sėkmingai sukurtas.`);
          createdCount++;
        }
      } catch (err) {
        console.error(`Klaida kuriant tiekėją "${record.name}":`, err);
        errorCount++;
      }
    }
    
    console.log(`Importavimas baigtas:`);
    console.log(`- Sukurti tiekėjai: ${createdCount}`);
    console.log(`- Praleisti (jau egzistuojantys): ${skippedCount}`);
    console.log(`- Klaidos: ${errorCount}`);
  } catch (error) {
    console.error('Klaida importuojant tiekėjus:', error);
  } finally {
    await sequelize.close();
  }
};

// Paleidžiame funkciją
seedSuppliers();
