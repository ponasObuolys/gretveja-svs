import React, { useState, useEffect, useCallback } from 'react';
import { Container, Alert, Row, Col, Button } from 'react-bootstrap';
import DriverList from '../components/drivers/DriverList';
import DriverForm from '../components/drivers/DriverForm';
import DriverDeleteModal from '../components/drivers/DriverDeleteModal';
import DriverController from '../controllers/DriverController';
import { sortItems } from '../utils/common';
import { useTranslation } from 'react-i18next';

/**
 * Vairuotojų administravimo puslapis
 * @returns {JSX.Element} Vairuotojų administravimo puslapio komponentas
 */
function Vairuotojai() {
  const { t } = useTranslation();
  // Būsenos kintamieji
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [driverSearch, setDriverSearch] = useState('');
  const [driverSort, setDriverSort] = useState({ field: 'driver', direction: 'asc' });
  
  // Vairuotojo formos būsenos kintamieji
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [driverFormData, setDriverFormData] = useState({
    driver: '',
    companyId: ''
  });
  
  // Vairuotojo ištrynimo būsenos kintamieji
  const [showDeleteDriverModal, setShowDeleteDriverModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);
  
  // Duomenų užkrovimo funkcija su useCallback
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Užkrauna duomenis lygiagrečiai
      const driversResult = await DriverController.fetchDriversWithCompanies();
      const companiesResult = await DriverController.fetchCompanies();
      
      setDrivers(Array.isArray(driversResult) ? driversResult : []);
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
   * @param {string} category - Kategorija (drivers)
   * @param {string} field - Laukelis, pagal kurį rūšiuojama
   */
  const handleSort = (category, field) => {
    DriverController.handleSort(driverSort, field, setDriverSort);
  };
  
  /**
   * Atidaro vairuotojo pridėjimo formą
   */
  const handleAddDriver = () => {
    setCurrentDriver(null);
    setDriverFormData({
      driver: '',
      companyId: companies.length > 0 ? companies[0].id.toString() : ''
    });
    setShowDriverForm(true);
  };
  
  /**
   * Atidaro vairuotojo redagavimo formą
   * @param {Object} driver - Vairuotojo objektas
   */
  const handleEditDriver = (driver) => {
    if (!driver) return;
    
    setCurrentDriver(driver);
    setDriverFormData({
      driver: driver.driver || '',
      companyId: driver.companyId ? driver.companyId.toString() : ''
    });
    setShowDriverForm(true);
  };
  
  /**
   * Tvarko vairuotojo formos įvesties pakeitimus
   * @param {Object} e - Įvykio objektas
   */
  const handleDriverInputChange = (e) => {
    const { name, value } = e.target;
    setDriverFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  /**
   * Išsaugo vairuotoją
   * @param {Object} e - Įvykio objektas 
   */
  const handleSaveDriver = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (currentDriver) {
        // Atnaujinti esamą vairuotoją
        await DriverController.updateDriver(currentDriver.id, driverFormData);
      } else {
        // Sukurti naują vairuotoją
        await DriverController.createDriver(driverFormData);
      }
      
      await fetchData();
      setShowDriverForm(false);
    } catch (err) {
      console.error('Error saving driver:', err);
      setError(t('common.errors.saveFailed'));
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Atidaro vairuotojo ištrynimo patvirtinimo modalą
   * @param {Object} driver - Vairuotojo objektas
   */
  const handleDeleteDriverClick = (driver) => {
    if (!driver) return;
    
    setDriverToDelete(driver);
    setShowDeleteDriverModal(true);
  };
  
  /**
   * Ištrina vairuotoją
   */
  const handleDeleteDriver = async () => {
    if (!driverToDelete) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await DriverController.deleteDriver(driverToDelete.id);
      setDrivers(drivers.filter(d => d.id !== driverToDelete.id));
      setShowDeleteDriverModal(false);
      setDriverToDelete(null);
    } catch (err) {
      console.error('Error deleting driver:', err);
      setError(t('common.errors.deleteFailed'));
    } finally {
      setLoading(false);
    }
  };
  
  // Filtruoti ir rūšiuoti vairuotojus
  const filteredDrivers = sortItems(
    DriverController.filterDrivers(drivers, driverSearch),
    driverSort
  );
  
  return (
    <Container className="admin-container">
      <h1 className="text-center my-4">{t('common.admin.drivers')}</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="mb-3">
        <Col>
          <Button 
            variant="primary" 
            onClick={handleAddDriver}
            disabled={loading}
          >
            {t('common.buttons.add')} {t('common.entities.driver')}
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
      
      <DriverList
        drivers={filteredDrivers}
        driverSearch={driverSearch}
        setDriverSearch={setDriverSearch}
        driverSort={driverSort}
        handleSort={handleSort}
        handleEditDriver={handleEditDriver}
        handleDeleteDriverClick={handleDeleteDriverClick}
        loading={loading}
      />
      
      <DriverForm
        showDriverForm={showDriverForm}
        setShowDriverForm={setShowDriverForm}
        currentDriver={currentDriver}
        driverFormData={driverFormData}
        handleDriverInputChange={handleDriverInputChange}
        handleSaveDriver={handleSaveDriver}
        companies={companies}
        loading={loading}
      />
      
      <DriverDeleteModal
        showDeleteDriverModal={showDeleteDriverModal}
        setShowDeleteDriverModal={setShowDeleteDriverModal}
        driverToDelete={driverToDelete}
        handleDeleteDriver={handleDeleteDriver}
        loading={loading}
      />
    </Container>
  );
}

export default Vairuotojai;
