import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';

// Function to create a Russian PDF with Latin transliteration (instead of Cyrillic)
export const createRussianPdf = (
  doc: typeof PDFDocument,
  issuance: any
): void => {
  // Title
  doc.fontSize(20);
  doc.text('Dokument o peredache produkcii', { align: 'center' });
  doc.moveDown();
  
  // Issue date
  const issueDate = new Date(issuance.issuance_date);
  const formattedDate = `${issueDate.getMonth() + 1}/${issueDate.getDate()}/${issueDate.getFullYear()}`;
  doc.fontSize(12);
  doc.text(`Data vypuska: ${formattedDate}`);
  doc.moveDown();
  
  // Product info
  const productName = issuance.products.name_ru || issuance.products.name;
  doc.text(`Produkt: ${productName}`);
  doc.text(`Kolichestvo: ${issuance.quantity} vnt`);
  doc.moveDown();
  
  // Driver and vehicle info
  doc.text(`Voditel': ${issuance.driver_name}`);
  doc.text(`Avtomobil': ${issuance.trucks.plate_number}`);
  
  if (issuance.trucks.companies) {
    doc.text(`Kompanija: ${issuance.trucks.companies.name}`);
  }
  
  doc.moveDown();
  
  if (issuance.notes) {
    doc.text(`Primechanija: ${issuance.notes}`);
    doc.moveDown();
  }
  
  // Signature lines
  doc.text('Vydano: _______________________', { align: 'left' });
  doc.moveDown();
  doc.text('Polucheno ot: _______________________', { align: 'left' });
};

// Function to create an English PDF
export const createEnglishPdf = (
  doc: typeof PDFDocument,
  issuance: any
): void => {
  // Title
  doc.fontSize(20);
  doc.text('Product Transfer Document', { align: 'center' });
  doc.moveDown();
  
  // Issue date
  const issueDate = new Date(issuance.issuance_date);
  doc.fontSize(12);
  doc.text(`Issue date: ${issueDate.toLocaleDateString('en-US')}`);
  doc.moveDown();
  
  // Product info
  const productName = issuance.products.name_en || issuance.products.name;
  doc.text(`Product: ${productName}`);
  doc.text(`Quantity: ${issuance.quantity} ${issuance.products.unit}`);
  doc.moveDown();
  
  // Driver and vehicle info
  doc.text(`Driver: ${issuance.driver_name}`);
  doc.text(`Vehicle: ${issuance.trucks.plate_number}`);
  
  if (issuance.trucks.companies) {
    doc.text(`Company: ${issuance.trucks.companies.name}`);
  }
  
  doc.moveDown();
  
  if (issuance.notes) {
    doc.text(`Notes: ${issuance.notes}`);
    doc.moveDown();
  }
  
  // Signature lines
  doc.text('Issued by: _______________________', { align: 'left' });
  doc.moveDown();
  doc.text('Received by: _______________________', { align: 'left' });
};
