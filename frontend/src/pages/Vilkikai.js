import React, { useState, useEffect } from 'react';
import { Container, Alert, Tab } from 'react-bootstrap';
import TruckList from '../components/trucks/TruckList';
import TruckForm from '../components/trucks/TruckForm';
import TruckDeleteModal from '../components/trucks/TruckDeleteModal';
import TruckController from '../controllers/TruckController';
import { sortItems } from '../utils/common';

/**
 * Vilkikų administravimo puslapis
 * @returns {JSX.Element} Vilkikų administravimo puslapio komponentas
 */
function Vilkikai() {
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
    model: '',
    companyId: ''
  });
  
  // Vilkiko ištrynimo būsenos kintamieji
  const [showDeleteTruckModal, setShowDeleteTruckModal] = useState(false);
  const [truckToDelete, setTruckToDelete] = useState(null);
  
  // Duomenų užkrovimas
  useEffect(() => {
    fetchData();
  }, []);
  
  /**
   * Užkrauna vilkikų ir įmonių duomenis
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Užkrauna duomenis lygiagrečiai
      await Promise.all([
        TruckController.fetchTrucksWithCompanies(setLoading, setTrucks, setError),
        TruckController.fetchCompanies(setLoading, setCompanies, setError)
      ]);
      
      setError(null);
    } catch (err) {
      console.error('Klaida gaunant duomenis:', err);
      setError('Nepavyko gauti duomenų. Bandykite dar kartą vėliau.');
    } finally {
      setLoading(false);
    }
  };
  
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
      model: '',
      companyId: ''
    });
    setShowTruckForm(true);
  };
  
  /**
   * Atidaro vilkiko redagavimo formą
   * @param {Object} truck - Vilkiko objektas
   */
  const handleEditTruck = (truck) => {
    setCurrentTruck(truck);
    setTruckFormData({
      plateNumber: truck.plateNumber,
      model: truck.model || '',
      companyId: truck.companyId
    });
    setShowTruckForm(true);
  };
  
  /**
   * Tvarko vilkiko formos įvesties pakeitimus
   * @param {Object} e - Įvykio objektas
   */
  const handleTruckInputChange = (e) => {
    const { name, value } = e.target;
    setTruckFormData({
      ...truckFormData,
      [name]: value
    });
  };
  
  /**
   * Išsaugo vilkiką
   * @param {Object} e - Įvykio objektas 
   */
  const handleSaveTruck = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (currentTruck) {
        // Atnaujinti esamą vilkiką
        await TruckController.updateTruck(
          currentTruck.id, 
          truckFormData, 
          setLoading, 
          setError,
          () => {
            fetchData();
            setShowTruckForm(false);
          }
        );
      } else {
        // Sukurti naują vilkiką
        await TruckController.createTruck(
          truckFormData, 
          setLoading, 
          setError,
          () => {
            fetchData();
            setShowTruckForm(false);
          }
        );
      }
    } catch (err) {
      console.error('Klaida išsaugant vilkiką:', err);
      setError('Nepavyko išsaugoti vilkiko. Bandykite dar kartą vėliau.');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Atidaro vilkiko ištrynimo patvirtinimo modalą
   * @param {Object} truck - Vilkiko objektas
   */
  const handleDeleteTruckClick = (truck) => {
    setTruckToDelete(truck);
    setShowDeleteTruckModal(true);
  };
  
  /**
   * Ištrina vilkiką
   */
  const handleDeleteTruck = async () => {
    try {
      setLoading(true);
      
      await TruckController.deleteTruck(
        truckToDelete.id,
        setLoading,
        setError,
        () => {
          setTrucks(trucks.filter(t => t.id !== truckToDelete.id));
          setShowDeleteTruckModal(false);
          setTruckToDelete(null);
        }
      );
    } catch (err) {
      console.error('Klaida ištrinant vilkiką:', err);
      setError('Nepavyko ištrinti vilkiko. Bandykite dar kartą vėliau.');
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
      <h1 className="text-center my-4">Vilkikų administravimas</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* Vilkikų sąrašas */}
      <TruckList
        trucks={trucks}
        truckSearch={truckSearch}
        setTruckSearch={setTruckSearch}
        truckSort={truckSort}
        handleSort={handleSort}
        handleAddTruck={handleAddTruck}
        handleEditTruck={handleEditTruck}
        handleDeleteTruckClick={handleDeleteTruckClick}
        loading={loading}
        filteredTrucks={filteredTrucks}
      />
      
      {/* Vilkiko forma */}
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
      
      {/* Vilkiko ištrynimo patvirtinimo modalas */}
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