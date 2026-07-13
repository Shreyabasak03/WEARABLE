import React from 'react'
import {Heart} from 'lucide-react';
import './Men.css';
export default function Men() {
  const categories = [
 "Women's Tops",
  "Dresses",
  "Kurtis",
  "Sarees",
  "Jeans",
  "T-Shirts",
  "Shirts",
  "Skirts",
  "Shorts",
  "Jumpsuits",
];
const products = [
  {
    id: 1,
    name: "Women Orange Top",
    brand: "Shaggy Dresses Pvt.",
    price: 50,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500",
  },
  {
    id: 2,
    name: "Pink Dress",
    brand: "Fashion Hub",
    price: 75,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500",
  },
  {
    id: 3,
    name: "Casual Outfit",
    brand: "Style Studio",
    price: 60,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500",
  },
  {
    id: 4,
    name: "Summer Collection",
    brand: "Elegant Wear",
    price: 90,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500",
  },
  {
    id: 5,
    name: "Women Orange Top",
    brand: "Shaggy Dresses Pvt.",
    price: 50,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500",
  },
  {
    id: 6,
    name: "Women Orange Top",
    brand: "Shaggy Dresses Pvt.",
    price: 50,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500",
  },
  {
    id: 7,
    name: "Women Orange Top",
    brand: "Shaggy Dresses Pvt.",
    price: 50,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500",
  },
  {
    id: 8,
    name: "Women Orange Top",
    brand: "Shaggy Dresses Pvt.",
    price: 50,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500",
  },

  {
    id: 9,
    name: "Women Orange Top",
    brand: "Shaggy Dresses Pvt.",
    price: 50,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500",
  },
  {
    id: 10,
    name: "Women Orange Top",
    brand: "Shaggy Dresses Pvt.",
    price: 50,
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500",
  },
];
  return (
    <div className="men">
      <div className="image-card">
       <div className="image">
         <img 
          src="https://images.unsplash.com/photo-1753162659461-38d8ea5b15ab?q=80&w=3131&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="dress"
        />
       </div>
        <div className="category-slider">
  <div className="slide-track">
    {[...categories, ...categories].map((item, index) => (
      <span key={index}>{item}</span>
    ))}
  </div>
</div>
        
      </div>
      <div className="card">
          <div>
        <div className="big-img">

        </div>
        <div className="cards-container">
  {products.map((product) => (
    <div className="card" key={product.id}>

      <div className="img-box">
        <img src={product.image} alt={product.name} />
        <Heart className="heart" />
      </div>

      <div className="card-body">

        <div className="product-name">
          <h3>{product.name}</h3>
          <span>${product.price}</span>
        </div>

        <p>{product.brand}</p>

        <button>View More Details</button>

      </div>

    </div>
  ))}
</div>
    </div>
      </div>
    </div>
  
  )
}
