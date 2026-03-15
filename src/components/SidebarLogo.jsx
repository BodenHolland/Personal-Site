import React from 'react';
import { motion } from 'framer-motion';

const SidebarLogo = () => {
  // SVG paths for the two halves of the logo - precisely reconstructed from the image
  // Top Half: rounded top-right, straight left, teeth on bottom
  const topPath = `
    M 15 52 
    L 15 15 
    C 15 8 22 2 30 2 
    L 55 2 
    C 75 2 85 15 85 28 
    C 85 41 75 52 55 52 
    L 48 52 
    L 48 38 
    L 38 38 
    L 38 52 
    L 28 52 
    L 28 38 
    L 18 38 
    L 18 52 
    Z
  `;
  
  const bottomPath = `
    M 15 58 
    L 18 58 
    L 18 72 
    L 28 72 
    L 28 58 
    L 38 58 
    L 38 72 
    L 48 72 
    L 48 58 
    L 55 58 
    C 75 58 85 69 85 82 
    C 85 95 75 108 55 108 
    L 30 108 
    C 22 108 15 102 15 95 
    L 15 58 
    Z
  `;

  return (
    <div className="sidebar-logo-container">
      <svg 
        width="60" 
        height="80" 
        viewBox="0 0 100 110" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="sidebar-logo-svg"
      >
        <defs>
          <filter id="logo-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <linearGradient id="trace-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#fff" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Base Logo Shapes - Dark for visibility on white */}
        <path d={topPath} fill="rgba(30, 41, 59, 0.05)" stroke="rgba(30, 41, 59, 0.2)" strokeWidth="1.5" />
        <path d={bottomPath} fill="rgba(30, 41, 59, 0.05)" stroke="rgba(30, 41, 59, 0.2)" strokeWidth="1.5" />

        {/* Animated Tracing Lights - Vibrant Blue */}
        {/* Top Path Trace */}
        <motion.path
          d={topPath}
          stroke="#4f46e5"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0.2, pathOffset: 0, opacity: 0 }}
          animate={{ 
            pathOffset: [0, 1],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ filter: 'drop-shadow(0 0 4px rgba(79, 70, 229, 0.6))' }}
        />

        {/* Bottom Path Trace (Staggered) */}
        <motion.path
          d={bottomPath}
          stroke="#4f46e5"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0.2, pathOffset: 0, opacity: 0 }}
          animate={{ 
            pathOffset: [0, 1],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          style={{ filter: 'drop-shadow(0 0 4px rgba(79, 70, 229, 0.6))' }}
        />
      </svg>
    </div>
  );
};

export default SidebarLogo;
