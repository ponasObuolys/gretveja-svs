import React, { useState, useEffect, useCallback } from 'react';
import { Container, Alert, Row, Col, Button } from 'react-bootstrap';
import SupplierList from '../components/suppliers/SupplierList';
import SupplierForm from '../components/suppliers/SupplierForm';
import SupplierDeleteModal from '../components/suppliers/SupplierDeleteModal';
import SupplierController from '../controllers/SupplierController';
import { sortItems } from '../utils/common';
import { useTranslation } from 'react-i18next';

/**
 * Tiekėjų administravimo puslapis
 * @returns {JSX.Element} Tiekėjų administravimo puslapio komponentas
 */
function Tiekejai() {
  const { t } = useTranslation();
  // Būsenos kintamieji
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [supplierSort, setSupplierSort] = useState({ field: 'name', direction: 'asc' });
  
  // Tiekėjo formos būsenos kintamieji
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [supplierFormData, setSupplierFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: ''
  });
  
  // Tiekėjo ištrynimo būsenos kintamieji
  const [showDeleteSupplierModal, setShowDeleteSupplierModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  
  // Duomenų užkrovimo funkcija su useCallback
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const suppliersResult = await SupplierController.fetchSuppliers();
      setSuppliers(Array.isArray(suppliersResult) ? suppliersResult : []);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError(t('common.errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);
  
  // Duomenų užkrovimas
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  /**
   * Tvarko rūšiavimo keitimą
   * @param {string} category - Kategorija (suppliers)
   * @param {string} field - Laukelis, pagal kurį rūšiuojama
   */
  const handleSort = (category, field) => {
    SupplierController.handleSort(supplierSort, field, setSupplierSort);
  };
  
  /**
   * Atidaro tiekėjo pridėjimo formą
   */
  const handleAddSupplier = () => {
    setCurrentSupplier(null);
    setSupplierFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: ''
    });
    setShowSupplierForm(true);
  };
  
  /**
   * Atidaro tiekėjo redagavimo formą
   * @param {Object} supplier - Tiekėjo objektas
   */
  const handleEditSupplier = (supplier) => {
    if (!supplier) return;
    
    setCurrentSupplier(supplier);
    setSupplierFormData({
      name: supplier.name || '',
      contactPerson: supplier.contactPerson || '',
      phone: supplier.phone || '',
      email: supplier.email || ''
    });
    setShowSupplierForm(true);
  };
  
  /**
   * Tvarko tiekėjo formos įvesties pakeitimus
   * @param {Object} e - Įvykio objektas
   */
  const handleSupplierInputChange = (e) => {
    const { name, value } = e.target;
    setSupplierFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  /**
   * Išsaugo tiekėją
   * @param {Object} e - Įvykio objektas 
   */
  const handleSaveSupplier = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (currentSupplier) {
        // Atnaujinti esamą tiekėją
        await SupplierController.updateSupplier(currentSupplier.id, supplierFormData);
      } else {
        // Sukurti naują tiekėją
        await SupplierController.createSupplier(supplierFormData);
      }
      
      await fetchData();
      setShowSupplierForm(false);
    } catch (err) {
      console.error('Error saving supplier:', err);
      setError(t('common.errors.saveFailed'));
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Atidaro tiekėjo ištrynimo patvirtinimo modalą
   * @param {Object} supplier - Tiekėjo objektas
   */
  const handleDeleteSupplierClick = (supplier) => {
    if (!supplier) return;
    
    setSupplierToDelete(supplier);
    setShowDeleteSupplierModal(true);
  };
  
  /**
   * Ištrina tiekėją
   */
  const handleDeleteSupplier = async () => {
    if (!supplierToDelete) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await SupplierController.deleteSupplier(supplierToDelete.id);
      setSuppliers(suppliers.filter(s => s.id !== supplierToDelete.id));
      setShowDeleteSupplierModal(false);
      setSupplierToDelete(null);
    } catch (err) {
      console.error('Error deleting supplier:', err);
      setError(t('common.errors.deleteFailed'));
    } finally {
      setLoading(false);
    }
  };
  
  // Filtruoti ir rūšiuoti tiekėjus
  const filteredSuppliers = sortItems(
    SupplierController.filterSuppliers(suppliers, supplierSearch),
    supplierSort
  );
  
  return (
    <Container className="admin-container">
      <h1 className="text-center my-4">{t('common.tables.suppliers')}</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="mb-3">
        <Col>
          <Button 
            variant="primary" 
            onClick={handleAddSupplier}
            disabled={loading}
          >
            {t('common.buttons.add')} {t('common.labels.supplier')}
          </Button>
        </Col>
        <Col className="text-end">
          <Button 
            variant="secondary" 
            onClick={fetchData}
            disabled={loading}
          >
            {t('common.buttons.refresh')}
          </Button>
        </Col>
      </Row>
      
      <SupplierList
        suppliers={filteredSuppliers}
        supplierSearch={supplierSearch}
        setSupplierSearch={setSupplierSearch}
        supplierSort={supplierSort}
        handleSort={handleSort}
        handleEditSupplier={handleEditSupplier}
        handleDeleteSupplierClick={handleDeleteSupplierClick}
        loading={loading}
        filteredSuppliers={filteredSuppliers}
      />
      
      <SupplierForm
        showSupplierForm={showSupplierForm}
        setShowSupplierForm={setShowSupplierForm}
        currentSupplier={currentSupplier}
        supplierFormData={supplierFormData}
        handleSupplierInputChange={handleSupplierInputChange}
        handleSaveSupplier={handleSaveSupplier}
        loading={loading}
      />
      
      <SupplierDeleteModal
        showDeleteSupplierModal={showDeleteSupplierModal}
        setShowDeleteSupplierModal={setShowDeleteSupplierModal}
        supplierToDelete={supplierToDelete}
        handleDeleteSupplier={handleDeleteSupplier}
        loading={loading}
      />
    </Container>
  );
}

export default Tiekejai;