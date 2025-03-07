import ProductModel from '../models/ProductModel';
import { safeApiCall, handleApiError, getNewSortDirection } from '../utils/common';

/**
 * ProductController - Klasė, valdanti produktų biznio logiką
 */
class ProductController {
  /**
   * Gauna visus produktus
   * @param {Function} setLoading - Funkcija, kuri nustato krovimo būseną
   * @param {Function} setProducts - Funkcija, kuri nustato produktų sąrašą
   * @param {Function} setError - Funkcija, kuri nustato klaidos būseną
   * @returns {Promise} Pažadas su produktų sąrašu
   */
  static async fetchProducts(setLoading, setProducts, setError) {
    return safeApiCall(
      () => ProductModel.getAll(),
      setLoading,
      setError,
      (data) => setProducts(data)
    );
  }

  /**
   * Filtruoja produktus pagal paieškos tekstą
   * @param {Array} products - Produktų masyvas
   * @param {string} searchText - Paieškos tekstas
   * @returns {Array} Filtruotas produktų masyvas
   */
  static filterProducts(products, searchText) {
    if (!searchText) return products;
    
    const searchLower = searchText.toLowerCase();
    return products.filter(product => 
      product.code.toLowerCase().includes(searchLower) ||
      product.name.toLowerCase().includes(searchLower) ||
      product.nameEn?.toLowerCase().includes(searchLower) ||
      product.nameRu?.toLowerCase().includes(searchLower)
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
   * Sukuria naują produktą
   * @param {Object} productData - Naujo produkto duomenys
   * @param {Function} setLoading - Funkcija, kuri nustato krovimo būseną
   * @param {Function} setError - Funkcija, kuri nustato klaidos būseną
   * @param {Function} onSuccess - Funkcija, kuri iškviečiama sėkmės atveju
   * @returns {Promise} Pažadas su sukurto produkto duomenimis
   */
  static async createProduct(productData, setLoading, setError, onSuccess) {
    return safeApiCall(
      () => ProductModel.create(productData),
      setLoading,
      setError,
      onSuccess
    );
  }

  /**
   * Atnaujina esamą produktą
   * @param {number} id - Produkto ID
   * @param {Object} productData - Atnaujinti produkto duomenys
   * @param {Function} setLoading - Funkcija, kuri nustato krovimo būseną
   * @param {Function} setError - Funkcija, kuri nustato klaidos būseną
   * @param {Function} onSuccess - Funkcija, kuri iškviečiama sėkmės atveju
   * @returns {Promise} Pažadas su atnaujinto produkto duomenimis
   */
  static async updateProduct(id, productData, setLoading, setError, onSuccess) {
    return safeApiCall(
      () => ProductModel.update(id, productData),
      setLoading,
      setError,
      onSuccess
    );
  }

  /**
   * Ištrina produktą
   * @param {number} id - Produkto ID
   * @param {Function} setLoading - Funkcija, kuri nustato krovimo būseną
   * @param {Function} setError - Funkcija, kuri nustato klaidos būseną
   * @param {Function} onSuccess - Funkcija, kuri iškviečiama sėkmės atveju
   * @returns {Promise} Pažadas su ištrynimo rezultatu
   */
  static async deleteProduct(id, setLoading, setError, onSuccess) {
    return safeApiCall(
      () => ProductModel.delete(id),
      setLoading,
      setError,
      onSuccess
    );
  }
}

export default ProductController; 