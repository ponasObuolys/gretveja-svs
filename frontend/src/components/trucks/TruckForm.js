import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

/**
 * Vilkikų formos komponentas
 * @param {Object} props - Komponento savybės
 * @returns {JSX.Element} Vilkikų formos komponentas
 */
const TruckForm = ({
  showTruckForm,
  setShowTruckForm,
  currentTruck,
  truckFormData,
  handleTruckInputChange,
  handleSaveTruck,
  companies,
  loading
}) => {
  return (
    <Modal show={showTruckForm} onHide={() => setShowTruckForm(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {currentTruck ? 'Redaguoti vilkiką' : 'Naujas vilkikas'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSaveTruck}>
          <Form.Group className="mb-3">
            <Form.Label>Valstybinis numeris *</Form.Label>
            <Form.Control
              type="text"
              name="plateNumber"
              value={truckFormData.plateNumber}
              onChange={handleTruckInputChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Modelis</Form.Label>
            <Form.Control
              type="text"
              name="model"
              value={truckFormData.model}
              onChange={handleTruckInputChange}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Įmonė *</Form.Label>
            <Form.Select
              name="companyId"
              value={truckFormData.companyId}
              onChange={handleTruckInputChange}
              required
            >
              <option value="">Pasirinkite įmonę</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={() => setShowTruckForm(false)}>
              Atšaukti
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saugoma...' : 'Išsaugoti'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TruckForm; 