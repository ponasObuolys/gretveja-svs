import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { stringify } from 'csv-stringify';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

// Gauti visus pirkimus
export const getAllPurchases = async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query;
    
    let query = supabase
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
      const endDate = new Date(`${parseInt(year as string) + 1}-01-01`);
      
      query = query.gte('purchase_date', startDate.toISOString());
      query = query.lt('purchase_date', endDate.toISOString());
      
      // Jei nurodytas ir mėnuo, papildomai filtruoti
      if (month) {
        const monthNum = parseInt(month as string);
        if (monthNum >= 1 && monthNum <= 12) {
          const monthStartDate = new Date(`${year}-${monthNum.toString().padStart(2, '0')}-01`);
          let monthEndDate;
          
          if (monthNum === 12) {
            monthEndDate = new Date(`${parseInt(year as string) + 1}-01-01`);
          } else {
            monthEndDate = new Date(`${year}-${(monthNum + 1).toString().padStart(2, '0')}-01`);
          }
          
          query = query.gte('purchase_date', monthStartDate.toISOString());
          query = query.lt('purchase_date', monthEndDate.toISOString());
        }
      }
    }
    
    // Rūšiuoti pagal datą (naujausi viršuje)
    query = query.order('purchase_date', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Klaida gaunant pirkimus:', error);
    return res.status(500).json({ message: 'Serverio klaida gaunant pirkimus' });
  }
};

// Gauti pirkimą pagal ID
export const getPurchaseById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        products (*),
        suppliers (*),
        companies (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ message: 'Pirkimas nerastas' });
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Klaida gaunant pirkimą ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida gaunant pirkimą' });
  }
};

// Sukurti naują pirkimą
export const createPurchase = async (req: Request, res: Response) => {
  const { 
    invoiceNumber, 
    productId, 
    supplierId, 
    quantity, 
    purchaseDate, 
    unitPrice, 
    companyId 
  } = req.body;
  
  try {
    // Apskaičiuoti bendrą sumą
    const totalAmount = quantity * unitPrice;
    
    const { data, error } = await supabase
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
    
    if (error) throw error;
    
    // Fetch the complete purchase with related data
    const { data: newPurchase, error: fetchError } = await supabase
      .from('purchases')
      .select(`
        *,
        products (*),
        suppliers (*),
        companies (*)
      `)
      .eq('id', data.id)
      .single();
    
    if (fetchError) throw fetchError;
    
    return res.status(201).json(newPurchase);
  } catch (error) {
    console.error('Klaida kuriant pirkimą:', error);
    return res.status(500).json({ message: 'Serverio klaida kuriant pirkimą' });
  }
};

// Atnaujinti pirkimą
export const updatePurchase = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { 
    invoiceNumber, 
    productId, 
    supplierId, 
    quantity, 
    purchaseDate, 
    unitPrice, 
    companyId 
  } = req.body;
  
  try {
    // Apskaičiuoti bendrą sumą
    const totalAmount = quantity * unitPrice;
    
    const { data, error } = await supabase
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
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ message: 'Pirkimas nerastas' });
    }
    
    // Fetch the complete updated purchase with related data
    const { data: updatedPurchase, error: fetchError } = await supabase
      .from('purchases')
      .select(`
        *,
        products (*),
        suppliers (*),
        companies (*)
      `)
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    return res.status(200).json(updatedPurchase);
  } catch (error) {
    console.error(`Klaida atnaujinant pirkimą ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida atnaujinant pirkimą' });
  }
};

// Ištrinti pirkimą
export const deletePurchase = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const { error } = await supabase
      .from('purchases')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return res.status(200).json({ message: 'Pirkimas sėkmingai ištrintas' });
  } catch (error) {
    console.error(`Klaida ištrinant pirkimą ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida ištrinant pirkimą' });
  }
};

