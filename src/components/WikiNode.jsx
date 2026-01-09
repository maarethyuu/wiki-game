import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { LuFileText, LuZap, LuTarget } from "react-icons/lu";

const WikiNode = ({ data }) => {
  const isPath = data.isOnPath;
  const isStart = data.isStart;
  const isEnd = data.isEnd;

  let borderColor = 'var(--ink-navy)';
  let bgColor = 'white';
  let icon = <LuFileText size={20} />;

  if (isStart) {
    bgColor = 'var(--digital-blue)';
    icon = <LuZap size={20} />;
  } else if (isEnd) {
    bgColor = 'var(--peach-warm)';
    icon = <LuTarget size={20} />;
  } else if (isPath) {
    bgColor = '#E0F7FA';
    borderColor = 'var(--digital-blue)';
  }

  return (
    <div className={`node-pop-container ${data.isSearching ? 'node-searching' : ''}`}
      style={{
        padding: '12px',
        borderRadius: '12px',
        background: bgColor,
        border: `3px solid ${borderColor}`,
        boxShadow: isPath ? '6px 6px 0px var(--ink-navy)' : '3px 3px 0px var(--ink-navy)',
        width: '180px',
        transition: 'all 0.3s var(--bounce)'
      }}>
      <Handle type="target" position={Position.Top} style={{ background: 'var(--ink-navy)' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <div style={{ opacity: 0.8 }}>{icon}</div>
        <div className="mono-text" style={{ fontSize: '0.6rem', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.6 }}>
          {isStart ? 'Punkt Startowy' : isEnd ? 'Cel' : `Poziom ${data.depth}`}
        </div>
      </div>

      <div style={{ 
        fontFamily: "'Baloo 2', cursive", 
        fontSize: '0.9rem', 
        fontWeight: '800', 
        lineHeight: '1.2',
        color: 'var(--ink-navy)',
        wordBreak: 'break-word'
      }}>
        {data.label}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: 'var(--ink-navy)' }} />
    </div>
  );
};

export default memo(WikiNode);