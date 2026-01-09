import React, { useState } from 'react';
import { LuSearch, LuMapPin, LuRocket, LuHistory, LuArrowDown } from 'react-icons/lu';

export default function ControlPanel({ onSearch, isSearching, stats, history, onHistoryClick }) {
  const [start, setStart] = useState('Harry Potter');
  const [target, setTarget] = useState('Polska');
  const [depth, setDepth] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (start && target) onSearch(start, target, depth);
  };

  return (
    <div className="card-pop" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ textAlign: 'center', borderBottom: '3px dashed var(--ink-navy)', paddingBottom: '16px' }}>
        <h2 className="chunky-text" style={{ margin: 0, fontSize: '1.6rem', color: 'var(--ink-navy)' }}>
           Panel sterowania
        </h2>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div>
          <label className="mono-text" style={{ display:'block', marginBottom:'6px', fontWeight:'bold' }}>PUNKT STARTOWY</label>
          <div style={{ position: 'relative' }}>
            <LuSearch style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--ink-navy)' }} size={20} />
            <input className="input-pop" style={{ paddingLeft: '48px' }} type="text" value={start} onChange={(e) => setStart(e.target.value)} disabled={isSearching} />
          </div>
        </div>

        <div>
          <label className="mono-text" style={{ display:'block', marginBottom:'6px', fontWeight:'bold' }}>PUNKT KOŃCOWY</label>
          <div style={{ position: 'relative' }}>
            <LuMapPin style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--ink-navy)' }} size={20} />
            <input className="input-pop" style={{ paddingLeft: '48px' }} type="text" value={target} onChange={(e) => setTarget(e.target.value)} disabled={isSearching} />
          </div>
        </div>

        <div style={{ background: '#F0FBFF', padding: '12px', borderRadius: '16px', border: '2px solid var(--ink-navy)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
             <span className="chunky-text">LIMIT</span>
             <span className="mono-text" style={{ background: 'var(--ink-navy)', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>{depth}</span>
           </div>
           <input type="range" min="1" max="5" value={depth} onChange={(e) => setDepth(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--digital-blue)' }} disabled={isSearching} />
        </div>

        <button type="submit" className="btn-pop" disabled={isSearching}>
          {isSearching ? 'W TRAKCIE...' : 'SZUKAJ!'}
        </button>
      </form>

      {history.length > 0 && (
        <div style={{ marginTop: 'auto' }}>
          <h4 className="mono-text" style={{ margin: '0 0 12px 0', borderBottom: '2px solid var(--ink-navy)', display:'inline-block' }}>HISTORIA</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {history.map((item, idx) => (
              <div key={idx} onClick={() => { setStart(item.start); setTarget(item.target); onHistoryClick(item.start, item.target); }}
                style={{ 
                  background: 'white', padding: '6px 12px', borderRadius: '12px', 
                  border: '2px solid var(--ink-navy)', cursor: 'pointer',
                  fontFamily: 'JetBrains Mono', fontSize: '0.7rem', fontWeight: 'bold',
                  boxShadow: '2px 2px 0px rgba(26,27,65,0.1)'
                }}>
               {item.start} → {item.target}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}