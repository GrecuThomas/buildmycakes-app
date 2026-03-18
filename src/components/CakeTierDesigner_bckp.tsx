import { useReducer, useRef, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type TierShape = 'round' | 'square' | 'hexagon'
export type FillingType = 'buttercream' | 'ganache' | 'jam' | 'custard' | 'none'

export interface CakeTier {
  id: string
  diameter: number // inches
  height: number // inches
  shape: TierShape
  filling: FillingType
  layers: number
  label: string
  color: string
  hasDowels: boolean
  hasBoardUnder: boolean
}

interface DesignerState {
  tiers: CakeTier[]
  selectedId: string | null
  showDimensions: boolean
  showDowels: boolean
  showBoards: boolean
  scalePx: number // px per inch
}

type Action =
  | { type: 'ADD_TIER' }
  | { type: 'REMOVE_TIER'; id: string }
  | { type: 'SELECT_TIER'; id: string | null }
  | { type: 'UPDATE_TIER'; id: string; patch: Partial<CakeTier> }
  | { type: 'MOVE_TIER'; id: string; direction: 'up' | 'down' }
  | { type: 'TOGGLE_DIMENSIONS' }
  | { type: 'TOGGLE_DOWELS' }
  | { type: 'TOGGLE_BOARDS' }
  | { type: 'SET_SCALE'; value: number }

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIER_COLORS = [
  '#fce7f3', '#fef9c3', '#dbeafe', '#d1fae5',
  '#ede9fe', '#ffedd5', '#f1f5f9', '#fce7f3',
]

let _id = 0
const uid = () => `tier-${++_id}`

function defaultTier(index: number): CakeTier {
  const sizes = [14, 10, 6]
  return {
    id: uid(),
    diameter: sizes[index] ?? 6,
    height: 4,
    shape: 'round',
    filling: 'buttercream',
    layers: 2,
    label: `Tier ${index + 1}`,
    color: TIER_COLORS[index % TIER_COLORS.length],
    hasDowels: index < 2,
    hasBoardUnder: true,
  }
}

const initialState: DesignerState = {
  tiers: [defaultTier(0), defaultTier(1), defaultTier(2)],
  selectedId: null,
  showDimensions: true,
  showDowels: true,
  showBoards: true,
  scalePx: 14,
}

function reducer(state: DesignerState, action: Action): DesignerState {
  switch (action.type) {
    case 'ADD_TIER': {
      const next = defaultTier(state.tiers.length)
      next.diameter = Math.max(4, (state.tiers[state.tiers.length - 1]?.diameter ?? 6) - 4)
      return { ...state, tiers: [...state.tiers, next], selectedId: next.id }
    }
    case 'REMOVE_TIER':
      return {
        ...state,
        tiers: state.tiers.filter(t => t.id !== action.id),
        selectedId: state.selectedId === action.id ? null : state.selectedId,
      }
    case 'SELECT_TIER':
      return { ...state, selectedId: action.id }
    case 'UPDATE_TIER':
      return {
        ...state,
        tiers: state.tiers.map(t => t.id === action.id ? { ...t, ...action.patch } : t),
      }
    case 'MOVE_TIER': {
      const idx = state.tiers.findIndex(t => t.id === action.id)
      if (idx < 0) return state
      const next = [...state.tiers]
      const swap = action.direction === 'up' ? idx - 1 : idx + 1
      if (swap < 0 || swap >= next.length) return state
      ;[next[idx], next[swap]] = [next[swap], next[idx]]
      return { ...state, tiers: next }
    }
    case 'TOGGLE_DIMENSIONS':
      return { ...state, showDimensions: !state.showDimensions }
    case 'TOGGLE_DOWELS':
      return { ...state, showDowels: !state.showDowels }
    case 'TOGGLE_BOARDS':
      return { ...state, showBoards: !state.showBoards }
    case 'SET_SCALE':
      return { ...state, scalePx: action.value }
    default:
      return state
  }
}

// ─── SVG Drawing ─────────────────────────────────────────────────────────────

const BOARD_H_PX = 6
const DOWEL_W = 4
const DOWEL_INSET_RATIO = 0.25

interface TierLayout {
  tier: CakeTier
  x: number
  y: number
  w: number
  h: number
}

function computeLayout(tiers: CakeTier[], scale: number): { layouts: TierLayout[]; totalW: number; totalH: number } {
  // tiers[0] = bottom, tiers[last] = top
  const maxDiam = Math.max(...tiers.map(t => t.diameter), 1)
  const totalW = maxDiam * scale + 80
  let curY = 10 // top padding
  const layouts: TierLayout[] = []

  // Draw top-to-bottom: reversed so index 0 (bottom tier) is at the bottom
  const reversed = [...tiers].reverse()
  for (const tier of reversed) {
    const w = tier.diameter * scale
    const h = tier.height * scale
    const x = (totalW - w) / 2
    const y = curY
    layouts.unshift({ tier, x, y, w, h })
    curY += h + (tier.hasBoardUnder ? BOARD_H_PX : 0) + 2
  }

  // Re-sort so bottom tier is really at the bottom
  // Recompute from bottom up
  const sortedLayouts: TierLayout[] = []
  let baseY = 0
  const reversedForBottom = [...tiers]
  for (const tier of reversedForBottom) {
    const w = tier.diameter * scale
    const h = tier.height * scale
    const x = (totalW - w) / 2
    sortedLayouts.push({ tier, x, y: baseY, w, h })
    baseY += h + (tier.hasBoardUnder ? BOARD_H_PX : 0) + 2
  }

  const totalH = baseY + 20
  // Flip y so that tier[0] is at bottom
  const flippedLayouts = sortedLayouts.map(l => ({
    ...l,
    y: totalH - l.y - l.h - 10,
  }))

  return { layouts: flippedLayouts, totalW, totalH }
}

function CakeDrawing({
  tiers,
  selectedId,
  showDimensions,
  showDowels,
  showBoards,
  scalePx,
  onSelect,
}: {
  tiers: CakeTier[]
  selectedId: string | null
  showDimensions: boolean
  showDowels: boolean
  showBoards: boolean
  scalePx: number
  onSelect: (id: string) => void
}) {
  if (tiers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Add a tier to start designing
      </div>
    )
  }

  const { layouts, totalW, totalH } = computeLayout(tiers, scalePx)

  return (
    <svg
      viewBox={`0 0 ${totalW} ${totalH}`}
      width="100%"
      style={{ maxHeight: 520, display: 'block' }}
      aria-label="Cake tier diagram"
    >
      {/* Drop shadow filter */}
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.15" />
        </filter>
      </defs>

      {layouts.map(({ tier, x, y, w, h }, idx) => {
        const isSelected = tier.id === selectedId
        const boardY = y + h

        return (
          <g key={tier.id} onClick={() => onSelect(tier.id)} style={{ cursor: 'pointer' }}>
            {/* Cake board */}
            {showBoards && tier.hasBoardUnder && (
              <rect
                x={x - 4}
                y={boardY}
                width={w + 8}
                height={BOARD_H_PX}
                fill="#d4a96a"
                rx={2}
                opacity={0.9}
              />
            )}

            {/* Tier body */}
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill={tier.color}
              stroke={isSelected ? '#6366f1' : '#c4a882'}
              strokeWidth={isSelected ? 2.5 : 1.5}
              rx={tier.shape === 'round' ? Math.min(w * 0.08, 8) : 2}
              filter="url(#shadow)"
            />

            {/* Layer lines */}
            {Array.from({ length: tier.layers - 1 }).map((_, li) => {
              const ly = y + (h / tier.layers) * (li + 1)
              return (
                <line
                  key={li}
                  x1={x + 4}
                  y1={ly}
                  x2={x + w - 4}
                  y2={ly}
                  stroke="#c4a88888"
                  strokeWidth={1}
                  strokeDasharray="3,3"
                />
              )
            })}

            {/* Dowels (shown on tiers that support tiers above) */}
            {showDowels && tier.hasDowels && idx < layouts.length - 1 && (
              <>
                {[-1, 0, 1].map(offset => {
                  const cx = x + w / 2 + offset * (w * 0.22)
                  return (
                    <rect
                      key={offset}
                      x={cx - DOWEL_W / 2}
                      y={y + 4}
                      width={DOWEL_W}
                      height={h - 8}
                      fill="#a78b5f"
                      rx={1}
                      opacity={0.7}
                    />
                  )
                })}
              </>
            )}

            {/* Tier label */}
            <text
              x={x + w / 2}
              y={y + h / 2 + 4}
              textAnchor="middle"
              fontSize={Math.max(9, Math.min(13, w * 0.12))}
              fill="#4b3a22"
              fontWeight="500"
              pointerEvents="none"
            >
              {tier.label}
            </text>

            {/* Dimension annotations */}
            {showDimensions && (
              <>
                {/* Width arrow */}
                <line x1={x} y1={y - 8} x2={x + w} y2={y - 8} stroke="#6366f1" strokeWidth={1} markerEnd="url(#arrow)" markerStart="url(#arrow)" />
                <text x={x + w / 2} y={y - 11} textAnchor="middle" fontSize={9} fill="#6366f1">
                  {tier.diameter}"
                </text>
                {/* Height arrow */}
                <line x1={x + w + 8} y1={y} x2={x + w + 8} y2={y + h} stroke="#6366f1" strokeWidth={1} />
                <text x={x + w + 14} y={y + h / 2 + 3} fontSize={9} fill="#6366f1">
                  {tier.height}"
                </text>
              </>
            )}
          </g>
        )
      })}

      {/* Arrow markers for dimensions */}
      <defs>
        <marker id="arrow" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="#6366f1" />
        </marker>
      </defs>
    </svg>
  )
}

