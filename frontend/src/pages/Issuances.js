import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form, Alert, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './Issuances.css';
import IssuanceForm from '../components/IssuanceForm';

function Issuances() {
  const { t, i18n } = useTranslation();
  const [issuances, setIssuances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentIssuance, setCurrentIssuance] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [issuanceToDelete, setIssuanceToDelete] = useState(null);
  
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

  // Helper function to get product name based on current language
  const getLocalizedProductName = (issuance) => {
    if (!issuance || !issuance.product) return t('common.messages.no_data');
    
    const product = issuance.product;
    const currentLanguage = i18n.language;
    
    // First check camelCase properties (frontend format)
    if (currentLanguage === 'en') {
      if (product.nameEn) return product.nameEn;
    } else if (currentLanguage === 'ru') {
      if (product.nameRu) return product.nameRu;
    }
    
    // Then check snake_case properties (backend format)
    if (currentLanguage === 'en') {
      if (product.name_en) return product.name_en;
    } else if (currentLanguage === 'ru') {
      if (product.name_ru) return product.name_ru;
    }
    
    // Default to Lithuanian name (could be either name or name_lt)
    return product.name || product.name_lt || t('common.messages.no_data');
  };

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
            {t('common.issuances.export_csv')}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleExport('xlsx')}>
            {t('common.issuances.export_xlsx')}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleExport('pdf')}>
            {t('common.issuances.export_pdf')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  // Gauti visus išdavimus
  const fetchIssuances = async () => {
    try {
      setLoading(true);
      
      // Sukurti URL su filtrais
      let url = '/api/issuances';
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
      
      const response = await axios.get(url);
      
      // Gauti produktų duomenis su vertimais (jei reikia)
      let issuancesData = response.data;
      
      // Patikrinti, ar yra bent vienam produktui trūksta nameEn ar nameRu laukų
      const needsProductTranslations = issuancesData.some(issuance => 
        issuance.product && (!issuance.product.nameEn || !issuance.product.nameRu)
      );
      
      // Jei reikia, gauti išsamius produktų duomenis
      if (needsProductTranslations) {
        try {
          const productsResponse = await axios.get('/api/products');
          const productsData = productsResponse.data;
          
          // Papildyti išdavimų produktų duomenis vertimais
          issuancesData = issuancesData.map(issuance => {
            if (issuance.product && issuance.productId) {
              const matchingProduct = productsData.find(p => p.id === issuance.productId);
              if (matchingProduct) {
                return {
                  ...issuance,
                  product: {
                    ...issuance.product,
                    nameEn: matchingProduct.nameEn || issuance.product.nameEn || issuance.product.name,
                    nameRu: matchingProduct.nameRu || issuance.product.nameRu || issuance.product.name
                  }
                };
              }
            }
            return issuance;
          });
        } catch (err) {
          console.error('Klaida gaunant produktų duomenis:', err);
          // Tęsti su esamais duomenimis, net jei nepavyko gauti vertimų
        }
      }
      
      setIssuances(issuancesData);
      setError(null);
    } catch (err) {
      console.error('Klaida gaunant išdavimus:', err);
      setError('Nepavyko gauti išdavimų. Bandykite dar kartą vėliau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssuances();
  }, [selectedYear, selectedMonth]);
  
  // Atnaujinti komponentą, kai pasikeičia kalba
  useEffect(() => {
    // Forsuoti komponento atnaujinimą, kai pasikeičia kalba
    // (Produktų pavadinimai turi reaguoti į kalbos pakeitimą)
    const newIssuances = [...issuances];
    setIssuances(newIssuances);
  }, [i18n.language]);

  // Atidaryti formą naujo išdavimo sukūrimui
  const handleAddNew = () => {
    setCurrentIssuance(null);
    setShowForm(true);
  };

  // Atidaryti formą išdavimo redagavimui
  const handleEdit = (issuance) => {
    setCurrentIssuance(issuance);
    setShowForm(true);
  };

  // Atidaryti ištrynimo patvirtinimo modalą
  const handleDeleteClick = (issuance) => {
    setIssuanceToDelete(issuance);
    setShowDeleteModal(true);
  };

  // Ištrinti išdavimą
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/issuances/${issuanceToDelete.id}`);
      setIssuances(issuances.filter(i => i.id !== issuanceToDelete.id));
      setShowDeleteModal(false);
      setIssuanceToDelete(null);
    } catch (err) {
      console.error('Klaida ištrinant išdavimą:', err);
      setError('Nepavyko ištrinti išdavimo. Bandykite dar kartą vėliau.');
    }
  };

  // Atsisiųsti PDF anglų kalba
  const handleDownloadPdfEnglish = async (issuance) => {
    try {
      const response = await axios.get(`/api/issuances/${issuance.id}/pdf/en`, {
        responseType: 'blob'
      });
      
      // Sukurti laikinąją nuorodą ir atsisiųsti failą
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `issuance_en_${issuance.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Klaida atsisiunčiant PDF:', err);
      setError('Nepavyko atsisiųsti PDF. Bandykite dar kartą vėliau.');
    }
  };

  // Atsisiųsti PDF rusų kalba
  const handleDownloadPdfRussian = async (issuance) => {
    try {
      const response = await axios.get(`/api/issuances/${issuance.id}/pdf/ru`, {
        responseType: 'blob'
      });
      
      // Sukurti laikinąją nuorodą ir atsisiųsti failą
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `issuance_ru_${issuance.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Klaida atsisiunčiant PDF:', err);
      setError('Nepavyko atsisiųsti PDF. Bandykite dar kartą vėliau.');
    }
  };

  // Eksportuoti duomenis
  const handleExport = async (format) => {
    try {
      // Sukurti URL su filtrais
      let exportUrl = `/api/issuances/export/${format}`;
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
      let filename = 'issuances';
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
  
  // Uždaryti formą ir atnaujinti duomenis
  const handleFormClose = (refreshData = false) => {
    setShowForm(false);
    if (refreshData) {
      fetchIssuances();
    }
  };

  // Formatuoti datą
  const formatDate = (dateString) => {
    if (!dateString) return t('common.messages.no_data');
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return t('common.messages.no_data');
    }
    
    return date.toLocaleDateString('lt-LT');
  };

  return (
    <div className="issuances-container">
      <h1>{t('common.tables.issuances')}</h1>
      
      <FilterComponent />
      
      <div className="action-buttons">
        <ExportButtons />
        <Button 
          className="btn-add-issuance" 
          onClick={handleAddNew}
        >
          {t('common.issuances.new_issuance')}
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="loading-spinner">{t('common.messages.loading')}</div>
      ) : (
        <>
          {issuances.length === 0 ? (
            <div className="no-data-message">
              {t('common.messages.no_data')}
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>{t('common.issuances.issuance_date')}</th>
                    <th>{t('common.labels.product')}</th>
                    <th>{t('common.labels.quantity')}</th>
                    <th>{t('common.issuances.driver_name')}</th>
                    <th>{t('common.issuances.plate_number')}</th>
                    <th>{t('common.issuances.company')}</th>
                    <th>{t('common.labels.status')}</th>
                    <th>{t('common.labels.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {issuances.map((issuance) => (
                    <tr key={issuance.id}>
                      <td>{formatDate(issuance.issuanceDate)}</td>
                      <td>{getLocalizedProductName(issuance)}</td>
                      <td>{issuance.quantity} {issuance.product?.unit || ''}</td>
                      <td>{issuance.driverName}</td>
                      <td>{issuance.truck?.plateNumber || t('common.messages.no_data')}</td>
                      <td>{issuance.truck?.company?.name || t('common.messages.no_data')}</td>
                      <td>
                        <span className={`status-badge ${issuance.isIssued ? 'issued' : 'not-issued'}`}>
                          {issuance.isIssued ? t('common.issuances.is_issued') : t('common.issuances.not_issued')}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => handleEdit(issuance)}
                          className="action-button"
                        >
                          {t('common.buttons.edit')}
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => handleDeleteClick(issuance)}
                          className="action-button"
                        >
                          {t('common.buttons.delete')}
                        </Button>
                        <Button 
                          variant="info"
                          size="sm"
                          onClick={() => handleDownloadPdfEnglish(issuance)}
                          className="action-button"
                          style={{ marginRight: '5px' }}
                        >
                          PDF Eng
                        </Button>
                        <Button 
                          variant="info"
                          size="sm"
                          onClick={() => handleDownloadPdfRussian(issuance)}
                          className="action-button"
                        >
                          PDF Rus
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* Išdavimo forma */}
      <IssuanceForm 
        show={showForm} 
        onHide={handleFormClose} 
        issuance={currentIssuance} 
      />

      {/* Ištrynimo patvirtinimo modalas */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('common.issuances.delete_issuance')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t('common.issuances.confirm_delete')}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            {t('common.buttons.cancel')}
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            {t('common.buttons.delete')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Issuances;