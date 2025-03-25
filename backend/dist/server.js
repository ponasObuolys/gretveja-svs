"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const purchaseRoutes_1 = __importDefault(require("./routes/purchaseRoutes"));
const issuanceRoutes_1 = __importDefault(require("./routes/issuanceRoutes"));
const stockRoutes_1 = __importDefault(require("./routes/stockRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const supplierRoutes_1 = __importDefault(require("./routes/supplierRoutes"));
const companyRoutes_1 = __importDefault(require("./routes/companyRoutes"));
const truckRoutes_1 = __importDefault(require("./routes/truckRoutes"));
const driverRoutes_1 = __importDefault(require("./routes/driverRoutes"));
const supabase_1 = require("./config/supabase");
// Įkrauname aplinkos kintamuosius
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://gretveja-svs.vercel.app', /\.vercel\.app$/]
        : 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
// Pagrindinis maršrutas
app.get('/', (req, res) => {
    res.json({ message: 'Sveiki atvykę į Gretvėja-SVS API!' });
});
// Api maršrutai
app.use('/api/purchases', purchaseRoutes_1.default);
app.use('/api/issuances', issuanceRoutes_1.default);
app.use('/api/stocks', stockRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/suppliers', supplierRoutes_1.default);
app.use('/api/companies', companyRoutes_1.default);
app.use('/api/trucks', truckRoutes_1.default);
app.use('/api/drivers', driverRoutes_1.default);
// Serverio paleidimas
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Test Supabase connection
        const { data, error } = yield supabase_1.supabase.from('products').select('count');
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
    }
    catch (error) {
        console.error('Nepavyko prisijungti prie Supabase:', error);
    }
});
// Paleidžiame serverį, jei tai nėra Vercel serverless aplinka
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === undefined) {
    startServer();
}
// Eksportuojame Express app objektą, kad jį galėtų naudoti Vercel serverless funkcijos
exports.default = app;
