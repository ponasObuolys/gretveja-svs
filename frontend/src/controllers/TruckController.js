import TruckModel from '../models/TruckModel';
import CompanyModel from '../models/CompanyModel';
import { safeApiCall, handleApiError, getNewSortDirection } from '../utils/common';

/**
 * TruckController - Klasė, valdanti vilkikų biznio logiką
 */
class TruckController {
  /**
   * Gauna visus vilkikus su įmonėmis
   * @param {Function} setLoading - Funkcija, kuri nustato krovimo būseną
   * @param {Function} setTrucks - Funkcija, kuri nustato vilkikų sąrašą
   * @param {Function} setError - Funkcija, kuri nustato klaidos būseną
   * @returns {Promise} Pažadas su vilkikų sąrašu
   */
  static async fetchTrucksWithCompanies(setLoading, setTrucks, setError) {
    return safeApiCall(
      () => TruckModel.getAll({ include: 'company' }),
      setLoading,
      setError,
      (data) => setTrucks(data)
    );
  }

  /**
   * Gauna visas įmones
   * @param {Function} setLoading - Funkcija, kuri nustato krovimo būseną
   * @param {Function} setCompanies - Funkcija, kuri nustato įmonių sąrašą
   * @param {Function} setError - Funkcija, kuri nustato klaidos būseną
   * @returns {Promise} Pažadas su įmonių sąrašu
   */
  static async fetchCompanies(setLoading, setCompanies, setError) {
    return safeApiCall(
      () => CompanyModel.getAll(),
      setLoading,
      setError,
      (data) => setCompanies(data)
    );
  }

  /**
   * Filtruoja vilkikus pagal paieškos tekstą
   * @param {Array} trucks - Vilkikų masyvas
   * @param {string} searchText - Paieškos tekstas
   * @returns {Array} Filtruotas vilkikų masyvas
   */
  static filterTrucks(trucks, searchText) {
    if (!searchText) return trucks;
    
    const searchLower = searchText.toLowerCase();
    return trucks.filter(truck => 
      truck.plateNumber.toLowerCase().includes(searchLower) ||
      truck.model?.toLowerCase().includes(searchLower) ||
      truck.company?.name.toLowerCase().includes(searchLower)
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
   * @param {Function} setLoading - Funkcija, kuri nustato krovimo būseną
   * @param {Function} setError - Funkcija, kuri nustato klaidos būseną
   * @param {Function} onSuccess - Funkcija, kuri iškviečiama sėkmės atveju
   * @returns {Promise} Pažadas su sukurto vilkiko duomenimis
   */
  static async createTruck(truckData, setLoading, setError, onSuccess) {
    return safeApiCall(
      () => TruckModel.create(truckData),
      setLoading,
      setError,
      onSuccess
    );
  }

  /**
   * Atnaujina esamą vilkiką
   * @param {number} id - Vilkiko ID
   * @param {Object} truckData - Atnaujinti vilkiko duomenys
   * @param {Function} setLoading - Funkcija, kuri nustato krovimo būseną
   * @param {Function} setError - Funkcija, kuri nustato klaidos būseną
   * @param {Function} onSuccess - Funkcija, kuri iškviečiama sėkmės atveju
   * @returns {Promise} Pažadas su atnaujinto vilkiko duomenimis
   */
  static async updateTruck(id, truckData, setLoading, setError, onSuccess) {
    return safeApiCall(
      () => TruckModel.update(id, truckData),
      setLoading,
      setError,
      onSuccess
    );
  }

  /**
   * Ištrina vilkiką
   * @param {number} id - Vilkiko ID
   * @param {Function} setLoading - Funkcija, kuri nustato krovimo būseną
   * @param {Function} setError - Funkcija, kuri nustato klaidos būseną
   * @param {Function} onSuccess - Funkcija, kuri iškviečiama sėkmės atveju
   * @returns {Promise} Pažadas su ištrynimo rezultatu
   */
  static async deleteTruck(id, setLoading, setError, onSuccess) {
    return safeApiCall(
      () => TruckModel.delete(id),
      setLoading,
      setError,
      onSuccess
    );
  }
}

export default TruckController; 