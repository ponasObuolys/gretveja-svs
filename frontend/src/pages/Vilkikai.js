import React, { useState, useEffect, useCallback } from 'react';
import { Container, Alert, Row, Col, Button } from 'react-bootstrap';
import TruckList from '../components/trucks/TruckList';
import TruckForm from '../components/trucks/TruckForm';
import TruckDeleteModal from '../components/trucks/TruckDeleteModal';
import TruckController from '../controllers/TruckController';
import { sortItems } from '../utils/common';
import { useTranslation } from 'react-i18next';

/**
 * Vilkikų administravimo puslapis
 * @returns {JSX.Element} Vilkikų administravimo puslapio komponentas
 */
function Vilkikai() {
  const { t } = useTranslation();
  // Būsenos kintamieji
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trucks, setTrucks] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [truckSearch, setTruckSearch] = useState('');
  const [truckSort, setTruckSort] = useState({ field: 'plateNumber', direction: 'asc' });
  
  // Vilkiko formos būsenos kintamieji
  const [showTruckForm, setShowTruckForm] = useState(false);
  const [currentTruck, setCurrentTruck] = useState(null);
  const [truckFormData, setTruckFormData] = useState({
    plateNumber: '',
    companyId: ''
  });
  
  // Vilkiko ištrynimo būsenos kintamieji
  const [showDeleteTruckModal, setShowDeleteTruckModal] = useState(false);
  const [truckToDelete, setTruckToDelete] = useState(null);
  
  // Duomenų užkrovimo funkcija su useCallback
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Užkrauna duomenis lygiagrečiai
      const trucksResult = await TruckController.fetchTrucksWithCompanies();
      const companiesResult = await TruckController.fetchCompanies();
      
      setTrucks(Array.isArray(trucksResult) ? trucksResult : []);
      setCompanies(Array.isArray(companiesResult) ? companiesResult : []);
    } catch (err) {
      console.error('Error fetching data:', err);
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
   * @param {string} category - Kategorija (trucks)
   * @param {string} field - Laukelis, pagal kurį rūšiuojama
   */
  const handleSort = (category, field) => {
    TruckController.handleSort(truckSort, field, setTruckSort);
  };
  
  /**
   * Atidaro vilkiko pridėjimo formą
   */
  const handleAddTruck = () => {
    setCurrentTruck(null);
    setTruckFormData({
      plateNumber: '',
      companyId: companies.length > 0 ? companies[0].id.toString() : ''
    });
    setShowTruckForm(true);
  };
  
  /**
   * Atidaro vilkiko redagavimo formą
   * @param {Object} truck - Vilkiko objektas
   */
  const handleEditTruck = (truck) => {
    if (!truck) return;
    
    setCurrentTruck(truck);
    setTruckFormData({
      plateNumber: truck.plateNumber || '',
      companyId: truck.companyId ? truck.companyId.toString() : ''
    });
    setShowTruckForm(true);
  };
  
  /**
   * Tvarko vilkiko formos įvesties pakeitimus
   * @param {Object} e - Įvykio objektas
   */
  const handleTruckInputChange = (e) => {
    const { name, value } = e.target;
    setTruckFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  /**
   * Išsaugo vilkiką
   * @param {Object} e - Įvykio objektas 
   */
  const handleSaveTruck = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (currentTruck) {
        // Atnaujinti esamą vilkiką
        await TruckController.updateTruck(currentTruck.id, truckFormData);
      } else {
        // Sukurti naują vilkiką
        await TruckController.createTruck(truckFormData);
      }
      
      await fetchData();
      setShowTruckForm(false);
    } catch (err) {
      console.error('Error saving truck:', err);
      setError(t('common.errors.saveFailed'));
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Atidaro vilkiko ištrynimo patvirtinimo modalą
   * @param {Object} truck - Vilkiko objektas
   */
  const handleDeleteTruckClick = (truck) => {
    if (!truck) return;
    
    setTruckToDelete(truck);
    setShowDeleteTruckModal(true);
  };
  
  /**
   * Ištrina vilkiką
   */
  const handleDeleteTruck = async () => {
    if (!truckToDelete) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await TruckController.deleteTruck(truckToDelete.id);
      setTrucks(trucks.filter(t => t.id !== truckToDelete.id));
      setShowDeleteTruckModal(false);
      setTruckToDelete(null);
    } catch (err) {
      console.error('Error deleting truck:', err);
      setError(t('common.errors.deleteFailed'));
    } finally {
      setLoading(false);
    }
  };
  
  // Filtruoti ir rūšiuoti vilkikus
  const filteredTrucks = sortItems(
    TruckController.filterTrucks(trucks, truckSearch),
    truckSort
  );
  
  return (
    <Container className="admin-container">
      <h1 className="text-center my-4">{t('common.admin.trucks')}</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="mb-3">
        <Col>
          <Button 
            variant="primary" 
            onClick={handleAddTruck}
            disabled={loading}
          >
            {t('common.buttons.add')} {t('common.entities.truck')}
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
      
      <TruckList
        trucks={filteredTrucks}
        truckSearch={truckSearch}
        setTruckSearch={setTruckSearch}
        truckSort={truckSort}
        handleSort={handleSort}
        handleEditTruck={handleEditTruck}
        handleDeleteTruckClick={handleDeleteTruckClick}
        loading={loading}
      />
      
      <TruckForm
        showTruckForm={showTruckForm}
        setShowTruckForm={setShowTruckForm}
        currentTruck={currentTruck}
        truckFormData={truckFormData}
        handleTruckInputChange={handleTruckInputChange}
        handleSaveTruck={handleSaveTruck}
        companies={companies}
        loading={loading}
      />
      
      <TruckDeleteModal
        showDeleteTruckModal={showDeleteTruckModal}
        setShowDeleteTruckModal={setShowDeleteTruckModal}
        truckToDelete={truckToDelete}
        handleDeleteTruck={handleDeleteTruck}
        loading={loading}
      />
    </Container>
  );
}

export default Vilkikai;