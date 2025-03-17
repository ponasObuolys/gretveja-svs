import React, { useState, useEffect, useCallback } from 'react';
import { Container, Alert, Row, Col, Button } from 'react-bootstrap';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';
import ProductDeleteModal from '../components/products/ProductDeleteModal';
import ProductController from '../controllers/ProductController';
import { sortItems } from '../utils/common';
import { useTranslation } from 'react-i18next';

/**
 * Produktų administravimo puslapis
 * @returns {JSX.Element} Produktų administravimo puslapio komponentas
 */
function Produktai() {
  const { t } = useTranslation();
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
  
  // Duomenų užkrovimo funkcija su useCallback
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const productsResult = await ProductController.fetchProducts();
      setProducts(Array.isArray(productsResult) ? productsResult : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(t('common.errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);
  
  // Duomenų užkrovimas
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
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
    if (!product) return;
    
    setCurrentProduct(product);
    setProductFormData({
      code: product.code || '',
      name: product.name || '',
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
    setProductFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  /**
   * Išsaugo produktą
   * @param {Object} e - Įvykio objektas 
   */
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (currentProduct) {
        // Atnaujinti esamą produktą
        await ProductController.updateProduct(currentProduct.id, productFormData);
      } else {
        // Sukurti naują produktą
        await ProductController.createProduct(productFormData);
      }
      
      await fetchData();
      setShowProductForm(false);
    } catch (err) {
      console.error('Error saving product:', err);
      setError(t('common.errors.saveFailed'));
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Atidaro produkto ištrynimo patvirtinimo modalą
   * @param {Object} product - Produkto objektas
   */
  const handleDeleteProductClick = (product) => {
    if (!product) return;
    
    setProductToDelete(product);
    setShowDeleteProductModal(true);
  };
  
  /**
   * Ištrina produktą
   */
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      setLoading(true);
      setError(null);
      
      await ProductController.deleteProduct(productToDelete.id);
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setShowDeleteProductModal(false);
      setProductToDelete(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(t('common.errors.deleteFailed'));
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
      <h1 className="text-center my-4">{t('common.tables.products')}</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row className="mb-3">
        <Col>
          <Button 
            variant="primary" 
            onClick={handleAddProduct}
            disabled={loading}
          >
            {t('common.buttons.add')} {t('common.labels.product')}
          </Button>
        </Col>
        <Col className="text-end">
          <Button 
            variant="secondary" 
            onClick={fetchData}
            disabled={loading}
          >
            {t('common.buttons.refresh')}
          </Button>
        </Col>
      </Row>
      
      <ProductList
        products={filteredProducts}
        productSearch={productSearch}
        setProductSearch={setProductSearch}
        productSort={productSort}
        handleSort={handleSort}
        handleEditProduct={handleEditProduct}
        handleDeleteProductClick={handleDeleteProductClick}
        loading={loading}
        filteredProducts={filteredProducts}
      />
      
      <ProductForm
        showProductForm={showProductForm}
        setShowProductForm={setShowProductForm}
        currentProduct={currentProduct}
        productFormData={productFormData}
        handleProductInputChange={handleProductInputChange}
        handleSaveProduct={handleSaveProduct}
        loading={loading}
      />
      
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