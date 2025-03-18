import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <Modal show={showDeleteSupplierModal} onHide={() => setShowDeleteSupplierModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('common.modals.confirmDelete')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {t('common.modals.deleteConfirmation', { 
            entity: t('common.labels.supplier'),
            name: supplierToDelete?.name || ''
          })}
        </p>
        <p className="text-danger">{t('common.messages.cannot_undo')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={() => setShowDeleteSupplierModal(false)}
          disabled={loading}
        >
          {t('common.buttons.cancel')}
        </Button>
        <Button 
          variant="danger" 
          onClick={handleDeleteSupplier} 
          disabled={loading}
        >
          {loading ? t('common.buttons.deleting') : t('common.buttons.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SupplierDeleteModal;