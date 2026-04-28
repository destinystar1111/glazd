import { useState } from 'react'

/* ── Services ─────────────────────────────────────────────── */

const SERVICES = [
  {
    id: 'builder-gel',
    name: 'Full Set Builder Gel',
    duration: '2 hrs',
    price: 85,
    desc: 'Soak-off gel for natural strength & length',
  },
  {
    id: 'polygel',
    name: 'Full Set PolyGel',
    duration: '2.5 hrs',
    price: 95,
    desc: 'Lightweight hybrid gel — flexible & durable',
  },
  {
    id: 'fill',
    name: 'Fill',
    duration: '1.5 hrs',
    price: 55,
    desc: 'Maintenance fill for your existing set',
  },
  {
    id: 'character-art',
    name: 'Character Art',
    duration: '+ 1 hr',
    price: 15,
    desc: 'Hand-painted custom nail art designs',
    isAddon: true,
  },
]

/* ── Time slots & availability ────────────────────────────── */

const SLOTS = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM']

// Availability pattern per day index — deterministic per day
const AVAIL = [
  [true,  false, true,  true,  false, true,  true,  false],
  [false, true,  true,  false, true,  true,  false, true ],
  [true,  true,  false, true,  true,  false, true,  true ],
  [false, false, true,  true,  true,  false, false, true ],
  [true,  false, true,  true,  false, true,  true,  false],
  [true,  true,  false, false, true,  true,  true,  false],
  [false, true,  true,  true,  false, false, true,  true ],
]

/* ── Sparkle burst particles ──────────────────────────────── */

const SPARKS = [
  { a: 0,   d: 128 }, { a: 30,  d: 104 }, { a: 60,  d: 144 },
  { a: 90,  d: 116 }, { a: 120, d: 132 }, { a: 150, d: 96  },
  { a: 180, d: 138 }, { a: 210, d: 108 }, { a: 240, d: 122 },
  { a: 270, d: 134 }, { a: 300, d: 112 }, { a: 330, d: 142 },
  { a: 15,  d: 80  }, { a: 75,  d: 76  }, { a: 135, d: 88  },
  { a: 195, d: 82  }, { a: 255, d: 94  }, { a: 315, d: 86  },
  { a: 45,  d: 68  }, { a: 165, d: 72  }, { a: 285, d: 70  },
]

const SPARK_COLORS = ['#c4607a', '#d4a96a', '#9b6b7a', '#f5d5de', '#fdf0f3', '#c4607a', '#d4a96a']
const SPARK_SIZES  = [8, 7, 11, 8, 6, 10, 7, 9, 7, 10, 6, 11, 6, 7, 6, 8, 7, 6, 5, 6, 5]

/* ── Date helpers ─────────────────────────────────────────── */

const D_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const M_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getNext7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return d
  })
}

function fmtDate(d) {
  return `${D_NAMES[d.getDay()]}, ${M_NAMES[d.getMonth()]} ${d.getDate()}`
}

/* ── Canvas story card ────────────────────────────────────── */

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

