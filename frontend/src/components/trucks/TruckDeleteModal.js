import React from 'react';
import { Modal, Button } from 'react-bootstrap';

/**
 * Vilkikų ištrynimo patvirtinimo modalas
 * @param {Object} props - Komponento savybės
 * @returns {JSX.Element} Vilkikų ištrynimo modalas
 */
const TruckDeleteModal = ({
  showDeleteTruckModal,
  setShowDeleteTruckModal,
  truckToDelete,
  handleDeleteTruck,
  loading
}) => {
  return (
    <Modal show={showDeleteTruckModal} onHide={() => setShowDeleteTruckModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Patvirtinkite ištrynimą</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Ar tikrai norite ištrinti vilkiką <strong>{truckToDelete?.plateNumber}</strong>?</p>
        <p className="text-danger">Šio veiksmo negalima atšaukti.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteTruckModal(false)}>
          Atšaukti
        </Button>
        <Button variant="danger" onClick={handleDeleteTruck} disabled={loading}>
          {loading ? 'Trinama...' : 'Ištrinti'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TruckDeleteModal; 