import { useState, useRef } from 'react'

/* ---- Mock data ---- */

const NAIL_TECHS = [
  {
    id: 1,
    name: 'Aria Monroe',
    location: 'West Hollywood, CA',
    pfp: '💅',
    rating: 4.9,
    reviews: 128,
    specialties: ['Builder Gel', 'Chrome', 'Minimalist'],
    bio: '"I believe every set should feel like wearable art — designed just for you."',
    price: 85,
    tiles: [
      { g: ['#f9c5d1', '#e8758a'], icon: '💎' },
      { g: ['#e8d5f5', '#c4a8e8'], icon: '🪞' },
      { g: ['#fde8b8', '#f5c870'], icon: '✨' },
      { g: ['#c8eef4', '#8dd5e8'], icon: '🌸' },
    ],
  },
  {
    id: 2,
    name: 'Jade Voss',
    location: 'Brooklyn, NY',
    pfp: '🖤',
    rating: 4.8,
    reviews: 94,
    specialties: ['PolyGel', 'Witchy', 'Character Art'],
    bio: '"Dark, moody, and intricate — my sets turn heads and spark conversations."',
    price: 110,
    tiles: [
      { g: ['#2d1b3d', '#4a2560'], icon: '🖤' },
      { g: ['#1a2a1a', '#2d4a2d'], icon: '🌙' },
      { g: ['#3d1a2a', '#6a2040'], icon: '🕷️' },
      { g: ['#1a1a2d', '#2d2a50'], icon: '⭐' },
    ],
  },
  {
    id: 3,
    name: 'Chloe Tan',
    location: 'Miami, FL',
    pfp: '👑',
    rating: 5.0,
    reviews: 212,
    specialties: ['Glam', 'Rhinestones', 'Acrylics'],
    bio: '"More is more, darling. Let\'s make your nails the main character."',
    price: 130,
    tiles: [
      { g: ['#ffd700', '#e8a800'], icon: '👑' },
      { g: ['#ff85a1', '#ee3a6d'], icon: '💅' },
      { g: ['#c8c8d4', '#a0a0b8'], icon: '✨' },
      { g: ['#ffb347', '#e87820'], icon: '💎' },
    ],
  },
  {
    id: 4,
    name: 'Mei Nakamura',
    location: 'Seattle, WA',
    pfp: '🎀',
    rating: 4.7,
    reviews: 67,
    specialties: ['Soft Girl', 'Press-On', 'Kawaii'],
    bio: '"Cute, pastel, and full of personality — every set tells a story. 🎀"',
    price: 70,
    tiles: [
      { g: ['#ffc8dd', '#ff85a1'], icon: '🎀' },
      { g: ['#bde0fe', '#85c8f8'], icon: '🌷' },
      { g: ['#cdb4db', '#b890d0'], icon: '🍓' },
      { g: ['#ffd7b5', '#f5b880'], icon: '🐰' },
    ],
  },
  {
    id: 5,
    name: 'Raven Ellis',
    location: 'Austin, TX',
    pfp: '🪞',
    rating: 4.9,
    reviews: 158,
    specialties: ['Chrome/Glazed', 'Nail Art', 'Gel X'],
    bio: '"Chrome. Glaze. Reflect. I specialize in making nails look like liquid glass."',
    price: 95,
    tiles: [
      { g: ['#dde0f5', '#b8c0ee'], icon: '🪞' },
      { g: ['#f0e0ff', '#d4b8f5'], icon: '💜' },
      { g: ['#ddf5f5', '#b8e8ee'], icon: '✨' },
      { g: ['#f8f0ff', '#e0d0f8'], icon: '🌟' },
    ],
  },
  {
    id: 6,
    name: 'Solène Dubois',
    location: 'Chicago, IL',
    pfp: '🤍',
    rating: 4.6,
    reviews: 43,
    specialties: ['French Tips', 'Gel Polish', 'Quiet Luxury'],
    bio: '"Clean lines. Perfect arcs. A set so quiet it speaks volumes."',
    price: 60,
    tiles: [
      { g: ['#fdf8f5', '#f0e8e0'], icon: '🤍' },
      { g: ['#f0ece8', '#e0d5cc'], icon: '✦' },
      { g: ['#fdf0f3', '#f5d5de'], icon: '🌸' },
      { g: ['#e8f0ec', '#c8ddd5'], icon: '🍃' },
    ],
  },
]