async function buildStoryCard(tech, svc, dateStr, timeStr) {
  await document.fonts.ready

  const W = 1080, H = 1920
  const cv = document.createElement('canvas')
  cv.width = W; cv.height = H
  const c = cv.getContext('2d')
  c.textAlign = 'center'

  // Background
  c.fillStyle = '#fdf8f5'
  c.fillRect(0, 0, W, H)

  // Orb — top-right
  const o1 = c.createRadialGradient(W * 0.88, H * 0.06, 0, W * 0.88, H * 0.06, 540)
  o1.addColorStop(0, 'rgba(245,213,222,0.88)'); o1.addColorStop(1, 'rgba(253,240,243,0)')
  c.fillStyle = o1; c.fillRect(0, 0, W, H)

  // Orb — bottom-left
  const o2 = c.createRadialGradient(W * 0.14, H * 0.93, 0, W * 0.14, H * 0.93, 420)
  o2.addColorStop(0, 'rgba(196,96,122,0.13)'); o2.addColorStop(1, 'rgba(253,240,243,0)')
  c.fillStyle = o2; c.fillRect(0, 0, W, H)

  // ─── Logo ───
  c.fillStyle = '#c4607a'
  c.font = 'italic bold 152px "Playfair Display", Georgia, serif'
  c.fillText('Glazd', W / 2, 270)

  // Gold divider
  c.strokeStyle = '#d4a96a'; c.lineWidth = 4
  ;[[W * 0.24, W * 0.46], [W * 0.54, W * 0.76]].forEach(([x1, x2]) => {
    c.beginPath(); c.moveTo(x1, 322); c.lineTo(x2, 322); c.stroke()
  })
  c.fillStyle = '#d4a96a'; c.font = '32px sans-serif'
  c.fillText('◆', W / 2, 336)

  // ─── "I just booked with" ───
  c.fillStyle = '#9b6b7a'
  c.font = '400 58px system-ui, sans-serif'
  c.fillText('I just booked with', W / 2, 520)

  // ─── Avatar circle ───
  const cx = W / 2, cy = 800, r = 172
  c.beginPath(); c.arc(cx, cy, r + 20, 0, Math.PI * 2)
  c.fillStyle = 'rgba(255,255,255,0.72)'; c.fill()
  const ag = c.createLinearGradient(cx - r, cy - r, cx + r, cy + r)
  ag.addColorStop(0, tech.g[0]); ag.addColorStop(1, tech.g[1])
  c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2)
  c.fillStyle = ag; c.fill()
  c.font = '148px serif'; c.textBaseline = 'middle'
  c.fillText(tech.icon, cx, cy + 14); c.textBaseline = 'alphabetic'

  // ─── Tech name ───
  c.fillStyle = '#3d2535'
  c.font = 'italic bold 104px "Playfair Display", Georgia, serif'
  c.fillText(tech.name, W / 2, 1070)

  // ─── Details card ───
  const [bx, by, bw, bh] = [88, 1128, W - 176, 468]
  c.fillStyle = 'rgba(255,255,255,0.92)'
  rrect(c, bx, by, bw, bh, 52); c.fill()
  c.strokeStyle = 'rgba(245,213,222,0.9)'; c.lineWidth = 3
  rrect(c, bx, by, bw, bh, 52); c.stroke()

  c.fillStyle = '#c4607a'
  c.font = 'bold 62px system-ui, sans-serif'
  c.fillText(svc.name, W / 2, by + 102)

  c.fillStyle = '#9b6b7a'
  c.font = '500 50px "Playfair Display", Georgia, serif'
  c.fillText(`$${svc.price}`, W / 2, by + 174)

  c.strokeStyle = 'rgba(245,213,222,0.75)'; c.lineWidth = 2
  c.beginPath(); c.moveTo(bx + 88, by + 214); c.lineTo(bx + bw - 88, by + 214); c.stroke()

  c.fillStyle = '#3d2535'
  c.font = 'bold 66px "Playfair Display", Georgia, serif'
  c.fillText(dateStr, W / 2, by + 318)

  c.fillStyle = '#c4607a'
  c.font = 'bold 56px system-ui, sans-serif'
  c.fillText(timeStr, W / 2, by + 400)

  // ─── Branding ───
  c.fillStyle = 'rgba(196,96,122,0.44)'
  c.font = '40px sans-serif'
  c.fillText('✦   glazd.app   ✦', W / 2, 1846)

  return cv
}

/* ── Main component ───────────────────────────────────────── */

