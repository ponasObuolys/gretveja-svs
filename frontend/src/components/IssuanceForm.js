import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './IssuanceForm.css';
import DriverModel from '../models/DriverModel';

function IssuanceForm({ show, onHide, issuance }) {
  const { t, i18n } = useTranslation();
  
  // Use useMemo to memoize the initialFormState
  const initialFormState = useMemo(() => ({
    productId: '',
    isIssued: false,
    issuanceDate: new Date().toISOString().split('T')[0],
    quantity: 1,
    driverId: '',
    truckId: '',
    notes: ''
  }), []);

  const [formData, setFormData] = useState(initialFormState);
  const [products, setProducts] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Define getLocalizedProductName function before it's used in useEffect
  const getLocalizedProductName = (product) => {
    if (!product) return '';
    
    const currentLanguage = i18n.language;
    
    // Check if product has the nameEn or nameRu properties directly
    if (currentLanguage === 'en' && product.nameEn) {
      return product.nameEn;
    } else if (currentLanguage === 'ru' && product.nameRu) {
      return product.nameRu;
    }
    
    // Check if product has name_en or name_ru (snake_case format from API)
    if (currentLanguage === 'en' && product.name_en) {
      return product.name_en;
    } else if (currentLanguage === 'ru' && product.name_ru) {
      return product.name_ru;
    }
    
    // Default to Lithuanian name
    return product.name || '';
  };

  // Gauti produktus, vilkikus ir vairuotojus
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const [productsResponse, trucksResponse, stockResponse, driversResponse] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/trucks?include=company'),
          axios.get('/api/stocks'),
          axios.get('/api/drivers?include=company')
        ]);
        setProducts(productsResponse.data);
        setFilteredProducts(productsResponse.data);
        
        // Transform truck data from backend (snake_case) to frontend (camelCase) format
        const transformedTrucks = trucksResponse.data.map(truck => {
          console.log('Raw truck data:', truck); // Debugging raw truck data
          
          const transformedTruck = {
            id: truck.id,
            plateNumber: truck.plate_number || truck.plateNumber || `ID: ${truck.id}`, // Fallback options
            companyId: truck.company_id || truck.companyId,
            company: null
          };
          
          // Handle company data from various possible structures
          if (truck.companies) {
            transformedTruck.company = {
              id: truck.companies.id,
              name: truck.companies.name
            };
          } else if (truck.company) {
            transformedTruck.company = {
              id: truck.company.id,
              name: truck.company.name
            };
          }
          
          return transformedTruck;
        });
        
        // Log transformed trucks to help with debugging
        console.log('Transformed trucks:', transformedTrucks);
        
        setTrucks(transformedTrucks);
        setStockData(stockResponse.data);
        
        // Transform and set drivers data
        const transformedDrivers = driversResponse.data.map(driver => {
          return {
            id: driver.id,
            driver: driver.driver,
            companyId: driver.company_id || driver.companyId,
            company: driver.company ? {
              id: driver.company.id,
              name: driver.company.name
            } : null
          };
        });
        
        console.log('Transformed drivers:', transformedDrivers);
        setDrivers(transformedDrivers);
        
        setError(null);
      } catch (err) {
        console.error(t('common.errors.fetchFailed'), err);
        setError(t('common.errors.fetchFailed'));
      } finally {
        setDataLoading(false);
      }
    };

    if (show) {
      fetchData();
    }
  }, [show, t]);

  // Nustatyti formos duomenis, kai atidaroma redagavimo forma
  useEffect(() => {
    if (issuance) {
      console.log('Setting form data from issuance:', issuance);
      
      setFormData({
        productId: issuance.productId || '',
        isIssued: issuance.isIssued || false,
        issuanceDate: issuance.issuanceDate ? new Date(issuance.issuanceDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        quantity: issuance.quantity || 1,
        driverId: issuance.driverId || '',
        truckId: issuance.truckId || '',
        notes: issuance.notes || ''
      });

      // Nustatyti įmonę pagal vilkiką
      if (issuance.truck && issuance.truck.company) {
        console.log('Setting company from issuance:', issuance.truck.company);
        setSelectedCompany(issuance.truck.company.name);
      } else if (issuance.truckId) {
        // Jei redaguojame issuance ir yra truckId, bet nėra kompanijos,
        // pabandykime rasti vilkiką iš trucks masyvo
        console.log('Trying to find company from truck ID:', issuance.truckId);
        const truck = trucks.find(t => t.id === issuance.truckId);
        if (truck && truck.company) {
          console.log('Found company from trucks array:', truck.company);
          setSelectedCompany(truck.company.name);
        }
      } else {
        setSelectedCompany('');
      }
    } else {
      setFormData(initialFormState);
      setSelectedCompany('');
    }
    setValidated(false);
    setError(null);
  }, [issuance, show, trucks, initialFormState]);

  // Atnaujinti filtruotus produktus pagal paieškos terminą
  useEffect(() => {
    if (productSearchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const searchTermLower = productSearchTerm.toLowerCase();
      const filtered = products.filter(product => {
        const productName = getLocalizedProductName(product).toLowerCase();
        return productName.includes(searchTermLower);
      });
      setFilteredProducts(filtered);
    }
  }, [productSearchTerm, products, i18n.language]);

  // Uždaryti produktų išskleidžiamąjį sąrašą, kai paspaudžiama kitur
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('product-dropdown');
      if (dropdown && !dropdown.contains(event.target)) {
        setIsProductDropdownOpen(false);
      }
    };

    if (isProductDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProductDropdownOpen]);

  // Apdoroti formos įvesties pakeitimus
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Jei pasirenkamas vilkikas, nustatyti įmonę
    if (name === 'truckId' && value) {
      const truckId = parseInt(value);
      console.log('Truck selected with ID:', truckId);
      console.log('Available trucks:', trucks);
      
      const selectedTruck = trucks.find(truck => truck.id === truckId);
      console.log('Selected truck:', selectedTruck);
      
      if (selectedTruck) {
        if (selectedTruck.company) {
          console.log('Company found:', selectedTruck.company);
          setSelectedCompany(selectedTruck.company.name);
        } else if (selectedTruck.companyId) {
          console.log('Company ID found but no company object:', selectedTruck.companyId);
          
          // Gauti kompanijos informaciją pagal ID
          const fetchCompany = async () => {
            try {
              const response = await axios.get(`/api/companies/${selectedTruck.companyId}`);
              if (response.data && response.data.name) {
                console.log('Company data fetched:', response.data);
                setSelectedCompany(response.data.name);
              } else {
                setSelectedCompany(`Įmonė ID: ${selectedTruck.companyId}`);
              }
            } catch (err) {
              console.error('Error fetching company:', err);
              setSelectedCompany(`Įmonė ID: ${selectedTruck.companyId}`);
            }
          };
          
          fetchCompany();
        } else {
          console.log('No company info found for truck');
          setSelectedCompany('');
        }
      } else {
        console.log('Truck not found in trucks array');
        setSelectedCompany('');
      }
    }
  };

  // Pasirinkti produktą iš išskleidžiamojo sąrašo
  const handleProductSelect = (productId) => {
    setFormData({
      ...formData,
      productId: productId
    });
    setIsProductDropdownOpen(false);
  };

  // Pateikti formą
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Konvertuoti reikšmes į tinkamus tipus
      const dataToSend = {
        ...formData,
        productId: parseInt(formData.productId),
        truckId: parseInt(formData.truckId),
        driverId: parseInt(formData.driverId),
        quantity: parseInt(formData.quantity),
        isIssued: Boolean(formData.isIssued)
      };

      console.log('Sending issuance data:', dataToSend);

      if (issuance) {
        // Atnaujinti esamą išdavimą
        await axios.put(`/api/issuances/${issuance.id}`, dataToSend);
      } else {
        // Sukurti naują išdavimą
        await axios.post('/api/issuances', dataToSend);
      }

      onHide(true); // Uždaryti formą ir atnaujinti duomenis
    } catch (err) {
      console.error(t('common.errors.saveFailed'), err);
      setError(t('common.errors.saveFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Gauti pasirinkto produkto pavadinimą
  const getSelectedProductName = () => {
    if (!formData.productId) return t('common.purchases.select_product');
    
    const product = products.find(p => p.id === parseInt(formData.productId));
    if (!product) return t('common.purchases.select_product');
    
    // Find stock information for the selected product
    const productStock = stockData.find(item => item.productId === product.id);
    const stockQuantity = productStock ? productStock.stockInHand : 0;
    
    return `${getLocalizedProductName(product)} (${t('common.inventory.balance')} ${stockQuantity} ${product.unit || t('common.inventory.unit')})`;
  };

  const handleProductSearch = (e) => {
    setProductSearchTerm(e.target.value);
  };

  const handleClose = () => {
    onHide(false);
  };

  // Get the selected driver's name for display
  const getSelectedDriverName = () => {
    if (!formData.driverId) return '';
    const selectedDriver = drivers.find(d => d.id === parseInt(formData.driverId));
    return selectedDriver ? selectedDriver.driver : '';
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
      centered
      className="issuance-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{issuance ? t('common.issuances.edit_issuance') : t('common.issuances.new_issuance')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <div className="error-message">
            {error}
            <button 
              className="btn btn-sm btn-outline-danger ms-3" 
              onClick={() => {
                setDataLoading(true);
                setError(null);
                axios.get('/api/stocks')
                  .then(response => {
                    setStockData(response.data);
                    setDataLoading(false);
                  })
                  .catch(err => {
                    console.error(t('common.errors.fetchFailed'), err);
                    setError(t('common.errors.fetchFailed'));
                    setDataLoading(false);
                  });
              }}
            >
              {t('common.buttons.refresh')}
            </button>
          </div>
        )}
        
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={12} className="mb-3">
              <Form.Group>
                <Form.Label>{t('common.labels.product')} *</Form.Label>
                <div className="custom-dropdown" id="product-dropdown">
                  <div 
                    className="custom-dropdown-header" 
                    onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                  >
                    <div className="selected-product">{getSelectedProductName()}</div>
                    <div className="dropdown-arrow">▼</div>
                  </div>
                  
                  {isProductDropdownOpen && (
                    <div className="custom-dropdown-content" id="product-dropdown">
                      <div className="dropdown-search">
                        <input
                          type="text"
                          placeholder={t('common.search.by_name_id')}
                          value={productSearchTerm}
                          onChange={handleProductSearch}
                        />
                      </div>
                      
                      <div className="products-list">
                        {dataLoading ? (
                          <div className="dropdown-loading">
                            <p>{t('common.messages.loading')}</p>
                          </div>
                        ) : filteredProducts.length > 0 ? (
                          filteredProducts.map(product => (
                            <div
                              key={product.id}
                              className="dropdown-item"
                              onClick={() => handleProductSelect(product.id)}
                            >
                              <span className="product-name">{getLocalizedProductName(product)}</span>
                              <span className="product-stock"> ({t('common.inventory.balance')} {stockData.find(item => item.productId === product.id)?.stockInHand || 0} {product.unit || t('common.inventory.unit')})</span>
                            </div>
                          ))
                        ) : (
                          <div className="no-products">
                            <p>{t('common.messages.no_data')}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <Form.Control
                  type="hidden"
                  name="productId"
                  value={formData.productId}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {t('common.purchases.select_product')}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>{t('common.issuances.issuance_date')} *</Form.Label>
                <Form.Control
                  type="date"
                  name="issuanceDate"
                  value={formData.issuanceDate}
                  onChange={handleInputChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {t('common.errors.required')}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>{t('common.labels.quantity')} ({t('common.inventory.unit')}) *</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {t('common.errors.positiveNumber')}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>{t('common.labels.driver')} *</Form.Label>
                <Form.Select
                  name="driverId"
                  value={formData.driverId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">{t('common.select.driver')}</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.driver} {driver.company ? `(${driver.company.name})` : ''}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {t('common.errors.required')}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>{t('common.labels.truck')} *</Form.Label>
                <Form.Select
                  name="truckId"
                  value={formData.truckId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">{t('common.select.truck')}</option>
                  {trucks.map(truck => (
                    <option key={truck.id} value={truck.id}>
                      {truck.plateNumber || `ID: ${truck.id}`}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {t('common.errors.required')}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>{t('common.labels.company')}</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedCompany || t('common.messages.companyWillBeSelected')}
                  disabled
                  readOnly
                  className={selectedCompany ? "company-selected" : "company-not-selected"}
                />
                <Form.Text className="text-muted">
                  {t('common.labels.company')} {t('common.messages.autoGenerated')}
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>{t('common.labels.issued')}</Form.Label>
                <div>
                  <Form.Check
                    type="checkbox"
                    name="isIssued"
                    label={t('common.labels.issued')}
                    checked={formData.isIssued}
                    onChange={handleInputChange}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12} className="mb-3">
              <Form.Group>
                <Form.Label>{t('common.labels.notes')}</Form.Label>
                <Form.Control
                  as="textarea"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          {t('common.buttons.cancel')}
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? t('common.buttons.saving') : (issuance ? t('common.buttons.update') : t('common.buttons.save'))}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default IssuanceForm;