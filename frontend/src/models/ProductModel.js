import axios from 'axios';
import { handleApiError } from '../utils/common';

/**
 * Transforms product data from backend (snake_case) to frontend (camelCase) format
 * @param {Object} product - Product data from backend
 * @returns {Object} Transformed product data for frontend
 */
const transformProductFromBackend = (product) => {
  if (!product) return null;
  
  return {
    id: product.id,
    name: product.name,
    nameEn: product.name_en,
    nameRu: product.name_ru,
    nameDe: product.name_de,
    unit: product.unit,
    // Add a placeholder for code to maintain compatibility with existing code
    code: product.id.toString(), // Using ID as a fallback for code
    createdAt: product.created_at,
    updatedAt: product.updated_at
  };
};

/**
 * Transforms product data from frontend (camelCase) to backend (snake_case) format
 * @param {Object} product - Product data from frontend
 * @returns {Object} Transformed product data for backend
 */
const transformProductToBackend = (product) => {
  const { code, ...rest } = product; // Remove code field as it's not in the backend
  
  return {
    name: rest.name,
    name_en: rest.nameEn,
    name_ru: rest.nameRu,
    name_de: rest.nameDe,
    unit: rest.unit
  };
};

/**
 * ProductModel - Klasė, valdanti produktų duomenis
 */
class ProductModel {
  /**
   * Gauna visų produktų sąrašą
   * @returns {Promise} Pažadas su produktų sąrašu
   */
  static async getAll() {
    try {
      const response = await axios.get('/api/products');
      // Transform each product to frontend format
      return response.data.map(transformProductFromBackend);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gauna vieną produktą pagal ID
   * @param {number} id - Produkto ID
   * @returns {Promise} Pažadas su produkto duomenimis
   */
  static async getById(id) {
    try {
      const response = await axios.get(`/api/products/${id}`);
      // Transform product to frontend format
      return transformProductFromBackend(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sukuria naują produktą
   * @param {Object} productData - Naujo produkto duomenys
   * @returns {Promise} Pažadas su sukurto produkto duomenimis
   */
  static async create(productData) {
    try {
      // Transform product to backend format
      const backendData = transformProductToBackend(productData);
      const response = await axios.post('/api/products', backendData);
      // Transform response back to frontend format
      return transformProductFromBackend(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atnaujina esamą produktą
   * @param {number} id - Produkto ID
   * @param {Object} productData - Atnaujinti produkto duomenys
   * @returns {Promise} Pažadas su atnaujinto produkto duomenimis
   */
  static async update(id, productData) {
    try {
      // Transform product to backend format
      const backendData = transformProductToBackend(productData);
      const response = await axios.put(`/api/products/${id}`, backendData);
      // Transform response back to frontend format
      return transformProductFromBackend(response.data);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Ištrina produktą
   * @param {number} id - Produkto ID
   * @returns {Promise} Pažadas su ištrynimo rezultatu
   */
  static async delete(id) {
    try {
      const response = await axios.delete(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default ProductModel;