// Eksportuoti pirkimus į CSV formatą
export const exportPurchasesToCsv = async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query;
    
    // Gauti filtruotus pirkimus
    let query = supabase
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
      const endDate = new Date(`${parseInt(year as string) + 1}-01-01`);
      
      query = query.gte('purchase_date', startDate.toISOString());
      query = query.lt('purchase_date', endDate.toISOString());
      
      // Jei nurodytas ir mėnuo, papildomai filtruoti
      if (month) {
        const monthNum = parseInt(month as string);
        if (monthNum >= 1 && monthNum <= 12) {
          const monthStartDate = new Date(`${year}-${monthNum.toString().padStart(2, '0')}-01`);
          let monthEndDate;
          
          if (monthNum === 12) {
            monthEndDate = new Date(`${parseInt(year as string) + 1}-01-01`);
          } else {
            monthEndDate = new Date(`${year}-${(monthNum + 1).toString().padStart(2, '0')}-01`);
          }
          
          query = query.gte('purchase_date', monthStartDate.toISOString());
          query = query.lt('purchase_date', monthEndDate.toISOString());
        }
      }
    }
    
    // Rūšiuoti pagal datą (seniausi viršuje, geriau apskaitos ataskaitoms)
    query = query.order('purchase_date', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
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
    const csvData = data.map(item => ({
      id: item.id,
      invoiceNumber: item.invoice_number,
      purchaseDate: new Date(item.purchase_date).toLocaleDateString('lt-LT'),
      productName: item.products?.name || 'Nenurodyta',
      productCode: item.products?.code || 'Nenurodyta',
      supplierName: item.suppliers?.name || 'Nenurodyta',
      quantity: item.quantity,
      unit: item.products?.unit || 'VNT',
      unitPrice: Number(item.unit_price).toFixed(2),
      totalAmount: Number(item.total_amount).toFixed(2),
      company: item.companies?.name || 'Nenurodyta'
    }));
    
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
    const stringifier = stringify({
      header: true,
      columns: csvColumns
    });
    
    // Rašyti duomenis į atsakymą
    stringifier.pipe(res);
    csvData.forEach(row => stringifier.write(row));
    stringifier.end();
    
  } catch (error) {
    console.error('Klaida eksportuojant pirkimus į CSV:', error);
    return res.status(500).json({ message: 'Serverio klaida eksportuojant pirkimus į CSV' });
  }
};

