import React from 'react';

const SidebarLogo = () => {
  return (
    <div className="sidebar-logo-container">
      <img 
        src="/logo.png" 
        alt="Boden Logo" 
        className="sidebar-logo-img"
        style={{ width: '90px', height: 'auto', opacity: 0.9 }}
      />
    </div>
  );
};

export default SidebarLogo;
