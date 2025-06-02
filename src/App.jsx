import React, { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState({ categories: [], products: [] });
  const [selectedCategory, setSelectedCategory] = useState('');
  const categoryScrollRef = useRef(null);

  // Drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    document.title = "Camlabs";

    fetch("https://s3.ap-south-1.amazonaws.com/camlabs.in/content.json")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setSelectedCategory(json.categories[0]);
      });
  }, []);

  // Scroll buttons
  const scroll = (direction) => {
    const container = categoryScrollRef.current;
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -150 : 150,
        behavior: 'smooth'
      });
    }
  };

  // Drag logic
  const handleMouseDown = (e) => {
    const slider = categoryScrollRef.current;
    isDragging.current = true;
    slider.classList.add('dragging');
    startX.current = e.pageX - slider.offsetLeft;
    scrollLeft.current = slider.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const slider = categoryScrollRef.current;
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    slider.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    categoryScrollRef.current.classList.remove('dragging');
  };

  const handleMouseLeave = () => {
    if (isDragging.current) handleMouseUp();
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "919972706169";
    const message = `Hi, I'm interested in renting a DSLR camera. Please provide more details.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const filteredProducts = data.products.filter(p => p.category === selectedCategory);

  return (
    <main className="main-content">
      <section className="categories-section">
        <h2>Categories</h2>
        <div className="scroll-wrapper">
          <div className="scroll-fade-left" />
          <div
            className="category-scroll"
            ref={categoryScrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {data.categories.map(cat => (
              <button
                key={cat}
                className={`category-tile-app ${selectedCategory === cat ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="scroll-fade-right" />
        </div>
      </section>


      <section className="products-section">
        <h2>{selectedCategory} </h2>

        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <div className="product-card placeholder">
              <h3>Products are being added</h3>
              <p>Please wait...</p>
            </div>
          ) : (filteredProducts.map(prod => (
            <div key={prod.id} className="product-card">
              <img src={prod.image || '/No_Image_Available.jpg'}
                alt={prod.name}
                onError={(e) => { e.target.onerror = null; e.target.src = '/No_Image_Available.jpg'; }} />
              <h3>{prod.name}</h3>
              <p>{prod.description}</p>
              <div className="price-block">
                  <>
                    <div className="price-line">
                      <span className="old-price">₹{prod.price}</span>
                      <span className="new-price">₹{prod.offerPrice}</span>
                    </div>
                    <span className="discount-tag">
                      {prod.price > 0
                        ? `${Math.round(((+prod.price - +prod.offerPrice) / +prod.price) * 100)}% OFF`
                        : ''}

                    </span>
                  </>
               
              </div>
              <a
                className="book-now-btn"
                href={`https://wa.me/919972706169?text=${encodeURIComponent(
                  `Hi, I'm interested in "${prod.name}" priced at ₹${prod.offerPrice || prod.price}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="whatsapp-icon"></span> Book Now
              </a>
            </div>
          )))}
        </div>

      </section>

      <section className="about">
        <h2>About Us</h2>
        <p>
          We offer top-quality DSLR cameras and accessories on rent in Mangalore.
          Whether you're a beginner or a pro, we’ve got the perfect gear for your shoot.
        </p>
        <button onClick={handleWhatsAppClick}>
          Enquire on WhatsApp
        </button>
      </section>
    </main>
  );
}

export default App;
