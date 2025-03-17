import TruckModel from '../models/TruckModel';
import CompanyModel from '../models/CompanyModel';
import { safeApiCall, handleApiError, getNewSortDirection } from '../utils/common';

/**
 * TruckController - Klasė, valdanti vilkikų biznio logiką
 */
class TruckController {
  /**
   * Gauna visus vilkikus su įmonėmis
   * @returns {Promise} Pažadas su vilkikų sąrašu
   */
  static async fetchTrucksWithCompanies() {
    try {
      return await TruckModel.getAll({ include: 'company' });
    } catch (error) {
      console.error('Error fetching trucks with companies:', error);
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
   * Filtruoja vilkikus pagal paieškos tekstą
   * @param {Array} trucks - Vilkikų masyvas
   * @param {string} searchText - Paieškos tekstas
   * @returns {Array} Filtruotas vilkikų masyvas
   */
  static filterTrucks(trucks, searchText) {
    if (!searchText || !trucks || !Array.isArray(trucks)) return trucks || [];
    
    const searchLower = searchText.toLowerCase();
    return trucks.filter(truck => 
      (truck.plateNumber && truck.plateNumber.toLowerCase().includes(searchLower)) ||
      (truck.company && truck.company.name && truck.company.name.toLowerCase().includes(searchLower))
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
   * Sukuria naują vilkiką
   * @param {Object} truckData - Naujo vilkiko duomenys
   * @returns {Promise} Pažadas su sukurto vilkiko duomenimis
   */
  static async createTruck(truckData) {
    try {
      return await TruckModel.create(truckData);
    } catch (error) {
      console.error('Error creating truck:', error);
      throw error;
    }
  }

  /**
   * Atnaujina esamą vilkiką
   * @param {number} id - Vilkiko ID
   * @param {Object} truckData - Atnaujinti vilkiko duomenys
   * @returns {Promise} Pažadas su atnaujinto vilkiko duomenimis
   */
  static async updateTruck(id, truckData) {
    try {
      return await TruckModel.update(id, truckData);
    } catch (error) {
      console.error('Error updating truck:', error);
      throw error;
    }
  }

  /**
   * Ištrina vilkiką
   * @param {number} id - Vilkiko ID
   * @returns {Promise} Pažadas su ištrynimo rezultatu
   */
  static async deleteTruck(id) {
    try {
      return await TruckModel.delete(id);
    } catch (error) {
      console.error('Error deleting truck:', error);
      throw error;
    }
  }
}

export default TruckController;