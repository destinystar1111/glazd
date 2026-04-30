import { useState, useRef } from 'react'

/* ── Style vibes ────────────────────────────────────────── */

const BASE_STYLE_VIBES = [
  { id:'glazed-chrome', name:'Glazed Chrome', icon:'🪞', tags:'chrome · glass · minimal',   g:['#dde0f5','#b8c0ee'], light:false },
  { id:'dark-botanics', name:'Dark Botanics', icon:'🌿', tags:'moody · green · witchy',     g:['#1a2a1a','#2d4a2d'], light:true  },
  { id:'coastal-girl',  name:'Coastal Girl',  icon:'🐚', tags:'sandy · blue · summer',      g:['#c8eef4','#8dd5e8'], light:false },
  { id:'mob-royale',    name:'Mob Royale',    icon:'💄', tags:'red · fierce · luxe',        g:['#4a0f1e','#7a1a30'], light:true  },
  { id:'sakura-bloom',  name:'Sakura Bloom',  icon:'🌸', tags:'pink · floral · spring',     g:['#fce8ee','#f5c0d0'], light:false },
  { id:'night-sky',     name:'Night Sky',     icon:'🌙', tags:'celestial · dark · stars',   g:['#0f0a2a','#1a1040'], light:true  },
]

const DEFAULT_BOARDS = [
  { id:'specialties', label:'My Specialties', icon:'💅' },
  { id:'spring',      label:'Spring 2026',    icon:'🌸' },
  { id:'summer',      label:'Summer Inspo',   icon:'☀️' },
]

/* Per-board data: { [boardId]: { vibes: Set, photos: { [vibeId]: string[] }, customVibes: [] } } */
function initBoardData() {
  return {
    specialties: { vibes: new Set(['glazed-chrome', 'sakura-bloom', 'coastal-girl']), photos: {}, customVibes: [] },
    spring:      { vibes: new Set(['sakura-bloom', 'coastal-girl', 'glazed-chrome']), photos: {}, customVibes: [] },
    summer:      { vibes: new Set(['coastal-girl', 'mob-royale', 'dark-botanics']),   photos: {}, customVibes: [] },
  }
}

/* ── Add Style color/emoji options ──────────────────────── */

const STYLE_COLORS = [
  ['#dde0f5','#b8c0ee'], ['#1a2a1a','#2d4a2d'], ['#c8eef4','#8dd5e8'],
  ['#4a0f1e','#7a1a30'], ['#fce8ee','#f5c0d0'], ['#0f0a2a','#1a1040'],
  ['#fdf0e0','#f5d5b8'], ['#e0d5f5','#c4b0e8'], ['#f5e8d5','#e8d5b0'],
  ['#d5f0e0','#b0e8c4'], ['#fce8d5','#f5c6a0'], ['#f5f0d5','#f0e8b8'],
]

const STYLE_EMOJIS = ['💅','🌸','🪞','🌙','💎','🌿','💄','✨','🤍','☀️','🖤','🎨','🌷','🫧','⭐','🦋']

/* ── Mock matched clients ───────────────────────────────── */

const NT_CLIENTS = [
  { id:1, name:'Aria Monroe',   avatar:'💅', g:['#f9c5d1','#e8758a'] },
  { id:6, name:'Solène Dubois', avatar:'🤍', g:['#e8e0d8','#d4c8be'] },
  { id:3, name:'Chloe Tan',     avatar:'👑', g:['#ffd700','#e8a800'] },
  { id:2, name:'Jade Voss',     avatar:'🖤', g:['#2d1b3d','#4a2560'] },
  { id:5, name:'Raven Ellis',   avatar:'🪞', g:['#dde0f5','#b8c0ee'] },
]

/* ── Share Modal ────────────────────────────────────────── */

