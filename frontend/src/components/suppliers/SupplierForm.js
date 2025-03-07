import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

/**
 * Tiekėjų formos komponentas
 * @param {Object} props - Komponento savybės
 * @returns {JSX.Element} Tiekėjų formos komponentas
 */
const SupplierForm = ({
  showSupplierForm,
  setShowSupplierForm,
  currentSupplier,
  supplierFormData,
  handleSupplierInputChange,
  handleSaveSupplier,
  loading
}) => {
  return (
    <Modal show={showSupplierForm} onHide={() => setShowSupplierForm(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {currentSupplier ? 'Redaguoti tiekėją' : 'Naujas tiekėjas'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSaveSupplier}>
          <Form.Group className="mb-3">
            <Form.Label>Pavadinimas *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={supplierFormData.name}
              onChange={handleSupplierInputChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Kontaktinis asmuo</Form.Label>
            <Form.Control
              type="text"
              name="contactPerson"
              value={supplierFormData.contactPerson}
              onChange={handleSupplierInputChange}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Telefonas</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={supplierFormData.phone}
              onChange={handleSupplierInputChange}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>El. paštas</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={supplierFormData.email}
              onChange={handleSupplierInputChange}
            />
          </Form.Group>
          
          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={() => setShowSupplierForm(false)}>
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

export default SupplierForm; 