import { useState, useRef } from 'react'
import { ALL_MATCHES } from './MatchesScreen'

/* ── Boards ─────────────────────────────────────────────── */

const INITIAL_BOARDS = [
  { id: 1, name: 'My Next Set',   icon: '💅' },
  { id: 2, name: 'Fall Inspo',    icon: '🍂' },
  { id: 3, name: 'Wedding Nails', icon: '🤍' },
  { id: 4, name: 'Summer Glazed', icon: '☀️' },
]

/* ── Base vibe cards ─────────────────────────────────────── */

const BASE_VIBES = [
  {
    id: 'dark-celestial',
    name: 'Dark Celestial',
    icon: '🌙',
    tags: 'moody · gothic · celestial',
    g: ['#2d1b3d', '#1a0f2e'],
    light: true,
  },
  {
    id: 'glazed-donut',
    name: 'Glazed Donut',
    icon: '🍩',
    tags: 'glazed · chrome · soft',
    g: ['#fce8ee', '#f5d5de'],
    light: false,
  },
  {
    id: 'strawberry-girl',
    name: 'Strawberry Girl',
    icon: '🍓',
    tags: 'pink · sweet · summer',
    g: ['#ffb3c6', '#ff6b9d'],
    light: false,
  },
  {
    id: 'butterfly-effect',
    name: 'Butterfly Effect',
    icon: '🦋',
    tags: 'iridescent · dreamy · sheer',
    g: ['#d0f0fc', '#b8d8f8'],
    light: false,
  },
  {
    id: 'botanical',
    name: 'Botanical',
    icon: '🌿',
    tags: 'earthy · green · natural',
    g: ['#2d4a2d', '#3a6040'],
    light: true,
  },
  {
    id: 'mob-wife',
    name: 'Mob Wife',
    icon: '💄',
    tags: 'fierce · red · leopard',
    g: ['#4a0f1e', '#7a1a30'],
    light: true,
  },
]

/* ── Add Vibe color options ──────────────────────────────── */

const VIBE_COLORS = [
  ['#2d1b3d', '#1a0f2e'],
  ['#fce8ee', '#f5d5de'],
  ['#ffb3c6', '#ff6b9d'],
  ['#d0f0fc', '#b8d8f8'],
  ['#2d4a2d', '#3a6040'],
  ['#4a0f1e', '#7a1a30'],
  ['#fdf0e0', '#f5d5b8'],
  ['#e0d5f5', '#c4b0e8'],
  ['#d5f0e0', '#b0e8c4'],
  ['#f5e8d5', '#e8d5b0'],
  ['#dde0f5', '#b8c0ee'],
  ['#fce8d5', '#f5c6a0'],
]

const VIBE_EMOJIS = ['✨','💅','🌙','🍓','🦋','🌿','💄','🌸','🎨','🪞','💎','🤍','⭐','🌷','🔮','🫧']

/* ── Initial board data ──────────────────────────────────── */

function initBoardData() {
  return {
    1: { selected: new Set(['glazed-donut', 'butterfly-effect', 'strawberry-girl']), photos: {}, customVibes: [] },
    2: { selected: new Set(['dark-celestial', 'botanical', 'mob-wife']),             photos: {}, customVibes: [] },
    3: { selected: new Set(['glazed-donut', 'strawberry-girl']),                     photos: {}, customVibes: [] },
    4: { selected: new Set(['strawberry-girl', 'butterfly-effect']),                 photos: {}, customVibes: [] },
  }
}

/* ── Canvas helpers ─────────────────────────────────────── */

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

