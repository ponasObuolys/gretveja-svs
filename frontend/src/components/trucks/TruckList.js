import React from 'react';
import { Card, Button, Table, InputGroup, Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { getSortIcon } from '../../utils/common';

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
  handleAddTruck,
  handleEditTruck,
  handleDeleteTruckClick,
  loading,
  filteredTrucks
}) => {
  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Vilkikų sąrašas</h3>
        <Button variant="primary" onClick={handleAddTruck}>
          Naujas vilkikas
        </Button>
      </Card.Header>
      <Card.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Ieškoti pagal valst. numerį ar įmonę..."
            value={truckSearch}
            onChange={(e) => setTruckSearch(e.target.value)}
          />
        </InputGroup>

        {loading && <p>Kraunama...</p>}
        
        {!loading && trucks.length === 0 && (
          <p className="text-center">Nėra įvestų vilkikų.</p>
        )}
        
        {!loading && trucks.length > 0 && (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th onClick={() => handleSort('trucks', 'plateNumber')} style={{ cursor: 'pointer' }}>
                    Valst. numeris {getSortIcon(truckSort, 'plateNumber')}
                  </th>
                  <th onClick={() => handleSort('trucks', 'company.name')} style={{ cursor: 'pointer' }}>
                    Įmonė {getSortIcon(truckSort, 'company.name')}
                  </th>
                  <th>Veiksmai</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrucks.map(truck => (
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
                        Redaguoti
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteTruckClick(truck)}
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

export default TruckList;