import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css'; // Assuming you have a CSS file

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // !!! CRITICAL CORRECTION: Using relative path for Vercel deployment !!!
        const response = await fetch('/api/products'); 
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="products-loading">Loading products...</div>;
  }

  return (
    <div className="products-page">
      <h1>All Products</h1>
      <div className="product-list">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
