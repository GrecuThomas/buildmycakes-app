"use client";

import { useEffect, useState, useMemo, useRef, FC, ReactNode, MouseEvent } from "react";
import { Circle, Square, Hexagon, Plus, Trash2, ArrowUp, ArrowDown, Move, Download, ArrowLeft, Save, FolderOpen, RotateCcw, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { SaveProjectModal } from "./SaveProjectModal";
import { ProjectsModal } from "./ProjectsModal";
import { AdWall } from "./AdWall";
import { saveProject, getProject } from "../server/projects.functions";
import { getSubscriptionDetails } from "../server/stripe.functions";
import { useSessionAutoSave, getSessionData, clearSessionData } from "../lib/useSessionStorage";

// --- TYPE DEFINITIONS ---
interface Tier {
  id: string;
  shape: "circle" | "circle_platform" | "square" | "square_platform" | "hexagon";
  width: number;
  height: number;
}

interface Decoration {
  id: string;
  iconId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  mirrorFlip?: boolean;
}

interface DecorationListItem {
  id: string;
  name: string;
  svgPath: string;
  type: "flower" | "leaf";
}

interface DecorationItemProps {
  decor: Decoration;
  isActive: boolean;
  onSelect: (id: string) => void;
  onInteract: (e: MouseEvent<SVGGElement>, mode: string, decor: Decoration) => void;
  onDelete: (id: string) => void;
  onMirror: (id: string) => void;
  onBringToFront: (id: string) => void;
}

interface TierShapeProps {
  tier: Tier;
  yBase: number;
  maxW: number;
  isHovered: boolean;
  onClick: (tier: Tier) => void;
  showDimensions?: boolean;
}

interface ShapeIconProps {
  shape: string;
  className: string;
}

interface ModalState {
  isOpen: boolean;
  mode: "add" | "edit";
  tierId: string | null;
  shape: string;
  width: number | "";
  height: number | "";
}

interface DecorInteractState {
  mode: string | null;
  id: string | null;
  startX: number;
  startY: number;
  initialDecor: Decoration | null;
}

interface SVGPoint {
  x: number;
  y: number;
}

// --- HELPER FUNCTIONS ---
const generateId = () => Math.random().toString(36).substr(2, 9);

const parseDimensionInput = (value: string): number | "" => {
  if (value === "") return "";
  return Number(value);
};

const sortDecorationsByNumericName = (a: DecorationListItem, b: DecorationListItem): number => {
  const aNum = Number(a.name.match(/\d+/)?.[0] ?? 0);
  const bNum = Number(b.name.match(/\d+/)?.[0] ?? 0);
  if (aNum !== bNum) return aNum - bNum;
  return a.name.localeCompare(b.name);
};

const getAutoTierHeight = (shape: string, width: number): number => {
  return shape.includes("platform") ? 2 : Math.floor(width / 2);
};

const fetchAsDataUrl = async (assetPath: string): Promise<string | null> => {
  try {
    const response = await fetch(assetPath);
    if (!response.ok) return null;

    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === "string" ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Failed to inline export image:", assetPath, error);
    return null;
  }
};

const inlineSvgImageAssets = async (svg: SVGSVGElement): Promise<void> => {
  const imageNodes = Array.from(svg.querySelectorAll("image"));

  await Promise.all(
    imageNodes.map(async (node) => {
      const href = node.getAttribute("href") || node.getAttributeNS("http://www.w3.org/1999/xlink", "href");
      if (!href || href.startsWith("data:")) return;

      const dataUrl = await fetchAsDataUrl(href);
      if (!dataUrl) return;

      node.setAttribute("href", dataUrl);
      node.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataUrl);
    }),
  );
};

// --- SVG DECORATION ASSETS FROM PUBLIC FOLDER ---
const decorationsList: DecorationListItem[] = [
  { id: "f1", name: "Flower 1", svgPath: "/flowers/flower1.svg", type: "flower" },
  { id: "f2", name: "Flower 2", svgPath: "/flowers/flower2.svg", type: "flower" },
  { id: "f3", name: "Flower 3", svgPath: "/flowers/flower3.svg", type: "flower" },
  { id: "f4", name: "Flower 4", svgPath: "/flowers/flower4.svg", type: "flower" },
  { id: "f5", name: "Flower 5", svgPath: "/flowers/flower5.svg", type: "flower" },
  { id: "f6", name: "Flower 6", svgPath: "/flowers/flower6.svg", type: "flower" },
  { id: "f7", name: "Flower 7", svgPath: "/flowers/flower7.svg", type: "flower" },
  { id: "f8", name: "Flower 8", svgPath: "/flowers/flower8.svg", type: "flower" },
  { id: "f9", name: "Flower 9", svgPath: "/flowers/flower9.svg", type: "flower" },
  { id: "f10", name: "Flower 10", svgPath: "/flowers/flower10.svg", type: "flower" },
  { id: "f11", name: "Flower 11", svgPath: "/flowers/flower11.svg", type: "flower" },
  { id: "f12", name: "Flower 12", svgPath: "/flowers/flower12.svg", type: "flower" },
  { id: "f13", name: "Flower 13", svgPath: "/flowers/flower13.svg", type: "flower" },
  { id: "f14", name: "Flower 14", svgPath: "/flowers/flower14.svg", type: "flower" },
  { id: "f15", name: "Flower 15", svgPath: "/flowers/flower15.svg", type: "flower" },
  { id: "f16", name: "Flower 16", svgPath: "/flowers/flower16.svg", type: "flower" },
  { id: "l1", name: "Leaf 1", svgPath: "/leaves/leaf1.svg", type: "leaf" },
  { id: "l2", name: "Leaf 2", svgPath: "/leaves/leaf2.svg", type: "leaf" },
  { id: "l3", name: "Leaf 3", svgPath: "/leaves/leaf3.svg", type: "leaf" },
  { id: "l4", name: "Leaf 4", svgPath: "/leaves/leaf4.svg", type: "leaf" },
  { id: "l5", name: "Leaf 5", svgPath: "/leaves/leaf5.svg", type: "leaf" },
  { id: "l6", name: "Leaf 6", svgPath: "/leaves/leaf6.svg", type: "leaf" },
  { id: "l7", name: "Leaf 7", svgPath: "/leaves/leaf7.svg", type: "leaf" },
  { id: "l8", name: "Leaf 8", svgPath: "/leaves/leaf8.svg", type: "leaf" },
  { id: "l9", name: "Leaf 9", svgPath: "/leaves/leaf9.svg", type: "leaf" },
  { id: "l10", name: "Leaf 10", svgPath: "/leaves/leaf10.svg", type: "leaf" },
  { id: "l11", name: "Leaf 11", svgPath: "/leaves/leaf11.svg", type: "leaf" },
  { id: "l12", name: "Leaf 12", svgPath: "/leaves/leaf12.svg", type: "leaf" },
  { id: "l13", name: "Leaf 13", svgPath: "/leaves/leaf13.svg", type: "leaf" },
  { id: "l14", name: "Leaf 14", svgPath: "/leaves/leaf14.svg", type: "leaf" },
];