// Eksportuoti pirkimus į XLSX formatą
export const exportPurchasesToXlsx = async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query;
    
    // Gauti filtruotus pirkimus
    let query = supabase
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
      const endDate = new Date(`${parseInt(year as string) + 1}-01-01`);
      
      query = query.gte('purchase_date', startDate.toISOString());
      query = query.lt('purchase_date', endDate.toISOString());
      
      // Jei nurodytas ir mėnuo, papildomai filtruoti
      if (month) {
        const monthNum = parseInt(month as string);
        if (monthNum >= 1 && monthNum <= 12) {
          const monthStartDate = new Date(`${year}-${monthNum.toString().padStart(2, '0')}-01`);
          let monthEndDate;
          
          if (monthNum === 12) {
            monthEndDate = new Date(`${parseInt(year as string) + 1}-01-01`);
          } else {
            monthEndDate = new Date(`${year}-${(monthNum + 1).toString().padStart(2, '0')}-01`);
          }
          
          query = query.gte('purchase_date', monthStartDate.toISOString());
          query = query.lt('purchase_date', monthEndDate.toISOString());
        }
      }
    }
    
    // Rūšiuoti pagal datą (seniausi viršuje, geriau apskaitos ataskaitoms)
    query = query.order('purchase_date', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
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
      worksheet.addRow({
        id: item.id,
        invoiceNumber: item.invoice_number,
        purchaseDate: new Date(item.purchase_date).toLocaleDateString('lt-LT'),
        productName: item.products?.name || 'Nenurodyta',
        productCode: item.products?.code || 'Nenurodyta',
        supplierName: item.suppliers?.name || 'Nenurodyta',
        quantity: item.quantity,
        unit: item.products?.unit || 'VNT',
        unitPrice: Number(item.unit_price).toFixed(2),
        totalAmount: Number(item.total_amount).toFixed(2),
        company: item.companies?.name || 'Nenurodyta'
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
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Klaida eksportuojant pirkimus į XLSX:', error);
    return res.status(500).json({ message: 'Serverio klaida eksportuojant pirkimus į XLSX' });
  }
};

// Eksportuoti pirkimus į PDF formatą
export const exportPurchasesToPdf = async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query;
    
    // Gauti filtruotus pirkimus
    let query = supabase
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
      const endDate = new Date(`${parseInt(year as string) + 1}-01-01`);
      
      query = query.gte('purchase_date', startDate.toISOString());
      query = query.lt('purchase_date', endDate.toISOString());
      
      // Jei nurodytas ir mėnuo, papildomai filtruoti
      if (month) {
        const monthNum = parseInt(month as string);
        if (monthNum >= 1 && monthNum <= 12) {
          const monthStartDate = new Date(`${year}-${monthNum.toString().padStart(2, '0')}-01`);
          let monthEndDate;
          
          if (monthNum === 12) {
            monthEndDate = new Date(`${parseInt(year as string) + 1}-01-01`);
          } else {
            monthEndDate = new Date(`${year}-${(monthNum + 1).toString().padStart(2, '0')}-01`);
          }
          
          query = query.gte('purchase_date', monthStartDate.toISOString());
          query = query.lt('purchase_date', monthEndDate.toISOString());
        }
      }
    }
    
    // Rūšiuoti pagal datą (seniausi viršuje, geriau apskaitos ataskaitoms)
    query = query.order('purchase_date', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Nerasta pirkimų pagal nurodytus filtrus' });
    }
    
    // Sukurti PDF dokumentą
    const doc = new PDFDocument({ margin: 50 });
    
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
    doc.fontSize(20).text('Pirkimų ataskaita', { align: 'center' as 'center' });
    doc.moveDown();
    
    // Pridėti filtravimo informaciją
    if (year) {
      let filterText = `Metai: ${year}`;
      if (month) {
        const monthNames = [
          'Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis',
          'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'
        ];
        filterText += `, Mėnuo: ${monthNames[parseInt(month as string) - 1]}`;
      }
      doc.fontSize(12).text(filterText, { align: 'center' as 'center' });
      doc.moveDown();
    }
    
    // Pridėti lentelės antraštę
    const tableTop = 150;
    const textOptions = { width: 500, align: 'left' as 'left' };
    
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
    doc.fontSize(10).text('Data', 50, tableTop, { width: 500, align: 'left' as 'left' });
    doc.text('Sąskaitos Nr.', 50 + colWidths.date, tableTop, { width: 500, align: 'left' as 'left' });
    doc.text('Produktas', 50 + colWidths.date + colWidths.invoice, tableTop, { width: 500, align: 'left' as 'left' });
    doc.text('Tiekėjas', 50 + colWidths.date + colWidths.invoice + colWidths.product, tableTop, { width: 500, align: 'left' as 'left' });
    doc.text('Kiekis', 50 + colWidths.date + colWidths.invoice + colWidths.product + colWidths.supplier, tableTop, { width: 500, align: 'left' as 'left' });
    doc.text('Kaina', 50 + colWidths.date + colWidths.invoice + colWidths.product + colWidths.supplier + colWidths.quantity, tableTop, { width: 500, align: 'left' as 'left' });
    doc.text('Suma', 50 + colWidths.date + colWidths.invoice + colWidths.product + colWidths.supplier + colWidths.quantity + colWidths.price, tableTop, { width: 500, align: 'left' as 'left' });
    
    // Linija po antraštės
    doc.moveTo(50, tableTop + 20)
       .lineTo(550, tableTop + 20)
       .stroke();
    
    // Pridėti duomenis
    let rowTop = tableTop + 30;
    let totalAmount = 0;
    
    data.forEach((item, i) => {
      // Jei reikia naujo puslapio
      if (rowTop > 700) {
        doc.addPage();
        rowTop = 50;
        
        // Pakartoti antraštę naujame puslapyje
        doc.fontSize(10).text('Data', 50, rowTop, { width: 500, align: 'left' as 'left' });
        doc.text('Sąskaitos Nr.', 50 + colWidths.date, rowTop, { width: 500, align: 'left' as 'left' });
        doc.text('Produktas', 50 + colWidths.date + colWidths.invoice, rowTop, { width: 500, align: 'left' as 'left' });
        doc.text('Tiekėjas', 50 + colWidths.date + colWidths.invoice + colWidths.product, rowTop, { width: 500, align: 'left' as 'left' });
        doc.text('Kiekis', 50 + colWidths.date + colWidths.invoice + colWidths.product + colWidths.supplier, rowTop, { width: 500, align: 'left' as 'left' });
        doc.text('Kaina', 50 + colWidths.date + colWidths.invoice + colWidths.product + colWidths.supplier + colWidths.quantity, rowTop, { width: 500, align: 'left' as 'left' });
        doc.text('Suma', 50 + colWidths.date + colWidths.invoice + colWidths.product + colWidths.supplier + colWidths.quantity + colWidths.price, rowTop, { width: 500, align: 'left' as 'left' });
        
        // Linija po antraštės
        doc.moveTo(50, rowTop + 20)
           .lineTo(550, rowTop + 20)
           .stroke();
        
        rowTop += 30;
      }
      
      const purchaseDate = new Date(item.purchase_date).toLocaleDateString('lt-LT');
      const productName = item.products?.name || 'Nenurodyta';
      const supplierName = item.suppliers?.name || 'Nenurodyta';
      const quantity = item.quantity;
      const unitPrice = Number(item.unit_price).toFixed(2);
      const total = Number(item.total_amount).toFixed(2);
      
      totalAmount += Number(item.total_amount);
      
      doc.fontSize(9).text(purchaseDate, 50, rowTop, { width: 500, align: 'left' as 'left' });
      doc.text(item.invoice_number || '', 50 + colWidths.date, rowTop, { width: 500, align: 'left' as 'left' });
      doc.text(productName, 50 + colWidths.date + colWidths.invoice, rowTop, { width: 500, align: 'left' as 'left' });
      doc.text(supplierName, 50 + colWidths.date + colWidths.invoice + colWidths.product, rowTop, { width: 500, align: 'left' as 'left' });
      doc.text(quantity.toString(), 50 + colWidths.date + colWidths.invoice + colWidths.product + colWidths.supplier, rowTop);
      doc.text(`${unitPrice} €`, 50 + colWidths.date + colWidths.invoice + colWidths.product + colWidths.supplier + colWidths.quantity, rowTop, { width: 500, align: 'left' as 'left' });
      doc.text(`${total} €`, 50 + colWidths.date + colWidths.invoice + colWidths.product + colWidths.supplier + colWidths.quantity + colWidths.price, rowTop, { width: 500, align: 'left' as 'left' });
      
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
    doc.fontSize(10).text('Bendra suma:', 400, rowTop, { width: 500, align: 'left' as 'left' });
    doc.text(`${totalAmount.toFixed(2)} €`, 500, rowTop, { width: 500, align: 'left' as 'left' });
    
    // Pridėti datą ir puslapio numerį
    const currentDate = new Date().toLocaleDateString('lt-LT');
    
    doc.on('pageAdded', () => {
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(8).text(
          `Sukurta: ${currentDate} | Puslapis ${i + 1} iš ${pages.count}`,
          50,
          doc.page.height - 50,
          { align: 'center' as 'center' }
        );
      }
    });
    
    // Pridėti datą ir puslapio numerį pirmame puslapyje
    doc.fontSize(8).text(
      `Sukurta: ${currentDate} | Puslapis 1`,
      50,
      doc.page.height - 50,
      { align: 'center' as 'center' }
    );
    
    // Užbaigti dokumentą
    doc.end();
    
  } catch (error) {
    console.error('Klaida eksportuojant pirkimus į PDF:', error);
    return res.status(500).json({ message: 'Serverio klaida eksportuojant pirkimus į PDF' });
  }
};