import React from 'react';
import { Card, Button, Table, InputGroup, Form, Spinner } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { getSortIcon } from '../../utils/common';
import { useTranslation } from 'react-i18next';

/**
 * Vilkikų sąrašo komponentas
 * @param {Object} props - Komponento savybės
 * @returns {JSX.Element} Vilkikų sąrašo komponentas
 */
const TruckList = ({
  trucks,
  truckSearch,
  setTruckSearch,
  truckSort,
  handleSort,
  handleEditTruck,
  handleDeleteTruckClick,
  loading
}) => {
  const { t } = useTranslation();
  
  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h3 className="mb-0">{t('common.lists.trucks')}</h3>
      </Card.Header>
      <Card.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder={t('common.search.truckPlaceholder')}
            value={truckSearch}
            onChange={(e) => setTruckSearch(e.target.value)}
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
        
        {!loading && (!trucks || trucks.length === 0) && (
          <p className="text-center">{t('common.noData.trucks')}</p>
        )}
        
        {!loading && trucks && trucks.length > 0 && (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th onClick={() => handleSort('trucks', 'plateNumber')} style={{ cursor: 'pointer' }}>
                    {t('common.fields.plateNumber')} {getSortIcon(truckSort, 'plateNumber')}
                  </th>
                  <th onClick={() => handleSort('trucks', 'company.name')} style={{ cursor: 'pointer' }}>
                    {t('common.fields.company')} {getSortIcon(truckSort, 'company.name')}
                  </th>
                  <th>{t('common.fields.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {trucks.map(truck => (
                  <tr key={truck.id}>
                    <td>{truck.plateNumber}</td>
                    <td>{truck.company?.name || '-'}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEditTruck(truck)}
                      >
                        {t('common.buttons.edit')}
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteTruckClick(truck)}
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

export default TruckList;