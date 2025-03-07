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
const sequelize_typescript_1 = require("sequelize-typescript");
const purchaseRoutes_1 = __importDefault(require("./routes/purchaseRoutes"));
const issuanceRoutes_1 = __importDefault(require("./routes/issuanceRoutes"));
const stockRoutes_1 = __importDefault(require("./routes/stockRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const supplierRoutes_1 = __importDefault(require("./routes/supplierRoutes"));
const companyRoutes_1 = __importDefault(require("./routes/companyRoutes"));
const truckRoutes_1 = __importDefault(require("./routes/truckRoutes"));
// Įkrauname aplinkos kintamuosius
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Duomenų bazės konfigūracija
const sequelize = new sequelize_typescript_1.Sequelize({
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
app.use('/api/purchases', purchaseRoutes_1.default);
app.use('/api/issuances', issuanceRoutes_1.default);
app.use('/api/stocks', stockRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/suppliers', supplierRoutes_1.default);
app.use('/api/companies', companyRoutes_1.default);
app.use('/api/trucks', truckRoutes_1.default);
// Serverio paleidimas
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log('Duomenų bazės ryšys sėkmingai sukurtas.');
        yield sequelize.sync({ alter: true });
        console.log('Duomenų bazės modeliai sinchronizuoti.');
        app.listen(PORT, () => {
            console.log(`Serveris paleistas adresu: http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('Nepavyko prisijungti prie duomenų bazės:', error);
    }
});
startServer();