async function buildMoodboardCard(selectedVibes) {
  await document.fonts.ready

  const W = 1080, H = 1920
  const cv = document.createElement('canvas')
  cv.width = W; cv.height = H
  const c = cv.getContext('2d')
  c.textAlign = 'center'

  c.fillStyle = '#fdf8f5'
  c.fillRect(0, 0, W, H)

  const o1 = c.createRadialGradient(W * 0.88, H * 0.07, 0, W * 0.88, H * 0.07, 520)
  o1.addColorStop(0, 'rgba(245,213,222,0.88)'); o1.addColorStop(1, 'rgba(253,240,243,0)')
  c.fillStyle = o1; c.fillRect(0, 0, W, H)

  const o2 = c.createRadialGradient(W * 0.14, H * 0.92, 0, W * 0.14, H * 0.92, 400)
  o2.addColorStop(0, 'rgba(196,96,122,0.14)'); o2.addColorStop(1, 'rgba(253,240,243,0)')
  c.fillStyle = o2; c.fillRect(0, 0, W, H)

  c.fillStyle = '#c4607a'
  c.font = 'italic bold 152px "Playfair Display", Georgia, serif'
  c.fillText('Glazd', W / 2, 260)

  c.strokeStyle = '#d4a96a'; c.lineWidth = 4
  ;[[W * 0.24, W * 0.46], [W * 0.54, W * 0.76]].forEach(([x1, x2]) => {
    c.beginPath(); c.moveTo(x1, 310); c.lineTo(x2, 310); c.stroke()
  })
  c.fillStyle = '#d4a96a'; c.font = '30px sans-serif'
  c.fillText('◆', W / 2, 324)

  c.fillStyle = '#3d2535'
  c.font = 'italic bold 88px "Playfair Display", Georgia, serif'
  c.fillText('My Nail Moodboard', W / 2, 444)

  c.fillStyle = '#9b6b7a'
  c.font = '400 50px system-ui, sans-serif'
  c.fillText("vibes I'm loving right now ✦", W / 2, 516)

  const PAD = 56, GAP = 40
  const tileW = (W - PAD * 2 - GAP) / 2
  const tileH = 468
  const startY = 608

  for (let i = 0; i < 4; i++) {
    const vibe = selectedVibes[i]
    const col = i % 2
    const row = Math.floor(i / 2)
    const tx = PAD + col * (tileW + GAP)
    const ty = startY + row * (tileH + GAP)

    if (vibe) {
      const tg = c.createLinearGradient(tx, ty, tx + tileW, ty + tileH)
      tg.addColorStop(0, vibe.g[0]); tg.addColorStop(1, vibe.g[1])
      rrect(c, tx, ty, tileW, tileH, 52); c.fillStyle = tg; c.fill()

      rrect(c, tx, ty, tileW, tileH, 52)
      c.strokeStyle = 'rgba(255,255,255,0.2)'; c.lineWidth = 3; c.stroke()

      c.font = '130px serif'; c.textBaseline = 'middle'
      c.fillText(vibe.icon, tx + tileW / 2, ty + tileH * 0.42)
      c.textBaseline = 'alphabetic'

      c.fillStyle = vibe.light ? 'rgba(255,255,255,0.96)' : '#3d2535'
      c.font = 'italic bold 54px "Playfair Display", Georgia, serif'
      c.fillText(vibe.name, tx + tileW / 2, ty + tileH * 0.73)

      c.fillStyle = vibe.light ? 'rgba(255,255,255,0.62)' : 'rgba(61,37,53,0.55)'
      c.font = '34px system-ui, sans-serif'
      c.fillText(vibe.tags, tx + tileW / 2, ty + tileH * 0.89)
    } else {
      rrect(c, tx, ty, tileW, tileH, 52)
      c.fillStyle = 'rgba(245,213,222,0.28)'; c.fill()
      rrect(c, tx, ty, tileW, tileH, 52)
      c.strokeStyle = 'rgba(196,96,122,0.22)'; c.lineWidth = 3
      c.setLineDash([14, 9]); c.stroke(); c.setLineDash([])
      c.fillStyle = 'rgba(196,96,122,0.25)'
      c.font = '80px serif'; c.textBaseline = 'middle'
      c.fillText('✦', tx + tileW / 2, ty + tileH / 2)
      c.textBaseline = 'alphabetic'
    }
  }

  c.fillStyle = 'rgba(196,96,122,0.42)'
  c.font = '40px sans-serif'
  c.fillText('✦   glazd.app   ✦', W / 2, 1856)

  return cv
}

