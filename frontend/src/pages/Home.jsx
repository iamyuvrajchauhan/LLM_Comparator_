import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { AuthContext } from '../context/AuthContext';
import Logo from '../components/Logo';
import '../styles/main.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const bestModels = [
    { name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
    { name: 'GPT-4o', provider: 'OpenAI' },
    { name: 'Mixtral 8x7B', provider: 'Mistral' },
    { name: 'Llama 3 70B', provider: 'Meta' },
  ];

  return (
    <div className="home-container" style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)', overflowX: 'hidden' }}>
      
      {/* Navbar */}
      <nav style={{ padding: '1.5rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent', zIndex: 10 }}>
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'transform 0.2s ease' }} 
             onClick={() => navigate('/')} 
             onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} 
             onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
          <Logo width={32} height={32} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <ThemeToggle />
          {user ? (
             <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ padding: '0.6rem 1.5rem', borderRadius: '30px' }}>Dashboard</button>
          ) : (
             <button className="btn btn-primary" onClick={() => navigate('/login')} style={{ padding: '0.6rem 1.5rem', borderRadius: '30px' }}>Login / Sign Up</button>
          )}
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Hero Section */}
        <section style={{ padding: '6rem 5% 8rem', textAlign: 'center', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          
          {/* Ambient Glow */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(100,200,255,0.06) 0%, transparent 60%)', zIndex: 0, pointerEvents: 'none' }} />
          
          <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '2rem', zIndex: 1 }}>
            ✨ Enterprise Multi-Model Architecture
          </div>

          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: '800', lineHeight: 1.05, marginBottom: '2rem', letterSpacing: '-0.04em', color: 'var(--text-primary)', zIndex: 1 }}>
             The Ultimate <br />
             <span style={{ 
               background: 'linear-gradient(90deg, var(--text-primary) 0%, var(--text-tertiary) 100%)',
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
             }}>AI Synthesis</span> Platform
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '3rem', maxWidth: '750px', zIndex: 1 }}>
            Stop switching between ChatGPT, Claude, and Gemini tabs. LLMForge lets you query up to 4 premier models concurrently, then uses AI to seamlessly synthesize their intelligence into one perfect answer.
          </p>
          <div style={{ display: 'flex', gap: '1rem', zIndex: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-primary animate-pulse-glow" style={{ padding: '1.1rem 2.5rem', fontSize: '1.05rem', letterSpacing: '0.02em', fontWeight: 600, borderRadius: '30px' }} onClick={() => navigate(user ? '/dashboard' : '/login')}>
              Deploy Workspaces Free
            </button>
            <button className="btn btn-secondary" style={{ padding: '1.1rem 2.5rem', fontSize: '1.05rem', letterSpacing: '0.02em', fontWeight: 600, borderRadius: '30px' }} onClick={() => {
              document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
            }}>
              Discover How It Works
            </button>
          </div>
        </section>

        {/* Powered By Models Band */}
        <section style={{ padding: '3rem 5%', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
           <p style={{ textAlign: 'center', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '2rem' }}>Powered by the world's most advanced reasoning engines</p>
           <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4rem', opacity: 0.8 }}>
              {bestModels.map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{m.name}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>by {m.provider}</span>
                </div>
              ))}
           </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" style={{ padding: '8rem 5%', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '1rem' }}>Smarter workflows in 3 steps.</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>LLMForge handles the heavy lifting of prompting multiple architectures so you can focus strictly on the results.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
              
              <div className="enterprise-panel" style={{ padding: '3rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '8rem', fontWeight: 900, color: 'var(--bg-tertiary)', opacity: 0.5, lineHeight: 1 }}>1</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)', position: 'relative' }}>Curate Your Stack</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem', position: 'relative' }}>
                  Use our beautiful floating UI menu to select exactly which models should tackle your prompt. Choose from over 500+ dynamic models piped straight from the Puter.js network.
                </p>
              </div>

              <div className="enterprise-panel" style={{ padding: '3rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '8rem', fontWeight: 900, color: 'var(--bg-tertiary)', opacity: 0.5, lineHeight: 1 }}>2</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)', position: 'relative' }}>Parallel Processing</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem', position: 'relative' }}>
                  Our Node.js backend broadcasts your prompt concurrently to Anthropic, OpenAI, Meta, and Mistral infrastructure. Results stream back lightning fast into isolated code-friendly views.
                </p>
              </div>

              <div className="enterprise-panel" style={{ padding: '3rem', borderRadius: '24px', position: 'relative', overflow: 'hidden', borderTop: '4px solid var(--text-primary)' }}>
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '8rem', fontWeight: 900, color: 'var(--bg-tertiary)', opacity: 0.5, lineHeight: 1 }}>3</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)', position: 'relative' }}>Pure Synthesis</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1.05rem', position: 'relative' }}>
                  We automatically pipe every generated answer back into a dedicated GPT-4o synthesis agent. It drafts a final, definitive conclusion highlighting agreements and unique insights.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Feature Highlights section */}
        <section style={{ padding: '6rem 5% 8rem', backgroundColor: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '5rem', letterSpacing: '-0.02em' }}>Enterprise-Grade Features</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
              
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '16px', boxShadow: 'var(--card-shadow)', border: '1px solid var(--border-color)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Device Sync & Persistence</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>Every query you send is securely encrypted and saved to MongoDB. Seamlessly resume your chats crossing between desktop and mobile devices.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '16px', boxShadow: 'var(--card-shadow)', border: '1px solid var(--border-color)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5l-10 14M22 12H2M19 19L5 5"/></svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Dynamic Puter SDK</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>Direct integration with the global Puter node network guarantees zero API billing limits. You have absolute freedom to scale multi-model comparisons.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '16px', boxShadow: 'var(--card-shadow)', border: '1px solid var(--border-color)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><path d="M13 8l4 4-4 4"></path></svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Developer Readability</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>Code blocks are beautifully formatted via GitHub-flavored markdown algorithms, wrapped safely within strict CSS grid layout protections.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '16px', boxShadow: 'var(--card-shadow)', border: '1px solid var(--border-color)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>100% Mobile Fluidity</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>Fully responsive glassmorphism architecture. Collapsible active chat windows and sidebars grant you absolute control, even on mobile viewports.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Expanded Footer */}
      <footer style={{ padding: '4rem 5% 2rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
         <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '3rem', marginBottom: '2rem' }}>
            
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                <Logo width={24} height={24} />
              </div>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '300px' }}>
                The ultimate multi-model reasoning and AI architecture testing tool. Built for power users and researchers.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h5 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Platform</h5>
                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem' }}>Models Network</a>
                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem' }}>Smart Synthesis</a>
                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem' }}>Security Protocol</a>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h5 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Resources</h5>
                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem' }}>Documentation</a>
                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem' }}>Puter.js SDK</a>
                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem' }}>Open Source API</a>
              </div>
            </div>

         </div>
         <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
           <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>© {new Date().getFullYear()} LLMForge Technologies. All rights reserved.</p>
           <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
             <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', cursor: 'pointer' }}>Privacy Policy</span>
             <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', cursor: 'pointer' }}>Terms of Service</span>
           </div>
         </div>
      </footer>
    </div>
  );
};

export default Home;