// --- DECORATION RENDERER & TRANSFORM UI ---
const DecorationItem: FC<DecorationItemProps> = ({ decor, isActive, onSelect, onInteract, onDelete, onMirror, onBringToFront }) => {
  const decorInfo = decorationsList.find((d) => d.id === decor.iconId);
  if (!decorInfo) return null;

  return (
    <g
      transform={`translate(${decor.x}, ${decor.y}) rotate(${decor.rotation}) scale(${decor.scale})`}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect(decor.id);
        onInteract(e, "move", decor);
      }}
      className={isActive ? "cursor-move" : "cursor-pointer"}
    >
      {/* Invisible hit box tightened to the core of the shape to avoid accidental selection */}
      <rect x="-10" y="-10" width="20" height="20" fill="transparent" />

      {/* SVG Image from public folder - with optional mirror flip */}
      <g transform={decor.mirrorFlip ? "scale(-1, 1)" : undefined}>
        <image x="-12" y="-12" width="24" height="24" href={decorInfo.svgPath} />
      </g>

      {isActive && (
        <g className="decor-ui">
          {/* Bounding Box */}
          <rect x="-16" y="-16" width="32" height="32" fill="none" stroke="#3b82f6" strokeWidth={0.4 / decor.scale} strokeDasharray="2,2" />

          {/* Bring To Front Handle (Top Left) */}
          <g
            transform="translate(-16, -16)"
            className="cursor-pointer"
            onMouseDown={(e) => {
              e.stopPropagation();
              onBringToFront(decor.id);
            }}
            onClick={(e) => {
              e.stopPropagation();
              onBringToFront(decor.id);
            }}
          >
            <circle cx="0" cy="0" r={1.6 / decor.scale} fill="#8b5cf6" />
            <line x1="0" y1={0.8 / decor.scale} x2="0" y2={-0.8 / decor.scale} stroke="white" strokeWidth={0.4 / decor.scale} strokeLinecap="round" />
            <line
              x1={-0.7 / decor.scale}
              y1={-0.1 / decor.scale}
              x2="0"
              y2={-0.8 / decor.scale}
              stroke="white"
              strokeWidth={0.4 / decor.scale}
              strokeLinecap="round"
            />
            <line
              x1={0.7 / decor.scale}
              y1={-0.1 / decor.scale}
              x2="0"
              y2={-0.8 / decor.scale}
              stroke="white"
              strokeWidth={0.4 / decor.scale}
              strokeLinecap="round"
            />
          </g>

          {/* Delete Handle (Top Right) */}
          <g
            transform="translate(16, -16)"
            className="cursor-pointer"
            onMouseDown={(e) => {
              e.stopPropagation();
              onDelete(decor.id);
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(decor.id);
            }}
          >
            <circle cx="0" cy="0" r={1.6 / decor.scale} fill="#ef4444" />
            <line
              x1={-0.56 / decor.scale}
              y1={-0.56 / decor.scale}
              x2={0.56 / decor.scale}
              y2={0.56 / decor.scale}
              stroke="white"
              strokeWidth={0.4 / decor.scale}
            />
            <line
              x1={0.56 / decor.scale}
              y1={-0.56 / decor.scale}
              x2={-0.56 / decor.scale}
              y2={0.56 / decor.scale}
              stroke="white"
              strokeWidth={0.4 / decor.scale}
            />
          </g>

          {/* Scale Handle (Bottom Right) */}
          <g
            transform="translate(16, 16)"
            className="cursor-se-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              onInteract(e, "scale", decor);
            }}
          >
            <circle cx="0" cy="0" r={1.6 / decor.scale} fill="#3b82f6" />
            <circle cx="0" cy="0" r={0.56 / decor.scale} fill="white" />
          </g>

          {/* Mirror Handle (Bottom Left) */}
          <g
            transform="translate(-16, 16)"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onMirror(decor.id);
            }}
          >
            <circle cx="0" cy="0" r={1.6 / decor.scale} fill="#f59e0b" />
            <line x1={-1.2 / decor.scale} y1="0" x2={1.2 / decor.scale} y2="0" stroke="white" strokeWidth={0.4 / decor.scale} />
            <line x1="0" y1={-0.56 / decor.scale} x2="0" y2={0.56 / decor.scale} stroke="white" strokeWidth={0.4 / decor.scale} />
          </g>

          {/* Rotate Handle (Top Center) */}
          <g
            transform="translate(0, -16)"
            className="cursor-crosshair"
            onMouseDown={(e) => {
              e.stopPropagation();
              onInteract(e, "rotate", decor);
            }}
          >
            <circle cx="0" cy="0" r={1.6 / decor.scale} fill="#10b981" />
            {/* Rotation icon SVG */}
            <image x={-1 / decor.scale} y={-1 / decor.scale} width={2 / decor.scale} height={2 / decor.scale} href="/rotation-icon.svg" />
          </g>
        </g>
      )}
    </g>
  );
};

