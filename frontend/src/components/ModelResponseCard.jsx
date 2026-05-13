import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

// Clean up model names from old data (e.g. "Puter (gpt-4o)" -> "GPT-4o")
const cleanModelName = (name) => {
  if (!name) return 'AI Model';
  // Strip any "Puter (...)" wrapper from old DB records
  const puterMatch = name.match(/^puter\s*\(([^)]+)\)$/i);
  if (puterMatch) return cleanModelName(puterMatch[1].trim());

  const s = name.toLowerCase();
  if (s.includes('claude-3-5') || s.includes('claude-3.5')) return 'Claude 3.5 Sonnet';
  if (s.includes('haiku')) return 'Claude 3 Haiku';
  if (s.includes('claude')) return 'Claude';
  if (s.includes('gpt-4o-mini')) return 'GPT-4o Mini';
  if (s.includes('gpt-4o')) return 'GPT-4o';
  if (s.includes('gpt-4')) return 'GPT-4';
  if (s.includes('mixtral')) return 'Mixtral 8x7B';
  if (s.includes('llama') || s.includes('meta')) return 'Meta Llama 3';
  if (s.includes('gemini')) return 'Gemini 1.5';
  if (s.includes('deepseek')) return 'DeepSeek';
  return name;
};

const markdownComponents = {
  pre: ({ children }) => <>{children}</>,
  code({ node, inline, className, children, ...props }) {
    if (!inline && (className || String(children).includes('\n'))) {
      return <CodeBlock className={className}>{children}</CodeBlock>;
    }
    return <code className={className} style={{ background: 'var(--bg-tertiary)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.85em' }} {...props}>{children}</code>;
  }
};

const ModelResponseCard = ({ modelName, answer }) => {
  return (
    <div className="breathtaking-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', maxWidth: '100%', minWidth: 0, overflow: 'hidden' }}>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-primary)', boxShadow: '0 0 8px var(--text-primary)' }}></div>
        <h3 style={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-primary)' }}>{cleanModelName(modelName)}</h3>
      </div>
      <div className="markdown-prose stagger-reveal" style={{ overflowY: 'auto', overflowX: 'hidden', flex: 1, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{answer}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ModelResponseCard;
