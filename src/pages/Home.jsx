import React, { useRef, useState, useEffect } from 'react';
import './Home.css';

export default function ScrollSequence() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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

    handleScroll(); // Call once on mount

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

          <button className="shop-btn">Shop Now &rarr;</button>
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
    </div>
  );
}