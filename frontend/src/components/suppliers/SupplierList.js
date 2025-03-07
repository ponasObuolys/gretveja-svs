import React from 'react';
import { Card, Button, Table, InputGroup, Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { getSortIcon } from '../../utils/common';

/**
 * Tiekėjų sąrašo komponentas
 * @param {Object} props - Komponento savybės
 * @returns {JSX.Element} Tiekėjų sąrašo komponentas
 */
const SupplierList = ({
  suppliers,
  supplierSearch,
  setSupplierSearch,
  supplierSort,
  handleSort,
  handleAddSupplier,
  handleEditSupplier,
  handleDeleteSupplierClick,
  loading,
  filteredSuppliers
}) => {
  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Tiekėjų sąrašas</h3>
        <Button variant="primary" onClick={handleAddSupplier}>
          Naujas tiekėjas
        </Button>
      </Card.Header>
      <Card.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Ieškoti pagal pavadinimą, kontaktinį asmenį, telefoną ar el. paštą..."
            value={supplierSearch}
            onChange={(e) => setSupplierSearch(e.target.value)}
          />
        </InputGroup>

        {loading && <p>Kraunama...</p>}
        
        {!loading && suppliers.length === 0 && (
          <p className="text-center">Nėra įvestų tiekėjų.</p>
        )}
        
        {!loading && suppliers.length > 0 && (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th onClick={() => handleSort('suppliers', 'name')} style={{ cursor: 'pointer' }}>
                    Pavadinimas {getSortIcon(supplierSort, 'name')}
                  </th>
                  <th onClick={() => handleSort('suppliers', 'contactPerson')} style={{ cursor: 'pointer' }}>
                    Kontaktinis asmuo {getSortIcon(supplierSort, 'contactPerson')}
                  </th>
                  <th onClick={() => handleSort('suppliers', 'phone')} style={{ cursor: 'pointer' }}>
                    Telefonas {getSortIcon(supplierSort, 'phone')}
                  </th>
                  <th onClick={() => handleSort('suppliers', 'email')} style={{ cursor: 'pointer' }}>
                    El. paštas {getSortIcon(supplierSort, 'email')}
                  </th>
                  <th>Veiksmai</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map(supplier => (
                  <tr key={supplier.id}>
                    <td>{supplier.name}</td>
                    <td>{supplier.contactPerson || '-'}</td>
                    <td>{supplier.phone || '-'}</td>
                    <td>{supplier.email || '-'}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEditSupplier(supplier)}
                      >
                        Redaguoti
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteSupplierClick(supplier)}
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

export default SupplierList; 