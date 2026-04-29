import { useState } from 'react'

const STYLE_VIBES = [
  { id:'glazed-chrome', name:'Glazed Chrome', icon:'🪞', tags:'chrome · glass · minimal',   g:['#dde0f5','#b8c0ee'], light:false },
  { id:'dark-botanics', name:'Dark Botanics', icon:'🌿', tags:'moody · green · witchy',     g:['#1a2a1a','#2d4a2d'], light:true  },
  { id:'coastal-girl',  name:'Coastal Girl',  icon:'🐚', tags:'sandy · blue · summer',      g:['#c8eef4','#8dd5e8'], light:false },
  { id:'mob-royale',    name:'Mob Royale',    icon:'💄', tags:'red · fierce · luxe',        g:['#4a0f1e','#7a1a30'], light:true  },
  { id:'sakura-bloom',  name:'Sakura Bloom',  icon:'🌸', tags:'pink · floral · spring',     g:['#fce8ee','#f5c0d0'], light:false },
  { id:'night-sky',     name:'Night Sky',     icon:'🌙', tags:'celestial · dark · stars',   g:['#0f0a2a','#1a1040'], light:true  },
]

const BOARDS = [
  {
    id: 'specialties',
    label: 'My Specialties',
    icon: '💅',
    vibes: [STYLE_VIBES[0], STYLE_VIBES[4], STYLE_VIBES[2]],
  },
  {
    id: 'spring',
    label: 'Spring 2026',
    icon: '🌸',
    vibes: [STYLE_VIBES[4], STYLE_VIBES[2], STYLE_VIBES[0]],
  },
  {
    id: 'summer',
    label: 'Summer Inspo',
    icon: '☀️',
    vibes: [STYLE_VIBES[2], STYLE_VIBES[3], STYLE_VIBES[1]],
  },
]

/* Mock matched clients (NT's client list) */
const NT_CLIENTS = [
  { id: 1, name: 'Aria Monroe',   avatar: '💅', g: ['#f9c5d1', '#e8758a'] },
  { id: 6, name: 'Solène Dubois', avatar: '🤍', g: ['#e8e0d8', '#d4c8be'] },
  { id: 3, name: 'Chloe Tan',     avatar: '👑', g: ['#ffd700', '#e8a800'] },
  { id: 2, name: 'Jade Voss',     avatar: '🖤', g: ['#2d1b3d', '#4a2560'] },
  { id: 5, name: 'Raven Ellis',   avatar: '🪞', g: ['#dde0f5', '#b8c0ee'] },
]

/* ── Share Modal ────────────────────────────────────────── */

