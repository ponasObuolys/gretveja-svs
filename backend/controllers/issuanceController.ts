import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';
import { supabase } from '../config/supabase';
import { stringify } from 'csv-stringify';
import * as ExcelJS from 'exceljs';

// Gauti visus išdavimus
export const getAllIssuances = async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query;
    
    let query = supabase
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
      const endDate = new Date(`${parseInt(year as string) + 1}-01-01`);
      
      query = query.gte('issuance_date', startDate.toISOString());
      query = query.lt('issuance_date', endDate.toISOString());
      
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
          
          query = query.gte('issuance_date', monthStartDate.toISOString());
          query = query.lt('issuance_date', monthEndDate.toISOString());
        }
      }
    }
    
    // Rūšiuoti pagal datą (naujausi viršuje)
    query = query.order('issuance_date', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Klaida gaunant išdavimus:', error);
    return res.status(500).json({ message: 'Serverio klaida gaunant išdavimus' });
  }
};

// Gauti išdavimą pagal ID
export const getIssuanceById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const { data, error } = await supabase
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
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ message: 'Išdavimas nerastas' });
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error(`Klaida gaunant išdavimą ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida gaunant išdavimą' });
  }
};

// Sukurti naują išdavimą
export const createIssuance = async (req: Request, res: Response) => {
  const { 
    productId, 
    isIssued, 
    issuanceDate, 
    quantity, 
    driverName, 
    truckId,
    notes
  } = req.body;
  
  try {
    const { data, error } = await supabase
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
    
    if (error) throw error;
    
    // Fetch the complete issuance with related data
    const { data: newIssuance, error: fetchError } = await supabase
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
    
    if (fetchError) throw fetchError;
    
    return res.status(201).json(newIssuance);
  } catch (error) {
    console.error('Klaida kuriant išdavimą:', error);
    return res.status(500).json({ message: 'Serverio klaida kuriant išdavimą' });
  }
};

// Atnaujinti išdavimą
export const updateIssuance = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { 
    productId, 
    isIssued, 
    issuanceDate, 
    quantity, 
    driverName, 
    truckId,
    notes
  } = req.body;
  
  try {
    const { data, error } = await supabase
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
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ message: 'Išdavimas nerastas' });
    }
    
    // Fetch the complete updated issuance with related data
    const { data: updatedIssuance, error: fetchError } = await supabase
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
    
    if (fetchError) throw fetchError;
    
    return res.status(200).json(updatedIssuance);
  } catch (error) {
    console.error(`Klaida atnaujinant išdavimą ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida atnaujinant išdavimą' });
  }
};