const THRESHOLD = 82

const OPENERS = [
  "Hi! I love your work 💅",
  "Can't wait for my appointment!",
  "I just shared my moodboard with you ✨",
]

export default function DiscoverScreen({ onBook, onViewProfile, onSettings, onNotifications, onChat }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [offset,       setOffset]       = useState({ x: 0, y: 0 })
  const [isDragging,   setIsDragging]   = useState(false)
  const [isExiting,    setIsExiting]    = useState(null)
  const [matchUser,    setMatchUser]    = useState(null)
  const dragStart                       = useRef({ x: 0, y: 0 })

  const remaining = NAIL_TECHS.slice(currentIndex)

  const triggerSwipe = (dir) => {
    if (isExiting) return
    setIsExiting(dir)
    setTimeout(() => {
      if (dir === 'right') setMatchUser(NAIL_TECHS[currentIndex])
      setCurrentIndex((i) => i + 1)
      setOffset({ x: 0, y: 0 })
      setIsExiting(null)
    }, 400)
  }

  const onPointerDown = (e) => {
    if (e.target.closest('button') || isExiting) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!isDragging) return
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    })
  }

  const onPointerUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    if (offset.x > THRESHOLD)       triggerSwipe('right')
    else if (offset.x < -THRESHOLD) triggerSwipe('left')
    else                             setOffset({ x: 0, y: 0 })
  }

  if (remaining.length === 0) return <AllSeen />

  const stack = remaining.slice(0, 3)

  return (
    <div className="screen discover">

      {/* ── Top bar ── */}
      <div className="disc-topbar">
        <span className="disc-wordmark">Glazd</span>
        <div className="disc-topbar-actions">
          <button className="disc-icon-btn" aria-label="Notifications" onClick={onNotifications}>
            <BellIcon />
          </button>
          <button className="disc-icon-btn" aria-label="Settings" onClick={onSettings}>
            <GearIcon />
          </button>
        </div>
      </div>

      {/* ── Card stack ── */}
      <div className="disc-stack">
        {stack.slice().reverse().map((tech, revIdx) => {
          const si    = stack.length - 1 - revIdx
          const isTop = si === 0

          const exitX   = isExiting === 'right' ? 600 : isExiting === 'left' ? -600 : offset.x
          const exitRot = isExiting === 'right' ? 22  : isExiting === 'left' ? -22  : offset.x * 0.035
          const topTY   = (isExiting ? offset.y * 0.4 : offset.y * 0.22)

          const scale   = 1 - si * 0.042
          const behindY = si * 16

          const transform = isTop
            ? `translateX(${exitX}px) translateY(${topTY}px) rotate(${exitRot}deg)`
            : `scale(${scale}) translateY(${behindY}px)`

          const transition = (isTop && isDragging)
            ? 'none'
            : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'

          const matchOp = isTop && !isExiting ? Math.max(0, Math.min(1, (offset.x - 22) / 58)) : 0
          const passOp  = isTop && !isExiting ? Math.max(0, Math.min(1, (-offset.x - 22) / 58)) : 0

          return (
            <div
              key={tech.id}
              className="ntc"
              style={{ transform, transition, zIndex: stack.length - si, touchAction: 'none' }}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? onPointerUp : undefined}
              onPointerCancel={isTop ? onPointerUp : undefined}
            >
              <div className="swipe-stamp stamp-match" style={{ opacity: matchOp }}>MATCH ❤️</div>
              <div className="swipe-stamp stamp-pass"  style={{ opacity: passOp  }}>PASS ✕</div>
              <NailTechCard tech={tech} onBook={onBook} onViewProfile={onViewProfile} />
            </div>
          )
        })}
      </div>

      {/* ── Action buttons — only pass and heart ── */}
      <div className="disc-actions disc-actions-two">
        <button
          className="disc-act disc-act-lg pass-act"
          onClick={() => triggerSwipe('left')}
          disabled={!!isExiting}
          aria-label="Pass"
        >✕</button>
        <button
          className="disc-act disc-act-lg heart-act"
          onClick={() => triggerSwipe('right')}
          disabled={!!isExiting}
          aria-label="Match"
        >❤️</button>
      </div>

      {/* ── Match overlay ── */}
      {matchUser && (
        <MatchOverlay tech={matchUser} onClose={() => setMatchUser(null)} onChat={onChat} />
      )}
    </div>
  )
}