function ShareModal({ board, onSend, onClose }) {
  const [selected, setSelected] = useState(new Set())
  const [sent,     setSent]     = useState(false)

  const toggle = (id) => setSelected(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const handleSend = () => {
    if (selected.size === 0) return
    setSent(true)
    setTimeout(() => {
      onSend([...selected])
      onClose()
    }, 1300)
  }

  return (
    <div className="nt-mb-share-overlay" onClick={onClose}>
      <div className="nt-mb-share-sheet" onClick={e => e.stopPropagation()}>
        <div className="nt-mb-share-handle" />

        {sent ? (
          <div className="nt-mb-share-success">
            <span className="nt-mb-share-success-icon">🌟</span>
            <p className="nt-mb-share-success-title">Board sent!</p>
            <p className="nt-mb-share-success-sub">Your clients will see it in their chat ✨</p>
          </div>
        ) : (
          <>
            {/* Board preview */}
            <p className="nt-mb-share-title">{board.icon} {board.label}</p>
            <div className="nt-mb-share-preview">
              {board.vibes.slice(0, 3).map(v => (
                <div
                  key={v.id}
                  className="nt-mb-share-preview-tile"
                  style={{ background: `linear-gradient(135deg, ${v.g[0]}, ${v.g[1]})` }}
                >
                  <span>{v.icon}</span>
                </div>
              ))}
            </div>

            <p className="nt-mb-share-sub">Choose clients to share with</p>

            <div className="nt-mb-client-list">
              {NT_CLIENTS.map(client => {
                const isSel = selected.has(client.id)
                return (
                  <button
                    key={client.id}
                    className={`nt-mb-client-row ${isSel ? 'selected' : ''}`}
                    onClick={() => toggle(client.id)}
                  >
                    <div
                      className="nt-mb-client-avatar"
                      style={{ background: `linear-gradient(135deg, ${client.g[0]}, ${client.g[1]})` }}
                    >
                      {client.avatar}
                    </div>
                    <span className="nt-mb-client-name">{client.name}</span>
                    <span className="nt-mb-client-check">{isSel ? '✓' : ''}</span>
                  </button>
                )
              })}
            </div>

            <button
              className="nt-mb-share-send-btn"
              onClick={handleSend}
              disabled={selected.size === 0}
            >
              {selected.size > 0
                ? `Send to ${selected.size} client${selected.size !== 1 ? 's' : ''} ✦`
                : 'Select clients to send'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Screen ─────────────────────────────────────────────── */

export default function NailTechMoodboard({ onShareBoard }) {
  const [activeBoard, setActiveBoard] = useState('specialties')
  const [selected,    setSelected]    = useState(new Set())
  const [shareBoard,  setShareBoard]  = useState(null)  // board being shared

  const currentBoard = BOARDS.find(b => b.id === activeBoard)

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else              next.add(id)
      return next
    })
  }

  const handleSend = (clientIds) => {
    if (!shareBoard) return
    onShareBoard?.(shareBoard.label, shareBoard.vibes, clientIds)
  }

  return (
    <div className="nt-sub-screen nt-moodboard-screen">

      {/* Header */}
      <div className="nt-mb-header">
        <h2 className="nt-mb-title">Style Boards</h2>
        <p className="nt-mb-sub">curate & share your aesthetic</p>
      </div>

      {/* Board cards */}
      <div className="nt-mb-boards-cards">
        {BOARDS.map(b => (
          <div
            key={b.id}
            className={`nt-mb-board-card ${activeBoard === b.id ? 'active' : ''}`}
            onClick={() => setActiveBoard(b.id)}
          >
            <div className="nt-mb-board-card-left">
              <span className="nt-mb-board-card-icon">{b.icon}</span>
              <span className="nt-mb-board-card-label">{b.label}</span>
            </div>
            <button
              className="nt-mb-board-share-btn"
              onClick={e => { e.stopPropagation(); setShareBoard(b) }}
            >
              Share ↗
            </button>
          </div>
        ))}
        <div className="nt-mb-board-card nt-mb-board-new-card" onClick={() => {}}>
          <div className="nt-mb-board-card-left">
            <span className="nt-mb-board-card-icon">＋</span>
            <span className="nt-mb-board-card-label">New Board</span>
          </div>
        </div>
      </div>

      {/* Style grid */}
      <div className="nt-mb-grid-wrap">
        <div className="nt-mb-grid">
          {STYLE_VIBES.map(vibe => {
            const isSel = selected.has(vibe.id)
            return (
              <button
                key={vibe.id}
                className={`nt-mb-vibe-card ${isSel ? 'selected' : ''}`}
                style={{ background: `linear-gradient(145deg, ${vibe.g[0]}, ${vibe.g[1]})` }}
                onClick={() => toggle(vibe.id)}
              >
                <div className="nt-mb-check">✓</div>
                <span className="nt-mb-vibe-icon">{vibe.icon}</span>
                <p className="nt-mb-vibe-name"
                  style={{ color: vibe.light ? 'rgba(255,255,255,0.95)' : 'rgba(61,37,53,0.9)' }}>
                  {vibe.name}
                </p>
                <p className="nt-mb-vibe-tags"
                  style={{ color: vibe.light ? 'rgba(255,255,255,0.62)' : 'rgba(61,37,53,0.55)' }}>
                  {vibe.tags}
                </p>
              </button>
            )
          })}
          <button className="nt-mb-add-card">
            <span className="nt-mb-add-plus">＋</span>
            <span className="nt-mb-add-label">Add Style</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="nt-mb-footer">
        {selected.size > 0 && (
          <p className="nt-mb-count">
            <strong>{selected.size}</strong> style{selected.size !== 1 ? 's' : ''} selected
          </p>
        )}
        <button
          className="btn-primary"
          onClick={() => setShareBoard(currentBoard)}
          disabled={selected.size === 0}
        >
          Share Current Board ✦
        </button>
      </div>

      {/* Share modal */}
      {shareBoard && (
        <ShareModal
          board={shareBoard}
          onSend={handleSend}
          onClose={() => setShareBoard(null)}
        />
      )}
    </div>
  )
}
