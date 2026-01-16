import React, { useState } from "react";
import GraphVisualizer from "./components/GraphVisualizer";
import ControlPanel from "./components/ControlPanel";
import { GraphSearcher } from "./services/graphLogic";
import { checkArticleExists, getArticleDetails } from "./services/wikiApi";
import { LuOrbit, LuX, LuExternalLink, LuMousePointer2, LuClock, LuEye } from "react-icons/lu";

function App() {
  const [isSearching, setIsSearching] = useState(false);
  const [resultPath, setResultPath] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Gotowy do działania!");
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);

  const [modalData, setModalData] = useState(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const handleNodeClick = async (event, node) => {
    setModalData({ loading: true, title: node.data.label });
    const details = await getArticleDetails(node.data.label);
    setModalData({
      loading: false,
      title: node.data.label,
      summary: details ? details.summary : "Brak opisu.",
      thumbnail: details ? details.thumbnail : null,
    });
  };

  const closeModal = () => setModalData(null);

  const visualizePath = (path, explorationTree) => {
    if (!explorationTree) return;

    const pathSet = new Set(path);
    const newNodes = [];

    const depthGroups = {};
    explorationTree.nodes.forEach((node) => {
      if (!depthGroups[node.depth]) depthGroups[node.depth] = [];
      depthGroups[node.depth].push(node);
    });

    Object.keys(depthGroups).forEach((key) => {
      const depth = parseInt(key);
      const nodesInLayer = depthGroups[depth];

      const mainPathNode = nodesInLayer.find((n) => pathSet.has(n.id));
      const ghostNodes = nodesInLayer.filter((n) => !pathSet.has(n.id));

      const spacingY = 250;

      if (mainPathNode) {
        newNodes.push({
          id: mainPathNode.id,
          type: "wikiNode",
          position: { x: 0, y: depth * spacingY },
          data: {
            label: mainPathNode.id,
            isStart: mainPathNode.id === path[0],
            isEnd: mainPathNode.id === path[path.length - 1],
            isGhost: false,
            isOnPath: true,
            depth: depth
          },
          zIndex: 100,
        });
      }

      const spacingX = 180;
      ghostNodes.forEach((ghost, index) => {
        const direction = index % 2 === 0 ? -1 : 1;
        const multiplier = Math.floor(index / 2) + 1;
        const xPos = multiplier * spacingX * direction;

        newNodes.push({
          id: ghost.id,
          type: "wikiNode",
          position: { x: xPos, y: depth * spacingY },
          data: { 
            label: ghost.id, 
            isGhost: true, // To jest duch
            isOnPath: false,
            depth: depth 
          },
          zIndex: 1,
        });
      });
    });

    const newEdges = explorationTree.edges.map((edge, i) => {
      const sourceIndex = path.indexOf(edge.source);
      const targetIndex = path.indexOf(edge.target);
      const isPathEdge =
        sourceIndex !== -1 &&
        targetIndex !== -1 &&
        targetIndex === sourceIndex + 1;

      return {
        id: `e-${i}`,
        source: edge.source,
        target: edge.target,
        animated: isPathEdge,
        style: {
          stroke: isPathEdge ? "var(--ink-navy)" : "rgba(47, 42, 71, 0.1)",
          strokeWidth: isPathEdge ? 4 : 1,
          opacity: isPathEdge ? 1 : 0.4,
        },
        type: isPathEdge ? "smoothstep" : "default",
      };
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const handleSearch = async (start, target, maxDepth = 3) => {
    setIsSearching(true);
    setResultPath(null);
    setStats(null);
    setNodes([]);
    setEdges([]);
    setStatusMessage(`Wyszukiwanie połączeń od ${start}...`);

    const startExists = await checkArticleExists(start);
    if (!startExists) {
      setStatusMessage(`Ups! "${start}" nie został znaleziony.`);
      setIsSearching(false);
      return;
    }
    const targetExists = await checkArticleExists(target);
    if (!targetExists) {
      setStatusMessage(`Ups! "${target}" nie został znaleziony.`);
      setIsSearching(false);
      return;
    }

    setStatusMessage(`Analizuję warstwy Wiki (depth: ${maxDepth})...`);
    const searcher = new GraphSearcher();

    const result = await searcher.findShortestPath(
      start,
      target,
      maxDepth,
      (current) => {
        setStatusMessage(`Sprawdzam: ${current}`);
      }
    );

    setIsSearching(false);

    if (result.path) {
      setStatusMessage(`BINGO! Znaleziono ścieżkę!`);
      setResultPath(result.path);
      setStats(result.stats);

      visualizePath(result.path, result.explorationTree);

      setHistory((prev) => {
        const newItem = { start, target };
        const newHistory = [
          newItem,
          ...prev.filter((i) => i.start !== start || i.target !== target),
        ].slice(0, 5);
        return newHistory;
      });
    } else {
      setStatusMessage(
        `Niestety, nie znaleziono ścieżki. Spróbuj bliższych tematów.`
      );
      setStats(result.stats);
      if (result.explorationTree) {
        visualizePath([], result.explorationTree);
      }
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <nav style={{ 
        background: 'var(--bg-cream)', borderBottom: '3px solid var(--ink-navy)', padding: '16px 30px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <div style={{ 
             background: 'var(--digital-blue)', border: '3px solid var(--ink-navy)', 
             boxShadow: '3px 3px 0px var(--ink-navy)', borderRadius: '12px',
             width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-navy)' 
           }}>
             <LuOrbit size={28} />
           </div>
           <div>
             <div className="chunky-text" style={{ fontSize: '1.8rem', lineHeight: 1 }}>Wiki<span style={{ color: 'var(--digital-blue)', textShadow: '2px 2px 0px var(--ink-navy)' }}>Game</span></div>
             <div className="mono-text" style={{ fontSize: '0.75rem', opacity: 0.8 }}>Wersja dla leniwych</div>
           </div>
        </div>
        <div className="mono-text" style={{ 
          background: 'var(--peach-warm)', padding: '8px 16px', border: '2px solid var(--ink-navy)', 
          borderRadius: '12px', fontWeight: 'bold', boxShadow: '2px 2px 0px var(--ink-navy)' 
        }}>
           PROJEKT: NADIA ZATORSKA
        </div>
      </nav>

      {modalData && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="chunky-text" style={{ fontSize: '1.4rem' }}>
                 {modalData.loading ? 'LOADING DATA...' : modalData.title.toUpperCase()}
              </span>
              <button onClick={closeModal} style={{ 
                background: 'var(--ink-navy)', color: 'white', border: 'none', 
                width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <LuX size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              {modalData.loading ? (
                <div style={{ width: '100%', textAlign: 'center', padding: '40px' }} className="mono-text">Connecting to Knowledge Base...</div>
              ) : (
                <>
                  <div style={{ flex: 1 }}>
                    <div className="mono-text" style={{ marginBottom: '10px', color: 'var(--digital-blue)', fontWeight: 'bold' }}>// ABSTRACT</div>
                    <p style={{ lineHeight: '1.7', fontSize: '0.95rem', fontFamily: 'Nunito', fontWeight: 600 }}>
                      {modalData.summary}
                    </p>
                    <a href={`https://pl.wikipedia.org/wiki/${encodeURIComponent(modalData.title)}`} target="_blank" rel="noreferrer"
                      className="btn-pop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '20px', fontSize: '0.9rem', padding: '10px 16px' }}
                    >
                      READ FULL ENTRY <LuExternalLink />
                    </a>
                  </div>
                  {modalData.thumbnail && (
                    <div style={{ width: '220px', flexShrink: 0 }}>
                      <img src={modalData.thumbnail} alt="thumb" style={{ 
                        width: '100%', borderRadius: '16px', border: '3px solid var(--ink-navy)', boxShadow: '4px 4px 0px var(--ink-navy)' 
                      }} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', padding: '24px', gap: '24px', overflow: 'hidden' }}>
        
        <div style={{ width: '350px', flexShrink: 0 }}>
          <ControlPanel onSearch={handleSearch} isSearching={isSearching} stats={stats} history={history} onHistoryClick={(s, t) => handleSearch(s, t, 3)} />
        </div>

        <div className="card-pop" style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: 0 }}>
          
          <div style={{ 
            position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 20,
            background: 'white', padding: '10px 24px', borderRadius: '50px', 
            border: '3px solid var(--ink-navy)', boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
            fontFamily: 'JetBrains Mono', fontWeight: 'bold', fontSize: '0.85rem'
          }}>
             {statusMessage}
          </div>

          <GraphVisualizer customNodes={nodes} customEdges={edges} onNodeClick={handleNodeClick} />

          {stats && resultPath && (
            <div style={{ 
              position: 'absolute', bottom: '24px', left: '24px', right: '24px',
              background: 'var(--peach-warm)',
              border: '3px solid var(--ink-navy)', borderRadius: '20px', padding: '16px',
              display: 'flex', justifyContent: 'space-around', alignItems: 'center',
              boxShadow: '4px 4px 0px var(--ink-navy)', zIndex: 20
            }}>
               <div style={{ textAlign: 'center' }}>
                 <div className="mono-text" style={{ opacity: 0.7, marginBottom: '4px', display:'flex', gap:'5px', alignItems:'center', justifyContent:'center' }}><LuMousePointer2/> DEPTH</div>
                 <div className="chunky-text" style={{ fontSize: '1.5rem' }}>{stats.depth}</div>
               </div>
               <div style={{ width: '3px', height: '40px', background: 'var(--ink-navy)' }}></div>
               <div style={{ textAlign: 'center' }}>
                 <div className="mono-text" style={{ opacity: 0.7, marginBottom: '4px', display:'flex', gap:'5px', alignItems:'center', justifyContent:'center' }}><LuEye/> NODES</div>
                 <div className="chunky-text" style={{ fontSize: '1.5rem' }}>{stats.visitedCount}</div>
               </div>
               <div style={{ width: '3px', height: '40px', background: 'var(--ink-navy)' }}></div>
               <div style={{ textAlign: 'center' }}>
                 <div className="mono-text" style={{ opacity: 0.7, marginBottom: '4px', display:'flex', gap:'5px', alignItems:'center', justifyContent:'center' }}><LuClock/> TIME</div>
                 <div className="chunky-text" style={{ fontSize: '1.5rem' }}>{stats.timeMs}ms</div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;