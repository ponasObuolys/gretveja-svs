import React, { useState, useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap';
import SupplierList from '../components/suppliers/SupplierList';
import SupplierForm from '../components/suppliers/SupplierForm';
import SupplierDeleteModal from '../components/suppliers/SupplierDeleteModal';
import SupplierController from '../controllers/SupplierController';
import { sortItems } from '../utils/common';

/**
 * Tiekėjų administravimo puslapis
 * @returns {JSX.Element} Tiekėjų administravimo puslapio komponentas
 */
function Tiekejai() {
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
  
  // Duomenų užkrovimas
  useEffect(() => {
    fetchData();
  }, []);
  
  /**
   * Užkrauna tiekėjų duomenis
   */
  const fetchData = async () => {
    await SupplierController.fetchSuppliers(setLoading, setSuppliers, setError);
  };
  
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
    setCurrentSupplier(supplier);
    setSupplierFormData({
      name: supplier.name,
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
    setSupplierFormData({
      ...supplierFormData,
      [name]: value
    });
  };
  
  /**
   * Išsaugo tiekėją
   * @param {Object} e - Įvykio objektas 
   */
  const handleSaveSupplier = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (currentSupplier) {
        // Atnaujinti esamą tiekėją
        await SupplierController.updateSupplier(
          currentSupplier.id, 
          supplierFormData, 
          setLoading, 
          setError,
          () => {
            fetchData();
            setShowSupplierForm(false);
          }
        );
      } else {
        // Sukurti naują tiekėją
        await SupplierController.createSupplier(
          supplierFormData, 
          setLoading, 
          setError,
          () => {
            fetchData();
            setShowSupplierForm(false);
          }
        );
      }
    } catch (err) {
      console.error('Klaida išsaugant tiekėją:', err);
      setError('Nepavyko išsaugoti tiekėjo. Bandykite dar kartą vėliau.');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Atidaro tiekėjo ištrynimo patvirtinimo modalą
   * @param {Object} supplier - Tiekėjo objektas
   */
  const handleDeleteSupplierClick = (supplier) => {
    setSupplierToDelete(supplier);
    setShowDeleteSupplierModal(true);
  };
  
  /**
   * Ištrina tiekėją
   */
  const handleDeleteSupplier = async () => {
    try {
      setLoading(true);
      
      await SupplierController.deleteSupplier(
        supplierToDelete.id,
        setLoading,
        setError,
        () => {
          setSuppliers(suppliers.filter(s => s.id !== supplierToDelete.id));
          setShowDeleteSupplierModal(false);
          setSupplierToDelete(null);
        }
      );
    } catch (err) {
      console.error('Klaida ištrinant tiekėją:', err);
      setError('Nepavyko ištrinti tiekėjo. Bandykite dar kartą vėliau.');
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
      <h1 className="text-center my-4">Tiekėjų administravimas</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* Tiekėjų sąrašas */}
      <SupplierList
        suppliers={suppliers}
        supplierSearch={supplierSearch}
        setSupplierSearch={setSupplierSearch}
        supplierSort={supplierSort}
        handleSort={handleSort}
        handleAddSupplier={handleAddSupplier}
        handleEditSupplier={handleEditSupplier}
        handleDeleteSupplierClick={handleDeleteSupplierClick}
        loading={loading}
        filteredSuppliers={filteredSuppliers}
      />
      
      {/* Tiekėjo forma */}
      <SupplierForm
        showSupplierForm={showSupplierForm}
        setShowSupplierForm={setShowSupplierForm}
        currentSupplier={currentSupplier}
        supplierFormData={supplierFormData}
        handleSupplierInputChange={handleSupplierInputChange}
        handleSaveSupplier={handleSaveSupplier}
        loading={loading}
      />
      
      {/* Tiekėjo ištrynimo patvirtinimo modalas */}
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