import React from 'react';
import { Modal, Button } from 'react-bootstrap';

/**
 * Tiekėjų ištrynimo patvirtinimo modalas
 * @param {Object} props - Komponento savybės
 * @returns {JSX.Element} Tiekėjų ištrynimo modalas
 */
const SupplierDeleteModal = ({
  showDeleteSupplierModal,
  setShowDeleteSupplierModal,
  supplierToDelete,
  handleDeleteSupplier,
  loading
}) => {
  return (
    <Modal show={showDeleteSupplierModal} onHide={() => setShowDeleteSupplierModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Patvirtinkite ištrynimą</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Ar tikrai norite ištrinti tiekėją <strong>{supplierToDelete?.name}</strong>?</p>
        <p className="text-danger">Šio veiksmo negalima atšaukti.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteSupplierModal(false)}>
          Atšaukti
        </Button>
        <Button variant="danger" onClick={handleDeleteSupplier} disabled={loading}>
          {loading ? 'Trinama...' : 'Ištrinti'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SupplierDeleteModal; 