import DriverModel from '../models/DriverModel';
import CompanyModel from '../models/CompanyModel';
import { safeApiCall, handleApiError, getNewSortDirection } from '../utils/common';

/**
 * DriverController - Klasė, valdanti vairuotojų biznio logiką
 */
class DriverController {
  /**
   * Gauna visus vairuotojus su įmonėmis
   * @returns {Promise} Pažadas su vairuotojų sąrašu
   */
  static async fetchDriversWithCompanies() {
    try {
      const drivers = await DriverModel.getAll({ include: 'company' });
      return drivers || [];
    } catch (error) {
      console.error('Error fetching drivers with companies:', error);
      // Log the API response error if available
      if (error.response) {
        console.error('API Response Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      return [];
    }
  }

  /**
   * Gauna visas įmones
   * @returns {Promise} Pažadas su įmonių sąrašu
   */
  static async fetchCompanies() {
    try {
      return await CompanyModel.getAll();
    } catch (error) {
      console.error('Error fetching companies:', error);
      return [];
    }
  }

  /**
   * Filtruoja vairuotojus pagal paieškos tekstą
   * @param {Array} drivers - Vairuotojų masyvas
   * @param {string} searchText - Paieškos tekstas
   * @returns {Array} Filtruotas vairuotojų masyvas
   */
  static filterDrivers(drivers, searchText) {
    if (!searchText || !drivers || !Array.isArray(drivers)) return drivers || [];
    
    const searchLower = searchText.toLowerCase();
    return drivers.filter(driver => 
      (driver.driver && driver.driver.toLowerCase().includes(searchLower)) ||
      (driver.company && driver.company.name && driver.company.name.toLowerCase().includes(searchLower))
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
   * Sukuria naują vairuotoją
   * @param {Object} driverData - Naujo vairuotojo duomenys
   * @returns {Promise} Pažadas su sukurto vairuotojo duomenimis
   */
  static async createDriver(driverData) {
    try {
      return await DriverModel.create(driverData);
    } catch (error) {
      console.error('Error creating driver:', error);
      throw error;
    }
  }

  /**
   * Atnaujina esamą vairuotoją
   * @param {number} id - Vairuotojo ID
   * @param {Object} driverData - Atnaujinti vairuotojo duomenys
   * @returns {Promise} Pažadas su atnaujinto vairuotojo duomenimis
   */
  static async updateDriver(id, driverData) {
    try {
      return await DriverModel.update(id, driverData);
    } catch (error) {
      console.error('Error updating driver:', error);
      throw error;
    }
  }

  /**
   * Ištrina vairuotoją
   * @param {number} id - Vairuotojo ID
   * @returns {Promise} Pažadas su ištrynimo rezultatu
   */
  static async deleteDriver(id) {
    try {
      return await DriverModel.delete(id);
    } catch (error) {
      console.error('Error deleting driver:', error);
      throw error;
    }
  }
}

export default DriverController;
