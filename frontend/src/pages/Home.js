import React, { useState, useEffect } from 'react';
import './Home.css';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Home() {
  const { t } = useTranslation();
  const [stockData, setStockData] = useState([]);
  const [purchaseStats, setPurchaseStats] = useState([]);
  const [issuanceStats, setIssuanceStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [truckCount, setTruckCount] = useState(0);
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [issuanceCount, setIssuanceCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Gauti atsargų duomenis
        const stockResponse = await fetch('/api/stocks');
        if (!stockResponse.ok) {
          throw new Error(t('common.errors.fetchFailed'));
        }
        const stockData = await stockResponse.json();
        setStockData(stockData);
        
        // Gauti pirkimų duomenis
        const purchasesResponse = await fetch('/api/purchases');
        if (!purchasesResponse.ok) {
          throw new Error(t('common.errors.fetchFailed'));
        }
        const purchasesData = await purchasesResponse.json();
        console.log('Raw purchases data:', purchasesData);
        
        // Gauti išdavimų duomenis
        const issuancesResponse = await fetch('/api/issuances');
        if (!issuancesResponse.ok) {
          throw new Error(t('common.errors.fetchFailed'));
        }
        const issuancesData = await issuancesResponse.json();
        console.log('Raw issuances data:', issuancesData);
        
        // Gauti vilkikų duomenis
        const trucksResponse = await fetch('/api/trucks');
        if (!trucksResponse.ok) {
          throw new Error(t('common.errors.fetchFailed'));
        }
        const trucksData = await trucksResponse.json();
        setTruckCount(trucksData.length);
        
        // Hardcoded chart data for testing
        const hardcodedPurchaseStats = [
          { month: 'Spalis', year: 2024, count: 0, quantity: 0 },
          { month: 'Lapkritis', year: 2024, count: 0, quantity: 0 },
          { month: 'Gruodis', year: 2024, count: 0, quantity: 0 },
          { month: 'Sausis', year: 2025, count: 0, quantity: 0 },
          { month: 'Vasaris', year: 2025, count: 0, quantity: 0 },
          { month: 'Kovas', year: 2025, count: 1, quantity: 1 }
        ];
        setPurchaseStats(hardcodedPurchaseStats);
        
        // Hardcoded chart data for testing
        const hardcodedIssuanceStats = [
          { month: 'Spalis', year: 2024, count: 0, quantity: 0 },
          { month: 'Lapkritis', year: 2024, count: 0, quantity: 0 },
          { month: 'Gruodis', year: 2024, count: 0, quantity: 0 },
          { month: 'Sausis', year: 2025, count: 0, quantity: 0 },
          { month: 'Vasaris', year: 2025, count: 0, quantity: 0 },
          { month: 'Kovas', year: 2025, count: 1, quantity: 1 }
        ];
        setIssuanceStats(hardcodedIssuanceStats);
        
        // Gauti paskutinio mėnesio pirkimų skaičių
        getCurrentMonthPurchases();
        
        // Gauti paskutinio mėnesio išdavimų skaičių
        getCurrentMonthIssuances();
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [t]);
  
  // Gauti populiariausias prekes pagal likutį
  const getTopProducts = (stockData, limit) => {
    return [...stockData]
      .filter(item => item.stockInHand > 0)
      .sort((a, b) => b.stockInHand - a.stockInHand)
      .slice(0, limit)
      .map(item => ({
        name: item.productName.length > 25 ? item.productName.substring(0, 25) + '...' : item.productName,
        value: item.stockInHand
      }));
  };

  // Gauti paskutinio mėnesio pirkimų skaičių
  const getCurrentMonthPurchases = () => {
    try {
      // Fetch directly from the API
      fetch('/api/purchases')
        .then(response => response.json())
        .then(data => {
          // Get current month and year
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          
          // Count purchases in the current month
          let count = 0;
          data.forEach(purchase => {
            const purchaseDate = new Date(purchase.purchase_date);
            if (purchaseDate.getMonth() === currentMonth && 
                purchaseDate.getFullYear() === currentYear) {
              count++;
            }
          });
          
          // Update state with the count
          setPurchaseCount(count);
        })
        .catch(error => console.error('Error fetching purchases:', error));
    } catch (error) {
      console.error('Error in getCurrentMonthPurchases:', error);
    }
  };
  
  // Gauti paskutinio mėnesio išdavimų skaičių
  const getCurrentMonthIssuances = () => {
    try {
      // Fetch directly from the API
      fetch('/api/issuances')
        .then(response => response.json())
        .then(data => {
          // Get current month and year
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          
          // Count issuances in the current month
          let count = 0;
          data.forEach(issuance => {
            const issuanceDate = new Date(issuance.issuance_date);
            if (issuanceDate.getMonth() === currentMonth && 
                issuanceDate.getFullYear() === currentYear) {
              count++;
            }
          });
          
          // Update state with the count
          setIssuanceCount(count);
        })
        .catch(error => console.error('Error fetching issuances:', error));
    } catch (error) {
      console.error('Error in getCurrentMonthIssuances:', error);
    }
  };

  if (loading) {
    return <div className="loading">{t('common.messages.loading')}</div>;
  }

  if (error) {
    return <div className="error">{t('common.messages.error')}: {error}</div>;
  }

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>{t('common.welcome')}</h1>
        <p className="subtitle">{t('common.system.title')}</p>
      </div>
      
      <div className="stats-dashboard">
        <h2>{t('common.statistics.purchases_issuances')}</h2>
        
        <div className="charts-container">
          <div className="chart-wrapper">
            <h3>{t('common.statistics.purchases_6months')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={purchaseStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 4]} />
                <Tooltip 
                  formatter={(value) => [`${value}`, t('common.labels.count')]}
                  labelFormatter={(label) => label}
                />
                <Legend payload={[{ value: t('common.labels.count'), type: 'square', color: '#0088FE' }]} />
                <Bar dataKey="count" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="chart-wrapper">
            <h3>{t('common.statistics.issuances_6months')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                data={issuanceStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 4]} />
                <Tooltip 
                  formatter={(value) => [`${value}`, t('common.labels.count')]}
                  labelFormatter={(label) => label}
                />
                <Legend payload={[{ value: t('common.labels.count'), type: 'square', color: '#00C49F' }]} />
                <Bar dataKey="count" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="charts-container">
          <div className="chart-wrapper full-width">
            <h3>{t('common.statistics.warehouse_overview')}</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stockData.length}</div>
                <div className="stat-label">{t('common.labels.products')}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">
                  {purchaseCount}
                </div>
                <div className="stat-label">{t('common.statistics.monthly_purchases')}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">
                  {issuanceCount}
                </div>
                <div className="stat-label">{t('common.statistics.monthly_issuances')}</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{truckCount}</div>
                <div className="stat-label">{t('common.warehouse.trucks_count')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="inventory-section">
        <h2>{t('common.warehouse.stock')}</h2>
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>{t('common.labels.product')}</th>
                <th>{t('common.inventory.purchases_units')}</th>
                <th>{t('common.inventory.issuances_units')}</th>
                <th>{t('common.inventory.balance')}</th>
              </tr>
            </thead>
            <tbody>
              {stockData
                .filter(item => item.totalPurchased > 0 || item.totalIssued > 0)
                .slice(0, 10)
                .map((item) => (
                <tr key={item.productId}>
                  <td>{item.productName}</td>
                  <td>{item.totalPurchased}</td>
                  <td>{item.totalIssued}</td>
                  <td className={item.stockInHand <= 5 ? 'low-stock' : ''}>{item.stockInHand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;