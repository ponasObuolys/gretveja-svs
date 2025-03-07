import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <Modal show={showDeleteProductModal} onHide={() => setShowDeleteProductModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('common.messages.confirm_delete')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('common.messages.confirm_delete')} <strong>{productToDelete?.name}</strong> ({productToDelete?.code})?</p>
        <p className="text-danger">{t('common.messages.cannot_undo')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteProductModal(false)}>
          {t('common.buttons.cancel')}
        </Button>
        <Button variant="danger" onClick={handleDeleteProduct} disabled={loading}>
          {loading ? t('common.messages.loading') : t('common.buttons.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductDeleteModal; 