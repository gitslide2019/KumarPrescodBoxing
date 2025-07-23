import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ShoppingCart, Heart, Star, Filter, Search } from 'lucide-react';
import { useAnalytics } from '../contexts/AnalyticsContext';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  sizes?: string[];
  colors?: string[];
}

const Shop: React.FC = () => {
  const { trackEvent, trackAddToCart } = useAnalytics();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    trackEvent('Page', 'View', 'Shop');
    
    // Mock products data
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Kumar Prescod Signature Boxing Gloves",
        price: 89.99,
        originalPrice: 119.99,
        image: "/images/product-1.jpg",
        category: "equipment",
        rating: 4.8,
        reviews: 127,
        inStock: true,
        sizes: ["S", "M", "L", "XL"],
      },
      {
        id: 2,
        name: "Oakland Pride Boxing Hoodie",
        price: 59.99,
        image: "/images/product-2.jpg",
        category: "apparel",
        rating: 4.6,
        reviews: 89,
        inStock: true,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Red", "Gray"],
      },
      {
        id: 3,
        name: "Undefeated Champion T-Shirt",
        price: 29.99,
        image: "/images/product-3.jpg",
        category: "apparel",
        rating: 4.7,
        reviews: 156,
        inStock: true,
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Black", "Red"],
      },
      {
        id: 4,
        name: "Training Camp Water Bottle",
        price: 19.99,
        image: "/images/product-4.jpg",
        category: "accessories",
        rating: 4.5,
        reviews: 67,
        inStock: true,
      },
      {
        id: 5,
        name: "Kumar Prescod Autographed Photo",
        price: 49.99,
        image: "/images/product-5.jpg",
        category: "memorabilia",
        rating: 4.9,
        reviews: 234,
        inStock: true,
      },
      {
        id: 6,
        name: "Boxing Shorts - Limited Edition",
        price: 79.99,
        image: "/images/product-6.jpg",
        category: "apparel",
        rating: 4.4,
        reviews: 45,
        inStock: false,
        sizes: ["S", "M", "L"],
      },
    ];
    
    setProducts(mockProducts);
  }, [trackEvent]);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    trackAddToCart(product);
    trackEvent('Shop', 'Add to Cart', product.name);
  };

  const filteredProducts = products.filter(product => {
    const matchesFilter = filter === 'all' || product.category === filter;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'apparel', name: 'Apparel' },
    { id: 'equipment', name: 'Equipment' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'memorabilia', name: 'Memorabilia' },
  ];

  return (
    <>
      <Helmet>
        <title>Shop - Kumar Prescod Official Store | Boxing Merchandise</title>
        <meta name="description" content="Shop official Kumar Prescod boxing merchandise, apparel, equipment, and memorabilia. Support the rising star of boxing." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 text-white">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container-max text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-6xl font-bold mb-6"
          >
            Official <span className="gradient-text">Store</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Support Kumar's journey with official merchandise, apparel, and boxing equipment.
          </motion.p>
        </div>
      </section>

      {/* Shop Section */}
      <section className="section-padding bg-gradient-to-b from-red-900/40 to-amber-900/40">
        <div className="container-max">
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-secondary-600" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card overflow-hidden group"
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-br from-primary-600 to-gold-500 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">🛍️</div>
                      <div className="text-sm opacity-80">{product.name}</div>
                    </div>
                  </div>
                  
                  {/* Sale Badge */}
                  {product.originalPrice && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      SALE
                    </div>
                  )}
                  
                  {/* Out of Stock Badge */}
                  {!product.inStock && (
                    <div className="absolute top-4 right-4 bg-gray-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      OUT OF STOCK
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-secondary-600 ml-2">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center mb-4">
                    <span className="text-2xl font-bold text-primary-600">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-secondary-400 line-through ml-2">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                      product.inStock
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-lg shadow-lg"
            >
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-semibold">{cart.length} items</span>
              </div>
              <div className="text-sm opacity-80">
                Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default Shop; 