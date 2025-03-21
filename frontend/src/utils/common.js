import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import React from 'react';
import axios from 'axios';

// Configure axios with better error handling for Vercel deployment
axios.interceptors.request.use(config => {
  // Log outgoing requests in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Request: ${config.method.toUpperCase()} ${config.url}`);
  }
  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  return response;
}, error => {
  // Enhanced error logging
  console.error('API Response Error:', {
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    message: error.message
  });
  
  return Promise.reject(error);
});

/**
 * Rūšiuoja elementų masyvą pagal nurodytą lauką ir kryptį
 * @param {Array} items - Elementų masyvas
 * @param {Object} sort - Rūšiavimo objektas su laukelio ir krypties nurodymais
 * @returns {Array} Surūšiuotas elementų masyvas
 */
export const sortItems = (items, sort) => {
  return [...items].sort((a, b) => {
    const aValue = a[sort.field] || '';
    const bValue = b[sort.field] || '';
    return sort.direction === 'asc' 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });
};

/**
 * Sprendžia, kokia turi būti nauja rūšiavimo kryptis pagal esamą būseną
 * @param {Object} currentSort - Dabartinis rūšiavimo objektas
 * @param {string} field - Laukelis, pagal kurį rūšiuojama
 * @returns {string} Nauja rūšiavimo kryptis
 */
export const getNewSortDirection = (currentSort, field) => {
  if (currentSort.field !== field) return 'asc';
  return currentSort.direction === 'asc' ? 'desc' : 'asc';
};

/**
 * Grąžina rūšiavimo ikoną pagal dabartinę rūšiavimo būseną
 * @param {Object} sort - Rūšiavimo objektas
 * @param {string} field - Laukelis, kuriam norime gauti ikoną
 * @returns {JSX.Element} Rūšiavimo ikona
 */
export const getSortIcon = (sort, field) => {
  if (sort.field !== field) return <FaSort />;
  return sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
};

/**
 * Apdoroja klaidas API užklausose
 * @param {Error} error - Klaidos objektas
 * @param {Function} setError - Funkcija, kuri nustato klaidos būseną
 * @returns {string} Klaidos pranešimas
 */
export const handleApiError = (error, setError) => {
  console.error('API klaida:', error);
  
  // Enhanced error message with more details
  let errorMessage = 'Įvyko klaida. Bandykite dar kartą vėliau.';
  
  if (error.response) {
    // Server responded with an error status
    errorMessage = error.response.data?.message || 
                  error.response.data?.error || 
                  `Serverio klaida (${error.response.status}): ${error.response.statusText}`;
  } else if (error.request) {
    // Request was made but no response received
    errorMessage = 'Nepavyko pasiekti serverio. Patikrinkite interneto ryšį arba bandykite vėliau.';
  } else {
    // Error in setting up the request
    errorMessage = `Užklausos klaida: ${error.message}`;
  }
  
  if (setError) {
    setError(errorMessage);
  }
  
  return errorMessage;
};

/**
 * Bendrinis API užklausų metodas su klaidos apdorojimu
 * @param {Function} apiCall - API užklausos funkcija
 * @param {Function} setLoading - Funkcija, kuri nustato krovimo būseną
 * @param {Function} setError - Funkcija, kuri nustato klaidos būseną
 * @param {Function} onSuccess - Funkcija, kuri iškviečiama sėkmės atveju
 * @returns {Promise} Pažadas su API atsakymu
 */
export const safeApiCall = async (apiCall, setLoading, setError, onSuccess) => {
  try {
    if (typeof setLoading === 'function') {
      setLoading(true);
    }
    const response = await apiCall();
    if (typeof setError === 'function') {
      setError(null);
    }
    if (typeof onSuccess === 'function') {
      onSuccess(response);
    }
    return response;
  } catch (err) {
    if (typeof setError === 'function') {
      return handleApiError(err, setError);
    } else {
      console.error('API klaida:', err);
      return null;
    }
  } finally {
    if (typeof setLoading === 'function') {
      setLoading(false);
    }
  }
};

// Function to test API connection
export const testApiConnection = async () => {
  try {
    const response = await axios.get('/api/test-connection');
    console.log('API connection test result:', response.data);
    return response.data;
  } catch (error) {
    console.error('API connection test failed:', error);
    return {
      success: false,
      error: error.message,
      details: error.response?.data || {}
    };
  }
};

export default {
  sortItems,
  getNewSortDirection,
  getSortIcon,
  handleApiError,
  safeApiCall,
  testApiConnection
};