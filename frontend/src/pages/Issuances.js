import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import './Issuances.css';
import IssuanceForm from '../components/IssuanceForm';

function Issuances() {
  const [issuances, setIssuances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentIssuance, setCurrentIssuance] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [issuanceToDelete, setIssuanceToDelete] = useState(null);

  // Gauti visus išdavimus
  const fetchIssuances = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/issuances');
      setIssuances(response.data);
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
  }, []);

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

  // Atsisiųsti PDF
  const handleDownloadPdf = async (issuance) => {
    try {
      const response = await axios.get(`/api/issuances/${issuance.id}/pdf`, {
        responseType: 'blob'
      });
      
      // Sukurti laikinąją nuorodą ir atsisiųsti failą
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `issuance_${issuance.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Klaida atsisiunčiant PDF:', err);
      setError('Nepavyko atsisiųsti PDF. Bandykite dar kartą vėliau.');
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
    const date = new Date(dateString);
    return date.toLocaleDateString('lt-LT');
  };

  return (
    <div className="issuances-container">
      <h1>Išdavimai</h1>
      
      <div className="action-buttons">
        <button 
          className="btn-add-issuance" 
          onClick={handleAddNew}
        >
          Naujas išdavimas
        </button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="loading-spinner">Kraunama...</div>
      ) : (
        <>
          {issuances.length === 0 ? (
            <div className="no-data-message">
              Nėra įrašytų išdavimų. Sukurkite naują išdavimą paspaudę mygtuką "Naujas išdavimas".
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Produktas</th>
                    <th>Kiekis</th>
                    <th>Vairuotojas</th>
                    <th>Vilkikas</th>
                    <th>Įmonė</th>
                    <th>Išduota?</th>
                    <th>Veiksmai</th>
                  </tr>
                </thead>
                <tbody>
                  {issuances.map((issuance) => (
                    <tr key={issuance.id}>
                      <td>{formatDate(issuance.issuanceDate)}</td>
                      <td>{issuance.product?.name || 'Nenurodyta'}</td>
                      <td>{issuance.quantity}</td>
                      <td>{issuance.driverName}</td>
                      <td>{issuance.truck?.plateNumber || 'Nenurodyta'}</td>
                      <td>{issuance.truck?.company?.name || 'Nenurodyta'}</td>
                      <td>
                        <span className={`status-badge ${issuance.isIssued ? 'issued' : 'not-issued'}`}>
                          {issuance.isIssued ? 'Taip' : 'Ne'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => handleEdit(issuance)}
                          className="action-button"
                        >
                          Redaguoti
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => handleDeleteClick(issuance)}
                          className="action-button"
                        >
                          Ištrinti
                        </Button>
                        <Button 
                          variant="outline-success" 
                          size="sm" 
                          onClick={() => handleDownloadPdf(issuance)}
                          className="action-button"
                        >
                          PDF
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
          <Modal.Title>Patvirtinkite ištrynimą</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Ar tikrai norite ištrinti šį išdavimą?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Atšaukti
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Ištrinti
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Issuances; 