export default function BookingScreen({ tech, onBack }) {
  const days = getNext7Days()

  const [stage,   setStage]   = useState('form')
  const [service, setService] = useState(null)
  const [dayIdx,  setDayIdx]  = useState(null)
  const [timeVal, setTimeVal] = useState(null)
  const [notes,   setNotes]   = useState('')

  const ready = service !== null && dayIdx !== null && timeVal !== null
  const avail = dayIdx !== null ? AVAIL[dayIdx] : null
  const selectedSvc = SERVICES.find(s => s.id === service)

  const handleConfirm = () => { if (ready) setStage('confirmed') }

  const handleShare = async () => {
    const cv = await buildStoryCard(tech, selectedSvc, fmtDate(days[dayIdx]), timeVal)
    const blob = await new Promise(r => cv.toBlob(r, 'image/png'))
    const file = new File([blob], 'glazd-booking.png', { type: 'image/png' })
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'My Glazd Booking' }); return }
      catch { /* fall through */ }
    }
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'glazd-booking.png'; a.click()
  }

  if (stage === 'confirmed') {
    return (
      <ConfirmScreen
        tech={tech}
        svc={selectedSvc}
        date={fmtDate(days[dayIdx])}
        time={timeVal}
        onBack={onBack}
        onShare={handleShare}
      />
    )
  }

  return (
    <div className="screen booking-screen">

      {/* ── Header ── */}
      <div className="bk-header">
        <button className="btn-ghost bk-back" onClick={onBack}><ArrowLeft /></button>
        <div className="bk-tech-pill">
          <div className="bk-tech-avatar"
            style={{ background: `linear-gradient(135deg, ${tech.g[0]}, ${tech.g[1]})` }}>
            <span>{tech.icon}</span>
          </div>
          <div>
            <p className="bk-tech-name">{tech.name}</p>
            <p className="bk-tech-loc">{tech.location}</p>
          </div>
        </div>
      </div>

      {/* ── Scrollable form body ── */}
      <div className="bk-body">

        {/* Services */}
        <div className="bk-section">
          <p className="bk-section-title">Choose a Service</p>
          <div className="bk-service-list">
            {SERVICES.map(svc => (
              <button key={svc.id}
                className={`bk-service-card ${service === svc.id ? 'sel' : ''} ${svc.isAddon ? 'addon' : ''}`}
                onClick={() => setService(svc.id)}>
                <div className="bk-svc-left">
                  {svc.isAddon && <span className="addon-badge">Add-on</span>}
                  <p className="bk-svc-name">{svc.name}</p>
                  <p className="bk-svc-meta">{svc.duration} · {svc.desc}</p>
                </div>
                <div className="bk-svc-right">
                  <span className="bk-svc-price">{svc.isAddon ? '+' : ''}${svc.price}</span>
                  <div className="bk-radio"><div className="bk-radio-dot" /></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="bk-section">
          <p className="bk-section-title">Pick a Date</p>
          <div className="bk-date-row">
            {days.map((d, i) => (
              <button key={i}
                className={`bk-date-pill ${dayIdx === i ? 'sel' : ''}`}
                onClick={() => { setDayIdx(i); setTimeVal(null) }}>
                <span className="bk-day-name">{D_NAMES[d.getDay()]}</span>
                <span className="bk-day-num">{d.getDate()}</span>
                <span className="bk-day-month">{M_NAMES[d.getMonth()]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time slots */}
        <div className="bk-section">
          <p className="bk-section-title">
            Pick a Time
            {dayIdx === null && <span className="bk-section-hint"> — select a date first</span>}
          </p>
          <div className="bk-time-grid">
            {SLOTS.map((t, i) => {
              const isAvail = avail ? avail[i] : false
              const isSel   = timeVal === t
              return (
                <button key={t}
                  className={`bk-time-slot ${isSel ? 'sel' : ''} ${(!isAvail || dayIdx === null) ? 'unavail' : ''}`}
                  onClick={() => isAvail && dayIdx !== null && setTimeVal(t)}
                  disabled={!isAvail || dayIdx === null}>
                  <span className="bk-slot-time">{t}</span>
                  {!isAvail && <span className="bk-booked-tag">Booked</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="bk-section">
          <p className="bk-section-title">Anything to share?</p>
          <p className="bk-section-hint bk-hint-standalone">
            Shape, length, inspo — your tech would love to know ✨
          </p>
          <textarea className="bk-notes"
            placeholder="e.g. coffin-shaped chrome nails with a glitter accent finger 💅"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3} />
        </div>

        <div style={{ height: 12 }} />
      </div>

      {/* ── Footer ── */}
      <div className="bk-footer">
        {ready && (
          <div className="bk-summary">
            <span className="bk-summary-text">
              {selectedSvc?.name} · {fmtDate(days[dayIdx])}
            </span>
            <span className="bk-summary-price">${selectedSvc?.price}</span>
          </div>
        )}
        <button className="btn-primary" onClick={handleConfirm} disabled={!ready}>
          Confirm Booking
        </button>
      </div>
    </div>
  )
}

/* ── Confirmation screen ──────────────────────────────────── */

function ConfirmScreen({ tech, svc, date, time, onBack, onShare }) {
  return (
    <div className="screen bk-confirmed">

      {/* Sparkle burst */}
      <div className="bk-burst-wrap">
        <div className="bk-burst">
          {SPARKS.map((s, i) => {
            const rad = s.a * Math.PI / 180
            const sx  = Math.round(Math.cos(rad) * s.d)
            const sy  = Math.round(Math.sin(rad) * s.d)
            return (
              <div key={i} className="bk-spark"
                style={{
                  '--sx': `${sx}px`, '--sy': `${sy}px`,
                  width:  SPARK_SIZES[i % SPARK_SIZES.length],
                  height: SPARK_SIZES[i % SPARK_SIZES.length],
                  background: SPARK_COLORS[i % SPARK_COLORS.length],
                  animationDelay: `${(i * 0.032).toFixed(3)}s`,
                  borderRadius: i % 4 === 0 ? '3px' : '50%',
                  transform: `rotate(${i * 17}deg)`,
                }} />
            )
          })}
        </div>
        <div className="bk-confirm-icon">💅</div>
      </div>

      {/* Floating sparkle glyphs */}
      {['bk-sg-1','bk-sg-2','bk-sg-3','bk-sg-4'].map((cls, i) => (
        <div key={cls} className={`bk-spark-glyph ${cls}`}>{i % 2 === 0 ? '✦' : '✧'}</div>
      ))}

      <h2 className="bk-confirmed-title">Booking Confirmed!</h2>
      <p className="bk-confirmed-sub">You're all set with {tech.name.split(' ')[0]} ✨</p>

      {/* Booking details card */}
      <div className="bk-details-card">
        <div className="bk-details-tech">
          <div className="bk-details-avatar"
            style={{ background: `linear-gradient(135deg, ${tech.g[0]}, ${tech.g[1]})` }}>
            <span style={{ fontSize: '1.5rem' }}>{tech.icon}</span>
          </div>
          <div>
            <p className="bk-details-tech-name">{tech.name}</p>
            <p className="bk-details-tech-loc">{tech.location}</p>
          </div>
        </div>

        <div className="bk-details-divider" />

        <div className="bk-details-rows">
          {[
            { label: 'Service', value: svc?.name },
            { label: 'Date',    value: date },
            { label: 'Time',    value: time },
            { label: 'Total',   value: `$${svc?.price}`, accent: true },
          ].map(({ label, value, accent }) => (
            <div key={label} className="bk-details-row">
              <span className="bk-details-label">{label}</span>
              <span className={`bk-details-value ${accent ? 'accent' : ''}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Story card preview */}
      <div className="bk-story-section">
        <p className="bk-story-label">Your shareable story card</p>
        <div className="bk-story-card">
          <div className="bk-story-orb" />
          <p className="bk-story-logo">Glazd</p>
          <div className="bk-story-divider-row">
            <div className="bk-story-line" /><span className="bk-story-diamond">◆</span><div className="bk-story-line" />
          </div>
          <p className="bk-story-booked">I just booked with</p>
          <div className="bk-story-avatar"
            style={{ background: `linear-gradient(135deg, ${tech.g[0]}, ${tech.g[1]})` }}>
            <span style={{ fontSize: '1.55rem' }}>{tech.icon}</span>
          </div>
          <p className="bk-story-tech-name">{tech.name}</p>
          <p className="bk-story-svc">{svc?.name}</p>
          <p className="bk-story-price">${svc?.price}</p>
          <div className="bk-story-detail-pill">
            <span>{date}</span>
            <span className="bk-story-dot" />
            <span>{time}</span>
          </div>
          <p className="bk-story-brand">✦ glazd.app ✦</p>
        </div>
      </div>

      {/* Actions */}
      <div className="bk-confirmed-actions">
        <button className="btn-primary" onClick={onShare}>Share your Booking ✦</button>
        <button className="bk-back-btn" onClick={onBack}>Back to Discover</button>
      </div>
    </div>
  )
}

function ArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  )
}
