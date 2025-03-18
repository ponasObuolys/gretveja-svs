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
        <Modal.Title>{t('common.modals.confirmDelete')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {t('common.modals.deleteConfirmation', { 
            entity: t('common.labels.product'),
            name: `${productToDelete?.name} (${productToDelete?.code})` || ''
          })}
        </p>
        <p className="text-danger">{t('common.messages.cannot_undo')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={() => setShowDeleteProductModal(false)}
          disabled={loading}
        >
          {t('common.buttons.cancel')}
        </Button>
        <Button 
          variant="danger" 
          onClick={handleDeleteProduct} 
          disabled={loading}
        >
          {loading ? t('common.buttons.deleting') : t('common.buttons.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductDeleteModal;