import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Stocks.css';
import StockTable from '../components/StockTable';
import { Card, InputGroup, Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

function Stocks() {
  const { t } = useTranslation();
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('all');

  // Gauti atsargų duomenis
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stocks');
        
        if (!response.ok) {
          throw new Error(t('common.errors.fetchFailed'));
        }
        
        const data = await response.json();
        setStocks(data);
        setFilteredStocks(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchStocks();
  }, []);

  // Filtruoti atsargas pagal paiešką
  useEffect(() => {
    if (!stocks) return;
    
    let result = [...stocks];
    
    // Filtruoti pagal paieškos terminą
    if (searchTerm) {
      result = result.filter(stock => 
        stock.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.productId.toString().includes(searchTerm)
      );
    }
    
    // Filtruoti pagal pasirinkimą
    if (filterOption === 'inStock') {
      result = result.filter(stock => stock.stockInHand > 0);
    } else if (filterOption === 'outOfStock') {
      result = result.filter(stock => stock.stockInHand <= 0);
    }
    
    setFilteredStocks(result);
  }, [searchTerm, filterOption, stocks]);

  // Tvarkyti paieškos įvesties pakeitimus
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Tvarkyti filtro pasirinkimo pakeitimus
  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  return (
    <div className="stocks-container">
      <h1 className="page-title">{t('common.warehouse.stock')}</h1>
      
      <Card className="mb-4">
        <Card.Body>
          <div className="filters-row">
            <InputGroup className="search-group mb-0">
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={t('common.search.by_name_id')}
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </InputGroup>
            
            <Form.Select 
              value={filterOption} 
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">{t('common.labels.all_products')}</option>
              <option value="inStock">{t('common.labels.in_stock_only')}</option>
              <option value="outOfStock">{t('common.labels.out_of_stock_only')}</option>
            </Form.Select>
          </div>
        </Card.Body>
      </Card>
      
      <StockTable 
        stocks={filteredStocks} 
        loading={loading} 
        error={error} 
      />
    </div>
  );
}

export default Stocks; 