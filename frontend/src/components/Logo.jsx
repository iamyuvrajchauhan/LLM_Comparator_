import React from 'react';

const Logo = ({ width = 36, height = 36, className = "" }) => {
  return (
    <div className={`logo-container ${className}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0px 0px 8px rgba(100, 200, 255, 0.4))' }}
      >
        {/* Abstract Glowing Hexagon/Forge Base */}
        <path 
          d="M50 5L90 27.5V72.5L50 95L10 72.5V27.5L50 5Z" 
          stroke="var(--text-primary)" 
          strokeWidth="4" 
          strokeLinejoin="round" 
        />
        {/* Inner Tech Node Hierarchy */}
        <circle cx="50" cy="50" r="12" fill="var(--text-primary)" />
        <circle cx="30" cy="35" r="5" fill="var(--text-tertiary)" />
        <circle cx="70" cy="35" r="5" fill="var(--text-tertiary)" />
        <circle cx="50" cy="80" r="6" fill="var(--text-secondary)" />
        
        {/* Neural Connections */}
        <path 
          d="M34 38L45 46M66 38L55 46M50 62L50 74" 
          stroke="var(--text-secondary)" 
          strokeWidth="3" 
          strokeLinecap="round" 
        />
        
        {/* Energy Pulse Ring */}
        <path 
          d="M50 18C31.5 18 16.5 33 16.5 51.5C16.5 70 31.5 85 50 85" 
          stroke="var(--bg-secondary)" 
          strokeWidth="2" 
          strokeDasharray="4 4" 
        />
      </svg>
      <span style={{ 
        marginLeft: '0.75rem', 
        fontSize: `calc(${width}px * 0.55)`, 
        fontWeight: 800, 
        letterSpacing: '-0.03em',
        background: 'linear-gradient(90deg, var(--text-primary) 0%, var(--text-tertiary) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        LLMFORGE
      </span>
    </div>
  );
};

export default Logo;