/* ── Share modal ────────────────────────────────────────── */

function ShareModal({ vibes, onSend, onClose }) {
  const [picked, setPicked] = useState(new Set())
  const [sent,   setSent]   = useState(false)

  const toggle = (id) => setPicked(prev => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id)
    else              next.add(id)
    return next
  })

  const handleSend = () => {
    onSend(vibes, [...picked])
    setSent(true)
    setTimeout(onClose, 1400)
  }

  return (
    <div className="mb-modal-overlay" onClick={onClose}>
      <div className="mb-modal" onClick={e => e.stopPropagation()}>
        <div className="mb-modal-handle" />
        <h3 className="mb-modal-title">Share moodboard with…</h3>
        <p className="mb-modal-sub">{vibes.length} vibe{vibes.length !== 1 ? 's' : ''} selected</p>

        {sent ? (
          <div className="mb-modal-sent">
            <span className="mb-modal-sent-icon">✨</span>
            <p className="mb-modal-sent-label">Moodboard sent!</p>
          </div>
        ) : (
          <>
            <div className="mb-modal-list">
              {ALL_MATCHES.map(match => (
                <button
                  key={match.id}
                  className={`mb-modal-row ${picked.has(match.id) ? 'picked' : ''}`}
                  onClick={() => toggle(match.id)}
                >
                  <div
                    className="mb-modal-avatar"
                    style={{ background: `linear-gradient(135deg, ${match.g[0]}, ${match.g[1]})` }}
                  >
                    <span>{match.icon}</span>
                  </div>
                  <div className="mb-modal-info">
                    <p className="mb-modal-name">{match.name}</p>
                    <p className="mb-modal-loc">{match.location}</p>
                  </div>
                  <div className={`mb-modal-check ${picked.has(match.id) ? 'on' : ''}`}>
                    {picked.has(match.id) ? '✓' : ''}
                  </div>
                </button>
              ))}
            </div>

            <button
              className="mb-modal-send-btn"
              disabled={picked.size === 0}
              onClick={handleSend}
            >
              Send to {picked.size > 0 ? picked.size : ''} {picked.size === 1 ? 'tech' : picked.size > 1 ? 'techs' : 'techs'} ✨
            </button>
            <button className="mb-modal-cancel" onClick={onClose}>Cancel</button>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Add Vibe Modal ──────────────────────────────────────── */

function AddVibeModal({ onSave, onClose }) {
  const [name,       setName]       = useState('')
  const [emoji,      setEmoji]      = useState('✨')
  const [colorPair,  setColorPair]  = useState(0)
  const [tags,       setTags]       = useState('')

  const handleSave = () => {
    if (!name.trim()) return
    onSave({
      id:    'custom-' + Date.now(),
      name:  name.trim(),
      icon:  emoji,
      tags:  tags.trim() || 'custom',
      g:     VIBE_COLORS[colorPair],
      light: false,
    })
  }

  const preview = VIBE_COLORS[colorPair]

  return (
    <div className="mb-add-vibe-overlay" onClick={onClose}>
      <div className="mb-add-vibe-sheet" onClick={e => e.stopPropagation()}>
        <div className="mb-modal-handle" />
        <h3 className="mb-modal-title">Add a Vibe</h3>

        {/* Preview card */}
        <div
          className="mb-add-preview-card"
          style={{ background: `linear-gradient(145deg, ${preview[0]}, ${preview[1]})` }}
        >
          <span className="mb-add-preview-emoji">{emoji}</span>
          <p className="mb-add-preview-name" style={{ color: 'rgba(61,37,53,0.9)' }}>
            {name || 'Vibe name'}
          </p>
        </div>

        {/* Name */}
        <input
          className="mb-add-input"
          placeholder="Vibe name (e.g. Glazed Chrome)"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />

        {/* Tags */}
        <input
          className="mb-add-input"
          placeholder="Tags (e.g. chrome · glass · minimal)"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />

        {/* Emoji picker */}
        <p className="mb-add-label">Emoji</p>
        <div className="mb-add-emoji-grid">
          {VIBE_EMOJIS.map(e => (
            <button
              key={e}
              className={`mb-add-emoji-btn ${emoji === e ? 'active' : ''}`}
              onClick={() => setEmoji(e)}
            >
              {e}
            </button>
          ))}
        </div>

        {/* Color picker */}
        <p className="mb-add-label">Color</p>
        <div className="mb-add-color-grid">
          {VIBE_COLORS.map((pair, i) => (
            <button
              key={i}
              className={`mb-add-color-swatch ${colorPair === i ? 'active' : ''}`}
              style={{ background: `linear-gradient(135deg, ${pair[0]}, ${pair[1]})` }}
              onClick={() => setColorPair(i)}
            />
          ))}
        </div>

        <button
          className="mb-modal-send-btn"
          onClick={handleSave}
          disabled={!name.trim()}
          style={{ marginTop: 16 }}
        >
          Add Vibe ✨
        </button>
        <button className="mb-modal-cancel" onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}

/* ── Screen ─────────────────────────────────────────────── */

export default function MoodboardScreen({ onShareToTech }) {
  const [boards,       setBoards]       = useState(INITIAL_BOARDS)
  const [activeBoard,  setActiveBoard]  = useState(1)
  const [boardData,    setBoardData]    = useState(initBoardData)
  const [showModal,    setShowModal]    = useState(false)
  const [showAddVibe,  setShowAddVibe]  = useState(false)
  const fileRefs                        = useRef({})

  const bd          = boardData[activeBoard] ?? { selected: new Set(), photos: {}, customVibes: [] }
  const allVibes    = [...BASE_VIBES, ...bd.customVibes]
  const currentSel  = bd.selected
  const currentPics = bd.photos

  /* ── Board helpers ── */
  const updateBd = (fn) =>
    setBoardData(prev => {
      const cur = prev[activeBoard] ?? { selected: new Set(), photos: {}, customVibes: [] }
      return { ...prev, [activeBoard]: fn(cur) }
    })

  const toggleVibe = (id) =>
    updateBd(cur => {
      const next = new Set(cur.selected)
      next.has(id) ? next.delete(id) : next.add(id)
      return { ...cur, selected: next }
    })

  /* ── Photo upload ── */
  const triggerUpload = (vibeId) => {
    const input = fileRefs.current[vibeId]
    if (input) input.click()
  }

  const handlePhotoUpload = (vibeId, e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    const urls = files.map(f => URL.createObjectURL(f))
    updateBd(cur => ({
      ...cur,
      photos: {
        ...cur.photos,
        [vibeId]: [...(cur.photos[vibeId] ?? []), ...urls],
      },
    }))
    e.target.value = ''
  }

  /* ── Add custom vibe ── */
  const handleAddVibe = (vibe) => {
    updateBd(cur => ({
      ...cur,
      customVibes: [...cur.customVibes, vibe],
      selected:    new Set([...cur.selected, vibe.id]),
    }))
    setShowAddVibe(false)
  }

  /* ── Share (story card) ── */
  const handleShare = async () => {
    const vibes = allVibes.filter(v => currentSel.has(v.id))
    const cv    = await buildMoodboardCard(vibes)
    const blob  = await new Promise((r) => cv.toBlob(r, 'image/png'))
    const file  = new File([blob], 'glazd-moodboard.png', { type: 'image/png' })
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'My Glazd Moodboard' }); return }
      catch { /* fall through */ }
    }
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'glazd-moodboard.png'; a.click()
  }

  const selectedVibes = allVibes.filter(v => currentSel.has(v.id))

  return (
    <div className="screen moodboard-screen">

      {/* ── Header ── */}
      <div className="mb-header">
        <h1 className="mb-title">My Moodboard</h1>
        <p className="mb-sub">save your nail inspo</p>
      </div>

      {/* ── Boards row ── */}
      <div className="mb-boards-row">
        {boards.map((b) => (
          <button
            key={b.id}
            className={`mb-board-pill ${activeBoard === b.id ? 'active' : ''}`}
            onClick={() => setActiveBoard(b.id)}
          >
            <span className="mb-board-icon">{b.icon}</span>
            <span>{b.name}</span>
          </button>
        ))}
        <button className="mb-board-pill mb-board-new">
          <span>＋</span>
          <span>New Board</span>
        </button>
      </div>

      {/* ── Vibe grid ── */}
      <div className="mb-grid-wrap">
        <div className="mb-grid">
          {allVibes.map((vibe) => {
            const isSel   = currentSel.has(vibe.id)
            const photos  = currentPics[vibe.id] ?? []
            return (
              <div
                key={vibe.id}
                className={`mb-vibe-card ${isSel ? 'selected' : ''}`}
                style={{ background: `linear-gradient(145deg, ${vibe.g[0]}, ${vibe.g[1]})` }}
                onClick={() => toggleVibe(vibe.id)}
              >
                <div className="mb-vibe-check">✓</div>
                <span className="mb-vibe-icon">{vibe.icon}</span>
                <p className="mb-vibe-name"
                  style={{ color: vibe.light ? 'rgba(255,255,255,0.95)' : 'rgba(61,37,53,0.9)' }}>
                  {vibe.name}
                </p>
                <p className="mb-vibe-tags"
                  style={{ color: vibe.light ? 'rgba(255,255,255,0.62)' : 'rgba(61,37,53,0.55)' }}>
                  {vibe.tags}
                </p>

                {/* Photo thumbnails */}
                {photos.length > 0 && (
                  <div className="mb-vibe-photos" onClick={e => e.stopPropagation()}>
                    {photos.slice(0, 4).map((url, i) => (
                      <img key={i} src={url} className="mb-vibe-photo" alt="" />
                    ))}
                  </div>
                )}

                {/* Upload button */}
                <button
                  className="mb-vibe-upload-btn"
                  onClick={e => { e.stopPropagation(); triggerUpload(vibe.id) }}
                  aria-label="Add photo"
                >＋</button>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  ref={el => { fileRefs.current[vibe.id] = el }}
                  onChange={e => handlePhotoUpload(vibe.id, e)}
                />
              </div>
            )
          })}

          {/* Add vibe card */}
          <button className="mb-add-card" onClick={() => setShowAddVibe(true)}>
            <span className="mb-add-plus">＋</span>
            <span className="mb-add-label">Add Vibe</span>
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="mb-footer">
        {currentSel.size > 0 && (
          <p className="mb-selected-count">
            <strong>{currentSel.size}</strong> vibe{currentSel.size !== 1 ? 's' : ''} selected
          </p>
        )}
        <div className="mb-footer-btns">
          <button
            className="mb-share-tech-btn"
            disabled={currentSel.size === 0}
            onClick={() => currentSel.size > 0 && setShowModal(true)}
          >
            Share with my tech 💅
          </button>
          <button className="btn-primary" onClick={handleShare}>
            Share Story ✦
          </button>
        </div>
      </div>

      {/* ── Share modal ── */}
      {showModal && (
        <ShareModal
          vibes={selectedVibes}
          onSend={(vibes, matchIds) => onShareToTech?.(vibes, matchIds)}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* ── Add Vibe modal ── */}
      {showAddVibe && (
        <AddVibeModal
          onSave={handleAddVibe}
          onClose={() => setShowAddVibe(false)}
        />
      )}
    </div>
  )
}