// Ištrinti išdavimą
export const deleteIssuance = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const { error } = await supabase
      .from('issuances')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return res.status(200).json({ message: 'Išdavimas sėkmingai ištrintas' });
  } catch (error) {
    console.error(`Klaida ištrinant išdavimą ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida ištrinant išdavimą' });
  }
};

// Generuoti PDF
export const generatePdf = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const { data: issuance, error } = await supabase
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
    
    if (error) throw error;
    
    if (!issuance) {
      return res.status(404).json({ message: 'Išdavimas nerastas' });
    }
    
    // Sukurti PDF dokumentą
    const doc = new PDFDocument();
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
    
  } catch (error) {
    console.error(`Klaida generuojant PDF išdavimui ID ${id}:`, error);
    return res.status(500).json({ message: 'Serverio klaida generuojant PDF' });
  }
};

// Eksportuoti išdavimus į CSV formatą
export const exportIssuancesToCsv = async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query;
    
    // Gauti filtruotus išdavimus
    let query = supabase
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
      const endDate = new Date(`${parseInt(year as string) + 1}-01-01`);
      
      query = query.gte('issuance_date', startDate.toISOString());
      query = query.lt('issuance_date', endDate.toISOString());
      
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
          
          query = query.gte('issuance_date', monthStartDate.toISOString());
          query = query.lt('issuance_date', monthEndDate.toISOString());
        }
      }
    }
    
    // Rūšiuoti pagal datą (seniausi viršuje, geriau apskaitos ataskaitoms)
    query = query.order('issuance_date', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
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
    const csvData = data.map(item => ({
      id: item.id,
      issuanceDate: new Date(item.issuance_date).toLocaleDateString('lt-LT'),
      productName: item.products?.name || 'Nenurodyta',
      productCode: item.products?.code || 'Nenurodyta',
      quantity: item.quantity,
      unit: item.products?.unit || 'VNT',
      driverName: item.driver_name,
      plateNumber: item.trucks?.plate_number || 'Nenurodyta',
      company: item.trucks?.companies?.name || 'Nenurodyta',
      isIssued: item.is_issued ? 'Taip' : 'Ne',
      notes: item.notes || ''
    }));
    
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
    const stringifier = stringify({
      header: true,
      columns: csvColumns
    });
    
    // Rašyti duomenis į atsakymą
    stringifier.pipe(res);
    csvData.forEach(row => stringifier.write(row));
    stringifier.end();
    
  } catch (error) {
    console.error('Klaida eksportuojant išdavimus į CSV:', error);
    return res.status(500).json({ message: 'Serverio klaida eksportuojant išdavimus į CSV' });
  }
};

// Eksportuoti išdavimus į XLSX formatą
export const exportIssuancesToXlsx = async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query;
    
    // Gauti filtruotus išdavimus
    let query = supabase
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
      const endDate = new Date(`${parseInt(year as string) + 1}-01-01`);
      
      query = query.gte('issuance_date', startDate.toISOString());
      query = query.lt('issuance_date', endDate.toISOString());
      
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
          
          query = query.gte('issuance_date', monthStartDate.toISOString());
          query = query.lt('issuance_date', monthEndDate.toISOString());
        }
      }
    }
    
    // Rūšiuoti pagal datą (seniausi viršuje, geriau apskaitos ataskaitoms)
    query = query.order('issuance_date', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
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
      worksheet.addRow({
        id: item.id,
        issuanceDate: new Date(item.issuance_date).toLocaleDateString('lt-LT'),
        productName: item.products?.name || 'Nenurodyta',
        productCode: item.products?.code || 'Nenurodyta',
        quantity: item.quantity,
        unit: item.products?.unit || 'VNT',
        driverName: item.driver_name,
        plateNumber: item.trucks?.plate_number || 'Nenurodyta',
        company: item.trucks?.companies?.name || 'Nenurodyta',
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
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Klaida eksportuojant išdavimus į XLSX:', error);
    return res.status(500).json({ message: 'Serverio klaida eksportuojant išdavimus į XLSX' });
  }
};

// Eksportuoti išdavimus į PDF formatą
export const exportIssuancesToPdf = async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query;
    
    // Gauti filtruotus išdavimus
    let query = supabase
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
      const endDate = new Date(`${parseInt(year as string) + 1}-01-01`);
      
      query = query.gte('issuance_date', startDate.toISOString());
      query = query.lt('issuance_date', endDate.toISOString());
      
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
          
          query = query.gte('issuance_date', monthStartDate.toISOString());
          query = query.lt('issuance_date', monthEndDate.toISOString());
        }
      }
    }
    
    // Rūšiuoti pagal datą (seniausi viršuje, geriau apskaitos ataskaitoms)
    query = query.order('issuance_date', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Nerasta išdavimų pagal nurodytus filtrus' });
    }
    
    // Sukurti PDF dokumentą
    const doc = new PDFDocument({ margin: 50 });
    
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
        title += ` ${monthNames[parseInt(month as string) - 1]} mėn.`;
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
      doc.text(item.products?.name || 'Nenurodyta', 50 + colWidths.date, yPos);
      doc.text(`${item.quantity} ${item.products?.unit || 'VNT'}`, 50 + colWidths.date + colWidths.product, yPos);
      doc.text(item.driver_name, 50 + colWidths.date + colWidths.product + colWidths.quantity, yPos);
      doc.text(item.trucks?.companies?.name || 'Nenurodyta', 50 + colWidths.date + colWidths.product + colWidths.quantity + colWidths.driver, yPos);
      
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
    
  } catch (error) {
    console.error('Klaida eksportuojant išdavimus į PDF:', error);
    return res.status(500).json({ message: 'Serverio klaida eksportuojant išdavimus į PDF' });
  }
};