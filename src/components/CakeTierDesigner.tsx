"use client";

import React, { useState, useMemo, useRef } from 'react';
import { Circle, Square, Hexagon, Plus, Trash2, ArrowUp, ArrowDown, Move, Download } from 'lucide-react';

// --- HELPER FUNCTIONS ---
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- SVG DECORATION ASSETS (Line art only) ---
const DecorIcons = {
  Flower1: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v7M12 15v7M2 12h7M15 12h7M5 5l5 5M14 14l5 5M19 5l-5 5M10 14l-5 5" />
    </svg>
  ),
  Flower2: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22V12" />
      <path d="M7 12c0-4 1-8 5-10 4 2 5 6 5 10H7z" />
      <path d="M7 12l2.5-3L12 12l2.5-3L17 12" />
    </svg>
  ),
  Flower3: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22V14" />
      <path d="M12 14c-4 0-6-3-6-6s2-5 6-5 6 2 6 5-2 6-6 6z" />
      <path d="M12 14c-2 0-3-1-3-3s1-2 3-2 2 1 2 2-1 3-2 3z" />
    </svg>
  ),
  Flower4: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22v-4" />
      <path d="M12 18c-4 0-8-3-8-8 3 0 6 2 8 8z" />
      <path d="M12 18c4 0 8-3 8-8-3 0-6 2-8 8z" />
      <path d="M12 18c-2 0-4-4-4-10 2 0 4 4 4 10z" />
      <path d="M12 18c2 0 4-4 4-10-2 0-4 4-4 10z" />
    </svg>
  ),
  Flower5: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 12c0-4-4-6-4-6s-4 2-4 6 4 4 4 4 4-2 4-4z" />
      <path d="M12 12c0-4 4-6 4-6s4 2 4 6-4 4-4 4-4-2-4-4z" />
      <path d="M12 12c0 4-4 6-4 6s-4-2-4-6 4-4 4-4 4 2 4 4z" />
      <path d="M12 12c0 4 4 6 4 6s4-2 4-6-4-4-4-4-4 2-4 4z" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Flower6: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2v6" />
      <path d="M12 8c-4 0-6 4-6 9l2 3 4-2 4 2 2-3c0-5-2-9-6-9z" />
      <path d="M12 8v5" />
    </svg>
  ),
  Leaf1: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22V2" />
      <path d="M12 2C6 2 3 7 12 22 21 7 18 2 12 2z" />
      <path d="M12 8l-3 3M12 14l-3 3M12 11l3-3M12 17l3-3" />
    </svg>
  ),
  Leaf2: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22V2" />
      <path d="M12 18l-5-4M12 14l-5-4M12 10l-4-3M12 16l5-4M12 12l5-4M12 8l4-3" />
    </svg>
  ),
  Leaf3: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22v-6" />
      <path d="M12 16c-3 0-6-2-8-5 1-2 4-1 5 1s3-8 3-8 2 10 3 8 4-3 5-1c-2 3-5 5-8 5z" />
      <path d="M12 16l-3-4M12 16l3-4M12 16V6" />
    </svg>
  )
};

const decorationsList = [
  { id: 'f1', name: 'Daisy', Icon: DecorIcons.Flower1, type: 'flower' },
  { id: 'f2', name: 'Tulip', Icon: DecorIcons.Flower2, type: 'flower' },
  { id: 'f3', name: 'Rose', Icon: DecorIcons.Flower3, type: 'flower' },
  { id: 'f4', name: 'Lotus', Icon: DecorIcons.Flower4, type: 'flower' },
  { id: 'f5', name: 'Petal', Icon: DecorIcons.Flower5, type: 'flower' },
  { id: 'f6', name: 'Bell', Icon: DecorIcons.Flower6, type: 'flower' },
  { id: 'l1', name: 'Oval', Icon: DecorIcons.Leaf1, type: 'leaf' },
  { id: 'l2', name: 'Fern', Icon: DecorIcons.Leaf2, type: 'leaf' },
  { id: 'l3', name: 'Lobe', Icon: DecorIcons.Leaf3, type: 'leaf' },
];

