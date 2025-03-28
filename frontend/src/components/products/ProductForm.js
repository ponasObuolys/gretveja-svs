import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

/**
 * Produktų formos komponentas
 * @param {Object} props - Komponento savybės
 * @returns {JSX.Element} Produktų formos komponentas
 */
const ProductForm = ({
  showProductForm,
  setShowProductForm,
  currentProduct,
  productFormData,
  handleProductInputChange,
  handleSaveProduct,
  loading
}) => {
  const { t } = useTranslation();

  return (
    <Modal show={showProductForm} onHide={() => setShowProductForm(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {currentProduct ? t('common.buttons.edit') : t('common.buttons.new')} {t('common.labels.product')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSaveProduct}>
          <Form.Group className="mb-3">
            <Form.Label>{t('common.labels.name')} (LT) *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={productFormData.name}
              onChange={handleProductInputChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>{t('common.labels.name')} (RU)</Form.Label>
            <Form.Control
              type="text"
              name="nameRu"
              value={productFormData.nameRu}
              onChange={handleProductInputChange}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>{t('common.labels.name')} (DE)</Form.Label>
            <Form.Control
              type="text"
              name="nameDe"
              value={productFormData.nameDe}
              onChange={handleProductInputChange}
            />
          </Form.Group>
          
          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={() => setShowProductForm(false)}>
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

export default ProductForm;