import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

/**
 * Vilkikų formos komponentas
 * @param {Object} props - Komponento savybės
 * @returns {JSX.Element} Vilkikų formos komponentas
 */
const TruckForm = ({
  showTruckForm,
  setShowTruckForm,
  currentTruck,
  truckFormData = { plateNumber: '', companyId: '' }, 
  handleTruckInputChange,
  handleSaveTruck,
  companies = [], 
  loading
}) => {
  const { t } = useTranslation();

  return (
    <Modal show={showTruckForm} onHide={() => setShowTruckForm(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {currentTruck ? t('common.buttons.edit') : t('common.buttons.new')} {t('common.entities.truck')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSaveTruck}>
          <Form.Group className="mb-3">
            <Form.Label>{t('common.fields.plateNumber')} *</Form.Label>
            <Form.Control
              type="text"
              name="plateNumber"
              value={truckFormData.plateNumber}
              onChange={handleTruckInputChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>{t('common.fields.company')} *</Form.Label>
            <Form.Select
              name="companyId"
              value={truckFormData.companyId}
              onChange={handleTruckInputChange}
              required
            >
              <option value="">{t('common.select.company')}</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={() => setShowTruckForm(false)}>
              {t('common.buttons.cancel')}
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? t('common.buttons.saving') : t('common.buttons.save')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TruckForm;