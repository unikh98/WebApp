import React, { useEffect } from 'react';
import './layout.css';

function Layout({ children, title }) {
  useEffect(() => {
    document.title = title || "Camlabs";
  }, [title]);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <img src="/logo.png" alt="Camlabs Logo" className="logo-img" />
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>©2025 CamLabs</p>
      </footer>
    </div>
  );
}

export default Layout;
