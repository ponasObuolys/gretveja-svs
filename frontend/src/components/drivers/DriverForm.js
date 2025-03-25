import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

/**
 * Vairuotojų formos komponentas
 * @param {Object} props - Komponento savybės
 * @returns {JSX.Element} Vairuotojų formos komponentas
 */
const DriverForm = ({
  showDriverForm,
  setShowDriverForm,
  currentDriver,
  driverFormData = { driver: '', companyId: '' }, 
  handleDriverInputChange,
  handleSaveDriver,
  companies = [], 
  loading
}) => {
  const { t } = useTranslation();

  return (
    <Modal show={showDriverForm} onHide={() => setShowDriverForm(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {currentDriver ? t('common.buttons.edit') : t('common.buttons.new')} {t('common.entities.driver')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSaveDriver}>
          <Form.Group className="mb-3">
            <Form.Label>{t('common.fields.driver')} *</Form.Label>
            <Form.Control
              type="text"
              name="driver"
              value={driverFormData.driver}
              onChange={handleDriverInputChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>{t('common.fields.company')} *</Form.Label>
            <Form.Select
              name="companyId"
              value={driverFormData.companyId}
              onChange={handleDriverInputChange}
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
            <Button variant="secondary" className="me-2" onClick={() => setShowDriverForm(false)}>
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

export default DriverForm;
