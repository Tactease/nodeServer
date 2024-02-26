import React from 'react';
import reactLogo from '../assets/react.svg';
import './header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo-container">
        <a href="/">
          <img src={reactLogo} className="logo" alt="React logo" />
        </a>
      </div>
      {/* Add other header content */}
    </header>
  );
}

export default Header;