function ShareModal({ board, currentVibes, allVibes, onSend, onClose }) {
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

  const previewVibes = allVibes.filter(v => currentVibes.has(v.id)).slice(0, 3)

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
            <p className="nt-mb-share-title">{board.icon} {board.label}</p>
            {previewVibes.length > 0 ? (
              <div className="nt-mb-share-preview">
                {previewVibes.map(v => (
                  <div
                    key={v.id}
                    className="nt-mb-share-preview-tile"
                    style={{ background:`linear-gradient(135deg,${v.g[0]},${v.g[1]})` }}
                  >
                    <span>{v.icon}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="nt-mb-share-empty-hint">No vibes added yet — add some below ✦</p>
            )}

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
                      style={{ background:`linear-gradient(135deg,${client.g[0]},${client.g[1]})` }}
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

/* ── New Board Modal ────────────────────────────────────── */

const BOARD_ICONS = ['💅', '🌸', '☀️', '🖤', '💎', '🪞', '🌙', '🎨', '💄', '✨', '🤍', '🌿']

function NewBoardModal({ onConfirm, onClose }) {
  const [name, setName]   = useState('')
  const [icon, setIcon]   = useState('💅')

  const handleConfirm = () => {
    if (!name.trim()) return
    onConfirm({ label: name.trim(), icon })
  }

  return (
    <div className="nt-mb-share-overlay" onClick={onClose}>
      <div className="nt-mb-share-sheet" onClick={e => e.stopPropagation()}>
        <div className="nt-mb-share-handle" />
        <p className="nt-mb-share-title">New Board</p>

        <label className="nt-edit-label">Board Name</label>
        <input
          className="nt-edit-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Fall Inspo"
          autoFocus
          onKeyDown={e => e.key === 'Enter' && handleConfirm()}
        />

        <label className="nt-edit-label" style={{ marginTop: 14 }}>Icon</label>
        <div className="nt-mb-icon-grid">
          {BOARD_ICONS.map(ic => (
            <button
              key={ic}
              className={`nt-mb-icon-btn ${icon === ic ? 'active' : ''}`}
              onClick={() => setIcon(ic)}
            >
              {ic}
            </button>
          ))}
        </div>

        <button
          className="nt-mb-share-send-btn"
          style={{ marginTop: 20 }}
          onClick={handleConfirm}
          disabled={!name.trim()}
        >
          Create Board ✦
        </button>
      </div>
    </div>
  )
}

/* ── Add Style Modal ────────────────────────────────────── */

function AddStyleModal({ onSave, onClose }) {
  const [name,      setName]      = useState('')
  const [emoji,     setEmoji]     = useState('✨')
  const [colorIdx,  setColorIdx]  = useState(0)
  const [tags,      setTags]      = useState('')

  const handleSave = () => {
    if (!name.trim()) return
    onSave({
      id:    'custom-' + Date.now(),
      name:  name.trim(),
      icon:  emoji,
      tags:  tags.trim() || 'custom',
      g:     STYLE_COLORS[colorIdx],
      light: false,
    })
  }

  const preview = STYLE_COLORS[colorIdx]

  return (
    <div className="nt-mb-share-overlay" onClick={onClose}>
      <div className="nt-mb-share-sheet" onClick={e => e.stopPropagation()}>
        <div className="nt-mb-share-handle" />
        <p className="nt-mb-share-title">Add a Style</p>

        {/* Preview */}
        <div
          className="nt-mb-add-preview-card"
          style={{ background: `linear-gradient(145deg, ${preview[0]}, ${preview[1]})` }}
        >
          <span className="nt-mb-add-preview-emoji">{emoji}</span>
          <p className="nt-mb-add-preview-name">{name || 'Style name'}</p>
        </div>

        <input
          className="nt-edit-input"
          placeholder="Style name (e.g. Glazed Chrome)"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
          style={{ marginTop: 12 }}
        />
        <input
          className="nt-edit-input"
          placeholder="Tags (e.g. chrome · glass · minimal)"
          value={tags}
          onChange={e => setTags(e.target.value)}
          style={{ marginTop: 8 }}
        />

        <label className="nt-edit-label" style={{ marginTop: 14 }}>Emoji</label>
        <div className="nt-mb-icon-grid">
          {STYLE_EMOJIS.map(e => (
            <button
              key={e}
              className={`nt-mb-icon-btn ${emoji === e ? 'active' : ''}`}
              onClick={() => setEmoji(e)}
            >
              {e}
            </button>
          ))}
        </div>

        <label className="nt-edit-label" style={{ marginTop: 14 }}>Color</label>
        <div className="nt-mb-add-color-grid">
          {STYLE_COLORS.map((pair, i) => (
            <button
              key={i}
              className={`nt-mb-add-color-swatch ${colorIdx === i ? 'active' : ''}`}
              style={{ background: `linear-gradient(135deg, ${pair[0]}, ${pair[1]})` }}
              onClick={() => setColorIdx(i)}
            />
          ))}
        </div>

        <button
          className="nt-mb-share-send-btn"
          style={{ marginTop: 20 }}
          onClick={handleSave}
          disabled={!name.trim()}
        >
          Add Style ✦
        </button>
      </div>
    </div>
  )
}

/* ── Screen ─────────────────────────────────────────────── */

export default function NailTechMoodboard({ onShareBoard }) {
  const [boards,        setBoards]        = useState(DEFAULT_BOARDS)
  const [activeBoard,   setActiveBoard]   = useState('specialties')
  const [boardData,     setBoardData]     = useState(initBoardData)
  const [shareModal,    setShareModal]    = useState(false)
  const [newBoardModal, setNewBoardModal] = useState(false)
  const [addStyleModal, setAddStyleModal] = useState(false)
  const fileRefs                          = useRef({})

  const currentBoard = boards.find(b => b.id === activeBoard) ?? boards[0]
  const bd           = boardData[activeBoard] ?? { vibes: new Set(), photos: {}, customVibes: [] }
  const allVibes     = [...BASE_STYLE_VIBES, ...bd.customVibes]
  const currentVibes = bd.vibes
  const currentPics  = bd.photos

  /* ── Board data helper ── */
  const updateBd = (fn) =>
    setBoardData(prev => {
      const cur = prev[activeBoard] ?? { vibes: new Set(), photos: {}, customVibes: [] }
      return { ...prev, [activeBoard]: fn(cur) }
    })

  const toggleVibe = (vibeId) =>
    updateBd(cur => {
      const next = new Set(cur.vibes)
      next.has(vibeId) ? next.delete(vibeId) : next.add(vibeId)
      return { ...cur, vibes: next }
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

  /* ── Add custom style ── */
  const handleAddStyle = (vibe) => {
    updateBd(cur => ({
      ...cur,
      customVibes: [...cur.customVibes, vibe],
      vibes:       new Set([...cur.vibes, vibe.id]),
    }))
    setAddStyleModal(false)
  }

  /* ── Share board ── */
  const handleSend = (clientIds) => {
    const vibeObjects = allVibes.filter(v => currentVibes.has(v.id))
    onShareBoard?.(currentBoard.label, vibeObjects, clientIds)
  }

  /* ── Create board ── */
  const handleCreateBoard = ({ label, icon }) => {
    const id = `board-${Date.now()}`
    setBoards(prev => [...prev, { id, label, icon }])
    setBoardData(prev => ({ ...prev, [id]: { vibes: new Set(), photos: {}, customVibes: [] } }))
    setActiveBoard(id)
    setNewBoardModal(false)
  }

  return (
    <div className="nt-sub-screen nt-moodboard-screen">

      {/* Header */}
      <div className="nt-mb-header">
        <div className="nt-mb-header-row">
          <div>
            <h2 className="nt-mb-title">Style Boards</h2>
            <p className="nt-mb-sub">curate & share your aesthetic</p>
          </div>
          <button
            className="nt-mb-board-share-btn"
            onClick={() => setShareModal(true)}
          >
            {currentBoard.icon} Share Board ↗
          </button>
        </div>
      </div>

      {/* Board tabs */}
      <div className="nt-mb-boards-row">
        {boards.map(b => (
          <button
            key={b.id}
            className={`nt-mb-board-pill ${activeBoard === b.id ? 'active' : ''}`}
            onClick={() => setActiveBoard(b.id)}
          >
            <span>{b.icon}</span>
            <span>{b.label}</span>
          </button>
        ))}
        <button
          className="nt-mb-board-pill nt-mb-board-new"
          onClick={() => setNewBoardModal(true)}
        >
          <span>＋</span>
          <span>New Board</span>
        </button>
      </div>

      {/* Vibe grid */}
      <div className="nt-mb-grid-wrap">
        <div className="nt-mb-grid">
          {allVibes.map(vibe => {
            const isSel  = currentVibes.has(vibe.id)
            const photos = currentPics[vibe.id] ?? []
            return (
              <div
                key={vibe.id}
                className={`nt-mb-vibe-card ${isSel ? 'selected' : ''}`}
                style={{ background:`linear-gradient(145deg,${vibe.g[0]},${vibe.g[1]})` }}
                onClick={() => toggleVibe(vibe.id)}
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

                {/* Photo thumbnails */}
                {photos.length > 0 && (
                  <div className="nt-mb-vibe-photos" onClick={e => e.stopPropagation()}>
                    {photos.slice(0, 4).map((url, i) => (
                      <img key={i} src={url} className="nt-mb-vibe-photo" alt="" />
                    ))}
                  </div>
                )}

                {/* Upload button */}
                <button
                  className="nt-mb-vibe-upload-btn"
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
          <button className="nt-mb-add-card" onClick={() => setAddStyleModal(true)}>
            <span className="nt-mb-add-plus">＋</span>
            <span className="nt-mb-add-label">Add Style</span>
          </button>
        </div>
      </div>

      {/* Share selected vibes bar */}
      {currentVibes.size > 0 && (
        <div className="nt-mb-vibe-share-bar">
          <span className="nt-mb-vibe-share-count">
            <strong>{currentVibes.size}</strong> vibe{currentVibes.size !== 1 ? 's' : ''} selected
          </span>
          <button className="nt-mb-vibe-share-btn" onClick={() => setShareModal(true)}>
            Share selected vibes ↗
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="nt-mb-footer">
        <p className="nt-mb-count">
          {currentVibes.size === 0 && (
            <span style={{ opacity:0.55 }}>Tap vibes to add them to this board</span>
          )}
        </p>
      </div>

      {/* Share modal */}
      {shareModal && (
        <ShareModal
          board={currentBoard}
          currentVibes={currentVibes}
          allVibes={allVibes}
          onSend={handleSend}
          onClose={() => setShareModal(false)}
        />
      )}

      {/* New board modal */}
      {newBoardModal && (
        <NewBoardModal
          onConfirm={handleCreateBoard}
          onClose={() => setNewBoardModal(false)}
        />
      )}

      {/* Add style modal */}
      {addStyleModal && (
        <AddStyleModal
          onSave={handleAddStyle}
          onClose={() => setAddStyleModal(false)}
        />
      )}
    </div>
  )
}
