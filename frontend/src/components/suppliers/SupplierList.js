import React from 'react';
import { Card, Button, Table, InputGroup, Form, Spinner } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { getSortIcon } from '../../utils/common';
import { useTranslation } from 'react-i18next';

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
  handleEditSupplier,
  handleDeleteSupplierClick,
  loading,
  filteredSuppliers
}) => {
  const { t } = useTranslation();

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h3 className="mb-0">{t('common.tables.suppliers')}</h3>
      </Card.Header>
      <Card.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder={t('common.search.by_name_contact_phone_email')}
            value={supplierSearch}
            onChange={(e) => setSupplierSearch(e.target.value)}
            disabled={loading}
          />
        </InputGroup>

        {loading && (
          <div className="text-center my-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">{t('common.loading')}</span>
            </Spinner>
          </div>
        )}
        
        {!loading && (!suppliers || suppliers.length === 0) && (
          <p className="text-center">{t('common.messages.no_data')}</p>
        )}
        
        {!loading && suppliers && suppliers.length > 0 && (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th onClick={() => handleSort('suppliers', 'name')} style={{ cursor: 'pointer' }}>
                    {t('common.labels.name')} {getSortIcon(supplierSort, 'name')}
                  </th>
                  <th onClick={() => handleSort('suppliers', 'contact_person')} style={{ cursor: 'pointer' }}>
                    Kontaktas {getSortIcon(supplierSort, 'contact_person')}
                  </th>
                  <th onClick={() => handleSort('suppliers', 'phone')} style={{ cursor: 'pointer' }}>
                    {t('common.labels.phone')} {getSortIcon(supplierSort, 'phone')}
                  </th>
                  <th onClick={() => handleSort('suppliers', 'email')} style={{ cursor: 'pointer' }}>
                    {t('common.labels.email')} {getSortIcon(supplierSort, 'email')}
                  </th>
                  <th>{t('common.labels.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map(supplier => (
                  <tr key={supplier.id}>
                    <td>{supplier.name}</td>
                    <td>{supplier.contact_person || '-'}</td>
                    <td>{supplier.phone || '-'}</td>
                    <td>{supplier.email || '-'}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEditSupplier(supplier)}
                      >
                        {t('common.buttons.edit')}
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteSupplierClick(supplier)}
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

export default SupplierList;