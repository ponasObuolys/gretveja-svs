"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.exportIssuancesToPdf = exports.exportIssuancesToXlsx = exports.exportIssuancesToCsv = exports.generatePdf = exports.deleteIssuance = exports.updateIssuance = exports.createIssuance = exports.getIssuanceById = exports.getAllIssuances = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const supabase_1 = require("../config/supabase");
const csv_stringify_1 = require("csv-stringify");
const ExcelJS = __importStar(require("exceljs"));
// Gauti visus išdavimus
const getAllIssuances = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year, month } = req.query;
        let query = supabase_1.supabase
            .from('issuances')
            .select(`
        *,
        products (*),
        trucks (
          *,
          companies (*)
        )
      `);
        // Filtruoti pagal metus ir mėnesį, jei pateikta
        if (year) {
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${parseInt(year) + 1}-01-01`);
            query = query.gte('issuance_date', startDate.toISOString());
            query = query.lt('issuance_date', endDate.toISOString());
            // Jei nurodytas ir mėnuo, papildomai filtruoti
            if (month) {
                const monthNum = parseInt(month);
                if (monthNum >= 1 && monthNum <= 12) {
                    const monthStartDate = new Date(`${year}-${monthNum.toString().padStart(2, '0')}-01`);
                    let monthEndDate;
                    if (monthNum === 12) {
                        monthEndDate = new Date(`${parseInt(year) + 1}-01-01`);
                    }
                    else {
                        monthEndDate = new Date(`${year}-${(monthNum + 1).toString().padStart(2, '0')}-01`);
                    }
                    query = query.gte('issuance_date', monthStartDate.toISOString());
                    query = query.lt('issuance_date', monthEndDate.toISOString());
                }
            }
        }
        // Rūšiuoti pagal datą (naujausi viršuje)
        query = query.order('issuance_date', { ascending: false });
        const { data, error } = yield query;
        if (error)
            throw error;
        return res.status(200).json(data);
    }
    catch (error) {
        console.error('Klaida gaunant išdavimus:', error);
        return res.status(500).json({ message: 'Serverio klaida gaunant išdavimus' });
    }
});
exports.getAllIssuances = getAllIssuances;
// Gauti išdavimą pagal ID
const getIssuanceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const { data, error } = yield supabase_1.supabase
            .from('issuances')
            .select(`
        *,
        products (*),
        trucks (
          *,
          companies (*)
        )
      `)
            .eq('id', id)
            .single();
        if (error)
            throw error;
        if (!data) {
            return res.status(404).json({ message: 'Išdavimas nerastas' });
        }
        return res.status(200).json(data);
    }
    catch (error) {
        console.error(`Klaida gaunant išdavimą ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida gaunant išdavimą' });
    }
});
exports.getIssuanceById = getIssuanceById;
// Sukurti naują išdavimą
const createIssuance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, isIssued, issuanceDate, quantity, driverName, truckId, notes } = req.body;
    try {
        const { data, error } = yield supabase_1.supabase
            .from('issuances')
            .insert([
            {
                product_id: productId,
                is_issued: isIssued,
                issuance_date: issuanceDate,
                quantity,
                driver_name: driverName,
                truck_id: truckId,
                notes
            }
        ])
            .select()
            .single();
        if (error)
            throw error;
        // Fetch the complete issuance with related data
        const { data: newIssuance, error: fetchError } = yield supabase_1.supabase
            .from('issuances')
            .select(`
        *,
        products (*),
        trucks (
          *,
          companies (*)
        )
      `)
            .eq('id', data.id)
            .single();
        if (fetchError)
            throw fetchError;
        return res.status(201).json(newIssuance);
    }
    catch (error) {
        console.error('Klaida kuriant išdavimą:', error);
        return res.status(500).json({ message: 'Serverio klaida kuriant išdavimą' });
    }
});
exports.createIssuance = createIssuance;
// Atnaujinti išdavimą
const updateIssuance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { productId, isIssued, issuanceDate, quantity, driverName, truckId, notes } = req.body;
    try {
        const { data, error } = yield supabase_1.supabase
            .from('issuances')
            .update({
            product_id: productId,
            is_issued: isIssued,
            issuance_date: issuanceDate,
            quantity,
            driver_name: driverName,
            truck_id: truckId,
            notes,
            updated_at: new Date()
        })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        if (!data) {
            return res.status(404).json({ message: 'Išdavimas nerastas' });
        }
        // Fetch the complete updated issuance with related data
        const { data: updatedIssuance, error: fetchError } = yield supabase_1.supabase
            .from('issuances')
            .select(`
        *,
        products (*),
        trucks (
          *,
          companies (*)
        )
      `)
            .eq('id', id)
            .single();
        if (fetchError)
            throw fetchError;
        return res.status(200).json(updatedIssuance);
    }
    catch (error) {
        console.error(`Klaida atnaujinant išdavimą ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida atnaujinant išdavimą' });
    }
});
exports.updateIssuance = updateIssuance;
// Ištrinti išdavimą
const deleteIssuance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const { error } = yield supabase_1.supabase
            .from('issuances')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        return res.status(200).json({ message: 'Išdavimas sėkmingai ištrintas' });
    }
    catch (error) {
        console.error(`Klaida ištrinant išdavimą ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida ištrinant išdavimą' });
    }
});
exports.deleteIssuance = deleteIssuance;
// Generuoti PDF
const generatePdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const { data: issuance, error } = yield supabase_1.supabase
            .from('issuances')
            .select(`
        *,
        products (*),
        trucks (
          *,
          companies (*)
        )
      `)
            .eq('id', id)
            .single();
        if (error)
            throw error;
        if (!issuance) {
            return res.status(404).json({ message: 'Išdavimas nerastas' });
        }
        // Sukurti PDF dokumentą
        const doc = new pdfkit_1.default();
        const filename = `issuance_${id}_${Date.now()}.pdf`;
        const filePath = path.join(__dirname, '..', 'pdfs', filename);
        // Patikrinti, ar egzistuoja katalogas, jei ne - sukurti
        if (!fs.existsSync(path.join(__dirname, '..', 'pdfs'))) {
            fs.mkdirSync(path.join(__dirname, '..', 'pdfs'), { recursive: true });
        }
        // Nustatyti atsakymo antraštės
        res.setHeader('Content-disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-type', 'application/pdf');
        // Sukurti rašymo srautus
        const fileStream = fs.createWriteStream(filePath);
        doc.pipe(fileStream);
        doc.pipe(res);
        // PDF turinys
        doc.fontSize(20).text('Prekių perdavimo aktas', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Išdavimo data: ${new Date(issuance.issuance_date).toLocaleDateString('lt-LT')}`);
        doc.moveDown();
        doc.text(`Produktas: ${issuance.products.name}`);
        doc.text(`Kiekis: ${issuance.quantity} ${issuance.products.unit}`);
        doc.moveDown();
        doc.text(`Vairuotojas: ${issuance.driver_name}`);
        doc.text(`Vilkikas: ${issuance.trucks.plate_number}`);
        if (issuance.trucks.companies) {
            doc.text(`Įmonė: ${issuance.trucks.companies.name}`);
        }
        doc.moveDown();
        if (issuance.notes) {
            doc.text(`Pastabos: ${issuance.notes}`);
            doc.moveDown();
        }
        doc.text('Išdavė: _______________________', { align: 'left' });
        doc.moveDown();
        doc.text('Priėmė: _______________________', { align: 'left' });
        // Užbaigti dokumentą
        doc.end();
        // Grąžinti atsakymą tik kai dokumentas bus pilnai sukurtas
        fileStream.on('finish', () => {
            console.log(`PDF dokumentas sukurtas: ${filePath}`);
        });
    }
    catch (error) {
        console.error(`Klaida generuojant PDF išdavimui ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida generuojant PDF' });
    }
});
exports.generatePdf = generatePdf;
// Eksportuoti išdavimus į CSV formatą
const exportIssuancesToCsv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year, month } = req.query;
        // Gauti filtruotus išdavimus
        let query = supabase_1.supabase
            .from('issuances')
            .select(`
        *,
        products (*),
        trucks (
          *,
          companies (*)
        )
      `);
        // Filtruoti pagal metus ir mėnesį, jei pateikta
        if (year) {
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${parseInt(year) + 1}-01-01`);
            query = query.gte('issuance_date', startDate.toISOString());
            query = query.lt('issuance_date', endDate.toISOString());
            // Jei nurodytas ir mėnuo, papildomai filtruoti
            if (month) {
                const monthNum = parseInt(month);
                if (monthNum >= 1 && monthNum <= 12) {
                    const monthStartDate = new Date(`${year}-${monthNum.toString().padStart(2, '0')}-01`);
                    let monthEndDate;
                    if (monthNum === 12) {
                        monthEndDate = new Date(`${parseInt(year) + 1}-01-01`);
                    }
                    else {
                        monthEndDate = new Date(`${year}-${(monthNum + 1).toString().padStart(2, '0')}-01`);
                    }
                    query = query.gte('issuance_date', monthStartDate.toISOString());
                    query = query.lt('issuance_date', monthEndDate.toISOString());
                }
            }
        }
        // Rūšiuoti pagal datą (seniausi viršuje, geriau apskaitos ataskaitoms)
        query = query.order('issuance_date', { ascending: true });
        const { data, error } = yield query;
        if (error)
            throw error;
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'Nerasta išdavimų pagal nurodytus filtrus' });
        }
        // Paruošti CSV antraštės
        const csvColumns = [
            { key: 'id', header: 'ID' },
            { key: 'issuanceDate', header: 'Išdavimo data' },
            { key: 'productName', header: 'Produktas' },
            { key: 'productCode', header: 'Produkto kodas' },
            { key: 'quantity', header: 'Kiekis' },
            { key: 'unit', header: 'Matavimo vnt.' },
            { key: 'driverName', header: 'Vairuotojo vardas' },
            { key: 'plateNumber', header: 'Vilkiko numeris' },
            { key: 'company', header: 'Įmonė' },
            { key: 'isIssued', header: 'Išduota' },
            { key: 'notes', header: 'Pastabos' }
        ];
        // Transformuoti duomenis į CSV formatą
        const csvData = data.map(item => {
            var _a, _b, _c, _d, _e, _f;
            return ({
                id: item.id,
                issuanceDate: new Date(item.issuance_date).toLocaleDateString('lt-LT'),
                productName: ((_a = item.products) === null || _a === void 0 ? void 0 : _a.name) || 'Nenurodyta',
                productCode: ((_b = item.products) === null || _b === void 0 ? void 0 : _b.code) || 'Nenurodyta',
                quantity: item.quantity,
                unit: ((_c = item.products) === null || _c === void 0 ? void 0 : _c.unit) || 'VNT',
                driverName: item.driver_name,
                plateNumber: ((_d = item.trucks) === null || _d === void 0 ? void 0 : _d.plate_number) || 'Nenurodyta',
                company: ((_f = (_e = item.trucks) === null || _e === void 0 ? void 0 : _e.companies) === null || _f === void 0 ? void 0 : _f.name) || 'Nenurodyta',
                isIssued: item.is_issued ? 'Taip' : 'Ne',
                notes: item.notes || ''
            });
        });
        // Nustatyti failo pavadinimą
        let filename = 'issuances';
        if (year) {
            filename += `_${year}`;
            if (month) {
                filename += `_${month.toString().padStart(2, '0')}`;
            }
        }
        filename += '.csv';
        // Nustatyti atsakymo antraštės
        res.setHeader('Content-disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-type', 'text/csv; charset=utf-8');
        // Sukurti CSV stringifier
        const stringifier = (0, csv_stringify_1.stringify)({
            header: true,
            columns: csvColumns
        });
        // Rašyti duomenis į atsakymą
        stringifier.pipe(res);
        csvData.forEach(row => stringifier.write(row));
        stringifier.end();
    }
    catch (error) {
        console.error('Klaida eksportuojant išdavimus į CSV:', error);
        return res.status(500).json({ message: 'Serverio klaida eksportuojant išdavimus į CSV' });
    }
});
exports.exportIssuancesToCsv = exportIssuancesToCsv;
// Eksportuoti išdavimus į XLSX formatą
const exportIssuancesToXlsx = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year, month } = req.query;
        // Gauti filtruotus išdavimus
        let query = supabase_1.supabase
            .from('issuances')
            .select(`
        *,
        products (*),
        trucks (
          *,
          companies (*)
        )
      `);
        // Filtruoti pagal metus ir mėnesį, jei pateikta
        if (year) {
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${parseInt(year) + 1}-01-01`);
            query = query.gte('issuance_date', startDate.toISOString());
            query = query.lt('issuance_date', endDate.toISOString());
            // Jei nurodytas ir mėnuo, papildomai filtruoti
            if (month) {
                const monthNum = parseInt(month);
                if (monthNum >= 1 && monthNum <= 12) {
                    const monthStartDate = new Date(`${year}-${monthNum.toString().padStart(2, '0')}-01`);
                    let monthEndDate;
                    if (monthNum === 12) {
                        monthEndDate = new Date(`${parseInt(year) + 1}-01-01`);
                    }
                    else {
                        monthEndDate = new Date(`${year}-${(monthNum + 1).toString().padStart(2, '0')}-01`);
                    }
                    query = query.gte('issuance_date', monthStartDate.toISOString());
                    query = query.lt('issuance_date', monthEndDate.toISOString());
                }
            }
        }
        // Rūšiuoti pagal datą (seniausi viršuje, geriau apskaitos ataskaitoms)
        query = query.order('issuance_date', { ascending: true });
        const { data, error } = yield query;
        if (error)
            throw error;
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'Nerasta išdavimų pagal nurodytus filtrus' });
        }
        // Sukurti naują Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Išdavimai');
        // Nustatyti stulpelių antraštes
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Išdavimo data', key: 'issuanceDate', width: 15 },
            { header: 'Produktas', key: 'productName', width: 20 },
            { header: 'Produkto kodas', key: 'productCode', width: 15 },
            { header: 'Kiekis', key: 'quantity', width: 10 },
            { header: 'Matavimo vnt.', key: 'unit', width: 15 },
            { header: 'Vairuotojo vardas', key: 'driverName', width: 20 },
            { header: 'Vilkiko numeris', key: 'plateNumber', width: 15 },
            { header: 'Įmonė', key: 'company', width: 20 },
            { header: 'Išduota', key: 'isIssued', width: 10 },
            { header: 'Pastabos', key: 'notes', width: 30 }
        ];
        // Stilizuoti antraštes
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        // Pridėti duomenis
        data.forEach(item => {
            var _a, _b, _c, _d, _e, _f;
            worksheet.addRow({
                id: item.id,
                issuanceDate: new Date(item.issuance_date).toLocaleDateString('lt-LT'),
                productName: ((_a = item.products) === null || _a === void 0 ? void 0 : _a.name) || 'Nenurodyta',
                productCode: ((_b = item.products) === null || _b === void 0 ? void 0 : _b.code) || 'Nenurodyta',
                quantity: item.quantity,
                unit: ((_c = item.products) === null || _c === void 0 ? void 0 : _c.unit) || 'VNT',
                driverName: item.driver_name,
                plateNumber: ((_d = item.trucks) === null || _d === void 0 ? void 0 : _d.plate_number) || 'Nenurodyta',
                company: ((_f = (_e = item.trucks) === null || _e === void 0 ? void 0 : _e.companies) === null || _f === void 0 ? void 0 : _f.name) || 'Nenurodyta',
                isIssued: item.is_issued ? 'Taip' : 'Ne',
                notes: item.notes || ''
            });
        });
        // Nustatyti failo pavadinimą
        let filename = 'issuances';
        if (year) {
            filename += `_${year}`;
            if (month) {
                filename += `_${month.toString().padStart(2, '0')}`;
            }
        }
        filename += '.xlsx';
        // Nustatyti atsakymo antraštės
        res.setHeader('Content-disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        // Rašyti workbook į atsakymą
        yield workbook.xlsx.write(res);
        res.end();
    }
    catch (error) {
        console.error('Klaida eksportuojant išdavimus į XLSX:', error);
        return res.status(500).json({ message: 'Serverio klaida eksportuojant išdavimus į XLSX' });
    }
});
exports.exportIssuancesToXlsx = exportIssuancesToXlsx;
// Eksportuoti išdavimus į PDF formatą
const exportIssuancesToPdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year, month } = req.query;
        // Gauti filtruotus išdavimus
        let query = supabase_1.supabase
            .from('issuances')
            .select(`
        *,
        products (*),
        trucks (
          *,
          companies (*)
        )
      `);
        // Filtruoti pagal metus ir mėnesį, jei pateikta
        if (year) {
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${parseInt(year) + 1}-01-01`);
            query = query.gte('issuance_date', startDate.toISOString());
            query = query.lt('issuance_date', endDate.toISOString());
            // Jei nurodytas ir mėnuo, papildomai filtruoti
            if (month) {
                const monthNum = parseInt(month);
                if (monthNum >= 1 && monthNum <= 12) {
                    const monthStartDate = new Date(`${year}-${monthNum.toString().padStart(2, '0')}-01`);
                    let monthEndDate;
                    if (monthNum === 12) {
                        monthEndDate = new Date(`${parseInt(year) + 1}-01-01`);
                    }
                    else {
                        monthEndDate = new Date(`${year}-${(monthNum + 1).toString().padStart(2, '0')}-01`);
                    }
                    query = query.gte('issuance_date', monthStartDate.toISOString());
                    query = query.lt('issuance_date', monthEndDate.toISOString());
                }
            }
        }
        // Rūšiuoti pagal datą (seniausi viršuje, geriau apskaitos ataskaitoms)
        query = query.order('issuance_date', { ascending: true });
        const { data, error } = yield query;
        if (error)
            throw error;
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'Nerasta išdavimų pagal nurodytus filtrus' });
        }
        // Sukurti PDF dokumentą
        const doc = new pdfkit_1.default({ margin: 50 });
        // Nustatyti failo pavadinimą
        let filename = 'issuances';
        if (year) {
            filename += `_${year}`;
            if (month) {
                filename += `_${month.toString().padStart(2, '0')}`;
            }
        }
        filename += '.pdf';
        // Nustatyti atsakymo antraštės
        res.setHeader('Content-disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-type', 'application/pdf');
        // Nukreipti PDF į atsakymą
        doc.pipe(res);
        // Pridėti antraštę
        let title = 'Išdavimų ataskaita';
        if (year) {
            title += ` ${year} m.`;
            if (month) {
                const monthNames = [
                    'sausio', 'vasario', 'kovo', 'balandžio', 'gegužės', 'birželio',
                    'liepos', 'rugpjūčio', 'rugsėjo', 'spalio', 'lapkričio', 'gruodžio'
                ];
                title += ` ${monthNames[parseInt(month) - 1]} mėn.`;
            }
        }
        doc.fontSize(20).text(title, { align: 'center' });
        doc.moveDown();
        // Pridėti informaciją apie ataskaitą
        doc.fontSize(12).text(`Ataskaita sugeneruota: ${new Date().toLocaleDateString('lt-LT')} ${new Date().toLocaleTimeString('lt-LT')}`);
        doc.moveDown();
        doc.text(`Iš viso įrašų: ${data.length}`);
        doc.moveDown();
        // Sukurti lentelę
        let yPos = doc.y + 20;
        const tableTop = yPos;
        const itemsPerPage = 15;
        let itemCount = 0;
        let pageCount = 1;
        // Lentelės stulpelių plotis
        const colWidths = {
            date: 80,
            product: 120,
            quantity: 60,
            driver: 100,
            company: 120
        };
        // Funkcija lentelės antraštei
        const drawTableHeader = () => {
            doc.font('Helvetica-Bold');
            doc.text('Data', 50, yPos);
            doc.text('Produktas', 50 + colWidths.date, yPos);
            doc.text('Kiekis', 50 + colWidths.date + colWidths.product, yPos);
            doc.text('Vairuotojas', 50 + colWidths.date + colWidths.product + colWidths.quantity, yPos);
            doc.text('Įmonė', 50 + colWidths.date + colWidths.product + colWidths.quantity + colWidths.driver, yPos);
            doc.font('Helvetica');
            // Linija po antrašte
            yPos += 20;
            doc.moveTo(50, yPos).lineTo(550, yPos).stroke();
            yPos += 10;
        };
        // Nupiešti lentelės antraštę
        drawTableHeader();
        // Pridėti eilutes
        data.forEach((item, index) => {
            var _a, _b, _c, _d;
            // Patikrinti, ar reikia naujo puslapio
            if (itemCount >= itemsPerPage) {
                doc.addPage();
                yPos = 50;
                pageCount++;
                itemCount = 0;
                // Pridėti puslapio numerį
                doc.text(`Puslapis ${pageCount}`, 50, 20, { align: 'right' });
                // Nupiešti lentelės antraštę naujame puslapyje
                drawTableHeader();
            }
            // Pridėti eilutę
            doc.text(new Date(item.issuance_date).toLocaleDateString('lt-LT'), 50, yPos);
            doc.text(((_a = item.products) === null || _a === void 0 ? void 0 : _a.name) || 'Nenurodyta', 50 + colWidths.date, yPos);
            doc.text(`${item.quantity} ${((_b = item.products) === null || _b === void 0 ? void 0 : _b.unit) || 'VNT'}`, 50 + colWidths.date + colWidths.product, yPos);
            doc.text(item.driver_name, 50 + colWidths.date + colWidths.product + colWidths.quantity, yPos);
            doc.text(((_d = (_c = item.trucks) === null || _c === void 0 ? void 0 : _c.companies) === null || _d === void 0 ? void 0 : _d.name) || 'Nenurodyta', 50 + colWidths.date + colWidths.product + colWidths.quantity + colWidths.driver, yPos);
            // Linija po eilute
            yPos += 20;
            doc.moveTo(50, yPos).lineTo(550, yPos).stroke();
            yPos += 10;
            itemCount++;
        });
        // Pridėti puslapio numerį pirmame puslapyje
        doc.switchToPage(0);
        doc.text(`Puslapis 1 iš ${pageCount}`, 50, 20, { align: 'right' });
        // Užbaigti dokumentą
        doc.end();
    }
    catch (error) {
        console.error('Klaida eksportuojant išdavimus į PDF:', error);
        return res.status(500).json({ message: 'Serverio klaida eksportuojant išdavimus į PDF' });
    }
});
exports.exportIssuancesToPdf = exportIssuancesToPdf;
