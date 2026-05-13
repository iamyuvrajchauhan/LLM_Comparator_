import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

const markdownComponents = {
  pre: ({ children }) => <>{children}</>,
  code({ node, inline, className, children, ...props }) {
    if (!inline && (className || String(children).includes('\n'))) {
      return <CodeBlock className={className}>{children}</CodeBlock>;
    }
    return <code className={className} style={{ background: 'var(--bg-tertiary)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.85em' }} {...props}>{children}</code>;
  }
};

const SummaryCard = ({ summary }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="enterprise-panel" 
         onClick={() => setIsExpanded(!isExpanded)}
         style={{ 
      padding: '2rem', 
      marginBottom: '2rem', 
      background: 'linear-gradient(145deg, var(--bg-secondary) 0%, var(--bg-elevated) 100%)',
      border: '1px solid var(--border-color)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all var(--transition-normal)'
    }}>
      {/* Decorative top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--text-tertiary)' }}></div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: isExpanded ? '1rem' : 0, borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none', marginBottom: isExpanded ? '1.5rem' : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '36px', height: '36px', borderRadius: '8px', background: 'var(--bg-tertiary)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            AI Synthesis
          </h2>
        </div>
        
        <div style={{ color: 'var(--text-secondary)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      
      {isExpanded && (
        <div className="markdown-prose stagger-reveal" style={{ 
          fontSize: '1rem', 
          lineHeight: 1.8, 
          color: 'var(--text-secondary)'
        }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{summary}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
