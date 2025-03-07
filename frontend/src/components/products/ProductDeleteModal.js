import React from 'react';
import { Modal, Button } from 'react-bootstrap';

/**
 * Produktų ištrynimo patvirtinimo modalas
 * @param {Object} props - Komponento savybės
 * @returns {JSX.Element} Produktų ištrynimo modalas
 */
const ProductDeleteModal = ({
  showDeleteProductModal,
  setShowDeleteProductModal,
  productToDelete,
  handleDeleteProduct,
  loading
}) => {
  return (
    <Modal show={showDeleteProductModal} onHide={() => setShowDeleteProductModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Patvirtinkite ištrynimą</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Ar tikrai norite ištrinti produktą <strong>{productToDelete?.name}</strong> ({productToDelete?.code})?</p>
        <p className="text-danger">Šio veiksmo negalima atšaukti.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteProductModal(false)}>
          Atšaukti
        </Button>
        <Button variant="danger" onClick={handleDeleteProduct} disabled={loading}>
          {loading ? 'Trinama...' : 'Ištrinti'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductDeleteModal; 