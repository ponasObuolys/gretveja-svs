import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import purchaseRoutes from './routes/purchaseRoutes';
import issuanceRoutes from './routes/issuanceRoutes';
import stockRoutes from './routes/stockRoutes';
import productRoutes from './routes/productRoutes';
import supplierRoutes from './routes/supplierRoutes';
import companyRoutes from './routes/companyRoutes';
import truckRoutes from './routes/truckRoutes';

// Įkrauname aplinkos kintamuosius
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Duomenų bazės konfigūracija
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'gretveja_svs',
  logging: false,
  models: [__dirname + '/models'],
});

// Pagrindinis maršrutas
app.get('/', (req, res) => {
  res.json({ message: 'Sveiki atvykę į Gretvėja-SVS API!' });
});

// Api maršrutai
app.use('/api/purchases', purchaseRoutes);
app.use('/api/issuances', issuanceRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/trucks', truckRoutes);

// Serverio paleidimas
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Duomenų bazės ryšys sėkmingai sukurtas.');
    
    await sequelize.sync({ alter: true });
    console.log('Duomenų bazės modeliai sinchronizuoti.');
    
    app.listen(PORT, () => {
      console.log(`Serveris paleistas adresu: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Nepavyko prisijungti prie duomenų bazės:', error);
  }
};

startServer(); 