import React from 'react';
import { Card, Button, Table, InputGroup, Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { getSortIcon } from '../../utils/common';

/**
 * Produktų sąrašo komponentas
 * @param {Object} props - Komponento savybės
 * @returns {JSX.Element} Produktų sąrašo komponentas
 */
const ProductList = ({
  products,
  productSearch,
  setProductSearch,
  productSort,
  handleSort,
  handleAddProduct,
  handleEditProduct,
  handleDeleteProductClick,
  loading,
  filteredProducts
}) => {
  const { t } = useTranslation();

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h3 className="mb-0">{t('common.tables.products')}</h3>
        <Button variant="primary" onClick={handleAddProduct}>
          {t('common.buttons.new')} {t('common.labels.product')}
        </Button>
      </Card.Header>
      <Card.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder={t('common.labels.search')}
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
          />
        </InputGroup>

        {loading && <p>{t('common.messages.loading')}</p>}
        
        {!loading && products.length === 0 && (
          <p className="text-center">{t('common.messages.no_data')}</p>
        )}
        
        {!loading && products.length > 0 && (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th onClick={() => handleSort('products', 'code')} style={{ cursor: 'pointer' }}>
                    {t('common.labels.code')} {getSortIcon(productSort, 'code')}
                  </th>
                  <th onClick={() => handleSort('products', 'name')} style={{ cursor: 'pointer' }}>
                    {t('common.labels.name')} (LT) {getSortIcon(productSort, 'name')}
                  </th>
                  <th onClick={() => handleSort('products', 'nameEn')} style={{ cursor: 'pointer' }}>
                    {t('common.labels.name')} (EN) {getSortIcon(productSort, 'nameEn')}
                  </th>
                  <th onClick={() => handleSort('products', 'nameRu')} style={{ cursor: 'pointer' }}>
                    {t('common.labels.name')} (RU) {getSortIcon(productSort, 'nameRu')}
                  </th>
                  <th onClick={() => handleSort('products', 'unit')} style={{ cursor: 'pointer' }}>
                    {t('common.labels.unit')} {getSortIcon(productSort, 'unit')}
                  </th>
                  <th>{t('common.labels.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>{product.code}</td>
                    <td>{product.name}</td>
                    <td>{product.nameEn || '-'}</td>
                    <td>{product.nameRu || '-'}</td>
                    <td>{product.unit || 'VNT'}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEditProduct(product)}
                      >
                        {t('common.buttons.edit')}
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteProductClick(product)}
                      >
                        {t('common.buttons.delete')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductList; 