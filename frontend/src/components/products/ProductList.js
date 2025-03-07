import React from 'react';
import { Card, Button, Table, InputGroup, Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
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
  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Produktų sąrašas</h3>
        <Button variant="primary" onClick={handleAddProduct}>
          Naujas produktas
        </Button>
      </Card.Header>
      <Card.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Ieškoti pagal kodą, pavadinimą..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
          />
        </InputGroup>

        {loading && <p>Kraunama...</p>}
        
        {!loading && products.length === 0 && (
          <p className="text-center">Nėra įvestų produktų.</p>
        )}
        
        {!loading && products.length > 0 && (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th onClick={() => handleSort('products', 'code')} style={{ cursor: 'pointer' }}>
                    Kodas {getSortIcon(productSort, 'code')}
                  </th>
                  <th onClick={() => handleSort('products', 'name')} style={{ cursor: 'pointer' }}>
                    Pavadinimas (LT) {getSortIcon(productSort, 'name')}
                  </th>
                  <th onClick={() => handleSort('products', 'nameEn')} style={{ cursor: 'pointer' }}>
                    Pavadinimas (EN) {getSortIcon(productSort, 'nameEn')}
                  </th>
                  <th onClick={() => handleSort('products', 'nameRu')} style={{ cursor: 'pointer' }}>
                    Pavadinimas (RU) {getSortIcon(productSort, 'nameRu')}
                  </th>
                  <th onClick={() => handleSort('products', 'unit')} style={{ cursor: 'pointer' }}>
                    Vnt. {getSortIcon(productSort, 'unit')}
                  </th>
                  <th>Veiksmai</th>
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
                        Redaguoti
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteProductClick(product)}
                      >
                        Ištrinti
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