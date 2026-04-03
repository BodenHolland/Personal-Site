import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, X, ChevronLeft } from 'lucide-react';

const GraphView = ({ 
  sections, 
  booksData, 
  screensData, 
  audioData, 
  products, 
  projectsData, 
  photographyData,
  renderSpatialContent,
  onClose
}) => {
  const fgRef = useRef();
  const [imgCache, setImgCache] = useState({});
  const [activeSpatialNode, setActiveSpatialNode] = useState('intro'); // Start inside intro
  const [zoomLevel, setZoomLevel] = useState(1);

  // Prepare graph data
  const graphData = useMemo(() => {
    const nodes = [];
    const links = [];

    // Filter out sections we want to render, ensuring 'intro' gets the 'root' styling treatment
    sections.filter(s => !s.hidden).forEach(s => {
      const isIntro = s.id === 'intro';
      nodes.push({ 
        id: s.id, 
        name: s.label, 
        val: isIntro ? 24 : 16, 
        type: isIntro ? 'root' : 'section', 
        color: isIntro ? '#111111' : '#3b82f6' 
      });
      
      // Link all sections to intro
      if (!isIntro) {
        links.push({ source: 'intro', target: s.id });
      }

      if (s.id === 'reading') {
        ['books', 'screens', 'audio'].forEach(cat => {
          const catId = `cat-${cat}`;
          nodes.push({ id: catId, name: cat.charAt(0).toUpperCase() + cat.slice(1), val: 12, type: 'category', color: '#60a5fa' });
          links.push({ source: s.id, target: catId });

          if (cat === 'books') {
            booksData.slice(0, 10).forEach(item => {
              nodes.push({ id: `book-${item.title}`, name: item.title, img: item.coverImageUrl, val: 8, type: 'item', category: 'books', color: '#93c5fd' });
              links.push({ source: catId, target: `book-${item.title}` });
            });
          } else if (cat === 'screens') {
            screensData.slice(0, 10).forEach(item => {
              nodes.push({ id: `screen-${item.title}`, name: item.title, img: item.coverImageUrl, val: 8, type: 'item', category: 'screens', color: '#93c5fd' });
              links.push({ source: catId, target: `screen-${item.title}` });
            });
          } else if (cat === 'audio') {
            audioData.slice(0, 12).forEach(item => {
              nodes.push({ id: `audio-${item.title}`, name: item.title, img: item.coverUrl, val: 8, type: 'item', category: 'audio', color: '#93c5fd' });
              links.push({ source: catId, target: `audio-${item.title}` });
            });
          }
        });
      } else if (s.id === 'products') {
        products.slice(0, 15).forEach(item => {
          nodes.push({ id: `prod-${item.name}`, name: item.name, img: item.iconUrl, val: 10, type: 'item', category: 'products', color: '#fbbf24' });
          links.push({ source: s.id, target: `prod-${item.name}` });
        });
      } else if (s.id === 'projects') {
        projectsData.forEach(item => {
          nodes.push({ id: `proj-${item.title}`, name: item.title, img: item.image, val: 14, type: 'item', category: 'projects', color: '#ef4444' });
          links.push({ source: s.id, target: `proj-${item.title}` });
        });
      } else if (s.id === 'photography') {
        photographyData.slice(0, 15).forEach((item, idx) => {
          nodes.push({ id: `photo-${idx}`, name: item.alt || '', img: item.src, val: 10, type: 'item', category: 'photography', color: '#10b981' });
          links.push({ source: s.id, target: `photo-${idx}` });
        });
      }
    });

    return { nodes, links };
  }, [sections, booksData, screensData, audioData, products, projectsData, photographyData]);

  // Configure physics to prevent overlaps via strong repulsion
  useEffect(() => {
    if (fgRef.current) {
      // Dialed back further so the dense Library cluster doesn't push itself too far away
      fgRef.current.d3Force('charge').strength(-40).distanceMax(400);

      fgRef.current.d3Force('link').distance(link => {
        if (link.target.type === 'item') return 15; // tuck items tighter
        if (link.target.type === 'category') return 30; 
        return 40; // main sections (bring Library closer to Intro)
      });
      fgRef.current.zoomToFit(800, 50); // Auto zoom to fit the settled graph
      fgRef.current.d3ReheatSimulation();
    }
  }, [graphData]);

  // Pre-load images
  useEffect(() => {
    graphData.nodes.forEach(node => {
      if (node.img && !imgCache[node.img]) {
        const img = new Image();
        img.src = node.img;
        img.onload = () => {
          setImgCache(prev => ({ ...prev, [node.img]: img }));
        };
      }
    });
  }, [graphData.nodes]);

  const handleZoom = useCallback((zoomEvent) => {
    // Some events might just pass the raw value, others pass an object
    const k = (zoomEvent && typeof zoomEvent.k === 'number') ? zoomEvent.k : (typeof zoomEvent === 'number' ? zoomEvent : 1);
    setZoomLevel(k);
    
    if (!activeSpatialNode && fgRef.current && k > 6) {
      try {
        // Scroll-to-Open math: Find if camera is zoomed perfectly straight into a node
        const center = fgRef.current.screen2GraphCoords(window.innerWidth / 2, window.innerHeight / 2);
        if (!center || !Number.isFinite(center.x) || !Number.isFinite(center.y)) return;

        let hitNode = null;
        let minDistance = Infinity;

        graphData.nodes.forEach(node => {
          if (node.type === 'item') return; // Don't Auto-open items
          if (node.type === 'category' && k < 9) return; // Need deeper zoom to trigger categories

          const dx = node.x - center.x;
          const dy = node.y - center.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < node.val && dist < minDistance) {
            hitNode = node;
            minDistance = dist;
          }
        });

        if (hitNode) {
          setActiveSpatialNode(hitNode.id);
        }
      } catch (e) {
        // Suppress spatial math errors so they don't break the physics engine
      }
    }
  }, [activeSpatialNode, graphData.nodes]);

  const handleNodeClick = useCallback(node => {

    fgRef.current.centerAt(node.x, node.y, 800);
    const zoomTarget = node.type === 'item' ? 8 : (node.type === 'category' ? 5 : 3);
    fgRef.current.zoom(zoomTarget, 800);
    
    // Any section or category gets a spatial overlay now
    if (node.type === 'section' || node.type === 'category' || node.type === 'root') {
      setTimeout(() => setActiveSpatialNode(node.id), 800);
    }
  }, []);

  const drawNode = useCallback((node, ctx, globalScale) => {
    if (!Number.isFinite(node.x) || !Number.isFinite(node.y) || !Number.isFinite(node.val)) return;

    const isMain = node.type === 'root' || node.type === 'section' || node.type === 'category';
    const isCategory = node.type === 'category';
    const isItem = node.type === 'item';
    
    // Progressive Disclosure Validation
    // Items don't show until zoomed past 3.5, Categories past 1.8
    if (isCategory && globalScale < 1.8) return;
    if (isItem && globalScale < 3.5) return;

    const radius = node.val / 2;
    
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    
    if (globalScale > 1.5 && node.img && imgCache[node.img]) {
      ctx.save();
      ctx.clip();
      try {
        const img = imgCache[node.img];
        const imgRatio = img.width / img.height;
        let drawWidth = node.val;
        let drawHeight = node.val;
        
        // Emulate object-fit: cover
        if (imgRatio > 1) {
          drawWidth = node.val * imgRatio;
        } else {
          drawHeight = node.val / imgRatio;
        }
        
        const dx = node.x - (drawWidth / 2);
        const dy = node.y - (drawHeight / 2);
        
        ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
      } catch (e) {}
      ctx.restore();
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();
    } else {
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius);
      gradient.addColorStop(0, node.color);
      gradient.addColorStop(1, `${node.color}44`);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.shadowBlur = isMain ? 20 / globalScale : 5 / globalScale;
      ctx.shadowColor = node.color;
      ctx.stroke();
    }

    const label = node.name;
    const isVisible = (globalScale > 2 || isMain) && !isItem; // Hide text if it is a sub-item
    if (isVisible && label) {
      const fontSize = isMain ? 5 : 3.5;
      ctx.font = `${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#111111';
      ctx.fillText(label, node.x, node.y + radius + 1);
    }
    ctx.shadowBlur = 0;
  }, [imgCache]);

  return (
    <div className="graph-container">
      <div className="graph-controls">
        <button onClick={() => {
           let z = fgRef.current.zoom();
           if (typeof z !== 'number') z = 1;
           fgRef.current.zoom(z * 1.5, 400);
        }}><ZoomIn size={20}/></button>
        <button onClick={() => {
           let z = fgRef.current.zoom();
           if (typeof z !== 'number') z = 1;
           fgRef.current.zoom(z / 1.5, 400);
        }}><ZoomOut size={20}/></button>
        <button onClick={() => { fgRef.current.zoomToFit(400, 50); }}><Maximize2 size={20}/></button>
        <button className="graph-close" onClick={onClose}><X size={20}/></button>
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        backgroundColor="#fcfcfc"
        nodeCanvasObject={drawNode}
        nodeLabel={node => node.name}
        linkColor={link => {
          if (link.target.type === 'category' && zoomLevel < 1.8) return 'transparent';
          if (link.target.type === 'item' && zoomLevel < 3.5) return 'transparent';
          return 'rgba(0, 0, 0, 0.15)';
        }}
        linkWidth={1}
        onNodeClick={handleNodeClick}
        onZoom={handleZoom}
        cooldownTicks={100}
        d3AlphaDecay={0.01}
        d3VelocityDecay={0.2}
        enablePointerInteraction={true}
      />

      <AnimatePresence>
        {activeSpatialNode && (
          <motion.div 
            className="spatial-room-overlay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
             <button className="spatial-exit-btn" onClick={() => {
                setActiveSpatialNode(null);
                // Instead of zooming all the way out to fit, just pull the camera back by half so we stay exactly where we were
                try {
                  let z = fgRef.current.zoom();
                  if (typeof z !== 'number' || Number.isNaN(z)) {
                    fgRef.current.zoomToFit(800, 50);
                  } else {
                    fgRef.current.zoom(z / 2.5, 800); 
                  }
                } catch(e) {
                   fgRef.current.zoomToFit(800, 50);
                }
             }}>
                <X size={24}/>
             </button>
             <div className="spatial-room-content">
                {renderSpatialContent(activeSpatialNode)}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="graph-overlay-hint">
        <p>Scroll to zoom • Drag to pan • Click to explore</p>
      </div>
    </div>
  );
};

export default GraphView;
