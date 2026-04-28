import { useState } from 'react'

/* ── Boards ─────────────────────────────────────────────── */

const BOARDS = [
  { id: 1, name: 'My Next Set',   icon: '💅' },
  { id: 2, name: 'Fall Inspo',    icon: '🍂' },
  { id: 3, name: 'Wedding Nails', icon: '🤍' },
  { id: 4, name: 'Summer Glazed', icon: '☀️' },
]

/* ── Vibe cards ─────────────────────────────────────────── */

const VIBES = [
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

  // Background
  c.fillStyle = '#fdf8f5'
  c.fillRect(0, 0, W, H)

  // Orb — top right
  const o1 = c.createRadialGradient(W * 0.88, H * 0.07, 0, W * 0.88, H * 0.07, 520)
  o1.addColorStop(0, 'rgba(245,213,222,0.88)'); o1.addColorStop(1, 'rgba(253,240,243,0)')
  c.fillStyle = o1; c.fillRect(0, 0, W, H)

  // Orb — bottom left
  const o2 = c.createRadialGradient(W * 0.14, H * 0.92, 0, W * 0.14, H * 0.92, 400)
  o2.addColorStop(0, 'rgba(196,96,122,0.14)'); o2.addColorStop(1, 'rgba(253,240,243,0)')
  c.fillStyle = o2; c.fillRect(0, 0, W, H)

  // ─── Logo ───
  c.fillStyle = '#c4607a'
  c.font = 'italic bold 152px "Playfair Display", Georgia, serif'
  c.fillText('Glazd', W / 2, 260)

  // Gold divider
  c.strokeStyle = '#d4a96a'; c.lineWidth = 4
  ;[[W * 0.24, W * 0.46], [W * 0.54, W * 0.76]].forEach(([x1, x2]) => {
    c.beginPath(); c.moveTo(x1, 310); c.lineTo(x2, 310); c.stroke()
  })
  c.fillStyle = '#d4a96a'; c.font = '30px sans-serif'
  c.fillText('◆', W / 2, 324)

  // ─── Heading ───
  c.fillStyle = '#3d2535'
  c.font = 'italic bold 88px "Playfair Display", Georgia, serif'
  c.fillText('My Nail Moodboard', W / 2, 444)

  c.fillStyle = '#9b6b7a'
  c.font = '400 50px system-ui, sans-serif'
  c.fillText("vibes I'm loving right now ✦", W / 2, 516)

  // ─── Vibe grid — 2 × 2, always 4 slots ───
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
      // Gradient fill
      const tg = c.createLinearGradient(tx, ty, tx + tileW, ty + tileH)
      tg.addColorStop(0, vibe.g[0]); tg.addColorStop(1, vibe.g[1])
      rrect(c, tx, ty, tileW, tileH, 52); c.fillStyle = tg; c.fill()

      // Inner shine stroke
      rrect(c, tx, ty, tileW, tileH, 52)
      c.strokeStyle = 'rgba(255,255,255,0.2)'; c.lineWidth = 3; c.stroke()

      // Icon
      c.font = '130px serif'; c.textBaseline = 'middle'
      c.fillText(vibe.icon, tx + tileW / 2, ty + tileH * 0.42)
      c.textBaseline = 'alphabetic'

      // Name
      c.fillStyle = vibe.light ? 'rgba(255,255,255,0.96)' : '#3d2535'
      c.font = 'italic bold 54px "Playfair Display", Georgia, serif'
      c.fillText(vibe.name, tx + tileW / 2, ty + tileH * 0.73)

      // Tags
      c.fillStyle = vibe.light ? 'rgba(255,255,255,0.62)' : 'rgba(61,37,53,0.55)'
      c.font = '34px system-ui, sans-serif'
      c.fillText(vibe.tags, tx + tileW / 2, ty + tileH * 0.89)
    } else {
      // Empty placeholder
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

  // ─── Branding ───
  c.fillStyle = 'rgba(196,96,122,0.42)'
  c.font = '40px sans-serif'
  c.fillText('✦   glazd.app   ✦', W / 2, 1856)

  return cv
}

/* ── Screen ─────────────────────────────────────────────── */

export default function MoodboardScreen() {
  const [activeBoard, setActiveBoard] = useState(1)
  const [selected, setSelected]       = useState(new Set())

  const toggleVibe = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else              next.add(id)
      return next
    })
  }

  const handleShare = async () => {
    const vibes = VIBES.filter((v) => selected.has(v.id))
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

  return (
    <div className="screen moodboard-screen">

      {/* ── Header ── */}
      <div className="mb-header">
        <h1 className="mb-title">My Moodboard</h1>
        <p className="mb-sub">save your nail inspo</p>
      </div>

      {/* ── Boards row ── */}
      <div className="mb-boards-row">
        {BOARDS.map((b) => (
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
          {VIBES.map((vibe) => {
            const isSel = selected.has(vibe.id)
            return (
              <button
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
              </button>
            )
          })}

          {/* Add vibe card */}
          <button className="mb-add-card">
            <span className="mb-add-plus">＋</span>
            <span className="mb-add-label">Add Vibe</span>
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="mb-footer">
        {selected.size > 0 && (
          <p className="mb-selected-count">
            <strong>{selected.size}</strong> vibe{selected.size !== 1 ? 's' : ''} selected
          </p>
        )}
        <button className="btn-primary" onClick={handleShare}>
          Share Moodboard ✦
        </button>
      </div>
    </div>
  )
}