// --- SVG SHAPE RENDERER ---
const TierShape: FC<TierShapeProps> = ({ tier, yBase, maxW, isHovered, onClick, showDimensions = true }) => {
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
  const dimX = maxW / 2 + 15;
  const midY = (yBase + topY) / 2;

  // Render shapes mathematically based on isometric projection
  let shapeElements;

  if (shape === "circle" || shape === "circle_platform") {
    shapeElements = (
      <g>
        {/* Bottom Arc (Hidden but good for structural outline if transparent) */}
        {/* Body */}
        <path
          d={`M ${-w / 2} ${yBase} 
              A ${w / 2} ${(w / 2) * p} 0 0 0 ${w / 2} ${yBase} 
              L ${w / 2} ${topY} 
              A ${w / 2} ${(w / 2) * p} 0 0 1 ${-w / 2} ${topY} Z`}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        {/* Top Ellipse */}
        <ellipse cx="0" cy={topY} rx={w / 2} ry={(w / 2) * p} fill={topFillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
      </g>
    );
  } else if (shape === "square" || shape === "square_platform") {
    shapeElements = (
      <g>
        {/* Left Face */}
        <polygon
          points={`0,${yBase + (w / 2) * p} ${-w / 2},${yBase} ${-w / 2},${topY} 0,${topY + (w / 2) * p}`}
          fill={sideFillLight}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        {/* Right Face */}
        <polygon
          points={`0,${yBase + (w / 2) * p} ${w / 2},${yBase} ${w / 2},${topY} 0,${topY + (w / 2) * p}`}
          fill={sideFillDark}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        {/* Top Face */}
        <polygon
          points={`0,${topY + (w / 2) * p} ${w / 2},${topY} 0,${topY - (w / 2) * p} ${-w / 2},${topY}`}
          fill={topFillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </g>
    );
  } else if (shape === "hexagon") {
    const w_4 = w / 4;
    const y_p = (w * p) / 2;
    shapeElements = (
      <g>
        {/* Left Face */}
        <polygon
          points={`${-w / 2},${yBase} ${-w_4},${yBase + y_p} ${-w_4},${topY + y_p} ${-w / 2},${topY}`}
          fill={sideFillLight}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        {/* Center Face */}
        <polygon
          points={`${-w_4},${yBase + y_p} ${w_4},${yBase + y_p} ${w_4},${topY + y_p} ${-w_4},${topY + y_p}`}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        {/* Right Face */}
        <polygon
          points={`${w_4},${yBase + y_p} ${w / 2},${yBase} ${w / 2},${topY} ${w_4},${topY + y_p}`}
          fill={sideFillDark}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        {/* Top Face */}
        <polygon
          points={`${-w_4},${topY + y_p} ${w_4},${topY + y_p} ${w / 2},${topY} ${w_4},${topY - y_p} ${-w_4},${topY - y_p} ${-w / 2},${topY}`}
          fill={topFillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </g>
    );
  }

  return (
    <g className="cursor-pointer transition-all duration-200" onClick={() => onClick(tier)}>
      {shapeElements}

      {showDimensions && (
        <>
          {/* Front Label (Width) */}
          <text
            x="0"
            y={yBase + (w / 2) * p - 0.5}
            textAnchor="middle"
            alignmentBaseline="baseline"
            fontFamily="monospace"
            fontSize="2px"
            fontWeight="bold"
            fill="#334155"
            style={{
              paintOrder: "stroke",
              stroke: "#ffffff",
              strokeWidth: "0.4px",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {shape === "circle" || shape === "circle_platform" ? "Ø" : shape === "hexagon" ? "⬡" : "□"} {w}cm
          </text>

          {/* --- Dimension Lines (Right Side) --- */}
          {/* Top extension line */}
          <line x1={w / 2 + 5} y1={topY} x2={dimX} y2={topY} stroke="#94a3b8" strokeDasharray="2,2" strokeWidth="0.125" />
          {/* Bottom extension line */}
          <line x1={w / 2 + 5} y1={yBase} x2={dimX} y2={yBase} stroke="#94a3b8" strokeDasharray="2,2" strokeWidth="0.125" />
          {/* Vertical dimension line */}
          <line
            x1={dimX - 10}
            y1={topY}
            x2={dimX - 10}
            y2={yBase}
            stroke="#64748b"
            strokeWidth="0.25"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          {/* Height Label */}
          <text
            x={dimX - 5}
            y={midY}
            alignmentBaseline="middle"
            fontFamily="monospace"
            fontSize="2px"
            fontWeight="bold"
            fill="#334155"
            style={{
              paintOrder: "stroke",
              stroke: "#f8fafc",
              strokeWidth: "0.4px",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {h}cm
          </text>
        </>
      )}
    </g>
  );
};

// --- MAIN APPLICATION COMPONENT ---
interface CakeTierDesignerProps {
  initialProjectId?: string;
}

export default function Page({ initialProjectId }: CakeTierDesignerProps): ReactNode {
  const router = useRouter();
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<SVGPoint>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [hasDragged, setHasDragged] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportModalName, setExportModalName] = useState<string>("");
  const [exportModalDate, setExportModalDate] = useState<string>("");
  const [exportType, setExportType] = useState<"png" | "pdf" | null>(null);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showDecorations, setShowDecorations] = useState<boolean>(true);
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);
  const panStartRef = useRef<SVGPoint>({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Decorations State
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [activeDecorId, setActiveDecorId] = useState<string | null>(null);
  const decorInteractRef = useRef<DecorInteractState>({
    mode: null,
    id: null,
    startX: 0,
    startY: 0,
    initialDecor: null,
  });

  // Modal State
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    mode: "add",
    tierId: null,
    shape: "circle",
    width: 30,
    height: 10,
  });

  // Save/Projects Modals State
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showProjectsModal, setShowProjectsModal] = useState<boolean>(false);
  const [isSavingProject, setIsSavingProject] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [sessionScopeId, setSessionScopeId] = useState<string>("guest");

  // AdWall State for free tier exports
  const [showAdWall, setShowAdWall] = useState<boolean>(false);
  const [pendingExport, setPendingExport] = useState<{
    name: string;
    date: string;
    type: "png" | "pdf";
  } | null>(null);

  // Session Restore State
  const [showRestoreNotification, setShowRestoreNotification] = useState<boolean>(false);
  const [isNotificationClosing, setIsNotificationClosing] = useState<boolean>(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState<boolean>(false);

  // Auto-dismiss notification after 5 seconds
  useEffect(() => {
    if (showRestoreNotification) {
      const timer = setTimeout(() => {
        setIsNotificationClosing(true);
        // Wait for animation to complete before removing
        const removeTimer = setTimeout(() => {
          setShowRestoreNotification(false);
          setIsNotificationClosing(false);
        }, 300);
        return () => clearTimeout(removeTimer);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showRestoreNotification]);

  // Check subscription status and restore session
  useEffect(() => {
    const initializeBuilderState = async () => {
      try {
        const { supabase } = await import("../lib/supabase");
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const scopeId = session?.user?.id || "guest";
        setSessionScopeId(scopeId);

        if (initialProjectId && session?.access_token) {
          const projectResult = await (getProject as any)({
            data: {
              projectId: initialProjectId,
              authToken: session.access_token,
            },
          });

          if (!projectResult.success || !projectResult.project) {
            throw new Error(projectResult.error || "Failed to load requested project");
          }

          setTiers(projectResult.project.tiers);
          setDecorations(projectResult.project.decorations);
        }

        // Restore session data for the active user scope if available
        const sessionData = getSessionData(scopeId);
        if (!initialProjectId && sessionData && sessionData.tiers.length > 0) {
          setTiers(sessionData.tiers);
          setDecorations(sessionData.decorations);
          setShowRestoreNotification(true);
        }

        if (!session?.access_token) {
          setHasSubscription(false);
          setShowGuestPrompt(true);
        } else {
          setShowGuestPrompt(false);
          const response = await getSubscriptionDetails({ data: { authToken: session.access_token } });
          setHasSubscription(response.hasPayment);
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
        setHasSubscription(false);
        if (initialProjectId) {
          alert(`Error loading project: ${(error as Error).message}`);
        }
      }
    };

    initializeBuilderState();
  }, [initialProjectId]);

  // Auto-save session data whenever tiers or decorations change
  useSessionAutoSave(tiers, decorations, 1000, sessionScopeId);

  // Derived calculations for the Canvas SVG
  const { maxW, totalH, viewBounds, tiersWithY, actualTiersCount } = useMemo(() => {
    if (tiers.length === 0) return { maxW: 100, totalH: 0, viewBounds: "-150 -150 300 300", tiersWithY: [], actualTiersCount: 0 };

    let mw = 0;
    let th = 0;
    let tCount = 0;
    const mapped = [...tiers].map((t) => {
      mw = Math.max(mw, t.width);
      const yBase = -th;
      th += t.height;

      let tNum = null;
      if (!t.shape.includes("platform")) {
        tCount++;
        tNum = tCount;
      }

      return { ...t, yBase, tierNumber: tNum };
    });

    const p = 0.25;
    // Calculate bounding box that tightly fits the entire technical sketch
    // Make it perfectly symmetrical around X=0 so the cake is centered
    const paddingRight = 30; // Space for the height dimensions on the right
    const maxX = mw / 2 + paddingRight;
    const minX = -maxX; // Symmetrical left margin to keep cake exactly in the center
    const width = maxX - minX;

    const minY = -th - (mw / 2) * p - 15; // Top padding (tightened)
    const maxY = (mw / 2) * p + 15; // Bottom padding (tightened)
    const height = maxY - minY;

    return {
      maxW: mw,
      totalH: th,
      viewBounds: `${minX} ${minY} ${width} ${height}`,
      tiersWithY: mapped,
      actualTiersCount: tCount,
    };
  }, [tiers]);

  // --- Handlers ---
  const getCanvasSnapshot = (
    projectName?: string,
    projectDate?: string,
  ): Promise<{ canvas: HTMLCanvasElement; exportW: number; exportH: number } | null> => {
    return new Promise((resolve) => {
      const exportSnapshot = async () => {
        const svgElement = svgRef.current;
        if (!svgElement) return resolve(null);

        const viewBox = svgElement.viewBox.baseVal;

        // 1. Force strict Portrait A4 dimensions at 300 DPI
        const exportW = 2480;
        const exportH = 3508;

        // 2. Enforce padding. Create a larger top margin to accommodate the text header!
        const marginPx = 100;
        const marginTopPx = 350;
        const drawW = exportW - marginPx * 2;
        const drawH = exportH - (marginTopPx + marginPx);

        // 3. Calculate exact scale to maximize the sketch into the safe printable area
        const scale = Math.min(drawW / viewBox.width, drawH / viewBox.height);
        const scaledW = viewBox.width * scale;
        const scaledH = viewBox.height * scale;

        // Clone the SVG so we don't mess up the live canvas
        const clone = svgElement.cloneNode(true) as SVGSVGElement;

        // Strip out any React inline styles for pan/zoom
        clone.style.transform = "";
        clone.style.filter = "";
        clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

        // Remove transform UI elements from the export clone
        clone.querySelectorAll(".decor-ui").forEach((el: Element) => el.remove());

        // Force the SVG to render exactly at the high-res scaled pixel size
        // This guarantees vector-crisp lines instead of a blurry upscaled image
        clone.setAttribute("width", scaledW.toString());
        clone.setAttribute("height", scaledH.toString());

        // Inline decoration assets so exported SVG always includes image nodes.
        await inlineSvgImageAssets(clone);

        const svgData = new XMLSerializer().serializeToString(clone);
        const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = exportW;
          canvas.height = exportH;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            URL.revokeObjectURL(url);
            return resolve(null);
          }

        // Fill blueprint background (grid lines removed for export)
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(0, 0, exportW, exportH);

        // --- DRAW HEADER TEXT ---
        ctx.textBaseline = "top";

        // Top Left: Name & Date
        ctx.textAlign = "left";
        ctx.fillStyle = "#1e293b"; // slate-800
        ctx.font = "bold 70px sans-serif";
        ctx.fillText(projectName || "Project Name: ________________", marginPx, marginPx);

        ctx.fillStyle = "#64748b"; // slate-500
        ctx.font = "50px sans-serif";
        ctx.fillText(projectDate || "Date: ________________", marginPx, marginPx + 100);

        // Top Right: Tiers & Height
        ctx.textAlign = "right";
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 70px sans-serif";
        ctx.fillText(`${actualTiersCount} Tiers`, exportW - marginPx, marginPx);

        ctx.fillStyle = "#64748b";
        ctx.font = "50px sans-serif";
        ctx.fillText(`Total Height: ${totalH}cm`, exportW - marginPx, marginPx + 100);
        // ------------------------

        ctx.save();

        // Re-apply a scaled-up drop shadow for aesthetics on the high-res export
        ctx.shadowColor = "rgba(0, 0, 0, 0.05)";
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 40;

        // 4. Center it perfectly within the margins (using the expanded top margin)
        const dx = marginPx + (drawW - scaledW) / 2;
        const dy = marginTopPx + (drawH - scaledH) / 2;

        // Draw the image exactly within the calculated safe zones
        ctx.drawImage(img, dx, dy, scaledW, scaledH);
        ctx.restore();

        // Add watermark for free tier users
        if (!hasSubscription) {
          // Load the watermark SVG image and draw it in a grid
          const watermarkImg = new Image();
          watermarkImg.onload = () => {
            ctx.save();
            ctx.globalAlpha = 0.08;
            ctx.translate(exportW / 2, exportH / 2);
            ctx.rotate((-45 * Math.PI) / 180);

            // Draw a larger, more spaced out grid of logos
            const logoWidth = 380; // Logo width (landscape)
            const logoHeight = 106; // Logo height
            const gapSize = 120; // Increased gap between logos
            const totalSpacingX = logoWidth + gapSize; // Total distance between logo centers (horizontal)
            const totalSpacingY = logoHeight + gapSize; // Total distance between logo centers (vertical)

            // Draw enough logos to cover the entire rotated canvas
            const extendedRange = Math.max(exportW, exportH) * 2;

            for (let x = -extendedRange; x < extendedRange; x += totalSpacingX) {
              for (let y = -extendedRange; y < extendedRange; y += totalSpacingY) {
                ctx.drawImage(watermarkImg, x - logoWidth / 2, y - logoHeight / 2, logoWidth, logoHeight);

                // Draw text below the logo
                ctx.save();
                ctx.globalAlpha = 0.08;
                ctx.font = "bold 36px 'Comic Sans MS', 'Comic Sans', cursive";
                ctx.textAlign = "center";
                ctx.fillStyle = "#2563EB";
                ctx.fillText("buildmycakes.com", x, y + logoHeight / 2 + 25);
                ctx.restore();
              }
            }

            ctx.restore();
            // Resolve after drawing watermark
            URL.revokeObjectURL(url);
            resolve({ canvas, exportW, exportH });
          };
          watermarkImg.src = "/main_logo.svg";
        } else {
          URL.revokeObjectURL(url);
          resolve({ canvas, exportW, exportH });
        }
      };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(null);
        };

        img.src = url;
      };

      void exportSnapshot();
    });
  };

  const handleExport = (): void => {
    setExportType(null);
    setShowExportModal(true);
  };

  const performExport = async (name: string, date: string, type: "png" | "pdf"): Promise<void> => {
    // If user is free tier, show AdWall instead of downloading immediately
    if (!hasSubscription) {
      setPendingExport({ name, date, type });
      setShowAdWall(true);
    } else {
      // Premium user gets immediate download
      await executeDownload(name, date, type);
    }
  };

  const executeDownload = async (name: string, date: string, type: "png" | "pdf"): Promise<void> => {
    try {
      // Convert date format from YYYY-MM-DD to DD-MM-YYYY
      const [year, month, day] = date.split("-");
      const formattedDate = `${day}-${month}-${year}`;

      // Use provided name and date for export
      const snapshot = await getCanvasSnapshot(name, date);
      if (!snapshot) return;

      if (type === "png") {
        const pngUrl = snapshot.canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `${name}_${formattedDate}.png`;
        a.click();
      } else if (type === "pdf") {
        // Dynamically load jsPDF library only when needed
        if (!(window as any).jspdf) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        const { jsPDF } = (window as any).jspdf;
        const { canvas } = snapshot;

        // Compress slightly for PDF to avoid massive file sizes
        const imgData = canvas.toDataURL("image/jpeg", 0.9);

        // Force standard Portrait A4 format
        const doc = new jsPDF({
          orientation: "p",
          unit: "mm",
          format: "a4",
        });

        // Map the 300 DPI canvas exactly to the physical A4 document
        const pdfW = doc.internal.pageSize.getWidth();
        const pdfH = doc.internal.pageSize.getHeight();

        doc.addImage(imgData, "JPEG", 0, 0, pdfW, pdfH);
        doc.save(`${name}_${formattedDate}.pdf`);
      }
    } catch (err) {
      console.error("Failed to generate export", err);
    }
  };

  const handleAdWallComplete = async (): Promise<void> => {
    if (pendingExport) {
      await executeDownload(pendingExport.name, pendingExport.date, pendingExport.type);
      setPendingExport(null);
    }
    setShowAdWall(false);
  };

  const handleAdWallCancel = (): void => {
    setShowAdWall(false);
    setPendingExport(null);
  };

  const handleSaveProject = async (projectName: string): Promise<void> => {
    try {
      setIsSavingProject(true);

      // Get auth session
      const { supabase } = await import("../lib/supabase");
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Not authenticated. Please log in first.");
      }

      const result = await (saveProject as any)({
        data: {
          name: projectName,
          tiers,
          decorations,
          authToken: session.access_token,
        },
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to save project");
      }

      setShowSaveModal(false);
    } catch (error: any) {
      console.log("Error saving project:", error.message);
      alert(`Error saving project: ${error.message}`);
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleLoadProject = async (project: any): Promise<void> => {
    try {
      setTiers(project.tiers);
      setDecorations(project.decorations);
      setActiveDecorId(null);
      // Reset zoom and pan when loading a new project
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } catch (error: any) {
      alert(`Error loading project: ${error.message}`);
    }
  };

  const handleResetCanvas = (): void => {
    setShowResetModal(true);
  };

  const confirmReset = (): void => {
    setTiers([]);
    setDecorations([]);
    setHoveredTier(null);
    setIsDraggingOver(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsPanning(false);
    setHasDragged(false);
    setActiveDecorId(null);
    setModal({
      isOpen: false,
      mode: "add",
      tierId: null,
      shape: "circle",
      width: 30,
      height: 10,
    });
    setShowSaveModal(false);
    setShowProjectsModal(false);
    setShowResetModal(false);
    clearSessionData(sessionScopeId);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>): void => {
    // Zoom in and out based on scroll wheel direction
    const zoomSensitivity = 0.002;
    setZoom((prev) => Math.max(0.1, Math.min(5, prev - e.deltaY * zoomSensitivity)));
  };

  // Convert screen coordinates to exact SVG ViewBox coordinates
  const getSvgPoint = (clientX: number, clientY: number): SVGPoint => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse() || new DOMMatrix());
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    setActiveDecorId(null); // Deselect decorations if clicking on the background
    setIsPanning(true);
    setHasDragged(false);
    panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (decorInteractRef.current.mode) {
      const svgP = getSvgPoint(e.clientX, e.clientY);
      const { mode, id, startX, startY, initialDecor } = decorInteractRef.current;

      setDecorations((prev) =>
        prev.map((d) => {
          if (d.id !== id || !initialDecor) return d;
          if (mode === "move") {
            return { ...d, x: initialDecor.x + (svgP.x - startX), y: initialDecor.y + (svgP.y - startY) };
          }
          if (mode === "scale") {
            const distStart = Math.hypot(startX - initialDecor.x, startY - initialDecor.y);
            const distCurrent = Math.hypot(svgP.x - initialDecor.x, svgP.y - initialDecor.y);
            const scaleFactor = distStart === 0 ? 1 : distCurrent / distStart;
            return { ...d, scale: Math.max(0.1, initialDecor.scale * scaleFactor) };
          }
          if (mode === "rotate") {
            const angleStart = Math.atan2(startY - initialDecor.y, startX - initialDecor.x);
            const angleCurrent = Math.atan2(svgP.y - initialDecor.y, svgP.x - initialDecor.x);
            const diff = (angleCurrent - angleStart) * (180 / Math.PI);
            return { ...d, rotation: initialDecor.rotation + diff };
          }
          return d;
        }),
      );
      return;
    }

    if (!isPanning) return;
    setHasDragged(true);
    setPan({
      x: e.clientX - panStartRef.current.x,
      y: e.clientY - panStartRef.current.y,
    });
  };

  const handleMouseUp = (): void => {
    setIsPanning(false);
    decorInteractRef.current.mode = null;
  };

  const handleMouseLeave = (): void => {
    setIsPanning(false);
    decorInteractRef.current.mode = null;
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: string, payload: string): void => {
    e.dataTransfer.setData("type", type);
    if (type === "shape") e.dataTransfer.setData("shape", payload);
    if (type === "decoration") e.dataTransfer.setData("iconId", payload);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation(); // Prevent duplicate firing if nested dropzones trigger
    setIsDraggingOver(false);

    const type = e.dataTransfer.getData("type");

    if (type === "decoration") {
      const iconId = e.dataTransfer.getData("iconId");
      if (!iconId) return;
      const svgP = getSvgPoint(e.clientX, e.clientY);
      const newDecor: Decoration = {
        id: generateId(),
        iconId,
        x: svgP.x,
        y: svgP.y,
        scale: 0.4, // Spawn at a more reasonable initial scale relative to the cake bounds
        rotation: 0,
      };
      setDecorations((prev) => [...prev, newDecor]);
      setActiveDecorId(newDecor.id);
    } else {
      // Fallback for cake tier shapes
      const shape = e.dataTransfer.getData("shape");
      if (shape) openModal("add", shape);
    }
  };

  // Decoration Interaction Handlers
  const handleDecorInteract = (e: MouseEvent<SVGGElement>, mode: string, decor: Decoration): void => {
    const svgP = getSvgPoint(e.clientX, e.clientY);
    decorInteractRef.current = {
      mode,
      id: decor.id,
      startX: svgP.x,
      startY: svgP.y,
      initialDecor: { ...decor },
    };
  };

  const handleDecorDelete = (id: string): void => {
    setDecorations((prev) => prev.filter((d) => d.id !== id));
    if (activeDecorId === id) setActiveDecorId(null);
  };

  const handleDecorMirror = (id: string): void => {
    setDecorations((prev) => prev.map((d) => (d.id === id ? { ...d, mirrorFlip: !d.mirrorFlip } : d)));
  };

  const handleDecorBringToFront = (id: string): void => {
    setDecorations((prev) => {
      const targetDecor = prev.find((d) => d.id === id);
      if (!targetDecor) return prev;

      return [...prev.filter((d) => d.id !== id), targetDecor];
    });
    setActiveDecorId(id);
  };

  const openModal = (mode: "add" | "edit", shapeType?: string, existingTier?: Tier): void => {
    if (mode === "add" && shapeType) {
      // Default sizing based on shape to give good starting points
      let defW = 30;
      let defH = getAutoTierHeight(shapeType, defW);
      if (tiers.length > 0) {
        // If adding a new tier, suggest slightly smaller than the top tier
        const topTier = tiers[tiers.length - 1];
        defW = shapeType.includes("platform") ? topTier.width + 5 : Math.max(10, topTier.width - 10);
        defH = getAutoTierHeight(shapeType, defW);
      }
      setModal({ isOpen: true, mode: "add", tierId: null, shape: shapeType, width: defW, height: defH });
    } else if (mode === "edit" && existingTier) {
      setModal({
        isOpen: true,
        mode: "edit",
        tierId: existingTier.id,
        shape: existingTier.shape,
        width: existingTier.width,
        height: existingTier.height,
      });
    }
  };

  const saveTier = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const width = Number(modal.width);
    const height = Number(modal.height);

    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      return;
    }

    if (modal.mode === "add") {
      setTiers([...tiers, { id: generateId(), shape: modal.shape as Tier["shape"], width, height }]);
    } else {
      setTiers(tiers.map((t) => (t.id === modal.tierId ? { ...t, width, height } : t)));
    }
    setModal({ ...modal, isOpen: false });
  };

  const removeTier = (id: string, e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setTiers(tiers.filter((t) => t.id !== id));
  };

  const moveTier = (index: number, direction: "up" | "down", e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    if (direction === "up" && index < tiers.length - 1) {
      const newTiers = [...tiers];
      [newTiers[index], newTiers[index + 1]] = [newTiers[index + 1], newTiers[index]];
      setTiers(newTiers);
    } else if (direction === "down" && index > 0) {
      const newTiers = [...tiers];
      [newTiers[index], newTiers[index - 1]] = [newTiers[index - 1], newTiers[index]];
      setTiers(newTiers);
    }
  };

  const ShapeIcon: FC<ShapeIconProps> = ({ shape, className }) => {
    if (shape === "circle" || shape === "circle_platform") return <Circle className={className} />;
    if (shape === "square" || shape === "square_platform") return <Square className={className} />;
    if (shape === "hexagon") return <Hexagon className={className} />;
    return null;
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Guest Login Prompt */}
      {showGuestPrompt && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
              <h2 className="text-lg font-bold text-slate-900">You are not logged in</h2>
              <p className="text-sm text-slate-600 mt-1">
                Create an account or log in to unlock all features, including easier project saving and a smoother overall workflow.
              </p>
            </div>

            <div className="px-6 py-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                You can continue in guest mode, but registering helps you get the full Build My Cakes experience.
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.navigate({ to: "/sign-up" })}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Create account
                </button>
                <button
                  onClick={() => router.navigate({ to: "/log-in" })}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Log in
                </button>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowGuestPrompt(false)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              >
                Continue as guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Restore Notification */}
      {showRestoreNotification && (
        <div 
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isNotificationClosing ? '0px' : '200px',
          }}
        >
          <div 
            className="bg-green-50 border-b border-green-200 px-6 py-3 flex items-center justify-between z-20"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <p className="text-sm text-green-800">
                <span className="font-semibold">Session restored!</span> We found your previous design and restored it.
              </p>
            </div>
            <button
              onClick={() => {
                setIsNotificationClosing(true);
                setTimeout(() => {
                  setShowRestoreNotification(false);
                  setIsNotificationClosing(false);
                }, 300);
              }}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm shrink-0 h-16">
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.navigate({ to: "/" })}
            className="flex items-center justify-center p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
            title="Back to home"
          >
            <ArrowLeft size={20} />
          </button>
          <img src="/main_logo.svg" alt="Build My Cakes" className="h-8" />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetCanvas}
            className="flex items-center gap-1.5 bg-slate-200 hover:bg-blue-600 text-slate-700 hover:text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm hover:shadow-blue-600/20"
            title="Start a new design"
          >
            <RotateCcw className="w-4 h-4" />
            New
          </button>
          <button
            onClick={() => setShowProjectsModal(true)}
            className="flex items-center gap-1.5 bg-slate-200 hover:bg-blue-600 text-slate-700 hover:text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm hover:shadow-blue-600/20"
            title="View projects"
          >
            <FolderOpen className="w-4 h-4" />
            Projects
          </button>
          <button
            onClick={() => setShowSaveModal(true)}
            disabled={tiers.length === 0}
            className="flex items-center gap-1.5 bg-slate-200 hover:bg-blue-600 text-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm hover:shadow-blue-600/20"
            title="Save project"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={handleExport}
            disabled={tiers.length === 0}
            className="flex items-center gap-1.5 bg-slate-200 hover:bg-blue-600 text-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm hover:shadow-blue-600/20"
            title="Export cake design"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden h-full">
        {/* Left Sidebar (Decorations) */}
        <aside className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col h-1/2 md:h-full z-10 shadow-lg md:shadow-none shrink-0">
          <div className="p-6 flex-1 overflow-y-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4">Decorations</h2>

            <div className="mb-8">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">Flowers</h3>
              <div className="grid grid-cols-2 gap-4">
                {decorationsList
                  .filter((d) => d.type === "flower")
                  .sort(sortDecorationsByNumericName)
                  .map((decor) => (
                    <div
                      key={decor.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, "decoration", decor.id)}
                      className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 cursor-grab active:cursor-grabbing transition-colors group"
                    >
                      <img
                        src={decor.svgPath}
                        alt={decor.name}
                        className="w-14 h-14 object-contain pointer-events-none group-hover:scale-110 transition-transform"
                      />
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">Leaves</h3>
              <div className="grid grid-cols-2 gap-4">
                {decorationsList
                  .filter((d) => d.type === "leaf")
                  .sort(sortDecorationsByNumericName)
                  .map((decor) => (
                    <div
                      key={decor.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, "decoration", decor.id)}
                      className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 cursor-grab active:cursor-grabbing transition-colors group"
                    >
                      <img
                        src={decor.svgPath}
                        alt={decor.name}
                        className="w-14 h-14 object-contain pointer-events-none group-hover:scale-110 transition-transform"
                      />
                    </div>
                  ))}
              </div>
            </div>

            <p className="text-[10px] text-slate-500 mt-6 text-center border-t border-slate-100 pt-4">More decorative tools coming soon</p>
          </div>
        </aside>

        {/* Main Canvas (Blueprint Renderer) - Center */}
        <div
          id="sketch-container"
          className={`flex-1 relative bg-slate-50 overflow-hidden ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}
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
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.4]"
            style={{
              backgroundImage: "linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Watermark - shown when user has no subscription */}
          {!hasSubscription && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-30" style={{ opacity: 0.08 }}>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: "rotate(-45deg)" }}>
                <div className="flex flex-col items-center gap-12" style={{ transform: "scale(2)", width: "200%", height: "200%" }}>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="flex gap-12">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div key={j} className="flex flex-col items-center gap-1 flex-shrink-0">
                          <img src="/main_logo.svg" alt="watermark" className="h-16" />
                          <span
                            className="text-[12px] font-semibold whitespace-nowrap text-blue-600"
                            style={{ fontFamily: "Comic Sans MS, Comic Sans, cursive" }}
                          >
                            buildmycakes.com
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Zoom controls and visibility toggles */}
          <div className="absolute bottom-6 left-6 z-20 flex gap-2">
            <div className="bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs font-mono text-slate-500 pointer-events-none">
              Zoom: {Math.round(zoom * 100)}% (Scroll to zoom)
            </div>
            <button
              onClick={() => setShowDimensions(!showDimensions)}
              className={`bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border shadow-sm text-xs font-semibold transition-colors ${
                showDimensions ? "border-blue-300 text-blue-600 hover:bg-blue-50" : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
              title={showDimensions ? "Hide dimensions" : "Show dimensions"}
            >
              {showDimensions ? "Dimensions: On" : "Dimensions: Off"}
            </button>
            <button
              onClick={() => {
                setShowDecorations(!showDecorations);
                if (showDecorations) {
                  setActiveDecorId(null);
                }
              }}
              className={`bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border shadow-sm text-xs font-semibold transition-colors ${
                showDecorations ? "border-blue-300 text-blue-600 hover:bg-blue-50" : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
              title={showDecorations ? "Hide decorations" : "Show decorations"}
            >
              {showDecorations ? "Decorations: On" : "Decorations: Off"}
            </button>
          </div>

          {/* Tier counter and total height */}
          <div className="absolute bottom-6 right-6 z-20 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-xs font-mono text-slate-500 pointer-events-none">
            {actualTiersCount} Tiers | Total Height: {totalH}cm
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
                  <p className="text-sm text-slate-500 mt-1 max-w-xs">
                    Drag shapes from the side panel onto this canvas, or click them to start building.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center p-8">
              <svg
                ref={svgRef}
                viewBox={viewBounds}
                className={`w-full h-full max-h-[80vh] ${isPanning ? "" : "transition-transform duration-75 ease-out"}`}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  filter: "drop-shadow(0 20px 13px rgb(0 0 0 / 0.05))",
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
                      if (!hasDragged) openModal("edit", undefined, t);
                    }}
                    showDimensions={showDimensions}
                  />
                ))}

                {/* Render Decorations (Always on top of tiers) */}
                {showDecorations &&
                  decorations.map((decor) => (
                    <DecorationItem
                      key={decor.id}
                      decor={decor}
                      isActive={activeDecorId === decor.id}
                      onSelect={setActiveDecorId}
                      onInteract={handleDecorInteract}
                      onDelete={handleDecorDelete}
                      onMirror={handleDecorMirror}
                      onBringToFront={handleDecorBringToFront}
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
              {["circle", "square", "hexagon", "circle_platform", "square_platform"].map((shape) => (
                <div
                  key={shape}
                  draggable
                  onDragStart={(e) => handleDragStart(e, "shape", shape)}
                  onClick={() => openModal("add", shape)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors group"
                >
                  <ShapeIcon shape={shape} className="w-6 h-6 text-slate-500 group-hover:text-blue-600 mb-2" />
                  <span className="text-xs font-medium text-slate-600 capitalize text-center leading-tight">{shape.replace("_", " ")}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-3 text-center">Click to add or drag onto canvas</p>
          </div>

          {/* Layer Panel */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Structural Layers (Top ➔ Bottom)</h2>
            {tiers.length === 0 ? (
              <div className="text-sm text-slate-400 text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">No tiers added yet.</div>
            ) : (
              <div className="flex flex-col gap-2">
                {[...tiersWithY].reverse().map((tier, reversedIndex) => {
                  const index = tiersWithY.length - 1 - reversedIndex;
                  return (
                    <div
                      key={tier.id}
                      className={`flex items-center justify-between p-3 rounded-xl border ${hoveredTier === tier.id ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white"} transition-colors cursor-pointer shadow-sm`}
                      onMouseEnter={() => setHoveredTier(tier.id)}
                      onMouseLeave={() => setHoveredTier(null)}
                      onClick={() => openModal("edit", undefined, tier)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                          <ShapeIcon shape={tier.shape} className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold capitalize">
                            {tier.tierNumber ? `Tier ${tier.tierNumber}` : "Platform"}: {tier.shape.replace("_", " ")}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                            {tier.width}cm W × {tier.height}cm H
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => moveTier(index, "up", e)}
                            disabled={index === tiers.length - 1}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => moveTier(index, "down", e)}
                            disabled={index === 0}
                            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                        <button onClick={(e) => removeTier(tier.id, e)} className="p-1 text-slate-400 hover:text-red-500 self-end">
                          <Trash2 className="w-3 h-3" />
                        </button>
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShapeIcon shape={modal.shape} className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800 capitalize">
                  {modal.mode === "add" ? "Add" : "Edit"} {modal.shape.replace("_", " ")} Tier
                </h3>
              </div>
            </div>

            <form onSubmit={saveTier} className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Width / Diameter (cm)</label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    required
                    value={modal.width}
                    onChange={(e) => setModal({ ...modal, width: parseDimensionInput(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all mb-3"
                    autoFocus
                  />
                  <input
                    type="range"
                    min="1"
                    max="200"
                    value={modal.width === "" ? 1 : modal.width}
                    onChange={(e) => setModal({ ...modal, width: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-[10px] text-slate-400 mt-2">Defines the horizontal span of the layer.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Height (cm)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={modal.height}
                    onChange={(e) => setModal({ ...modal, height: parseDimensionInput(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all mb-3"
                  />
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={modal.height === "" ? 1 : modal.height}
                    onChange={(e) => setModal({ ...modal, height: Number(e.target.value) })}
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
                  {modal.mode === "add" ? "Add to Cake" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800">Export Cake Design</h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (exportType && exportModalName && exportModalDate) {
                  performExport(exportModalName, exportModalDate, exportType);
                  setShowExportModal(false);
                  setExportModalName("");
                  setExportModalDate("");
                  setExportType(null);
                }
              }}
              className="p-6"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Project Name / Customer Name</label>
                  <input
                    type="text"
                    required
                    value={exportModalName}
                    onChange={(e) => setExportModalName(e.target.value)}
                    placeholder="e.g., Wedding Cake 2024"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Date</label>
                  <input
                    type="date"
                    required
                    value={exportModalDate}
                    onChange={(e) => setExportModalDate(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Export Format</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="exportFormat"
                        value="png"
                        checked={exportType === "png"}
                        onChange={(e) => setExportType(e.target.value as "png" | "pdf")}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-700">PNG Image</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="exportFormat"
                        value="pdf"
                        checked={exportType === "pdf"}
                        onChange={(e) => setExportType(e.target.value as "png" | "pdf")}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-slate-700">PDF Document</span>
                    </label>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  <p className="font-semibold mb-1">File name:</p>
                  <p className="font-mono text-slate-600">
                    {exportModalName || "[Project Name]"}_
                    {exportModalDate
                      ? (() => {
                          const [year, month, day] = exportModalDate.split("-");
                          return `${day}-${month}-${year}`;
                        })()
                      : "[DD-MM-YYYY]"}
                    .{exportType === "png" ? "png" : "pdf"}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowExportModal(false);
                    setExportModalName("");
                    setExportModalDate("");
                    setExportType(null);
                  }}
                  className="flex-1 px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!exportModalName || !exportModalDate || !exportType}
                  className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed font-semibold rounded-lg transition-colors shadow-sm shadow-blue-600/20"
                >
                  Download File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AdWall for Free Tier */}
      {pendingExport && (
        <AdWall
          isOpen={showAdWall}
          onComplete={handleAdWallComplete}
          onCancel={handleAdWallCancel}
          fileName={`${pendingExport.name}_${
            (() => {
              const [year, month, day] = pendingExport.date.split("-");
              return `${day}-${month}-${year}`;
            })()
          }.${pendingExport.type}`}
        />
      )}

      {/* Save Project Modal */}
      <SaveProjectModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveProject}
        tiers={tiers}
        decorations={decorations}
        isSaving={isSavingProject}
      />

      {/* Projects Modal */}
      <ProjectsModal isOpen={showProjectsModal} onClose={() => setShowProjectsModal(false)} onLoad={handleLoadProject} />

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Start New Design?</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-slate-600 text-sm leading-relaxed">Are you sure you want to start a new cake design? All changes will be lost.</p>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex gap-3 justify-end bg-slate-50">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Start New
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
