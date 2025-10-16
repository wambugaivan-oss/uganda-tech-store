  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // This is the fixed line:
        const response = await fetch('/api/products'); 
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);
