import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

/**
 * Vairuotojų ištrynimo patvirtinimo modalas
 * @param {Object} props - Komponento savybės
 * @returns {JSX.Element} Vairuotojų ištrynimo modalas
 */
const DriverDeleteModal = ({
  showDeleteDriverModal,
  setShowDeleteDriverModal,
  driverToDelete,
  handleDeleteDriver,
  loading
}) => {
  const { t } = useTranslation();

  return (
    <Modal 
      show={showDeleteDriverModal} 
      onHide={() => setShowDeleteDriverModal(false)} 
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('common.modals.confirmDelete')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {t('common.modals.deleteConfirmation', { 
            entity: t('common.entities.driver'),
            name: driverToDelete?.driver || ''
          })}
        </p>
        <p className="text-danger">{t('common.modals.cannotUndo')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={() => setShowDeleteDriverModal(false)}
          disabled={loading}
        >
          {t('common.buttons.cancel')}
        </Button>
        <Button 
          variant="danger" 
          onClick={handleDeleteDriver} 
          disabled={loading}
        >
          {loading ? t('common.buttons.deleting') : t('common.buttons.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DriverDeleteModal;
