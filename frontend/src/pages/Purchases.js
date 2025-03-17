import React, { useState, useEffect, useRef } from 'react';
import './Purchases.css';
import InitialStockForm from '../components/InitialStockForm';
import { useTranslation } from 'react-i18next';
import { Row, Col, Form, Button, Dropdown } from 'react-bootstrap';
import axios from 'axios';

function Purchases() {
  const { t } = useTranslation();
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Naujo pirkimo forma
  const [newPurchase, setNewPurchase] = useState({
    invoiceNumber: '',
    productId: '',
    supplierId: '',
    quantity: 1,
    purchaseDate: new Date().toISOString().split('T')[0],
    unitPrice: 0,
    companyId: ''
  });
  
  // Redagavimo režimas
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Pradinio likučio forma
  const [showInitialStockForm, setShowInitialStockForm] = useState(false);
  
  // Produktų pasirinkimo laukelio būsena
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState('Pasirinkite produktą');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  
  // Filtravimo būsenos
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  
  // Gauti metus filtravimui (nuo 2020 iki dabartinių metų)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i);
  
  // Mėnesių sąrašas
  const months = [
    { value: 1, name: 'january' },
    { value: 2, name: 'february' },
    { value: 3, name: 'march' },
    { value: 4, name: 'april' },
    { value: 5, name: 'may' },
    { value: 6, name: 'june' },
    { value: 7, name: 'july' },
    { value: 8, name: 'august' },
    { value: 9, name: 'september' },
    { value: 10, name: 'october' },
    { value: 11, name: 'november' },
    { value: 12, name: 'december' }
  ];
  
  // Ref produktų dropdown elementui
  const productDropdownRef = useRef(null);
  
  // Uždaryti dropdown, kai paspaudžiama už jo ribų
  useEffect(() => {
    function handleClickOutside(event) {
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target)) {
        setShowProductDropdown(false);
      }
    }
    
    // Pridėti event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Pašalinti event listener, kai komponentas išmontuojamas
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [productDropdownRef]);
  
  // Filtravimo komponentas
  const FilterComponent = () => {
    return (
      <div className="filter-container">
        <Row>
          <Col sm={3}>
            <Form.Group>
              <Form.Label>{t('common.filters.year')}</Form.Label>
              <Form.Select
                value={selectedYear || ''}
                onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">{t('common.filters.all_years')}</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm={3}>
            <Form.Group>
              <Form.Label>{t('common.filters.month')}</Form.Label>
              <Form.Select
                value={selectedMonth || ''}
                onChange={(e) => setSelectedMonth(e.target.value ? parseInt(e.target.value) : null)}
                disabled={!selectedYear}
              >
                <option value="">{t('common.filters.all_months')}</option>
                {months.map(month => (
                  <option key={month.value} value={month.value}>
                    {t(`common.months.${month.name}`)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col sm={3} className="d-flex align-items-end">
            <Button 
              variant="outline-secondary" 
              onClick={clearFilters}
              className="mb-3"
            >
              {t('common.filters.clear')}
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  // Valyti filtrus
  const clearFilters = () => {
    setSelectedYear(null);
    setSelectedMonth(null);
  };

  // Eksporto mygtukai
  const ExportButtons = () => {
    return (
      <Dropdown className="export-dropdown">
        <Dropdown.Toggle variant="success">
          {t('common.buttons.export')}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleExport('csv')}>
            {t('common.purchases.export_csv')}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleExport('xlsx')}>
            {t('common.purchases.export_xlsx')}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleExport('pdf')}>
            {t('common.purchases.export_pdf')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };
  
  // Gauti visus pirkimus
  const fetchPurchases = async () => {
    try {
      setLoading(true);
      
      // Sukurti URL su filtrais
      let url = '/api/purchases';
      const params = new URLSearchParams();
      
      if (selectedYear) {
        params.append('year', selectedYear);
      }
      
      if (selectedMonth) {
        params.append('month', selectedMonth);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const purchasesResponse = await axios.get(url);
      
      // Transform data from snake_case (backend) to camelCase (frontend)
      const transformedPurchases = purchasesResponse.data.map(purchase => ({
        id: purchase.id,
        invoiceNumber: purchase.invoice_number,
        productId: purchase.product_id,
        supplierId: purchase.supplier_id,
        quantity: purchase.quantity,
        purchaseDate: purchase.purchase_date,
        unitPrice: purchase.unit_price,
        companyId: purchase.company_id,
        totalAmount: purchase.total_amount,
        product: purchase.products,
        supplier: purchase.suppliers,
        company: purchase.companies
      }));
      
      setPurchases(transformedPurchases);
      
      // Gauti produktus
      const productsResponse = await fetch('/api/products');
      if (!productsResponse.ok) {
        throw new Error('Nepavyko gauti produktų duomenų');
      }
      const productsData = await productsResponse.json();
      setProducts(productsData);
      
      // Gauti tiekėjus
      const suppliersResponse = await fetch('/api/suppliers');
      if (!suppliersResponse.ok) {
        throw new Error('Nepavyko gauti tiekėjų duomenų');
      }
      const suppliersData = await suppliersResponse.json();
      setSuppliers(suppliersData);
      
      // Gauti įmones
      const companiesResponse = await fetch('/api/companies');
      if (!companiesResponse.ok) {
        throw new Error('Nepavyko gauti įmonių duomenų');
      }
      const companiesData = await companiesResponse.json();
      setCompanies(companiesData);
      
      setLoading(false);
      setError(null);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  // Eksportuoti duomenis
  const handleExport = async (format) => {
    try {
      // Sukurti URL su filtrais
      let exportUrl = `/api/purchases/export/${format}`;
      const params = new URLSearchParams();
      
      if (selectedYear) {
        params.append('year', selectedYear);
      }
      
      if (selectedMonth) {
        params.append('month', selectedMonth);
      }
      
      if (params.toString()) {
        exportUrl += `?${params.toString()}`;
      }
      
      const response = await axios.get(exportUrl, {
        responseType: 'blob'
      });
      
      // Nustatyti failo pavadinimą
      let filename = 'purchases';
      if (selectedYear) {
        filename += `_${selectedYear}`;
        if (selectedMonth) {
          filename += `_${selectedMonth.toString().padStart(2, '0')}`;
        }
      }
      filename += `.${format}`;
      
      // Sukurti laikinąją nuorodą ir atsisiųsti failą
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(`Klaida eksportuojant duomenis į ${format.toUpperCase()}:`, err);
      setError(`Nepavyko eksportuoti duomenų į ${format.toUpperCase()}. Bandykite dar kartą vėliau.`);
    }
  };
  
  useEffect(() => {
    fetchPurchases();
  }, [selectedYear, selectedMonth]);
  
  // Formos įvesties keitimas
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPurchase({
      ...newPurchase,
      [name]: value
    });
    
    // Jei keičiamas produktas, atnaujinti pasirinkto produkto pavadinimą
    if (name === 'productId') {
      const selectedProduct = products.find(product => product.id === parseInt(value));
      if (selectedProduct) {
        const productCode = selectedProduct.code || '';
        const productName = selectedProduct.name || '';
        setSelectedProductName(`${productCode} ${productName}`);
      } else {
        setSelectedProductName('Pasirinkite produktą');
      }
    }
  };
  
  // Produkto pasirinkimas iš pasirinktinio išskleidžiamojo sąrašo
  const handleProductSelect = (product) => {
    if (!product) return;
    
    setNewPurchase({
      ...newPurchase,
      productId: product.id
    });
    
    const productCode = product.code || '';
    const productName = product.name || '';
    setSelectedProductName(`${productCode} ${productName}`);
    setShowProductDropdown(false);
  };
  
  // Produktų filtravimas pagal paieškos terminą
  const filteredProducts = productSearchTerm 
    ? products.filter(product => 
        (product.name && product.name.toLowerCase().includes(productSearchTerm.toLowerCase())) ||
        (product.code && product.code.toLowerCase().includes(productSearchTerm.toLowerCase()))
      )
    : products;
  
  // Pirkimo pridėjimas
  const handleAddPurchase = async (e) => {
    e.preventDefault();
    
    try {
      const purchaseData = {
        ...newPurchase,
        unitPrice: Number(newPurchase.unitPrice),
        quantity: Number(newPurchase.quantity)
      };
      
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(purchaseData)
      });
      
      if (!response.ok) {
        throw new Error('Nepavyko pridėti pirkimo');
      }
      
      const addedPurchase = await response.json();
      setPurchases([...purchases, addedPurchase]);
      
      // Išvalyti formą
      setNewPurchase({
        invoiceNumber: '',
        productId: '',
        supplierId: '',
        quantity: 1,
        purchaseDate: new Date().toISOString().split('T')[0],
        unitPrice: 0,
        companyId: ''
      });
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Pirkimo redagavimas
  const handleEditPurchase = (purchase) => {
    setEditMode(true);
    setEditId(purchase.id);
    
    // Saugus datos apdorojimas
    let formattedDate = '';
    try {
      // Patikriname, ar purchase.purchaseDate yra validus
      if (purchase.purchaseDate) {
        const purchaseDate = new Date(purchase.purchaseDate);
        // Patikriname, ar data yra validi
        if (!isNaN(purchaseDate.getTime())) {
          formattedDate = purchaseDate.toISOString().split('T')[0];
        } else {
          formattedDate = new Date().toISOString().split('T')[0];
        }
      } else {
        formattedDate = new Date().toISOString().split('T')[0];
      }
    } catch (error) {
      console.error('Klaida formatuojant datą:', error);
      formattedDate = new Date().toISOString().split('T')[0];
    }
    
    setNewPurchase({
      invoiceNumber: purchase.invoiceNumber,
      productId: purchase.productId,
      supplierId: purchase.supplierId,
      quantity: purchase.quantity,
      purchaseDate: formattedDate,
      unitPrice: purchase.unitPrice,
      companyId: purchase.companyId
    });
  };
  
  // Pirkimo atnaujinimas
  const handleUpdatePurchase = async (e) => {
    e.preventDefault();
    
    try {
      const purchaseData = {
        ...newPurchase,
        unitPrice: Number(newPurchase.unitPrice),
        quantity: Number(newPurchase.quantity)
      };
      
      const response = await fetch(`/api/purchases/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(purchaseData)
      });
      
      if (!response.ok) {
        throw new Error('Nepavyko atnaujinti pirkimo');
      }
      
      const updatedPurchase = await response.json();
      setPurchases(purchases.map(p => p.id === editId ? updatedPurchase : p));
      
      // Išvalyti formą ir išjungti redagavimo režimą
      setNewPurchase({
        invoiceNumber: '',
        productId: '',
        supplierId: '',
        quantity: 1,
        purchaseDate: new Date().toISOString().split('T')[0],
        unitPrice: 0,
        companyId: ''
      });
      setEditMode(false);
      setEditId(null);
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Pirkimo ištrynimas
  const handleDeletePurchase = async (id) => {
    if (window.confirm('Ar tikrai norite ištrinti šį pirkimą?')) {
      try {
        const response = await fetch(`/api/purchases/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Nepavyko ištrinti pirkimo');
        }
        
        setPurchases(purchases.filter(p => p.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };
  
  // Atšaukti redagavimą
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditId(null);
    setNewPurchase({
      invoiceNumber: '',
      productId: '',
      supplierId: '',
      quantity: 1,
      purchaseDate: new Date().toISOString().split('T')[0],
      unitPrice: 0,
      companyId: ''
    });
  };
  
  // Pradinio likučio pridėjimas
  const handleAddInitialStock = (newStock) => {
    setPurchases([...purchases, newStock]);
  };
  
  if (loading) return <div className="loading">Kraunama...</div>;
  if (error) return <div className="error">Klaida: {error}</div>;
  
  return (
    <div className="purchases-container">
      <h1>{t('common.purchases.title')}</h1>
      
      <FilterComponent />
      
      <div className="action-buttons">
        <ExportButtons />
        <button 
          className="btn-add-initial-stock" 
          onClick={() => setShowInitialStockForm(true)}
        >
          Pridėti pradinį likutį
        </button>
      </div>
      
      <div className="purchase-form-container">
        <h2>{editMode ? 'Redaguoti pirkimą' : 'Pridėti naują pirkimą'}</h2>
        <form onSubmit={editMode ? handleUpdatePurchase : handleAddPurchase}>
          <div className="form-group">
            <label htmlFor="invoiceNumber">Sąskaitos numeris:</label>
            <input
              type="text"
              id="invoiceNumber"
              name="invoiceNumber"
              value={newPurchase.invoiceNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="productId">Produktas:</label>
            <div className="custom-dropdown" ref={productDropdownRef}>
              <div 
                className="custom-dropdown-header" 
                onClick={() => setShowProductDropdown(!showProductDropdown)}
              >
                <span>{selectedProductName}</span>
                <span className="dropdown-arrow">▼</span>
              </div>
              {showProductDropdown && (
                <div className="custom-dropdown-content">
                  <input
                    type="text"
                    placeholder="Ieškoti produkto..."
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="product-search"
                  />
                  <div className="custom-dropdown-items">
                    {filteredProducts.map(product => (
                      <div 
                        key={product.id} 
                        className="custom-dropdown-item"
                        onClick={() => handleProductSelect(product)}
                      >
                        {product.code || ''} {product.name || ''}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <input
                type="hidden"
                id="productId"
                name="productId"
                value={newPurchase.productId}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="supplierId">Tiekėjas:</label>
            <select
              id="supplierId"
              name="supplierId"
              value={newPurchase.supplierId}
              onChange={handleInputChange}
              required
            >
              <option value="">Pasirinkite tiekėją</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity">Kiekis:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={newPurchase.quantity}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="purchaseDate">Pirkimo data:</label>
            <input
              type="date"
              id="purchaseDate"
              name="purchaseDate"
              value={newPurchase.purchaseDate}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="unitPrice">Vieneto kaina:</label>
            <input
              type="number"
              id="unitPrice"
              name="unitPrice"
              value={newPurchase.unitPrice}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="companyId">Įmonė:</label>
            <select
              id="companyId"
              name="companyId"
              value={newPurchase.companyId}
              onChange={handleInputChange}
              required
            >
              <option value="">Pasirinkite įmonę</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {editMode ? 'Atnaujinti' : 'Pridėti'}
            </button>
            {editMode && (
              <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                Atšaukti
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className="purchases-list">
        <h2>Pirkimų sąrašas</h2>
        {purchases.length === 0 ? (
          <p>Nėra pirkimų įrašų.</p>
        ) : (
          <div className="table-responsive">
            <table className="purchases-table">
              <thead>
                <tr>
                  <th>{t('common.purchases.invoice_number')}</th>
                  <th>{t('common.labels.product')}</th>
                  <th>{t('common.labels.supplier')}</th>
                  <th>{t('common.labels.quantity')}</th>
                  <th>{t('common.purchases.purchase_date')}</th>
                  <th>{t('common.purchases.unit_price')}</th>
                  <th>{t('common.purchases.total_price')}</th>
                  <th>{t('common.labels.company')}</th>
                  <th>{t('common.labels.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td>{purchase.invoiceNumber}</td>
                    <td>{purchase.product?.name || t('common.messages.no_data')}</td>
                    <td>{purchase.supplier?.name || t('common.messages.no_data')}</td>
                    <td>{purchase.quantity}</td>
                    <td>
                      {purchase.purchaseDate ? 
                        (() => {
                          try {
                            const date = new Date(purchase.purchaseDate);
                            // Patikriname, ar data yra validi
                            if (!isNaN(date.getTime())) {
                              return date.toLocaleDateString();
                            } else {
                              return t('common.messages.no_data');
                            }
                          } catch (error) {
                            console.error('Klaida formatuojant datą:', error);
                            return t('common.messages.no_data');
                          }
                        })() : 
                        t('common.messages.no_data')
                      }
                    </td>
                    <td>{Number(purchase.unitPrice).toFixed(2)}</td>
                    <td>{(Number(purchase.quantity) * Number(purchase.unitPrice)).toFixed(2)}</td>
                    <td>{purchase.company?.name || t('common.messages.no_data')}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleEditPurchase(purchase)}
                      >
                        {t('common.buttons.edit')}
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeletePurchase(purchase.id)}
                      >
                        {t('common.buttons.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {showInitialStockForm && (
        <InitialStockForm 
          onClose={() => setShowInitialStockForm(false)} 
          onSave={handleAddInitialStock}
        />
      )}
    </div>
  );
}

export default Purchases; 