// --- DECORATION RENDERER & TRANSFORM UI ---
const DecorationItem = ({ decor, isActive, onSelect, onInteract, onDelete }) => {
  const decorInfo = decorationsList.find(d => d.id === decor.iconId);
  if (!decorInfo) return null;
  const Icon = decorInfo.Icon;

  return (
    <g
      transform={`translate(${decor.x}, ${decor.y}) rotate(${decor.rotation}) scale(${decor.scale})`}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect(decor.id);
        onInteract(e, 'move', decor);
      }}
      className={isActive ? "cursor-move" : "cursor-pointer"}
    >
      {/* Invisible hit box tightened to the core of the shape to avoid accidental selection */}
      <rect x="-10" y="-10" width="20" height="20" fill="transparent" />
      
      {/* Centered Icon mathematically constrained to the bounding box */}
      <g className="text-slate-800">
        <Icon width="24" height="24" x="-12" y="-12" />
      </g>

      {isActive && (
        <g className="decor-ui">
          {/* Bounding Box */}
          <rect x="-16" y="-16" width="32" height="32" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2,2" />

          {/* Delete Handle (Top Right) */}
          <g transform="translate(16, -16)" className="cursor-pointer" 
             onMouseDown={(e) => { e.stopPropagation(); onDelete(decor.id); }} 
             onClick={(e) => { e.stopPropagation(); onDelete(decor.id); }}>
            <circle cx="0" cy="0" r="4" fill="#ef4444" />
            <line x1="-1.5" y1="-1.5" x2="1.5" y2="1.5" stroke="white" strokeWidth="1"/>
            <line x1="1.5" y1="-1.5" x2="-1.5" y2="1.5" stroke="white" strokeWidth="1"/>
          </g>

          {/* Scale Handle (Bottom Right) */}
          <g transform="translate(16, 16)" className="cursor-se-resize" 
             onMouseDown={(e) => { e.stopPropagation(); onInteract(e, 'scale', decor); }}>
            <circle cx="0" cy="0" r="4" fill="#3b82f6" />
            <circle cx="0" cy="0" r="1.5" fill="white" />
          </g>

          {/* Rotate Handle (Top Center) */}
          <g transform="translate(0, -22)" className="cursor-crosshair" 
             onMouseDown={(e) => { e.stopPropagation(); onInteract(e, 'rotate', decor); }}>
            <line x1="0" y1="0" x2="0" y2="6" stroke="#10b981" strokeWidth="1" />
            <circle cx="0" cy="0" r="4" fill="#10b981" />
            <circle cx="0" cy="0" r="1.5" fill="white" />
          </g>
        </g>
      )}
    </g>
  );
};

