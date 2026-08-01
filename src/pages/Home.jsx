import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingCart,
  ArrowRight,
  Truck,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

import ProductDetails from '../components/ProductDetails';
import { getProductsByCategory } from '../api/ProductsApi.js';
import { useCart } from '../context/cartContext.jsx';
import './Home.css';

export default function ScrollSequence() {
  const containerRef = useRef(null);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // States for dynamic API products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  // 1. Fetch dynamic products from the API (Same logic as Men.jsx)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [shirts, shoes, watches] = await Promise.all([
          getProductsByCategory("mens-shirts"),
          getProductsByCategory("mens-shoes"),
          getProductsByCategory("mens-watches"),
        ]);

        setProducts([...shirts, ...shoes, ...watches]);
      } catch (err) {
        console.error("Error loading trending products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 2. Scroll sequence calculations
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableHeight = rect.height - windowHeight;

      if (totalScrollableHeight <= 0) return;

      // Calculate progress clamped strictly between 0 and 1
      const progress = Math.min(
        Math.max(-rect.top / totalScrollableHeight, 0),
        1
      );
      setScrollProgress(progress);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Animation calculation ranges
  const zoomProgress = Math.min(scrollProgress / 0.5, 1);
  const wipeProgress = scrollProgress > 0.5 ? (scrollProgress - 0.5) / 0.5 : 0;

  const imageScale = 0.25 + zoomProgress * 0.75;
  const imageRadius = Math.max(8 - zoomProgress * 8, 0);
  const clipPercentage = 100 - wipeProgress * 100;

  // Smooth Slider Navigation Logic
  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth * 0.75;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Categories Data
  const categories = [
    {
      name: "Women's Collection",
      image:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800',
      link: '/men',
    },
    {
      name: 'Dresses & Tops',
      image:
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800',
      link: '/men',
    },
    {
      name: 'Trending Styles',
      image:
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800',
      link: '/men',
    },
  ];

  return (
    <div className="page-wrapper">
      {/* HERO SECTION */}
      <section className="home">
        <div className="left">
          <span className="tag">NEW COLLECTION</span>

          <h1 className="heading">
            Where Style <br />
            Meets Elegance
          </h1>

          <p className="para">
            Find your perfect outfit with our latest fashion arrivals. Premium
            quality with modern designs for every occasion.
          </p>

          <button className="shop-btn" onClick={() => navigate('/men')}>
            Shop Now &rarr;
          </button>
        </div>

        <div className="right">
          <div className="big">
            <div className="right-tab">Elevate Your Style</div>
            <img
              className="img"
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
              alt="Fashion main visual"
            />
            <div className="left-tab">Start Shopping</div>
          </div>

          <div className="small">
            <img
              className="small-img"
              src="https://images.unsplash.com/photo-1684244160171-97f5dac39204?q=80&w=987&auto=format&fit=crop"
              alt="Fashion thumbnail 1"
            />
            <img
              className="small-img"
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
              alt="Fashion thumbnail 2"
            />
            <img
              className="small-img"
              src="https://images.unsplash.com/photo-1507680434567-5739c80be1ac?q=80&w=2070&auto=format&fit=crop"
              alt="Fashion thumbnail 3"
            />
          </div>
        </div>
      </section>

      {/* SCROLL SEQUENCE ANIMATION SECTION */}
      <section className="scroll-container" ref={containerRef}>
        <div className="sticky-viewport">
          {/* Phase 1: Text Layer */}
          <div
            className="hero-text-layer"
            style={{ opacity: Math.max(1 - zoomProgress * 1.5, 0) }}
          >
            <span className="subtitle">the ESSENCE of VERO</span>
            <h1>
              <span className="italic-text">where</span> INNOVATION
              <br />
              meets CRAFTSMANSHIP
            </h1>
          </div>

          {/* Phase 2: Zoom Container */}
          <div
            className="zooming-image-wrapper"
            style={{
              transform: `scale(${imageScale})`,
              borderRadius: `${imageRadius}px`,
              width: zoomProgress >= 1 ? '100%' : 'clamp(250px, 80vw, 500px)',
              height: zoomProgress >= 1 ? '100%' : 'clamp(180px, 45vh, 350px)',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200"
              alt="First fashion garment"
              className="full-cover-img"
            />

            {/* Phase 3: Wipe Overlay */}
            <div
              className="wipe-image-layer"
              style={{
                clipPath: `polygon(${clipPercentage}% 0%, 100% 0%, 100% 100%, ${clipPercentage}% 100%)`,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200"
                alt="Second artwork transition"
                className="full-cover-img grayscaled"
              />
              <div className="wipe-text-layer">
                <h2>From DRESS, to DATA, to SCULPTURE.</h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES SECTION */}
      <section className="home-categories">
        <div className="section-header">
          <h2>Explore Categories</h2>
          <p>Handpicked styles designed for your everyday wardrobe</p>
        </div>

        <div className="category-grid">
          {categories.map((cat, index) => (
            <div
              className="category-card"
              key={index}
              onClick={() => navigate(cat.link)}
            >
              <img src={cat.image} alt={cat.name} />
              <div className="category-overlay">
                <h3>{cat.name}</h3>
                <span className="cat-link">Explore Now &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRENDING ARRIVALS (SLIDER WITH LIVE API DATA) */}
      <section className="featured-products">
        <div className="section-header-slider">
          <div className="header-text">
            <h2>Trending Arrivals</h2>
            <p>Discover our top-rated fashion pieces of the week</p>
          </div>

          {/* Slider Controls */}
          <div className="slider-controls">
            <button
              className="nav-btn prev-btn"
              onClick={() => scrollSlider('left')}
              aria-label="Previous Slide"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              className="nav-btn next-btn"
              onClick={() => scrollSlider('right')}
              aria-label="Next Slide"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Scrollable Slider Track */}
        <div className="product-slider-track" ref={sliderRef}>
          {loading ? (
            <div className="loading-container">
              <h3>Loading Trending Arrivals...</h3>
            </div>
          ) : products.length > 0 ? (
            products.map((product) => (
              <div className="slider-card" key={product.id}>
                <div className="card-media">
                  <img 
                    src={product.thumbnail || product.images?.[0]} 
                    alt={product.title} 
                    loading="lazy" 
                  />

                  {/* Quick Action Overlay */}
                  <div className="media-overlay">
                    <button
                      className="quick-action-btn"
                      onClick={() => setSelectedProduct(product)}
                      title="Quick View Modal"
                    >
                      <Eye size={18} /> Quick View
                    </button>
                    <button
                      className="quick-action-btn primary"
                      onClick={() => addToCart(product, 1)}
                      title="Add to Cart"
                    >
                      <ShoppingCart size={18} /> Add
                    </button>
                  </div>
                </div>

                <div className="card-info">
                  <span className="card-brand">{product.brand || 'Wearable'}</span>
                  <h3 className="card-title">{product.title}</h3>
                  <div className="card-bottom">
                    <span className="card-price">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <button
                      className="details-link-btn"
                      onClick={() => setSelectedProduct(product)}
                    >
                      Details &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h3>No products available</h3>
          )}
        </div>

        <div className="view-all-wrapper">
          <Link to="/men" className="view-all-btn">
            View Full Catalog <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* PERKS & FEATURES BANNER */}
      <section className="features-banner">
        <div className="feature-item">
          <Truck size={32} />
          <h4>Free Express Delivery</h4>
          <p>On all orders over $99</p>
        </div>

        <div className="feature-item">
          <ShieldCheck size={32} />
          <h4>Secure Payment</h4>
          <p>100% encrypted shopping</p>
        </div>

        <div className="feature-item">
          <RefreshCw size={32} />
          <h4>Easy Returns</h4>
          <p>30-day return policy</p>
        </div>
      </section>

      {/* PRODUCT DETAILS MODAL TRIGGER */}
      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}