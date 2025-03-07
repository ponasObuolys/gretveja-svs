import React, { useState, useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';
import ProductDeleteModal from '../components/products/ProductDeleteModal';
import ProductController from '../controllers/ProductController';
import { sortItems } from '../utils/common';

/**
 * Produktų administravimo puslapis
 * @returns {JSX.Element} Produktų administravimo puslapio komponentas
 */
function Produktai() {
  // Būsenos kintamieji
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [productSort, setProductSort] = useState({ field: 'code', direction: 'asc' });
  
  // Produkto formos būsenos kintamieji
  const [showProductForm, setShowProductForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    code: '',
    name: '',
    nameEn: '',
    nameRu: '',
    unit: 'VNT'
  });
  
  // Produkto ištrynimo būsenos kintamieji
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Duomenų užkrovimas
  useEffect(() => {
    fetchData();
  }, []);
  
  /**
   * Užkrauna produktų duomenis
   */
  const fetchData = async () => {
    await ProductController.fetchProducts(setLoading, setProducts, setError);
  };
  
  /**
   * Tvarko rūšiavimo keitimą
   * @param {string} category - Kategorija (products)
   * @param {string} field - Laukelis, pagal kurį rūšiuojama
   */
  const handleSort = (category, field) => {
    ProductController.handleSort(productSort, field, setProductSort);
  };
  
  /**
   * Atidaro produkto pridėjimo formą
   */
  const handleAddProduct = () => {
    setCurrentProduct(null);
    setProductFormData({
      code: '',
      name: '',
      nameEn: '',
      nameRu: '',
      unit: 'VNT'
    });
    setShowProductForm(true);
  };
  
  /**
   * Atidaro produkto redagavimo formą
   * @param {Object} product - Produkto objektas
   */
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setProductFormData({
      code: product.code,
      name: product.name,
      nameEn: product.nameEn || '',
      nameRu: product.nameRu || '',
      unit: product.unit || 'VNT'
    });
    setShowProductForm(true);
  };
  
  /**
   * Tvarko produkto formos įvesties pakeitimus
   * @param {Object} e - Įvykio objektas
   */
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData({
      ...productFormData,
      [name]: value
    });
  };
  
  /**
   * Išsaugo produktą
   * @param {Object} e - Įvykio objektas 
   */
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (currentProduct) {
        // Atnaujinti esamą produktą
        await ProductController.updateProduct(
          currentProduct.id, 
          productFormData, 
          setLoading, 
          setError,
          () => {
            fetchData();
            setShowProductForm(false);
          }
        );
      } else {
        // Sukurti naują produktą
        await ProductController.createProduct(
          productFormData, 
          setLoading, 
          setError,
          () => {
            fetchData();
            setShowProductForm(false);
          }
        );
      }
    } catch (err) {
      console.error('Klaida išsaugant produktą:', err);
      setError('Nepavyko išsaugoti produkto. Bandykite dar kartą vėliau.');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Atidaro produkto ištrynimo patvirtinimo modalą
   * @param {Object} product - Produkto objektas
   */
  const handleDeleteProductClick = (product) => {
    setProductToDelete(product);
    setShowDeleteProductModal(true);
  };
  
  /**
   * Ištrina produktą
   */
  const handleDeleteProduct = async () => {
    try {
      setLoading(true);
      
      await ProductController.deleteProduct(
        productToDelete.id,
        setLoading,
        setError,
        () => {
          setProducts(products.filter(p => p.id !== productToDelete.id));
          setShowDeleteProductModal(false);
          setProductToDelete(null);
        }
      );
    } catch (err) {
      console.error('Klaida ištrinant produktą:', err);
      setError('Nepavyko ištrinti produkto. Bandykite dar kartą vėliau.');
    } finally {
      setLoading(false);
    }
  };
  
  // Filtruoti ir rūšiuoti produktus
  const filteredProducts = sortItems(
    ProductController.filterProducts(products, productSearch),
    productSort
  );
  
  return (
    <Container className="admin-container">
      <h1 className="text-center my-4">Produktų administravimas</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* Produktų sąrašas */}
      <ProductList
        products={products}
        productSearch={productSearch}
        setProductSearch={setProductSearch}
        productSort={productSort}
        handleSort={handleSort}
        handleAddProduct={handleAddProduct}
        handleEditProduct={handleEditProduct}
        handleDeleteProductClick={handleDeleteProductClick}
        loading={loading}
        filteredProducts={filteredProducts}
      />
      
      {/* Produkto forma */}
      <ProductForm
        showProductForm={showProductForm}
        setShowProductForm={setShowProductForm}
        currentProduct={currentProduct}
        productFormData={productFormData}
        handleProductInputChange={handleProductInputChange}
        handleSaveProduct={handleSaveProduct}
        loading={loading}
      />
      
      {/* Produkto ištrynimo patvirtinimo modalas */}
      <ProductDeleteModal
        showDeleteProductModal={showDeleteProductModal}
        setShowDeleteProductModal={setShowDeleteProductModal}
        productToDelete={productToDelete}
        handleDeleteProduct={handleDeleteProduct}
        loading={loading}
      />
    </Container>
  );
}

export default Produktai; 