/* ── Card content ── */

function NailTechCard({ tech, onBook, onViewProfile }) {
  return (
    <div className="ntc-inner">
      <div className="ntc-grid">
        {tech.tiles.map((tile, i) => (
          <div
            key={i}
            className="ntc-tile"
            style={{ background: `linear-gradient(135deg, ${tile.g[0]}, ${tile.g[1]})` }}
          >
            <span className="tile-glyph">{tile.icon}</span>
          </div>
        ))}
      </div>

      <div className="ntc-info">
        <div className="ntc-header-row">
          <div>
            <h3 className="ntc-name">{tech.name}</h3>
            <p className="ntc-loc">📍 {tech.location}</p>
          </div>
          <div className="ntc-rating-pill">
            <span className="ntc-star">★</span>
            <span className="ntc-rnum">{tech.rating}</span>
            <span className="ntc-rrev">({tech.reviews})</span>
          </div>
        </div>

        <div className="ntc-tags">
          {tech.specialties.map((t) => (
            <span key={t} className="ntc-tag">{t}</span>
          ))}
        </div>

        <p className="ntc-bio">{tech.bio}</p>

        <div className="ntc-footer-row">
          <div className="ntc-price">
            <span className="ntc-from">from</span>
            <span className="ntc-amount">${tech.price}</span>
          </div>
          <div className="ntc-footer-btns">
            <button
              className="ntc-view-profile-btn"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); onViewProfile?.(tech) }}
            >
              Full profile
            </button>
            <button
              className="book-now-btn"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onBook?.({ name: tech.name, location: tech.location, g: tech.tiles[0].g, icon: tech.pfp, specialties: tech.specialties })
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Match overlay with Say Hello openers ── */

function MatchOverlay({ tech, onClose, onChat }) {
  const [sent,     setSent]     = useState(null)
  const [custom,   setCustom]   = useState('')
  const [showChat, setShowChat] = useState(false)

  const sendOpener = (text) => { setSent(text); setShowChat(true) }
  const sendCustom = () => {
    if (!custom.trim()) return
    setSent(custom.trim()); setShowChat(true)
  }

  const goToChat = () => {
    const matchObj = {
      id:       tech.id,
      name:     tech.name,
      location: tech.location,
      g:        tech.tiles?.[0]?.g ?? ['#f9c5d1', '#e8758a'],
      icon:     tech.pfp,
      isNew:    false,
      lastMsg:  null,
      time:     null,
      unread:   false,
    }
    onChat?.(matchObj)
  }

  return (
    <div className="match-overlay" onClick={onClose}>
      <div className="match-card" onClick={(e) => e.stopPropagation()}>
        <div className="match-sparkles">✦ ✧ ✦</div>
        <div className="match-icon">💅</div>
        <h2 className="match-title">It's a Match!</h2>
        <p className="match-sub">You and <strong>{tech.name}</strong> connected</p>

        {!showChat ? (
          <>
            <p className="match-hello-label">Say hello! 👋</p>
            <div className="match-openers">
              {OPENERS.map(opener => (
                <button key={opener} className="match-opener-btn" onClick={() => sendOpener(opener)}>
                  {opener}
                </button>
              ))}
            </div>
            <div className="match-custom-row">
              <input
                className="match-custom-input"
                placeholder="Write your own message…"
                value={custom}
                onChange={e => setCustom(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendCustom()}
              />
              <button className="match-custom-send" onClick={sendCustom} disabled={!custom.trim()}>›</button>
            </div>
          </>
        ) : (
          <div className="match-sent-wrap">
            <div className="match-sent-bubble">{sent}</div>
            <p className="match-sent-label">Message sent! ✨</p>
            <button className="match-msg-btn" onClick={goToChat}>Go to Chat →</button>
          </div>
        )}

        <button className="match-keep-btn" onClick={onClose}>Keep Swiping</button>
      </div>
    </div>
  )
}

/* ── Empty state ── */

function AllSeen() {
  return (
    <div className="screen disc-empty">
      <div className="disc-empty-icon">💅</div>
      <h2 className="disc-empty-title">You've seen everyone!</h2>
      <p className="disc-empty-sub">Check back soon for new nail techs<br />in your area.</p>
    </div>
  )
}

/* ── Icons ── */

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}
