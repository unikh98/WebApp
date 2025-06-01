import React, { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    document.title = "Camlabs";
  }, []);

  const phoneNumber = "919972706169";

  const handleWhatsAppClick = () => {
    const message = `Hi, I'm interested in renting a DSLR camera. Please provide more details.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
      <main className="main-content">
        {/* Products Section */}
        <section className="body-section">
          <h2>Products</h2>
          <div className="wip-text">
            <span className="crane">🏗️</span>
            <span className="message">Building Something Awesome...</span>
            <span className="hammer">🔨</span>
          </div>
        </section>

        {/* About Section */}
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
