import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
  return (
    <header 
      className="position-absolute top-0 start-0 p-4"
      style={{ zIndex: 50 }}
    >
      <div>
        <h3 
          className="fw-bold text-dark mb-1"
          style={{ 
            fontFamily: "Pacifico, cursive",
            fontSize: "1.9rem",
          }}
        >
          Study With Me
        </h3>

        <p className="text-muted me-0" style={{ fontSize: "1rem" }}>
          by Venlong Hak
        </p>
      </div>
    </header>
  );
};

export default Header;
