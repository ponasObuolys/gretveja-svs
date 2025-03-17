import SupplierModel from '../models/SupplierModel';
import { safeApiCall, handleApiError, getNewSortDirection } from '../utils/common';

/**
 * SupplierController - Klasė, valdanti tiekėjų biznio logiką
 */
class SupplierController {
  /**
   * Gauna visus tiekėjus
   * @param {Function} setLoading - Funkcija, kuri nustato krovimo būseną (optional)
   * @param {Function} setSuppliers - Funkcija, kuri nustato tiekėjų sąrašą (optional)
   * @param {Function} setError - Funkcija, kuri nustato klaidos būseną (optional)
   * @returns {Promise} Pažadas su tiekėjų sąrašu
   */
  static async fetchSuppliers(setLoading, setSuppliers, setError) {
    try {
      // If setLoading is provided, set loading state to true
      if (typeof setLoading === 'function') {
        setLoading(true);
      }
      
      const data = await SupplierModel.getAll();
      
      // If setError is provided, clear any previous errors
      if (typeof setError === 'function') {
        setError(null);
      }
      
      // If setSuppliers is provided, update the suppliers state
      if (typeof setSuppliers === 'function') {
        setSuppliers(data);
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      
      // If setError is provided, set the error state
      if (typeof setError === 'function') {
        setError(err.message || 'Failed to fetch suppliers');
      }
      
      return [];
    } finally {
      // If setLoading is provided, set loading state to false
      if (typeof setLoading === 'function') {
        setLoading(false);
      }
    }
  }

  /**
   * Filtruoja tiekėjus pagal paieškos tekstą
   * @param {Array} suppliers - Tiekėjų masyvas
   * @param {string} searchText - Paieškos tekstas
   * @returns {Array} Filtruotas tiekėjų masyvas
   */
  static filterSuppliers(suppliers, searchText) {
    if (!searchText) return suppliers;
    
    const searchLower = searchText.toLowerCase();
    return suppliers.filter(supplier => 
      supplier.name.toLowerCase().includes(searchLower) ||
      supplier.contactPerson?.toLowerCase().includes(searchLower) ||
      supplier.email?.toLowerCase().includes(searchLower) ||
      supplier.phone?.toLowerCase().includes(searchLower)
    );
  }

  /**
   * Tvarko rūšiavimo keitimą
   * @param {Object} currentSort - Dabartinis rūšiavimo objektas
   * @param {string} field - Laukelis, pagal kurį rūšiuojama
   * @param {Function} setSort - Funkcija, kuri nustato naują rūšiavimo būseną
   */
  static handleSort(currentSort, field, setSort) {
    const direction = getNewSortDirection(currentSort, field);
    setSort({ field, direction });
  }

  /**
   * Sukuria naują tiekėją
   * @param {Object} supplierData - Naujo tiekėjo duomenys
   * @param {Function} setLoading - Funkcija, kuri nustato krovimo būseną
   * @param {Function} setError - Funkcija, kuri nustato klaidos būseną
   * @param {Function} onSuccess - Funkcija, kuri iškviečiama sėkmės atveju
   * @returns {Promise} Pažadas su sukurto tiekėjo duomenimis
   */
  static async createSupplier(supplierData, setLoading, setError, onSuccess) {
    return safeApiCall(
      () => SupplierModel.create(supplierData),
      setLoading,
      setError,
      onSuccess
    );
  }

  /**
   * Atnaujina esamą tiekėją
   * @param {number} id - Tiekėjo ID
   * @param {Object} supplierData - Atnaujinti tiekėjo duomenys
   * @param {Function} setLoading - Funkcija, kuri nustato krovimo būseną
   * @param {Function} setError - Funkcija, kuri nustato klaidos būseną
   * @param {Function} onSuccess - Funkcija, kuri iškviečiama sėkmės atveju
   * @returns {Promise} Pažadas su atnaujinto tiekėjo duomenimis
   */
  static async updateSupplier(id, supplierData, setLoading, setError, onSuccess) {
    return safeApiCall(
      () => SupplierModel.update(id, supplierData),
      setLoading,
      setError,
      onSuccess
    );
  }

  /**
   * Ištrina tiekėją
   * @param {number} id - Tiekėjo ID
   * @param {Function} setLoading - Funkcija, kuri nustato krovimo būseną
   * @param {Function} setError - Funkcija, kuri nustato klaidos būseną
   * @param {Function} onSuccess - Funkcija, kuri iškviečiama sėkmės atveju
   * @returns {Promise} Pažadas su ištrynimo rezultatu
   */
  static async deleteSupplier(id, setLoading, setError, onSuccess) {
    return safeApiCall(
      () => SupplierModel.delete(id),
      setLoading,
      setError,
      onSuccess
    );
  }
}

export default SupplierController; 