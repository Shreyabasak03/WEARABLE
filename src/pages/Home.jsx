// import React from 'react'
// import './Home.css'

// export default function 
// () {
//   return (
//     <div className='home'>

//       <div className="left">
//   <span className="tag">NEW COLLECTION</span>

//   <h1 className="heading">
//     Where Style <br />
//     Meets Elegance
//   </h1>

//   <p className="para">
//     Find your perfect outfit with our latest fashion arrivals.
//     Premium quality with modern designs for every occasion.
//   </p>

//   <button className="shop-btn">
//     Shop Now →
//   </button>
// </div>
//       <div className="right">
//         <div class="big">
//           <div class="right-tab">
//             Elevate
// Your Style
//           </div>
//           <img className='img'
//       src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//       alt="Fashion"
//     />
//     <div class="left-tab">
//       Start Shopping
//     </div>
//         </div>
         
//     <div className="small">
//       <img className='small-img'
//       src="https://images.unsplash.com/photo-1684244160171-97f5dac39204?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//       alt="Fashion"
//     />
//     <img className='small-img'
//     src="https://plus.unsplash.com/premium_photo-1675186049419-d48f4b28fe7c?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//       alt="Fashion"
//     />
//     <img className='small-img'
//       src="https://images.unsplash.com/photo-1507680434567-5739c80be1ac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//       alt="Fashion"
//     />
//     </div>
     
//       </div>
//     </div>
//   )
// }


import React, { useRef, useState, useEffect } from 'react';
import './Home.css';

export default function ScrollSequence() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const totalHeight = rect.height - window.innerHeight;
      
      // Calculate how far down the user has scrolled within this specific section
      // clamped between 0 (start) and 1 (end)
      const progress = Math.min(Math.max(-rect.top / totalHeight, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Split the total 0-1 progress into two distinct animation ranges
  // 1. Zoom Phase: from progress 0 to 0.5
  const zoomProgress = Math.min(scrollProgress / 0.5, 1); 
  
  // 2. Wipe Phase: from progress 0.5 to 1.0
  const wipeProgress = scrollProgress > 0.5 ? (scrollProgress - 0.5) / 0.5 : 0;

  // Calculate scales and clips dynamically
  const imageScale = 0.25 + zoomProgress * 0.75; // Starts small (25%), scales up to 100%
  const imageRadius = Math.max(8 - zoomProgress * 8, 0); // Smooth border-radius reduction to 0
  
  // Slide 3 clip-path: unmasks from the right (100% to 0%)
  const clipPercentage = 100 - wipeProgress * 100;

  return (
    <div>
       <div className='home'>

      <div className="left">
  <span className="tag">NEW COLLECTION</span>

  <h1 className="heading">
    Where Style <br />
    Meets Elegance
  </h1>

  <p className="para">
    Find your perfect outfit with our latest fashion arrivals.
    Premium quality with modern designs for every occasion.
  </p>

  <button className="shop-btn">
    Shop Now →
  </button>
</div>
      <div className="right">
        <div class="big">
          <div class="right-tab">
            Elevate
Your Style
          </div>
          <img className='img'
      src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="Fashion"
    />
    <div class="left-tab">
      Start Shopping
    </div>
        </div>
         
    <div className="small">
      <img className='small-img'
      src="https://images.unsplash.com/photo-1684244160171-97f5dac39204?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="Fashion"
    />
    <img className='small-img'
    src="https://plus.unsplash.com/premium_photo-1675186049419-d48f4b28fe7c?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="Fashion"
    />
    <img className='small-img'
      src="https://images.unsplash.com/photo-1507680434567-5739c80be1ac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      alt="Fashion"
    />
    </div>
     
      </div>
    </div>
    <div className="scroll-container" ref={containerRef}>
      <div className="sticky-viewport">
        
        {/* PHASE 1: Main Text Content (Fades out gently as zoom finishes) */}
        <div 
          className="hero-text-layer"
          style={{ opacity: Math.max(1 - zoomProgress * 1.5, 0) }}
        >
          <span className="subtitle">the ESSENCE of VERO</span>
          <h1>
            <span className="italic-text">where</span> INNOVATION<br />
            meets CRAFTSMANSHIP
          </h1>
        </div>

        {/* PHASE 2: The Zooming Image Container */}
        <div 
          className="zooming-image-wrapper"
          style={{
            transform: `scale(${imageScale})`,
            borderRadius: `${imageRadius}px`,
            width: zoomProgress >= 1 ? '100%' : '500px',
            height: zoomProgress >= 1 ? '100%' : '350px'
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200" 
            alt="First fashion garment" 
            className="full-cover-img"
          />

          {/* PHASE 3: The Overlay Wipe Slide */}
          <div 
            className="wipe-image-layer"
            style={{ clipPath: `polygon(${clipPercentage}% 0%, 100% 0%, 100% 100%, ${clipPercentage}% 100%)` }}
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
    </div>
    </div>
  );
}