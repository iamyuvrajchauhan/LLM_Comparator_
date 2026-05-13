import React, { useState } from 'react';

const CodeBlock = ({ children, className }) => {
  const [copied, setCopied] = useState(false);
  const language = className?.replace('language-', '') || '';

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div style={{ 
      position: 'relative', 
      marginBlock: '1.25rem',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      background: '#0d0d0d'
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.4rem 1rem',
        background: '#2f2f2f',
        borderBottom: '1px solid #1a1a1a'
      }}>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'lowercase',
          color: '#b4b4b4',
          letterSpacing: '0.02em',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'transparent',
            border: 'none',
            color: copied ? '#22c55e' : '#b4b4b4',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 500,
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
          onMouseEnter={(e) => { 
            if (!copied) {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }
          }}
          onMouseLeave={(e) => { 
            if (!copied) {
              e.currentTarget.style.color = '#b4b4b4';
              e.currentTarget.style.background = 'transparent';
            }
          }}
          title="Copy code"
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              Copy code
            </>
          )}
        </button>
      </div>
      {/* Code content */}
      <pre style={{
        margin: 0,
        padding: '1.25rem 1rem',
        overflowX: 'auto',
        fontSize: '0.875rem',
        lineHeight: 1.6,
        color: '#e3e3e3'
      }}>
        <code style={{ fontFamily: "Fira Code, Consolas, Monaco, monospace" }}>{children}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
