import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <Modal 
      show={showDeleteTruckModal} 
      onHide={() => setShowDeleteTruckModal(false)} 
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('common.modals.confirmDelete')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {t('common.modals.deleteConfirmation', { 
            entity: t('common.entities.truck'),
            name: truckToDelete?.plateNumber || ''
          })}
        </p>
        <p className="text-danger">{t('common.modals.cannotUndo')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={() => setShowDeleteTruckModal(false)}
          disabled={loading}
        >
          {t('common.buttons.cancel')}
        </Button>
        <Button 
          variant="danger" 
          onClick={handleDeleteTruck} 
          disabled={loading}
        >
          {loading ? t('common.buttons.deleting') : t('common.buttons.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TruckDeleteModal;