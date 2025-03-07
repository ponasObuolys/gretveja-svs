import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import React from 'react';

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
  const errorMessage = error.response?.data?.message || 'Įvyko klaida. Bandykite dar kartą vėliau.';
  setError(errorMessage);
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
    setLoading(true);
    const response = await apiCall();
    setError(null);
    if (onSuccess) onSuccess(response);
    return response;
  } catch (err) {
    return handleApiError(err, setError);
  } finally {
    setLoading(false);
  }
};

export default {
  sortItems,
  getNewSortDirection,
  getSortIcon,
  handleApiError,
  safeApiCall
}; 