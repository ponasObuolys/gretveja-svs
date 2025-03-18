import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <Modal show={showSupplierForm} onHide={() => setShowSupplierForm(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {currentSupplier ? t('common.buttons.edit') : t('common.buttons.new')} {t('common.labels.supplier')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSaveSupplier}>
          <Form.Group className="mb-3">
            <Form.Label>{t('common.labels.name')} *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={supplierFormData.name}
              onChange={handleSupplierInputChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>{t('common.labels.contactPerson')}</Form.Label>
            <Form.Control
              type="text"
              name="contactPerson"
              value={supplierFormData.contactPerson}
              onChange={handleSupplierInputChange}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>{t('common.labels.phone')}</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={supplierFormData.phone}
              onChange={handleSupplierInputChange}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>{t('common.labels.email')}</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={supplierFormData.email}
              onChange={handleSupplierInputChange}
            />
          </Form.Group>
          
          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={() => setShowSupplierForm(false)}>
              {t('common.buttons.cancel')}
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? t('common.messages.loading') : t('common.buttons.save')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SupplierForm;