// ─── Panel Components ─────────────────────────────────────────────────────────

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700">
      <div
        onClick={onChange}
        className={`relative w-9 h-5 rounded-full transition-colors ${checked ? 'bg-indigo-500' : 'bg-gray-300'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : ''}`}
        />
      </div>
      {label}
    </label>
  )
}

const SHAPE_OPTIONS: { value: TierShape; label: string }[] = [
  { value: 'round', label: 'Round' },
  { value: 'square', label: 'Square' },
  { value: 'hexagon', label: 'Hexagon' },
]

const FILLING_OPTIONS: { value: FillingType; label: string }[] = [
  { value: 'buttercream', label: 'Buttercream' },
  { value: 'ganache', label: 'Ganache' },
  { value: 'jam', label: 'Jam' },
  { value: 'custard', label: 'Custard' },
  { value: 'none', label: 'None' },
]

function TierEditor({
  tier,
  onUpdate,
  onRemove,
  onMove,
  isFirst,
  isLast,
}: {
  tier: CakeTier
  onUpdate: (patch: Partial<CakeTier>) => void
  onRemove: () => void
  onMove: (dir: 'up' | 'down') => void
  isFirst: boolean
  isLast: boolean
}) {
  return (
    <div className="space-y-3">
      {/* Label + color */}
      <div className="flex gap-2 items-center">
        <input
          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={tier.label}
          onChange={e => onUpdate({ label: e.target.value })}
          placeholder="Tier label"
        />
        <input
          type="color"
          value={tier.color}
          onChange={e => onUpdate({ color: e.target.value })}
          className="w-8 h-8 rounded cursor-pointer border border-gray-200"
          title="Tier color"
        />
      </div>

      {/* Shape */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Shape</label>
        <div className="flex gap-2">
          {SHAPE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onUpdate({ shape: opt.value })}
              className={`flex-1 py-1 text-xs rounded-lg border transition-colors ${
                tier.shape === opt.value
                  ? 'bg-indigo-100 border-indigo-400 text-indigo-700 font-medium'
                  : 'border-gray-200 text-gray-600 hover:border-indigo-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Diameter (in)</label>
          <input
            type="number"
            min={2}
            max={24}
            step={0.5}
            value={tier.diameter}
            onChange={e => onUpdate({ diameter: parseFloat(e.target.value) || 2 })}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Height (in)</label>
          <input
            type="number"
            min={1}
            max={12}
            step={0.5}
            value={tier.height}
            onChange={e => onUpdate({ height: parseFloat(e.target.value) || 1 })}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Layers</label>
          <input
            type="number"
            min={1}
            max={6}
            step={1}
            value={tier.layers}
            onChange={e => onUpdate({ layers: parseInt(e.target.value) || 1 })}
            className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      {/* Filling */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Filling</label>
        <select
          value={tier.filling}
          onChange={e => onUpdate({ filling: e.target.value as FillingType })}
          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
        >
          {FILLING_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Structural */}
      <div className="flex flex-col gap-2">
        <Toggle
          label="Dowel supports (for tiers above)"
          checked={tier.hasDowels}
          onChange={() => onUpdate({ hasDowels: !tier.hasDowels })}
        />
        <Toggle
          label="Cake board underneath"
          checked={tier.hasBoardUnder}
          onChange={() => onUpdate({ hasBoardUnder: !tier.hasBoardUnder })}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onMove('up')}
          disabled={isFirst}
          className="flex-1 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Move tier up (closer to top)"
        >
          ↑ Up
        </button>
        <button
          onClick={() => onMove('down')}
          disabled={isLast}
          className="flex-1 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Move tier down (closer to bottom)"
        >
          ↓ Down
        </button>
        <button
          onClick={onRemove}
          className="flex-1 py-1 text-xs border border-red-200 text-red-500 rounded-lg hover:bg-red-50"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

// ─── Stats Panel ─────────────────────────────────────────────────────────────

function servingsForTier(tier: CakeTier): number {
  // Standard party servings estimate: round ≈ π*r²*h / (1×2 slice inches)
  if (tier.shape === 'round') {
    const r = tier.diameter / 2
    return Math.round(Math.PI * r * r * tier.height / 2)
  }
  return Math.round(tier.diameter * tier.diameter * tier.height / 2)
}

function StatsPanel({ tiers }: { tiers: CakeTier[] }) {
  const totalHeight = tiers.reduce((sum, t) => sum + t.height, 0)
  const totalServings = tiers.reduce((sum, t) => sum + servingsForTier(t), 0)
  const bottomTier = tiers[0]

  return (
    <div className="grid grid-cols-3 gap-3 text-center">
      <div className="bg-indigo-50 rounded-xl p-3">
        <div className="text-2xl font-bold text-indigo-600">{tiers.length}</div>
        <div className="text-xs text-gray-500 mt-0.5">Tiers</div>
      </div>
      <div className="bg-pink-50 rounded-xl p-3">
        <div className="text-2xl font-bold text-pink-600">{totalHeight}"</div>
        <div className="text-xs text-gray-500 mt-0.5">Total Height</div>
      </div>
      <div className="bg-amber-50 rounded-xl p-3">
        <div className="text-2xl font-bold text-amber-600">~{totalServings}</div>
        <div className="text-xs text-gray-500 mt-0.5">Est. Servings</div>
      </div>
      {bottomTier && (
        <div className="col-span-3 bg-green-50 rounded-xl p-3">
          <div className="text-sm font-medium text-green-700">
            Base: {bottomTier.diameter}" {bottomTier.shape} • {bottomTier.height}" tall • {bottomTier.layers}-layer
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Bottom tier (largest)</div>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CakeTierDesigner() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { tiers, selectedId, showDimensions, showDowels, showBoards, scalePx } = state

  const selectedTier = tiers.find(t => t.id === selectedId) ?? tiers[0] ?? null

  const handleSelect = useCallback((id: string) => {
    dispatch({ type: 'SELECT_TIER', id })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden>🎂</span>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">Cake Tier Designer</h1>
              <p className="text-xs text-gray-400">Technical drawings for tiered cakes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-500 flex items-center gap-1.5">
              Scale
              <input
                type="range"
                min={8}
                max={22}
                value={scalePx}
                onChange={e => dispatch({ type: 'SET_SCALE', value: parseInt(e.target.value) })}
                className="w-20 accent-indigo-500"
              />
            </label>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Drawing canvas */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">Technical Drawing</h2>
              <div className="flex gap-4">
                <Toggle label="Dimensions" checked={showDimensions} onChange={() => dispatch({ type: 'TOGGLE_DIMENSIONS' })} />
                <Toggle label="Dowels" checked={showDowels} onChange={() => dispatch({ type: 'TOGGLE_DOWELS' })} />
                <Toggle label="Boards" checked={showBoards} onChange={() => dispatch({ type: 'TOGGLE_BOARDS' })} />
              </div>
            </div>
            <div className="bg-amber-50/40 rounded-xl border border-amber-100 p-2">
              <CakeDrawing
                tiers={tiers}
                selectedId={selectedId ?? tiers[0]?.id ?? null}
                showDimensions={showDimensions}
                showDowels={showDowels}
                showBoards={showBoards}
                scalePx={scalePx}
                onSelect={handleSelect}
              />
            </div>
            {tiers.length > 0 && (
              <p className="text-xs text-gray-400 text-center mt-2">
                Click a tier to select and edit it. Tiers displayed bottom to top.
              </p>
            )}
          </div>

          {/* Stats */}
          {tiers.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Cake Summary</h2>
              <StatsPanel tiers={tiers} />
            </div>
          )}

          {/* Legend */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Legend</h2>
            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-2 rounded bg-amber-600 opacity-70" />
                Cake board
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-4 rounded bg-amber-800 opacity-70" />
                Dowel support
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-3 rounded border border-dashed border-gray-400" />
                Layer line
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-3 rounded border-2 border-indigo-400 bg-indigo-50" />
                Selected tier
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Tier list */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">Tiers</h2>
              <button
                onClick={() => dispatch({ type: 'ADD_TIER' })}
                className="text-xs bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                + Add Tier
              </button>
            </div>
            <div className="space-y-1.5">
              {tiers.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No tiers yet. Add one above.</p>
              )}
              {[...tiers].reverse().map((tier, revIdx) => {
                const realIdx = tiers.length - 1 - revIdx
                return (
                  <div
                    key={tier.id}
                    onClick={() => dispatch({ type: 'SELECT_TIER', id: tier.id })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${
                      (selectedId ?? tiers[0]?.id) === tier.id
                        ? 'bg-indigo-50 border border-indigo-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-sm border border-gray-300" style={{ background: tier.color }} />
                    <span className="flex-1 font-medium text-gray-700">{tier.label}</span>
                    <span className="text-xs text-gray-400">{tier.diameter}" × {tier.height}"</span>
                    <span className="text-xs text-gray-300">
                      {realIdx === 0 ? '(bottom)' : realIdx === tiers.length - 1 ? '(top)' : ''}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selected tier editor */}
          {selectedTier && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Edit: <span className="text-indigo-600">{selectedTier.label}</span>
              </h2>
              <TierEditor
                tier={selectedTier}
                onUpdate={patch => dispatch({ type: 'UPDATE_TIER', id: selectedTier.id, patch })}
                onRemove={() => dispatch({ type: 'REMOVE_TIER', id: selectedTier.id })}
                onMove={dir => dispatch({ type: 'MOVE_TIER', id: selectedTier.id, direction: dir })}
                isFirst={tiers[tiers.length - 1]?.id === selectedTier.id}
                isLast={tiers[0]?.id === selectedTier.id}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
