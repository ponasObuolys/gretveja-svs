import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import { Company } from '../models/Company';

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

// Įmonių duomenys
const companies = [
  { 
    name: 'UAB Gretvėja', 
    code: '145844229', 
    vatCode: 'LT458442219' 
  },
  { 
    name: 'Gwind', 
    code: '389006797', 
    vatCode: 'PL8442372719' 
  },
  { 
    name: 'Gretveja, DE', 
    code: '33558044644', 
    vatCode: 'DE342191450' 
  },
  { 
    name: 'Neve Trans', 
    code: '303424391', 
    vatCode: 'LT100012316317' 
  }
];

// Funkcija įmonių sukūrimui
const seedCompanies = async () => {
  try {
    await sequelize.authenticate();
    console.log('Duomenų bazės ryšys sėkmingai sukurtas.');
    
    // Sinchronizuojame modelius
    await sequelize.sync();
    
    // Sukuriame įmones
    for (const companyData of companies) {
      // Patikriname, ar įmonė jau egzistuoja
      const existingCompany = await Company.findOne({ where: { name: companyData.name } });
      
      if (existingCompany) {
        console.log(`Įmonė ${companyData.name} jau egzistuoja, praleidžiame.`);
      } else {
        await Company.create(companyData);
        console.log(`Įmonė ${companyData.name} sėkmingai sukurta.`);
      }
    }
    
    console.log('Visos įmonės sėkmingai sukurtos!');
  } catch (error) {
    console.error('Klaida kuriant įmones:', error);
  } finally {
    await sequelize.close();
  }
};

// Paleidžiame funkciją
seedCompanies();
