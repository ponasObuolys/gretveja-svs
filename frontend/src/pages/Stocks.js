import React, { useState, useEffect } from 'react';
import './Stocks.css';
import StockTable from '../components/StockTable';

function Stocks() {
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
          throw new Error('Nepavyko gauti atsargų duomenų');
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
      <h1 className="page-title">Atsargos</h1>
      
      <div className="filters-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Ieškoti pagal pavadinimą arba ID..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <select 
            value={filterOption} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">Visi produktai</option>
            <option value="inStock">Tik turintys atsargų</option>
            <option value="outOfStock">Tik neturintys atsargų</option>
          </select>
        </div>
      </div>
      
      <StockTable 
        stocks={filteredStocks} 
        loading={loading} 
        error={error} 
      />
    </div>
  );
}

export default Stocks; 