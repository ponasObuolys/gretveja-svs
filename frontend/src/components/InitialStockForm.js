import React, { useState, useEffect } from 'react';
import './InitialStockForm.css';
import { useTranslation } from 'react-i18next';

function InitialStockForm({ onClose, onSave }) {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [initialStock, setInitialStock] = useState({
    productId: '',
    companyId: '',
    quantity: 1,
    purchaseDate: new Date().toISOString().split('T')[0],
    unitPrice: 0,
    invoiceNumber: 'PRADINIS-LIKUTIS'
  });
  
  // Gauti produktus ir įmones
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Gauti produktus
        const productsResponse = await fetch('/api/products');
        if (!productsResponse.ok) {
          throw new Error(t('common.errors.fetchFailed'));
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);
        
        // Gauti įmones
        const companiesResponse = await fetch('/api/companies');
        if (!companiesResponse.ok) {
          throw new Error(t('common.errors.fetchFailed'));
        }
        const companiesData = await companiesResponse.json();
        setCompanies(companiesData);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [t]);
  
  // Formos įvesties keitimas
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInitialStock({
      ...initialStock,
      [name]: value
    });
  };
  
  // Išsaugoti pradinį likutį
  const handleSaveInitialStock = async (e) => {
    e.preventDefault();
    
    try {
      // Gauti tiekėją (naudosime pirmą tiekėją iš sąrašo)
      const suppliersResponse = await fetch('/api/suppliers');
      if (!suppliersResponse.ok) {
        throw new Error(t('common.errors.fetchFailed'));
      }
      const suppliersData = await suppliersResponse.json();
      
      if (suppliersData.length === 0) {
        throw new Error(t('common.errors.noSuppliers'));
      }
      
      const supplierId = suppliersData[0].id;
      
      // Sukurti pirkimą su pradiniu likučiu
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...initialStock,
          supplierId,
          totalAmount: initialStock.quantity * Number(initialStock.unitPrice),
          unitPrice: Number(initialStock.unitPrice),
          quantity: Number(initialStock.quantity)
        })
      });
      
      if (!response.ok) {
        throw new Error(t('common.errors.saveFailed'));
      }
      
      const addedPurchase = await response.json();
      
      if (onSave) {
        onSave(addedPurchase);
      }
      
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(err.message);
    }
  };
  
  if (loading) return <div className="loading">{t('common.messages.loading')}</div>;
  
  return (
    <div className="initial-stock-form-overlay">
      <div className="initial-stock-form-container">
        <h2>{t('common.inventory.initialStock')}</h2>
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSaveInitialStock}>
          <div className="form-group">
            <label htmlFor="productId">{t('common.labels.product')}:</label>
            <select
              id="productId"
              name="productId"
              value={initialStock.productId}
              onChange={handleInputChange}
              required
              className="product-select"
              size="1"
            >
              <option value="">{t('common.select.product')}</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.code} {product.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="companyId">{t('common.labels.company')}:</label>
            <select
              id="companyId"
              name="companyId"
              value={initialStock.companyId}
              onChange={handleInputChange}
              required
            >
              <option value="">{t('common.select.company')}</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity">{t('common.labels.quantity')}:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={initialStock.quantity}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="purchaseDate">{t('common.labels.date')}:</label>
            <input
              type="date"
              id="purchaseDate"
              name="purchaseDate"
              value={initialStock.purchaseDate}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="unitPrice">{t('common.labels.price')}:</label>
            <input
              type="number"
              id="unitPrice"
              name="unitPrice"
              value={initialStock.unitPrice}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {t('common.buttons.save')}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              {t('common.buttons.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InitialStockForm;