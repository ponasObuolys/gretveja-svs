import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import './Issuances.css';
import IssuanceForm from '../components/IssuanceForm';

function Issuances() {
  const { t } = useTranslation();
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
      <h1>{t('common.issuances.title')}</h1>
      
      <div className="action-buttons">
        <button 
          className="btn-add-issuance" 
          onClick={handleAddNew}
        >
          {t('common.issuances.new_issuance')}
        </button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="loading-spinner">{t('common.messages.loading')}</div>
      ) : (
        <>
          {issuances.length === 0 ? (
            <div className="no-data-message">
              {t('common.issuances.no_data')}
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
                      <td>{issuance.product?.name || t('common.messages.no_data')}</td>
                      <td>{issuance.quantity}</td>
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
                          variant="outline-success" 
                          size="sm" 
                          onClick={() => handleDownloadPdf(issuance)}
                          className="action-button"
                        >
                          {t('common.issuances.download_pdf')}
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