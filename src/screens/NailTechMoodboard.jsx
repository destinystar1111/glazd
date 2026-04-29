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
  { id:'specialties', label:'My Specialties', icon:'💅' },
  { id:'spring',      label:'Spring 2026',    icon:'🌸' },
  { id:'summer',      label:'Summer Inspo',   icon:'☀️' },
]

export default function NailTechMoodboard() {
  const [activeBoard, setActiveBoard] = useState('specialties')
  const [selected,    setSelected]    = useState(new Set())
  const [toast,       setToast]       = useState(false)

  const toggle = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else              next.add(id)
      return next
    })
  }

  const handleShare = () => {
    if (selected.size === 0) return
    setToast(true)
    setTimeout(() => setToast(false), 2600)
  }

  return (
    <div className="nt-sub-screen nt-moodboard-screen">

      {/* Header */}
      <div className="nt-mb-header">
        <h2 className="nt-mb-title">Style Boards</h2>
        <p className="nt-mb-sub">curate & share your aesthetic</p>
      </div>

      {/* Board tabs */}
      <div className="nt-mb-boards-row">
        {BOARDS.map(b => (
          <button
            key={b.id}
            className={`nt-mb-board-pill ${activeBoard === b.id ? 'active' : ''}`}
            onClick={() => setActiveBoard(b.id)}
          >
            <span>{b.icon}</span>
            <span>{b.label}</span>
          </button>
        ))}
        <button className="nt-mb-board-pill nt-mb-board-new">
          <span>＋</span>
          <span>New Board</span>
        </button>
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
        {toast && (
          <div className="nt-mb-toast">
            ✨ Moodboard sent to matched clients!
          </div>
        )}
        {selected.size > 0 && !toast && (
          <p className="nt-mb-count">
            <strong>{selected.size}</strong> style{selected.size !== 1 ? 's' : ''} selected
          </p>
        )}
        <button
          className="btn-primary"
          onClick={handleShare}
          disabled={selected.size === 0}
        >
          Share with Clients ✦
        </button>
      </div>
    </div>
  )
}
