import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import purchaseRoutes from './routes/purchaseRoutes';
import issuanceRoutes from './routes/issuanceRoutes';
import stockRoutes from './routes/stockRoutes';
import productRoutes from './routes/productRoutes';
import supplierRoutes from './routes/supplierRoutes';
import companyRoutes from './routes/companyRoutes';
import truckRoutes from './routes/truckRoutes';
import { supabase } from './config/supabase';

// Įkrauname aplinkos kintamuosius
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://gretveja-svs.vercel.app', /\.vercel\.app$/] 
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

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
    // Test Supabase connection
    const { data, error } = await supabase.from('products').select('count');
    
    if (error) {
      throw error;
    }
    
    console.log('Supabase ryšys sėkmingai sukurtas.');
    
    // Vercel serverless aplinkoje nereikia klausytis porto
    if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === undefined) {
      app.listen(PORT, () => {
        console.log(`Serveris paleistas adresu: http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error('Nepavyko prisijungti prie Supabase:', error);
  }
};

// Paleidžiame serverį, jei tai nėra Vercel serverless aplinka
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === undefined) {
  startServer();
}

// Eksportuojame Express app objektą, kad jį galėtų naudoti Vercel serverless funkcijos
export default app;