// --- SVG SHAPE RENDERER ---
const TierShape = ({ tier, yBase, maxW, isHovered, onClick }) => {
  const { shape, width: w, height: h } = tier;
  const topY = yBase - h;
  const p = 0.25; // Perspective factor (gives the 3D isometric tilt)
  
  // Theme styling for the technical sketch
  const strokeColor = isHovered ? "#0284c7" : "#1e293b"; // Blue if hovered, else Slate-800
  const strokeWidth = isHovered ? "0.625" : "0.375";
  const fillColor = "#ffffff";
  const topFillColor = "#f8fafc";
  const sideFillLight = "#f1f5f9";
  const sideFillDark = "#e2e8f0";

  // Dimension line constants
  const dimX = (maxW / 2) + 15;
  const midY = (yBase + topY) / 2;

  // Render shapes mathematically based on isometric projection
  let shapeElements;

  if (shape === 'circle' || shape === 'circle_platform') {
    shapeElements = (
      <g>
        {/* Bottom Arc (Hidden but good for structural outline if transparent) */}
        {/* Body */}
        <path 
          d={`M ${-w/2} ${yBase} 
              A ${w/2} ${w/2 * p} 0 0 0 ${w/2} ${yBase} 
              L ${w/2} ${topY} 
              A ${w/2} ${w/2 * p} 0 0 1 ${-w/2} ${topY} Z`} 
          fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" 
        />
        {/* Top Ellipse */}
        <ellipse 
          cx="0" cy={topY} rx={w/2} ry={w/2 * p} 
          fill={topFillColor} stroke={strokeColor} strokeWidth={strokeWidth} 
        />
      </g>
    );
  } else if (shape === 'square' || shape === 'square_platform') {
    shapeElements = (
      <g>
        {/* Left Face */}
        <polygon 
          points={`0,${yBase + w/2*p} ${-w/2},${yBase} ${-w/2},${topY} 0,${topY + w/2*p}`} 
          fill={sideFillLight} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" 
        />
        {/* Right Face */}
        <polygon 
          points={`0,${yBase + w/2*p} ${w/2},${yBase} ${w/2},${topY} 0,${topY + w/2*p}`} 
          fill={sideFillDark} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" 
        />
        {/* Top Face */}
        <polygon 
          points={`0,${topY + w/2*p} ${w/2},${topY} 0,${topY - w/2*p} ${-w/2},${topY}`} 
          fill={topFillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" 
        />
      </g>
    );
  } else if (shape === 'hexagon') {
    const w_4 = w / 4;
    const y_p = w * p / 2;
    shapeElements = (
      <g>
        {/* Left Face */}
        <polygon 
          points={`${-w/2},${yBase} ${-w_4},${yBase + y_p} ${-w_4},${topY + y_p} ${-w/2},${topY}`} 
          fill={sideFillLight} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" 
        />
        {/* Center Face */}
        <polygon 
          points={`${-w_4},${yBase + y_p} ${w_4},${yBase + y_p} ${w_4},${topY + y_p} ${-w_4},${topY + y_p}`} 
          fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" 
        />
        {/* Right Face */}
        <polygon 
          points={`${w_4},${yBase + y_p} ${w/2},${yBase} ${w/2},${topY} ${w_4},${topY + y_p}`} 
          fill={sideFillDark} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" 
        />
        {/* Top Face */}
        <polygon 
          points={`${-w_4},${topY + y_p} ${w_4},${topY + y_p} ${w/2},${topY} ${w_4},${topY - y_p} ${-w_4},${topY - y_p} ${-w/2},${topY}`} 
          fill={topFillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" 
        />
      </g>
    );
  }

  return (
    <g 
      className="cursor-pointer transition-all duration-200" 
      onClick={() => onClick(tier)}
    >
      {shapeElements}
      
      {/* Front Label (Width) */}
      <text 
        x="0" y={yBase + (w / 2 * p) - 0.5} 
        textAnchor="middle" alignmentBaseline="baseline" 
        fontFamily="monospace" fontSize="2px" fontWeight="bold" fill="#334155"
        style={{ paintOrder: 'stroke', stroke: '#ffffff', strokeWidth: '0.4px', strokeLinecap: 'round', strokeLinejoin: 'round', userSelect: 'none', pointerEvents: 'none' }}
      >
        {(shape === 'circle' || shape === 'circle_platform') ? 'Ø' : shape === 'hexagon' ? '⬡' : '□'} {w}cm
      </text>

      {/* --- Dimension Lines (Right Side) --- */}
      {/* Top extension line */}
      <line x1={w/2 + 5} y1={topY} x2={dimX} y2={topY} stroke="#94a3b8" strokeDasharray="2,2" strokeWidth="0.125" />
      {/* Bottom extension line */}
      <line x1={w/2 + 5} y1={yBase} x2={dimX} y2={yBase} stroke="#94a3b8" strokeDasharray="2,2" strokeWidth="0.125" />
      {/* Vertical dimension line */}
      <line 
        x1={dimX - 10} y1={topY} x2={dimX - 10} y2={yBase} 
        stroke="#64748b" strokeWidth="0.25" 
        markerStart="url(#arrow)" markerEnd="url(#arrow)" 
      />
      {/* Height Label */}
      <text 
        x={dimX - 5} y={midY} 
        alignmentBaseline="middle" 
        fontFamily="monospace" fontSize="2px" fontWeight="bold" fill="#334155"
        style={{ paintOrder: 'stroke', stroke: '#f8fafc', strokeWidth: '0.4px', strokeLinecap: 'round', strokeLinejoin: 'round', userSelect: 'none', pointerEvents: 'none' }}
      >
        {h}cm
      </text>
    </g>
  );
};

// --- MAIN APPLICATION COMPONENT ---
export default function Page() {
  const [tiers, setTiers] = useState([]);
  const [hoveredTier, setHoveredTier] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [sketchName, setSketchName] = useState('');
  const [sketchDate, setSketchDate] = useState('');
  const panStartRef = useRef({ x: 0, y: 0 });
  const svgRef = useRef(null);
  
  // Decorations State
  const [decorations, setDecorations] = useState([]);
  const [activeDecorId, setActiveDecorId] = useState(null);
  const decorInteractRef = useRef({ mode: null, id: null, startX: 0, startY: 0, initialDecor: null });

  // Modal State
  const [modal, setModal] = useState({
    isOpen: false,
    mode: 'add', // 'add' or 'edit'
    tierId: null,
    shape: 'circle',
    width: 30,
    height: 10
  });

  // Derived calculations for the Canvas SVG
  const { maxW, totalH, viewBounds, tiersWithY, actualTiersCount } = useMemo(() => {
    if (tiers.length === 0) return { maxW: 100, totalH: 0, viewBounds: '-150 -150 300 300', tiersWithY: [], actualTiersCount: 0 };

    let mw = 0;
    let th = 0;
    let tCount = 0;
    const mapped = [...tiers].map(t => {
      mw = Math.max(mw, t.width);
      const yBase = -th;
      th += t.height;
      
      let tNum = null;
      if (!t.shape.includes('platform')) {
        tCount++;
        tNum = tCount;
      }
      
      return { ...t, yBase, tierNumber: tNum };
    });

    const p = 0.25;
    // Calculate bounding box that tightly fits the entire technical sketch
    // Make it perfectly symmetrical around X=0 so the cake is centered
    const paddingRight = 30; // Space for the height dimensions on the right
    const maxX = mw/2 + paddingRight;
    const minX = -maxX; // Symmetrical left margin to keep cake exactly in the center
    const width = maxX - minX;
    
    const minY = -th - (mw/2)*p - 15; // Top padding (tightened)
    const maxY = (mw/2)*p + 15;       // Bottom padding (tightened)
    const height = maxY - minY;

    return { 
      maxW: mw, 
      totalH: th, 
      viewBounds: `${minX} ${minY} ${width} ${height}`,
      tiersWithY: mapped,
      actualTiersCount: tCount
    };
  }, [tiers]);

  // --- Handlers ---
  const getCanvasSnapshot = () => {
    return new Promise((resolve) => {
      const svgElement = svgRef.current;
      if (!svgElement) return resolve(null);

      const viewBox = svgElement.viewBox.baseVal;

      // 1. Force strict Portrait A4 dimensions at 300 DPI
      const exportW = 2480;
      const exportH = 3508;

      // 2. Enforce padding. Create a larger top margin to accommodate the text header!
      const marginPx = 100;
      const marginTopPx = 350; 
      const drawW = exportW - (marginPx * 2);
      const drawH = exportH - (marginTopPx + marginPx);

      // 3. Calculate exact scale to maximize the sketch into the safe printable area
      const scale = Math.min(drawW / viewBox.width, drawH / viewBox.height);
      const scaledW = viewBox.width * scale;
      const scaledH = viewBox.height * scale;

      // Clone the SVG so we don't mess up the live canvas
      const clone = svgElement.cloneNode(true);
      
      // Strip out any React inline styles for pan/zoom
      clone.style.transform = ''; 
      clone.style.filter = '';    
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      
      // Remove transform UI elements from the export clone
      clone.querySelectorAll('.decor-ui').forEach(el => el.remove());

      // Force the SVG to render exactly at the high-res scaled pixel size
      // This guarantees vector-crisp lines instead of a blurry upscaled image
      clone.setAttribute('width', scaledW);
      clone.setAttribute('height', scaledH);

      const svgData = new XMLSerializer().serializeToString(clone);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = exportW;
        canvas.height = exportH;
        const ctx = canvas.getContext('2d');
        
        // Fill blueprint background (grid lines removed for export)
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, exportW, exportH);
        
        // --- DRAW HEADER TEXT ---
        ctx.textBaseline = 'top';
        
        // Top Left: Name & Date
        ctx.textAlign = 'left';
        ctx.fillStyle = '#1e293b'; // slate-800
        ctx.font = 'bold 70px sans-serif';
        ctx.fillText(sketchName || 'Project Name: ________________', marginPx, marginPx);
        
        ctx.fillStyle = '#64748b'; // slate-500
        ctx.font = '50px sans-serif';
        ctx.fillText(sketchDate || 'Date: ________________', marginPx, marginPx + 100);

        // Top Right: Tiers & Height
        ctx.textAlign = 'right';
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 70px sans-serif';
        ctx.fillText(`${actualTiersCount} Tiers`, exportW - marginPx, marginPx);
        
        ctx.fillStyle = '#64748b';
        ctx.font = '50px sans-serif';
        ctx.fillText(`Total Height: ${totalH}cm`, exportW - marginPx, marginPx + 100);
        // ------------------------

        ctx.save();

        // Re-apply a scaled-up drop shadow for aesthetics on the high-res export
        ctx.shadowColor = 'rgba(0, 0, 0, 0.05)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 40;

        // 4. Center it perfectly within the margins (using the expanded top margin)
        const dx = marginPx + (drawW - scaledW) / 2;
        const dy = marginTopPx + (drawH - scaledH) / 2;

        // Draw the image exactly within the calculated safe zones
        ctx.drawImage(img, dx, dy, scaledW, scaledH);
        ctx.restore();
        
        URL.revokeObjectURL(url);
        resolve({ canvas, exportW, exportH });
      };
      img.src = url;
    });
  };

  const getExportFileName = (extension) => {
    let base = 'Cake_Blueprint';
    if (sketchName.trim() || sketchDate.trim()) {
      const parts = [];
      if (sketchName.trim()) parts.push(sketchName.trim());
      if (sketchDate.trim()) parts.push(sketchDate.trim());
      base = parts.join('_');
    }
    // Clean invalid filename characters (like slashes) so the OS doesn't throw an error
    base = base.replace(/[<>:"/\\|?*]+/g, '-');
    return `${base}.${extension}`;
  };

  const handleExportPNG = async () => {
    const snapshot = await getCanvasSnapshot();
    if (!snapshot) return;
    const pngUrl = snapshot.canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = getExportFileName('png');
    a.click();
  };

  const handleExportPDF = async () => {
    const snapshot = await getCanvasSnapshot();
    if (!snapshot) return;
    
    try {
      // Dynamically load jsPDF library only when needed
      if (!window.jspdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      
      const { jsPDF } = window.jspdf;
      const { canvas } = snapshot;
      
      // Compress slightly for PDF to avoid massive file sizes
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      
      // Force standard Portrait A4 format
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });
      
      // Map the 300 DPI canvas exactly to the physical A4 document
      const pdfW = doc.internal.pageSize.getWidth();
      const pdfH = doc.internal.pageSize.getHeight();
      
      doc.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);
      doc.save(getExportFileName('pdf'));
      
    } catch (err) {
      console.error("Failed to generate PDF", err);
    }
  };

  const handleWheel = (e) => {
    // Zoom in and out based on scroll wheel direction
    const zoomSensitivity = 0.002;
    setZoom(prev => Math.max(0.1, Math.min(5, prev - e.deltaY * zoomSensitivity)));
  };

  // Convert screen coordinates to exact SVG ViewBox coordinates
  const getSvgPoint = (clientX, clientY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
  };

  const handleMouseDown = (e) => {
    setActiveDecorId(null); // Deselect decorations if clicking on the background
    setIsPanning(true);
    setHasDragged(false);
    panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e) => {
    if (decorInteractRef.current.mode) {
      const svgP = getSvgPoint(e.clientX, e.clientY);
      const { mode, id, startX, startY, initialDecor } = decorInteractRef.current;
      
      setDecorations(prev => prev.map(d => {
        if (d.id !== id) return d;
        if (mode === 'move') {
          return { ...d, x: initialDecor.x + (svgP.x - startX), y: initialDecor.y + (svgP.y - startY) };
        }
        if (mode === 'scale') {
          const distStart = Math.hypot(startX - initialDecor.x, startY - initialDecor.y);
          const distCurrent = Math.hypot(svgP.x - initialDecor.x, svgP.y - initialDecor.y);
          const scaleFactor = distStart === 0 ? 1 : distCurrent / distStart;
          return { ...d, scale: Math.max(0.1, initialDecor.scale * scaleFactor) };
        }
        if (mode === 'rotate') {
          const angleStart = Math.atan2(startY - initialDecor.y, startX - initialDecor.x);
          const angleCurrent = Math.atan2(svgP.y - initialDecor.y, svgP.x - initialDecor.x);
          const diff = (angleCurrent - angleStart) * (180 / Math.PI);
          return { ...d, rotation: initialDecor.rotation + diff };
        }
        return d;
      }));
      return;
    }

    if (!isPanning) return;
    setHasDragged(true);
    setPan({
      x: e.clientX - panStartRef.current.x,
      y: e.clientY - panStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    decorInteractRef.current.mode = null;
  };
  
  const handleMouseLeave = () => {
    setIsPanning(false);
    decorInteractRef.current.mode = null;
  };

  const handleDragStart = (e, type, payload) => {
    e.dataTransfer.setData('type', type);
    if (type === 'shape') e.dataTransfer.setData('shape', payload);
    if (type === 'decoration') e.dataTransfer.setData('iconId', payload);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent duplicate firing if nested dropzones trigger
    setIsDraggingOver(false);
    
    const type = e.dataTransfer.getData('type');
    
    if (type === 'decoration') {
      const iconId = e.dataTransfer.getData('iconId');
      if (!iconId) return;
      const svgP = getSvgPoint(e.clientX, e.clientY);
      const newDecor = {
        id: generateId(),
        iconId,
        x: svgP.x,
        y: svgP.y,
        scale: 0.4, // Spawn at a more reasonable initial scale relative to the cake bounds
        rotation: 0
      };
      setDecorations(prev => [...prev, newDecor]);
      setActiveDecorId(newDecor.id);
    } else {
      // Fallback for cake tier shapes
      const shape = e.dataTransfer.getData('shape');
      if (shape) openModal('add', shape);
    }
  };

  // Decoration Interaction Handlers
  const handleDecorInteract = (e, mode, decor) => {
    const svgP = getSvgPoint(e.clientX, e.clientY);
    decorInteractRef.current = {
      mode,
      id: decor.id,
      startX: svgP.x,
      startY: svgP.y,
      initialDecor: { ...decor }
    };
  };

  const handleDecorDelete = (id) => {
    setDecorations(prev => prev.filter(d => d.id !== id));
    if (activeDecorId === id) setActiveDecorId(null);
  };

  const openModal = (mode, shapeType, existingTier = null) => {
    if (mode === 'add') {
      // Default sizing based on shape to give good starting points
      let defW = 30, defH = shapeType.includes('platform') ? 2 : 15;
      if (tiers.length > 0) {
        // If adding a new tier, suggest slightly smaller than the top tier
        const topTier = tiers[tiers.length - 1];
        defW = shapeType.includes('platform') ? topTier.width + 5 : Math.max(10, topTier.width - 10);
        defH = shapeType.includes('platform') ? 2 : topTier.height;
      }
      setModal({ isOpen: true, mode: 'add', tierId: null, shape: shapeType, width: defW, height: defH });
    } else if (mode === 'edit' && existingTier) {
      setModal({ 
        isOpen: true, 
        mode: 'edit', 
        tierId: existingTier.id, 
        shape: existingTier.shape, 
        width: existingTier.width, 
        height: existingTier.height 
      });
    }
  };

  const saveTier = (e) => {
    e.preventDefault();
    if (modal.mode === 'add') {
      setTiers([...tiers, { id: generateId(), shape: modal.shape, width: Number(modal.width), height: Number(modal.height) }]);
    } else {
      setTiers(tiers.map(t => t.id === modal.tierId ? { ...t, width: Number(modal.width), height: Number(modal.height) } : t));
    }
    setModal({ ...modal, isOpen: false });
  };

  const removeTier = (id, e) => {
    e.stopPropagation();
    setTiers(tiers.filter(t => t.id !== id));
  };

  const moveTier = (index, direction, e) => {
    e.stopPropagation();
    if (direction === 'up' && index < tiers.length - 1) {
      const newTiers = [...tiers];
      [newTiers[index], newTiers[index + 1]] = [newTiers[index + 1], newTiers[index]];
      setTiers(newTiers);
    } else if (direction === 'down' && index > 0) {
      const newTiers = [...tiers];
      [newTiers[index], newTiers[index - 1]] = [newTiers[index - 1], newTiers[index]];
      setTiers(newTiers);
    }
  };

  const ShapeIcon = ({ shape, className }) => {
    if (shape === 'circle' || shape === 'circle_platform') return <Circle className={className} />;
    if (shape === 'square' || shape === 'square_platform') return <Square className={className} />;
    if (shape === 'hexagon') return <Hexagon className={className} />;
    return null;
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-white w-5 h-5"
              >
                <rect x="4" y="17" width="16" height="5" rx="1" />
                <rect x="7" y="12" width="10" height="5" rx="1" />
                <rect x="10" y="7" width="4" height="5" rx="1" />
                <path d="M12 3v4" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">Build The Cakes</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">Your on-demand custom cake builder</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 border-l border-slate-200 pl-6">
            <input 
              type="text" 
              placeholder="Project Name..." 
              value={sketchName}
              onChange={(e) => setSketchName(e.target.value)}
              className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 text-slate-700 font-medium placeholder-slate-400"
            />
            <input 
              type="text" 
              placeholder="Date..." 
              value={sketchDate}
              onChange={(e) => setSketchDate(e.target.value)}
              className="px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 text-slate-700 font-medium placeholder-slate-400"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-500 font-mono hidden lg:block">
            {actualTiersCount} Tiers | Total Height: {totalH}cm
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportPNG}
              disabled={tiers.length === 0}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
              title="Export as PNG Image"
            >
              <Download className="w-4 h-4" />
              PNG
            </button>
            <button 
              onClick={handleExportPDF}
              disabled={tiers.length === 0}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
              title="Export as PDF Document"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden h-full">
        
        {/* Left Sidebar (Decorations) */}
        <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col h-1/2 md:h-full z-10 shadow-lg md:shadow-none shrink-0">
          <div className="p-6 flex-1 overflow-y-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Decorations</h2>
            
            <div className="mb-6">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-3">Flowers</h3>
              <div className="grid grid-cols-3 gap-3">
                {decorationsList.filter(d => d.type === 'flower').map(decor => (
                  <div 
                    key={decor.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'decoration', decor.id)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 cursor-grab active:cursor-grabbing transition-colors group"
                  >
                    <div className="text-slate-400 group-hover:text-emerald-600 mb-2 transition-colors pointer-events-none">
                      <decor.Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 capitalize text-center leading-tight pointer-events-none">{decor.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-3">Leaves</h3>
              <div className="grid grid-cols-3 gap-3">
                {decorationsList.filter(d => d.type === 'leaf').map(decor => (
                  <div 
                    key={decor.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'decoration', decor.id)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 cursor-grab active:cursor-grabbing transition-colors group"
                  >
                    <div className="text-slate-400 group-hover:text-emerald-600 mb-2 transition-colors pointer-events-none">
                      <decor.Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 capitalize text-center leading-tight pointer-events-none">{decor.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 mt-6 text-center border-t border-slate-100 pt-4">More decorative tools coming soon</p>
          </div>
        </aside>

        {/* Main Canvas (Blueprint Renderer) - Center */}
        <div 
          id="sketch-container"
          className={`flex-1 relative bg-slate-50 overflow-hidden ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
          onDragEnter={() => setIsDraggingOver(true)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* Blueprint Grid Background */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.4]" style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          {/* Zoom controls hint */}
          <div className="absolute bottom-6 left-6 z-20 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs font-mono text-slate-500 pointer-events-none">
            Zoom: {Math.round(zoom * 100)}% (Scroll to zoom)
          </div>

          {isDraggingOver && (
            <div 
              className="absolute inset-0 z-50"
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={handleDrop}
            >
              <div className="absolute inset-4 border-4 border-blue-400 border-dashed rounded-2xl bg-blue-50/50 flex items-center justify-center pointer-events-none">
                <div className="bg-white px-6 py-3 rounded-full shadow-lg font-semibold text-blue-600 flex items-center gap-2 pointer-events-none">
                  <Move className="w-5 h-5" /> Drop to place shape
                </div>
              </div>
            </div>
          )}

          {tiers.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="text-center">
                <div className="inline-flex bg-white/80 backdrop-blur px-8 py-6 rounded-3xl shadow-sm border border-slate-200 flex-col items-center">
                  <div className="bg-slate-100 p-4 rounded-full text-slate-400 mb-4">
                    <Plus className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">Empty Blueprint</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-xs">Drag shapes from the side panel onto this canvas, or click them to start building.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center p-8">
              <svg 
                ref={svgRef}
                viewBox={viewBounds} 
                className={`w-full h-full max-h-[80vh] ${isPanning ? '' : 'transition-transform duration-75 ease-out'}`}
                style={{ 
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  filter: 'drop-shadow(0 20px 13px rgb(0 0 0 / 0.05))' 
                }}
              >
                <defs>
                  {/* Arrowhead for dimension lines */}
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="2" markerHeight="2" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                  </marker>
                </defs>
                
                {/* Render Tiers */}
                {tiersWithY.map((tier) => (
                  <TierShape 
                    key={tier.id} 
                    tier={tier} 
                    yBase={tier.yBase} 
                    maxW={maxW}
                    isHovered={hoveredTier === tier.id}
                    onClick={(t) => {
                      if (!hasDragged) openModal('edit', null, t);
                    }}
                  />
                ))}

                {/* Render Decorations (Always on top of tiers) */}
                {decorations.map((decor) => (
                  <DecorationItem 
                    key={decor.id}
                    decor={decor}
                    isActive={activeDecorId === decor.id}
                    onSelect={setActiveDecorId}
                    onInteract={handleDecorInteract}
                    onDelete={handleDecorDelete}
                  />
                ))}
              </svg>
            </div>
          )}
        </div>

        {/* Right Sidebar (Tools & Layers) - Moved to right */}
        <aside className="w-full md:w-80 bg-white border-l border-slate-200 flex flex-col h-1/2 md:h-full z-10 shadow-lg md:shadow-none shrink-0">
          
          {/* Shape Palette */}
          <div className="p-6 border-b border-slate-100 shrink-0">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Available Shapes</h2>
            <div className="grid grid-cols-3 gap-3">
              {['circle', 'square', 'hexagon', 'circle_platform', 'square_platform'].map(shape => (
                <div 
                  key={shape}
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'shape', shape)}
                  onClick={() => openModal('add', shape)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors group"
                >
                  <ShapeIcon shape={shape} className="w-6 h-6 text-slate-500 group-hover:text-blue-600 mb-2" />
                  <span className="text-xs font-medium text-slate-600 capitalize text-center leading-tight">{shape.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-3 text-center">Click to add or drag onto canvas</p>
          </div>

          {/* Layer Panel */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Structural Layers (Top ➔ Bottom)</h2>
            {tiers.length === 0 ? (
              <div className="text-sm text-slate-400 text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
                No tiers added yet.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {[...tiersWithY].reverse().map((tier, reversedIndex) => {
                  const index = tiersWithY.length - 1 - reversedIndex;
                  return (
                  <div 
                    key={tier.id}
                    className={`flex items-center justify-between p-3 rounded-xl border ${hoveredTier === tier.id ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-white'} transition-colors cursor-pointer shadow-sm`}
                    onMouseEnter={() => setHoveredTier(tier.id)}
                    onMouseLeave={() => setHoveredTier(null)}
                    onClick={() => openModal('edit', null, tier)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                        <ShapeIcon shape={tier.shape} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold capitalize">
                          {tier.tierNumber ? `Tier ${tier.tierNumber}` : 'Platform'}: {tier.shape.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">{tier.width}cm W × {tier.height}cm H</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1">
                        <button onClick={(e) => moveTier(index, 'up', e)} disabled={index === tiers.length - 1} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"><ArrowUp className="w-3 h-3" /></button>
                        <button onClick={(e) => moveTier(index, 'down', e)} disabled={index === 0} className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"><ArrowDown className="w-3 h-3" /></button>
                      </div>
                      <button onClick={(e) => removeTier(tier.id, e)} className="p-1 text-slate-400 hover:text-red-500 self-end"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </div>
        </aside>
      </main>

      {/* Input Modal for Dimensions */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShapeIcon shape={modal.shape} className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 capitalize">{modal.mode === 'add' ? 'Add' : 'Edit'} {modal.shape.replace('_', ' ')} Tier</h3>
              </div>
            </div>
            
            <form onSubmit={saveTier} className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Width / Diameter (cm)</label>
                  <input 
                    type="number" 
                    min="1" max="200" required
                    value={modal.width}
                    onChange={e => setModal({ ...modal, width: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all mb-3"
                    autoFocus
                  />
                  <input 
                    type="range" 
                    min="1" max="200" 
                    value={modal.width}
                    onChange={e => setModal({ ...modal, width: e.target.value })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-[10px] text-slate-400 mt-2">Defines the horizontal span of the layer.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Height (cm)</label>
                  <input 
                    type="number" 
                    min="1" max="100" required
                    value={modal.height}
                    onChange={e => setModal({ ...modal, height: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all mb-3"
                  />
                  <input 
                    type="range" 
                    min="1" max="100" 
                    value={modal.height}
                    onChange={e => setModal({ ...modal, height: e.target.value })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-[10px] text-slate-400 mt-2">Defines the vertical thickness.</p>
                </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setModal({ ...modal, isOpen: false })}
                  className="flex-1 px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg transition-colors shadow-sm shadow-blue-600/20"
                >
                  {modal.mode === 'add' ? 'Add to Cake' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
