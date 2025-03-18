import React from 'react';
import './StockTable.css';
import { useTranslation } from 'react-i18next';

function StockTable({ stocks, loading, error }) {
  const { t, i18n } = useTranslation();

  // Helper function to get product name based on current language
  const getLocalizedProductName = (stock) => {
    if (!stock) return '';
    
    const currentLanguage = i18n.language;
    
    // Check if stock has the productNameEn or productNameRu properties
    if (currentLanguage === 'en' && stock.productNameEn) {
      return stock.productNameEn;
    } else if (currentLanguage === 'ru' && stock.productNameRu) {
      return stock.productNameRu;
    }
    
    // Default to Lithuanian name
    return stock.productName || '';
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="error">{t('common.errors.fetchFailed')}: {error}</div>;
  }

  if (!stocks || stocks.length === 0) {
    return <div className="no-data">{t('common.messages.no_data')}</div>;
  }

  return (
    <div className="stock-table-container">
      <table className="stock-table">
        <thead>
          <tr>
            <th>{t('common.labels.product')} ID</th>
            <th>{t('common.labels.name')}</th>
            <th>{t('common.inventory.total_purchased')}</th>
            <th>{t('common.inventory.total_issued')}</th>
            <th>{t('common.inventory.current_balance')}</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.productId} className={stock.stockInHand <= 0 ? 'out-of-stock' : ''}>
              <td>{stock.productId}</td>
              <td>{getLocalizedProductName(stock)}</td>
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