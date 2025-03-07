import React, { useState, useEffect, useRef } from 'react';
import './Purchases.css';
import InitialStockForm from '../components/InitialStockForm';

function Purchases() {
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
  
  // Gauti visus pirkimus
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Gauti pirkimus
        const purchasesResponse = await fetch('/api/purchases');
        if (!purchasesResponse.ok) {
          throw new Error('Nepavyko gauti pirkimų duomenų');
        }
        const purchasesData = await purchasesResponse.json();
        setPurchases(purchasesData);
        
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
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
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
    setNewPurchase({
      invoiceNumber: purchase.invoiceNumber,
      productId: purchase.productId,
      supplierId: purchase.supplierId,
      quantity: purchase.quantity,
      purchaseDate: new Date(purchase.purchaseDate).toISOString().split('T')[0],
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
      <h1>Pirkimai</h1>
      
      <div className="action-buttons">
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
          <table>
            <thead>
              <tr>
                <th>Sąskaitos Nr.</th>
                <th>Produktas</th>
                <th>Tiekėjas</th>
                <th>Kiekis</th>
                <th>Data</th>
                <th>Vieneto kaina</th>
                <th>Bendra suma</th>
                <th>Įmonė</th>
                <th>Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(purchase => (
                <tr key={purchase.id}>
                  <td>{purchase.invoiceNumber}</td>
                  <td>{purchase.product?.name || 'Nežinomas'}</td>
                  <td>{purchase.supplier?.name || 'Nežinomas'}</td>
                  <td>{purchase.quantity}</td>
                  <td>{new Date(purchase.purchaseDate).toLocaleDateString('lt-LT')}</td>
                  <td>{typeof purchase.unitPrice === 'number' ? purchase.unitPrice.toFixed(2) : Number(purchase.unitPrice).toFixed(2)} €</td>
                  <td>{typeof purchase.totalAmount === 'number' ? purchase.totalAmount.toFixed(2) : Number(purchase.totalAmount).toFixed(2)} €</td>
                  <td>{purchase.company?.name || 'Nežinoma'}</td>
                  <td>
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEditPurchase(purchase)}
                    >
                      Redaguoti
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDeletePurchase(purchase.id)}
                    >
                      Ištrinti
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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