import React from 'react';
import { Card, Button, Table, InputGroup, Form, Spinner } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { getSortIcon } from '../../utils/common';
import { useTranslation } from 'react-i18next';

/**
 * Vairuotojų sąrašo komponentas
 * @param {Object} props - Komponento savybės
 * @returns {JSX.Element} Vairuotojų sąrašo komponentas
 */
const DriverList = ({
  drivers,
  driverSearch,
  setDriverSearch,
  driverSort,
  handleSort,
  handleEditDriver,
  handleDeleteDriverClick,
  loading
}) => {
  const { t } = useTranslation();
  
  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h3 className="mb-0">{t('common.lists.drivers')}</h3>
      </Card.Header>
      <Card.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder={t('common.search.driverPlaceholder')}
            value={driverSearch}
            onChange={(e) => setDriverSearch(e.target.value)}
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
        
        {!loading && (!drivers || drivers.length === 0) && (
          <p className="text-center">{t('common.noData.drivers')}</p>
        )}
        
        {!loading && drivers && drivers.length > 0 && (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th onClick={() => handleSort('drivers', 'driver')} style={{ cursor: 'pointer' }}>
                    {t('common.fields.driver')} {getSortIcon(driverSort, 'driver')}
                  </th>
                  <th onClick={() => handleSort('drivers', 'company.name')} style={{ cursor: 'pointer' }}>
                    {t('common.fields.company')} {getSortIcon(driverSort, 'company.name')}
                  </th>
                  <th>{t('common.fields.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map(driver => (
                  <tr key={driver.id}>
                    <td>{driver.driver}</td>
                    <td>{driver.company?.name || '-'}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEditDriver(driver)}
                      >
                        {t('common.buttons.edit')}
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteDriverClick(driver)}
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

export default DriverList;
