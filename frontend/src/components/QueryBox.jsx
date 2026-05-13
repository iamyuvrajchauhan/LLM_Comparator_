import React, { useState, useEffect } from 'react';
import { fetchModels } from '../services/api';

const QueryBox = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModels, setSelectedModels] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadModels = async () => {
      try {
        const data = await fetchModels();
        if (isMounted) {
          const allModels = data || [];
          
          const bestKeywords = [
            'claude-3-5-sonnet',
            'gpt-4o',
            'gpt-4o-mini',
            'mixtral',
            'llama-3',
            'gemini',
            'claude-3-haiku',
            'deepseek'
          ];
          
          const curated = [];
          for (const keyword of bestKeywords) {
             const found = allModels.find(m => String(m.id).toLowerCase().includes(keyword) && !curated.some(c => c.id === m.id));
             if (found) curated.push(found);
             if (curated.length >= 8) break;
          }
          
          if (curated.length < 8) {
            const addedIds = new Set(curated.map(c => c.id));
            for (const m of allModels) {
               if (!addedIds.has(m.id)) {
                 curated.push(m);
                 addedIds.add(m.id);
                 if (curated.length >= 8) break;
               }
            }
          }

          setAvailableModels(curated);
          const initialSelected = {};
          if (curated.length > 0) {
            initialSelected[curated[0].id] = true;
            if (curated.length > 1) {
              initialSelected[curated[1].id] = true;
            }
          }
          setSelectedModels(initialSelected);
        }
      } catch (err) {
        console.error('Failed to load dynamic models', err);
      }
    };
    loadModels();
    return () => { isMounted = false; };
  }, []);

  const getProviderIcon = (providerRaw) => {
    const provider = String(providerRaw || '').toLowerCase();
    if (provider.includes('anthropic') || provider.includes('claude')) {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        </svg>
      );
    }
    if (provider.includes('openai')) {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          <path d="M2 12h20"></path>
        </svg>
      );
    }
    if (provider.includes('mistral')) {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 14 10 14 10 20"></polyline>
          <polyline points="20 10 14 10 14 4"></polyline>
          <line x1="14" y1="10" x2="21" y2="3"></line>
          <line x1="3" y1="21" x2="10" y2="14"></line>
        </svg>
      );
    }
    if (provider.includes('meta')) {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5l-10 14M22 12H2M19 19L5 5"/>
        </svg>
      );
    }
    // Generic spark indicator
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    );
  };

  const getDisplayName = (id) => {
    const s = String(id).toLowerCase();
    if (s.includes('claude-3-5')) return 'Claude 3.5';
    if (s.includes('haiku')) return 'Claude 3 Haiku';
    if (s.includes('claude')) return 'Claude';
    if (s.includes('gpt-4o-mini')) return 'GPT-4o Mini';
    if (s.includes('gpt-4o')) return 'GPT-4o';
    if (s.includes('gpt-4')) return 'GPT-4';
    if (s.includes('mixtral')) return 'Mixtral 8x7B';
    if (s.includes('llama') || s.includes('meta')) return 'Meta Llama 3';
    if (s.includes('gemini')) return 'Gemini 1.5';
    if (s.includes('deepseek')) return 'DeepSeek';
    if (s.includes('qwen')) return 'Qwen';
    // Fallback: capitalize first word
    return s.split('-')[0].charAt(0).toUpperCase() + s.split('-')[0].slice(1);
  };

  const handleModelToggle = (modelId) => {
    setSelectedModels(prev => {
      const isCurrentlySelected = prev[modelId];
      if (!isCurrentlySelected) {
        const currentCount = Object.values(prev).filter(Boolean).length;
        if (currentCount >= 4) {
          return prev; // Do not allow more than 4 selections
        }
      }
      return {
        ...prev,
        [modelId]: !isCurrentlySelected
      };
    });
  };

  const selectedCount = Object.values(selectedModels).filter(Boolean).length;
  const selectedModelsList = availableModels.filter(m => selectedModels[m.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selected = Object.keys(selectedModels).filter(model => selectedModels[model]);
    if (query.trim() && !isLoading && selected.length > 0) {
      onSubmit(query, selected);
      setQuery('');
      setShowDropdown(false);
    }
  };

  return (
    <div className="breathtaking-panel" style={{ padding: '0.5rem', margin: '0', display: 'flex', flexDirection: 'column', background: 'var(--bg-elevated)', borderRadius: '12px', transition: 'all 0.3s ease-in-out' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        
        {isExpanded && (
          <textarea
            className="input-field"
            style={{ 
              border: 'none', 
              background: 'transparent', 
              width: '100%', 
              minHeight: '60px', 
              fontSize: '1rem', 
              resize: 'none', 
              padding: '1rem',
              boxShadow: 'none',
              animation: 'fadeIn 0.2s ease-out'
            }}
            placeholder="Ask a question to compare models..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          ></textarea>
        )}
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '0.75rem 0.5rem 0.5rem',
          borderTop: isExpanded ? '1px solid var(--border-color)' : 'none',
          position: 'relative'
        }}>
          {/* Left Area: Dropdown Button & Selected Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            
            <div style={{ position: 'relative' }}>
              <button 
                type="button" 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  background: showDropdown ? 'var(--bg-tertiary)' : 'transparent', 
                  border: '1px dashed var(--text-tertiary)', 
                  padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', color: showDropdown ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: 500, cursor: 'pointer', transition: 'all var(--transition-fast)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = showDropdown ? 'var(--text-primary)' : 'var(--text-tertiary)'; e.currentTarget.style.color = showDropdown ? 'var(--text-primary)' : 'var(--text-secondary)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span style={{ whiteSpace: 'nowrap' }}>Models ({selectedCount}/4)</span>
              </button>

              {/* Popup Menu */}
              {showDropdown && (
                <div style={{
                  position: 'absolute', bottom: 'calc(100% + 10px)', left: 0,
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--card-shadow-hover)',
                  width: '260px', zIndex: 50, padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem',
                  animation: 'fadeIn 0.15s ease-out forwards', textAlign: 'left'
                }}>
                  <div style={{ padding: '0.25rem 0.5rem 0.5rem', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Select up to 4 to compare
                  </div>
                  {availableModels.map(model => {
                    const isSelected = selectedModels[model.id];
                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => handleModelToggle(model.id)}
                        disabled={!isSelected && selectedCount >= 4}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '0.5rem 0.65rem', borderRadius: 'var(--border-radius-md)',
                          background: isSelected ? 'var(--bg-secondary)' : 'transparent',
                          border: 'none', cursor: (!isSelected && selectedCount >= 4) ? 'not-allowed' : 'pointer',
                          color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                          opacity: (!isSelected && selectedCount >= 4) ? 0.4 : 1,
                          transition: 'all var(--transition-fast)'
                        }}
                        onMouseOver={(e) => { if(!isSelected && selectedCount < 4) e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                        onMouseOut={(e) => { if(!isSelected) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left' }}>
                          <div style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-tertiary)', display: 'flex' }}>
                            {getProviderIcon(model.provider)}
                          </div>
                          <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? 600 : 400, whiteSpace: 'nowrap' }}>{getDisplayName(model.id)}</span>
                        </div>
                        <div style={{ width: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {isSelected && (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {selectedModelsList.map(m => (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', 
                padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--text-primary)',
                fontWeight: 500, boxShadow: 'var(--card-shadow)', whiteSpace: 'nowrap',
                animation: 'fadeIn 0.2s ease-out'
              }}>
                <div style={{ color: 'var(--text-tertiary)', display: 'flex' }}>
                   {getProviderIcon(m.provider)}
                </div>
                <span>{getDisplayName(m.id)}</span>
                <button type="button" onClick={() => handleModelToggle(m.id)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', marginLeft: '0.25rem', opacity: 0.7 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            ))}
          </div>

          {/* Right Area: Send Button & Expand Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'transparent', border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)', cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              title={isExpanded ? "Collapse Chatbox" : "Expand Chatbox"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s ease' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!query.trim() || isLoading || selectedCount === 0}
              style={{ 
                borderRadius: '20px', padding: '0.5rem 1.5rem',
                opacity: (!query.trim() || isLoading || selectedCount === 0) ? 0.5 : 1,
                cursor: (!query.trim() || isLoading || selectedCount === 0) ? 'not-allowed' : 'pointer',
                fontWeight: 600, letterSpacing: '0.01em', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid transparent', borderTopColor: 'currentColor', animation: 'spin 1s linear infinite' }} />
                  Running
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  Send
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
      {showDropdown && (
        <div 
          onClick={() => setShowDropdown(false)} 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }} 
        />
      )}
    </div>
  );
};

export default QueryBox;
