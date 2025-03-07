import React, { useState, useEffect } from 'react';
import './Home.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Home() {
  const [stockData, setStockData] = useState([]);
  const [purchaseStats, setPurchaseStats] = useState([]);
  const [issuanceStats, setIssuanceStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topProducts, setTopProducts] = useState([]);

  // Spalvos grafikams
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Gauti atsargų duomenis
        const stockResponse = await fetch('/api/stocks');
        if (!stockResponse.ok) {
          throw new Error('Nepavyko gauti atsargų duomenų');
        }
        const stockData = await stockResponse.json();
        setStockData(stockData);
        
        // Gauti pirkimų duomenis
        const purchasesResponse = await fetch('/api/purchases');
        if (!purchasesResponse.ok) {
          throw new Error('Nepavyko gauti pirkimų duomenų');
        }
        const purchasesData = await purchasesResponse.json();
        
        // Gauti išdavimų duomenis
        const issuancesResponse = await fetch('/api/issuances');
        if (!issuancesResponse.ok) {
          throw new Error('Nepavyko gauti išdavimų duomenų');
        }
        const issuancesData = await issuancesResponse.json();
        
        // Apdoroti pirkimų statistiką pagal mėnesius
        const purchasesByMonth = processDataByMonth(purchasesData);
        setPurchaseStats(purchasesByMonth);
        
        // Apdoroti išdavimų statistiką pagal mėnesius
        const issuancesByMonth = processDataByMonth(issuancesData, 'issuanceDate');
        setIssuanceStats(issuancesByMonth);
        
        // Nustatyti populiariausias prekes pagal išdavimus
        const topProductsData = getTopProducts(stockData, 10);
        setTopProducts(topProductsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Klaida gaunant duomenis:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Apdoroti duomenis pagal mėnesius
  const processDataByMonth = (data, dateField = 'purchaseDate') => {
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 5);
    
    // Inicializuoti mėnesių masyvą
    const months = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(sixMonthsAgo);
      date.setMonth(sixMonthsAgo.getMonth() + i);
      months.push({
        month: date.toLocaleString('lt-LT', { month: 'long' }),
        year: date.getFullYear(),
        count: 0,
        quantity: 0
      });
    }
    
    // Skaičiuoti kiekius pagal mėnesius
    data.forEach(item => {
      const itemDate = new Date(item[dateField]);
      const itemMonth = itemDate.getMonth();
      const itemYear = itemDate.getFullYear();
      
      months.forEach(monthData => {
        const monthDate = new Date(`${monthData.month} 1, ${monthData.year}`);
        if (itemMonth === monthDate.getMonth() && itemYear === monthDate.getFullYear()) {
          monthData.count += 1;
          monthData.quantity += Number(item.quantity) || 0;
        }
      });
    });
    
    return months;
  };
  
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

  // Gauti dabartinį metus
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  if (loading) {
    return <div className="loading">Kraunami duomenys...</div>;
  }

  if (error) {
    return <div className="error">Klaida: {error}</div>;
  }

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Gretvėja-SVS</h1>
        <p className="subtitle">Sandėlio valdymo sistema</p>
      </div>
      
      <div className="stats-dashboard">
        <h2>Pirkimų ir išdavimų statistika</h2>
        
        <div className="charts-container">
          <div className="chart-wrapper">
            <h3>Pirkimai per paskutinius 6 mėnesius</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={purchaseStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} vnt.`, 'Kiekis']} />
                <Legend />
                <Bar dataKey="quantity" name="Kiekis (vnt.)" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="chart-wrapper">
            <h3>Išdavimai per paskutinius 6 mėnesius</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={issuanceStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} vnt.`, 'Kiekis']} />
                <Legend />
                <Bar dataKey="quantity" name="Kiekis (vnt.)" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="charts-container">
          <div className="chart-wrapper">
            <h3>Top 10 prekių pagal likutį</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topProducts}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip formatter={(value) => [`${value} vnt.`, 'Kiekis']} />
                <Legend />
                <Bar dataKey="value" name="Likutis (vnt.)" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="chart-wrapper stats-card-container">
            <h3>Sandėlio apžvalga</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stockData.length}</div>
                <div className="stat-label">Prekių</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">
                  {purchaseStats.length > 0 ? purchaseStats[purchaseStats.length - 1].count : 0}
                </div>
                <div className="stat-label">Pirkimų per mėnesį</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">
                  {issuanceStats.length > 0 ? issuanceStats[issuanceStats.length - 1].count : 0}
                </div>
                <div className="stat-label">Išdavimų per mėnesį</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">4</div>
                <div className="stat-label">Logistikos įmonės</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="inventory-section">
        <h2>Sandėlio atsargos</h2>
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Produktas</th>
                <th>Pirkimai (vnt.)</th>
                <th>Išdavimai (vnt.)</th>
                <th>Likutis (vnt.)</th>
              </tr>
            </thead>
            <tbody>
              {stockData.filter(item => item.stockInHand > 0).slice(0, 10).map((item) => (
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