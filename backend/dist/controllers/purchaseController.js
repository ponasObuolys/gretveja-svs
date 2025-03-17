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
exports.exportPurchasesToPdf = exports.exportPurchasesToXlsx = exports.exportPurchasesToCsv = exports.deletePurchase = exports.updatePurchase = exports.createPurchase = exports.getPurchaseById = exports.getAllPurchases = void 0;
const supabase_1 = require("../config/supabase");
const csv_stringify_1 = require("csv-stringify");
const ExcelJS = __importStar(require("exceljs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
// Gauti visus pirkimus
const getAllPurchases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year, month } = req.query;
        let query = supabase_1.supabase
            .from('purchases')
            .select(`
        *,
        products (*),
        suppliers (*),
        companies (*)
      `);
        // Filtruoti pagal metus ir mėnesį, jei pateikta
        if (year) {
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${parseInt(year) + 1}-01-01`);
            query = query.gte('purchase_date', startDate.toISOString());
            query = query.lt('purchase_date', endDate.toISOString());
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
                    query = query.gte('purchase_date', monthStartDate.toISOString());
                    query = query.lt('purchase_date', monthEndDate.toISOString());
                }
            }
        }
        // Rūšiuoti pagal datą (naujausi viršuje)
        query = query.order('purchase_date', { ascending: false });
        const { data, error } = yield query;
        if (error)
            throw error;
        return res.status(200).json(data);
    }
    catch (error) {
        console.error('Klaida gaunant pirkimus:', error);
        return res.status(500).json({ message: 'Serverio klaida gaunant pirkimus' });
    }
});
exports.getAllPurchases = getAllPurchases;
// Gauti pirkimą pagal ID
const getPurchaseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const { data, error } = yield supabase_1.supabase
            .from('purchases')
            .select(`
        *,
        products (*),
        suppliers (*),
        companies (*)
      `)
            .eq('id', id)
            .single();
        if (error)
            throw error;
        if (!data) {
            return res.status(404).json({ message: 'Pirkimas nerastas' });
        }
        return res.status(200).json(data);
    }
    catch (error) {
        console.error(`Klaida gaunant pirkimą ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida gaunant pirkimą' });
    }
});
exports.getPurchaseById = getPurchaseById;
// Sukurti naują pirkimą
const createPurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { invoiceNumber, productId, supplierId, quantity, purchaseDate, unitPrice, companyId } = req.body;
    try {
        // Apskaičiuoti bendrą sumą
        const totalAmount = quantity * unitPrice;
        const { data, error } = yield supabase_1.supabase
            .from('purchases')
            .insert([
            {
                invoice_number: invoiceNumber,
                product_id: productId,
                supplier_id: supplierId,
                quantity,
                purchase_date: purchaseDate,
                unit_price: unitPrice,
                company_id: companyId,
                total_amount: totalAmount
            }
        ])
            .select()
            .single();
        if (error)
            throw error;
        // Fetch the complete purchase with related data
        const { data: newPurchase, error: fetchError } = yield supabase_1.supabase
            .from('purchases')
            .select(`
        *,
        products (*),
        suppliers (*),
        companies (*)
      `)
            .eq('id', data.id)
            .single();
        if (fetchError)
            throw fetchError;
        return res.status(201).json(newPurchase);
    }
    catch (error) {
        console.error('Klaida kuriant pirkimą:', error);
        return res.status(500).json({ message: 'Serverio klaida kuriant pirkimą' });
    }
});
exports.createPurchase = createPurchase;
// Atnaujinti pirkimą
const updatePurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { invoiceNumber, productId, supplierId, quantity, purchaseDate, unitPrice, companyId } = req.body;
    try {
        // Apskaičiuoti bendrą sumą
        const totalAmount = quantity * unitPrice;
        const { data, error } = yield supabase_1.supabase
            .from('purchases')
            .update({
            invoice_number: invoiceNumber,
            product_id: productId,
            supplier_id: supplierId,
            quantity,
            purchase_date: purchaseDate,
            unit_price: unitPrice,
            company_id: companyId,
            total_amount: totalAmount,
            updated_at: new Date()
        })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        if (!data) {
            return res.status(404).json({ message: 'Pirkimas nerastas' });
        }
        // Fetch the complete updated purchase with related data
        const { data: updatedPurchase, error: fetchError } = yield supabase_1.supabase
            .from('purchases')
            .select(`
        *,
        products (*),
        suppliers (*),
        companies (*)
      `)
            .eq('id', id)
            .single();
        if (fetchError)
            throw fetchError;
        return res.status(200).json(updatedPurchase);
    }
    catch (error) {
        console.error(`Klaida atnaujinant pirkimą ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida atnaujinant pirkimą' });
    }
});
exports.updatePurchase = updatePurchase;
// Ištrinti pirkimą
const deletePurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const { error } = yield supabase_1.supabase
            .from('purchases')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        return res.status(200).json({ message: 'Pirkimas sėkmingai ištrintas' });
    }
    catch (error) {
        console.error(`Klaida ištrinant pirkimą ID ${id}:`, error);
        return res.status(500).json({ message: 'Serverio klaida ištrinant pirkimą' });
    }
});
exports.deletePurchase = deletePurchase;
// Eksportuoti pirkimus į CSV formatą
const exportPurchasesToCsv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year, month } = req.query;
        // Gauti filtruotus pirkimus
        let query = supabase_1.supabase
            .from('purchases')
            .select(`
        *,
        products (*),
        suppliers (*),
        companies (*)
      `);
        // Filtruoti pagal metus ir mėnesį, jei pateikta
        if (year) {
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${parseInt(year) + 1}-01-01`);
            query = query.gte('purchase_date', startDate.toISOString());
            query = query.lt('purchase_date', endDate.toISOString());
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
                    query = query.gte('purchase_date', monthStartDate.toISOString());
                    query = query.lt('purchase_date', monthEndDate.toISOString());
                }
            }
        }
        // Rūšiuoti pagal datą (seniausi viršuje, geriau apskaitos ataskaitoms)
        query = query.order('purchase_date', { ascending: true });
        const { data, error } = yield query;
        if (error)
            throw error;
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'Nerasta pirkimų pagal nurodytus filtrus' });
        }
        // Paruošti CSV antraštės
        const csvColumns = [
            { key: 'id', header: 'ID' },
            { key: 'invoiceNumber', header: 'Sąskaitos numeris' },
            { key: 'purchaseDate', header: 'Pirkimo data' },
            { key: 'productName', header: 'Produktas' },
            { key: 'productCode', header: 'Produkto kodas' },
            { key: 'supplierName', header: 'Tiekėjas' },
            { key: 'quantity', header: 'Kiekis' },
            { key: 'unit', header: 'Matavimo vnt.' },
            { key: 'unitPrice', header: 'Vieneto kaina' },
            { key: 'totalAmount', header: 'Bendra suma' },
            { key: 'company', header: 'Įmonė' }
        ];
        // Transformuoti duomenis į CSV formatą
        const csvData = data.map(item => {
            var _a, _b, _c, _d, _e;
            return ({
                id: item.id,
                invoiceNumber: item.invoice_number,
                purchaseDate: new Date(item.purchase_date).toLocaleDateString('lt-LT'),
                productName: ((_a = item.products) === null || _a === void 0 ? void 0 : _a.name) || 'Nenurodyta',
                productCode: ((_b = item.products) === null || _b === void 0 ? void 0 : _b.code) || 'Nenurodyta',
                supplierName: ((_c = item.suppliers) === null || _c === void 0 ? void 0 : _c.name) || 'Nenurodyta',
                quantity: item.quantity,
                unit: ((_d = item.products) === null || _d === void 0 ? void 0 : _d.unit) || 'VNT',
                unitPrice: Number(item.unit_price).toFixed(2),
                totalAmount: Number(item.total_amount).toFixed(2),
                company: ((_e = item.companies) === null || _e === void 0 ? void 0 : _e.name) || 'Nenurodyta'
            });
        });
        // Nustatyti failo pavadinimą
        let filename = 'purchases';
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
        console.error('Klaida eksportuojant pirkimus į CSV:', error);
        return res.status(500).json({ message: 'Serverio klaida eksportuojant pirkimus į CSV' });
    }
});
exports.exportPurchasesToCsv = exportPurchasesToCsv;
// Eksportuoti pirkimus į XLSX formatą
const exportPurchasesToXlsx = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year, month } = req.query;
        // Gauti filtruotus pirkimus
        let query = supabase_1.supabase
            .from('purchases')
            .select(`
        *,
        products (*),
        suppliers (*),
        companies (*)
      `);
        // Filtruoti pagal metus ir mėnesį, jei pateikta
        if (year) {
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${parseInt(year) + 1}-01-01`);
            query = query.gte('purchase_date', startDate.toISOString());
            query = query.lt('purchase_date', endDate.toISOString());
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
                    query = query.gte('purchase_date', monthStartDate.toISOString());
                    query = query.lt('purchase_date', monthEndDate.toISOString());
                }
            }
        }
        // Rūšiuoti pagal datą (seniausi viršuje, geriau apskaitos ataskaitoms)
        query = query.order('purchase_date', { ascending: true });
        const { data, error } = yield query;
        if (error)
            throw error;
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'Nerasta pirkimų pagal nurodytus filtrus' });
        }
        // Sukurti naują Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Pirkimai');
        // Nustatyti stulpelių antraštes
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Sąskaitos numeris', key: 'invoiceNumber', width: 20 },
            { header: 'Pirkimo data', key: 'purchaseDate', width: 15 },
            { header: 'Produktas', key: 'productName', width: 20 },
            { header: 'Produkto kodas', key: 'productCode', width: 15 },
            { header: 'Tiekėjas', key: 'supplierName', width: 20 },
            { header: 'Kiekis', key: 'quantity', width: 10 },
            { header: 'Matavimo vnt.', key: 'unit', width: 15 },
            { header: 'Vieneto kaina', key: 'unitPrice', width: 15 },
            { header: 'Bendra suma', key: 'totalAmount', width: 15 },
            { header: 'Įmonė', key: 'company', width: 20 }
        ];
        // Stilizuoti antraštės
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
        // Pridėti duomenis
        data.forEach(item => {
            var _a, _b, _c, _d, _e;
            worksheet.addRow({
                id: item.id,
                invoiceNumber: item.invoice_number,
                purchaseDate: new Date(item.purchase_date).toLocaleDateString('lt-LT'),
                productName: ((_a = item.products) === null || _a === void 0 ? void 0 : _a.name) || 'Nenurodyta',
                productCode: ((_b = item.products) === null || _b === void 0 ? void 0 : _b.code) || 'Nenurodyta',
                supplierName: ((_c = item.suppliers) === null || _c === void 0 ? void 0 : _c.name) || 'Nenurodyta',
                quantity: item.quantity,
                unit: ((_d = item.products) === null || _d === void 0 ? void 0 : _d.unit) || 'VNT',
                unitPrice: Number(item.unit_price).toFixed(2),
                totalAmount: Number(item.total_amount).toFixed(2),
                company: ((_e = item.companies) === null || _e === void 0 ? void 0 : _e.name) || 'Nenurodyta'
            });
        });
        // Nustatyti kiekio, kainos ir bendros sumos stulpelių formatą
        worksheet.getColumn('quantity').numFmt = '0.00';
        worksheet.getColumn('unitPrice').numFmt = '0.00 €';
        worksheet.getColumn('totalAmount').numFmt = '0.00 €';
        // Nustatyti failo pavadinimą
        let filename = 'purchases';
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
        console.error('Klaida eksportuojant pirkimus į XLSX:', error);
        return res.status(500).json({ message: 'Serverio klaida eksportuojant pirkimus į XLSX' });
    }
});
exports.exportPurchasesToXlsx = exportPurchasesToXlsx;
// Eksportuoti pirkimus į PDF formatą
const exportPurchasesToPdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year, month } = req.query;
        // Gauti filtruotus pirkimus
        let query = supabase_1.supabase
            .from('purchases')
            .select(`
        *,
        products (*),
        suppliers (*),
        companies (*)
      `);
        // Filtruoti pagal metus ir mėnesį, jei pateikta
        if (year) {
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${parseInt(year) + 1}-01-01`);
            query = query.gte('purchase_date', startDate.toISOString());
            query = query.lt('purchase_date', endDate.toISOString());
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
                    query = query.gte('purchase_date', monthStartDate.toISOString());
                    query = query.lt('purchase_date', monthEndDate.toISOString());
                }
            }
        }
        // Rūšiuoti pagal datą (seniausi viršuje, geriau apskaitos ataskaitoms)
        query = query.order('purchase_date', { ascending: true });
        const { data, error } = yield query;
        if (error)
            throw error;
        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'Nerasta pirkimų pagal nurodytus filtrus' });
        }
        // Sukurti PDF dokumentą
        const doc = new pdfkit_1.default({ margin: 50 });
        // Nustatyti failo pavadinimą
        let filename = 'purchases';
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
        // Pipe PDF į atsakymą
        doc.pipe(res);
        // Pridėti antraštę
        doc.fontSize(20).text('Pirkimų ataskaita', { align: 'center' });
        doc.moveDown();
        // Pridėti filtravimo informaciją
        if (year) {
            let filterText = `Metai: ${year}`;
            if (month) {
                const monthNames = [
                    'Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis',
                    'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'
                ];
                filterText += `, Mėnuo: ${monthNames[parseInt(month) - 1]}`;
            }
            doc.fontSize(12).text(filterText, { align: 'center' });
            doc.moveDown();
        }
        // Pridėti lentelės antraštę
        const tableTop = 150;
        const textOptions = { width: 500, align: 'left' };
        // Stulpelių plotis
        const colWidths = {
            date: 80,
            invoice: 100,
            product: 120,
            supplier: 100,
            quantity: 60,
            price: 80,
            total: 80
        };
        // Antraštės
        doc.fontSize(10).text('Data', 50, tableTop, { width: 500, align: 'left' });
        doc.text('Sąskaitos Nr.', 50 + colWidths.date, tableTop, { width: 500, align: 'left' });
        doc.text('Produktas', 50 + colWidths.date + colWidths.invoice, tableTop, { width: 500, align: 'left' });
        doc.text('Tiekėjas', 50 + colWidths.date + colWidths.invoice + colWidths.product, tableTop, { width: 500, align: 'left' });
        doc.text('Kiekis', 50 + colWidths.date + colWidths.invoice + colWidths.product + colWidths.supplier, tableTop, { width: 500, align: 'left' });
        doc.text('Kaina', 50 + colWidths.date + colWidths.invoice + colWidths.product + colWidths.supplier + colWidths.quantity, tableTop, { width: 500, align: 'left' });
        doc.text('Suma', 50 + colWidths.date + colWidths.invoice + colWidths.product + colWidths.supplier + colWidths.quantity + colWidths.price, tableTop, { width: 500, align: 'left' });
        // Linija po antraštės
        doc.moveTo(50, tableTop + 20)
            .lineTo(550, tableTop + 20)
            .stroke();
        // Pridėti duomenis
        let rowTop = tableTop + 30;
        let totalAmount = 0;
        data.forEach((item, i) => {
            var _a, _b;
            // Jei reikia naujo puslapio
            if (rowTop > 700) {
                doc.addPage();
                rowTop = 50;
                // Pakartoti antraštę naujame puslapyje
                doc.fontSize(10).text('Data', 50, rowTop, { width: 500, align: 'left' });
                doc.text('Sąskaitos Nr.', 50 + colWidths.date, rowTop, { width: 500, align: 'left' });
                doc.text('Produktas', 50 + colWidths.date + colWidths.invoice, rowTop, { width: 500, align: 'left' });
                doc.text('Tiekėjas', 50 + colWidths.date + colWidths.invoice + colWidths.product, rowTop, { width: 500, align: 'left' });
                doc.text('Kiekis', 50 + colWidths.date + colWidths.invoice + colWidths.product + colWidths.supplier, rowTop, { width: 500, align: 'left' });
                doc.text('Kaina', 50 + colWidths.date + colWidths.invoice + colWidths.product + colWidths.supplier + colWidths.quantity, rowTop, { width: 500, align: 'left' });
                doc.text('Suma', 50 + colWidths.date + colWidths.invoice + colWidths.product + colWidths.supplier + colWidths.quantity + colWidths.price, rowTop, { width: 500, align: 'left' });
                // Linija po antraštės
                doc.moveTo(50, rowTop + 20)
                    .lineTo(550, rowTop + 20)
                    .stroke();
                rowTop += 30;
            }
            const purchaseDate = new Date(item.purchase_date).toLocaleDateString('lt-LT');
            const productName = ((_a = item.products) === null || _a === void 0 ? void 0 : _a.name) || 'Nenurodyta';
            const supplierName = ((_b = item.suppliers) === null || _b === void 0 ? void 0 : _b.name) || 'Nenurodyta';
            const quantity = item.quantity;
            const unitPrice = Number(item.unit_price).toFixed(2);
            const total = Number(item.total_amount).toFixed(2);
            totalAmount += Number(item.total_amount);
            doc.fontSize(9).text(purchaseDate, 50, rowTop, { width: 500, align: 'left' });
            doc.text(item.invoice_number || '', 50 + colWidths.date, rowTop, { width: 500, align: 'left' });
            doc.text(productName, 50 + colWidths.date + colWidths.invoice, rowTop, { width: 500, align: 'left' });
            doc.text(supplierName, 50 + colWidths.date + colWidths.invoice + colWidths.product, rowTop, { width: 500, align: 'left' });
            doc.text(quantity.toString(), 50 + colWidths.date + colWidths.invoice + colWidths.product + colWidths.supplier, rowTop);
            doc.text(`${unitPrice} €`, 50 + colWidths.date + colWidths.invoice + colWidths.product + colWidths.supplier + colWidths.quantity, rowTop, { width: 500, align: 'left' });
            doc.text(`${total} €`, 50 + colWidths.date + colWidths.invoice + colWidths.product + colWidths.supplier + colWidths.quantity + colWidths.price, rowTop, { width: 500, align: 'left' });
            // Linija po eilute
            if (i < data.length - 1) {
                doc.moveTo(50, rowTop + 15)
                    .lineTo(550, rowTop + 15)
                    .stroke();
            }
            rowTop += 25;
        });
        // Pridėti bendrą sumą
        doc.moveTo(50, rowTop)
            .lineTo(550, rowTop)
            .stroke();
        rowTop += 10;
        doc.fontSize(10).text('Bendra suma:', 400, rowTop, { width: 500, align: 'left' });
        doc.text(`${totalAmount.toFixed(2)} €`, 500, rowTop, { width: 500, align: 'left' });
        // Pridėti datą ir puslapio numerį
        const currentDate = new Date().toLocaleDateString('lt-LT');
        doc.on('pageAdded', () => {
            const pages = doc.bufferedPageRange();
            for (let i = 0; i < pages.count; i++) {
                doc.switchToPage(i);
                doc.fontSize(8).text(`Sukurta: ${currentDate} | Puslapis ${i + 1} iš ${pages.count}`, 50, doc.page.height - 50, { align: 'center' });
            }
        });
        // Pridėti datą ir puslapio numerį pirmame puslapyje
        doc.fontSize(8).text(`Sukurta: ${currentDate} | Puslapis 1`, 50, doc.page.height - 50, { align: 'center' });
        // Užbaigti dokumentą
        doc.end();
    }
    catch (error) {
        console.error('Klaida eksportuojant pirkimus į PDF:', error);
        return res.status(500).json({ message: 'Serverio klaida eksportuojant pirkimus į PDF' });
    }
});
exports.exportPurchasesToPdf = exportPurchasesToPdf;
