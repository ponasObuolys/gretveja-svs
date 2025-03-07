import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import './IssuanceForm.css';

function IssuanceForm({ show, onHide, issuance }) {
  const initialFormState = {
    productId: '',
    isIssued: false,
    issuanceDate: new Date().toISOString().split('T')[0],
    quantity: 1,
    driverName: '',
    truckId: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [products, setProducts] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Gauti produktus ir vilkikus
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, trucksResponse] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/trucks?include=company')
        ]);
        setProducts(productsResponse.data);
        setFilteredProducts(productsResponse.data);
        setTrucks(trucksResponse.data);
      } catch (err) {
        console.error('Klaida gaunant duomenis:', err);
        setError('Nepavyko gauti duomenų. Bandykite dar kartą vėliau.');
      }
    };

    if (show) {
      fetchData();
    }
  }, [show]);

  // Nustatyti formos duomenis, kai atidaroma redagavimo forma
  useEffect(() => {
    if (issuance) {
      setFormData({
        productId: issuance.productId || '',
        isIssued: issuance.isIssued || false,
        issuanceDate: new Date(issuance.issuanceDate).toISOString().split('T')[0],
        quantity: issuance.quantity || 1,
        driverName: issuance.driverName || '',
        truckId: issuance.truckId || '',
        notes: issuance.notes || ''
      });

      // Nustatyti įmonę pagal vilkiką
      if (issuance.truck && issuance.truck.company) {
        setSelectedCompany(issuance.truck.company.name);
      }
    } else {
      setFormData(initialFormState);
      setSelectedCompany('');
    }
    setValidated(false);
    setError(null);
  }, [issuance, show]);

  // Atnaujinti filtruotus produktus pagal paieškos terminą
  useEffect(() => {
    if (productSearchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const searchTermLower = productSearchTerm.toLowerCase();
      const filtered = products.filter(product => 
        product.code.toLowerCase().includes(searchTermLower) || 
        product.name.toLowerCase().includes(searchTermLower)
      );
      setFilteredProducts(filtered);
    }
  }, [productSearchTerm, products]);

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
      const selectedTruck = trucks.find(truck => truck.id === parseInt(value));
      if (selectedTruck && selectedTruck.company) {
        setSelectedCompany(selectedTruck.company.name);
      } else {
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
        quantity: parseInt(formData.quantity)
      };

      if (issuance) {
        // Atnaujinti esamą išdavimą
        await axios.put(`/api/issuances/${issuance.id}`, dataToSend);
      } else {
        // Sukurti naują išdavimą
        await axios.post('/api/issuances', dataToSend);
      }

      onHide(true); // Uždaryti formą ir atnaujinti duomenis
    } catch (err) {
      console.error('Klaida išsaugant išdavimą:', err);
      setError('Nepavyko išsaugoti išdavimo. Bandykite dar kartą vėliau.');
    } finally {
      setLoading(false);
    }
  };

  // Gauti pasirinkto produkto pavadinimą
  const getSelectedProductName = () => {
    if (!formData.productId) return 'Pasirinkite produktą';
    const product = products.find(p => p.id === parseInt(formData.productId));
    return product ? `${product.code} - ${product.name}` : 'Pasirinkite produktą';
  };

  return (
    <Modal
      show={show}
      onHide={() => onHide(false)}
      backdrop="static"
      keyboard={false}
      size="lg"
      centered
      dialogClassName="issuance-modal"
      contentClassName="modal-content"
      animation={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>{issuance ? 'Redaguoti išdavimą' : 'Naujas išdavimas'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={12} className="mb-3">
              <Form.Group>
                <Form.Label>Produktas *</Form.Label>
                <div className="custom-dropdown" id="product-dropdown">
                  <div 
                    className="custom-dropdown-header" 
                    onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                  >
                    <div className="selected-product">{getSelectedProductName()}</div>
                    <div className="dropdown-arrow">▼</div>
                  </div>
                  
                  {isProductDropdownOpen && (
                    <div className="custom-dropdown-content">
                      <div className="search-container">
                        <input
                          type="text"
                          placeholder="Ieškoti produkto..."
                          value={productSearchTerm}
                          onChange={(e) => setProductSearchTerm(e.target.value)}
                          className="search-input"
                        />
                      </div>
                      <div className="products-list">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map(product => (
                            <div 
                              key={product.id} 
                              className="product-item"
                              onClick={() => handleProductSelect(product.id)}
                            >
                              <span className="product-code">{product.code}</span>
                              <span className="product-name">{product.name}</span>
                            </div>
                          ))
                        ) : (
                          <div className="no-products">Produktų nerasta</div>
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
                  Pasirinkite produktą
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Išdavimo data *</Form.Label>
                <Form.Control
                  type="date"
                  name="issuanceDate"
                  value={formData.issuanceDate}
                  onChange={handleInputChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Įveskite išdavimo datą
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Kiekis (VNT) *</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Įveskite teigiamą kiekį
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Vairuotojas *</Form.Label>
                <Form.Control
                  type="text"
                  name="driverName"
                  value={formData.driverName}
                  onChange={handleInputChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Įveskite vairuotojo vardą
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Vilkikas *</Form.Label>
                <Form.Select
                  name="truckId"
                  value={formData.truckId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Pasirinkite vilkiką</option>
                  {trucks.map(truck => (
                    <option key={truck.id} value={truck.id}>
                      {truck.plateNumber} {truck.model ? `(${truck.model})` : ''}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Pasirinkite vilkiką
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Įmonė</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedCompany}
                  disabled
                  readOnly
                />
                <Form.Text className="text-muted">
                  Įmonė nustatoma automatiškai pagal pasirinktą vilkiką
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label>Išduota?</Form.Label>
                <div>
                  <Form.Check
                    type="checkbox"
                    name="isIssued"
                    label="Taip, prekės išduotos"
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
                <Form.Label>Pastabos</Form.Label>
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
        <Button variant="secondary" onClick={() => onHide(false)} disabled={loading}>
          Atšaukti
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saugoma...' : (issuance ? 'Atnaujinti' : 'Išsaugoti')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default IssuanceForm; 