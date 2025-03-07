import React from 'react';
import './StockTable.css';

function StockTable({ stocks, loading, error }) {
  if (loading) {
    return <div className="loading">Kraunami duomenys...</div>;
  }

  if (error) {
    return <div className="error">Klaida: {error}</div>;
  }

  if (!stocks || stocks.length === 0) {
    return <div className="no-data">Nėra duomenų apie atsargas.</div>;
  }

  return (
    <div className="stock-table-container">
      <table className="stock-table">
        <thead>
          <tr>
            <th>Produkto ID</th>
            <th>Produkto pavadinimas</th>
            <th>Iš viso įsigyta (VNT)</th>
            <th>Iš viso išduota (VNT)</th>
            <th>Likutis (VNT)</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.productId} className={stock.stockInHand <= 0 ? 'out-of-stock' : ''}>
              <td>{stock.productId}</td>
              <td>{stock.productName}</td>
              <td>{stock.totalPurchased}</td>
              <td>{stock.totalIssued}</td>
              <td className={stock.stockInHand <= 0 ? 'out-of-stock-cell' : ''}>{stock.stockInHand}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StockTable; 