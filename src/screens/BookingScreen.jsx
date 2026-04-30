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

// Module-level: stable reference, never recreated mid-render
const TODAY_MID = new Date()
TODAY_MID.setHours(0, 0, 0, 0)

function fmtDate(d) {
  return `${D_NAMES[d.getDay()]}, ${M_NAMES[d.getMonth()]} ${d.getDate()}`
}

function getMonthDays(year, month) {
  const firstDow    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

/* ── Card input formatting ────────────────────────────────── */

const formatCardNum = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 16)
  return d.replace(/(.{4})/g, '$1 ').trim()
}

const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  if (d.length >= 3) return d.slice(0, 2) + '/' + d.slice(2)
  return d
}

/* ── Cancellation deadline ────────────────────────────────── */

function getCancelDeadline(apptDate, timeStr) {
  const [time, period] = timeStr.split(' ')
  const [hStr, mStr]   = time.split(':')
  let h = parseInt(hStr, 10)
  const m = parseInt(mStr, 10)
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  const d = new Date(apptDate)
  d.setHours(h, m, 0, 0)
  const dl  = new Date(d.getTime() - 24 * 60 * 60 * 1000)
  const dh  = dl.getHours()
  const dm  = dl.getMinutes()
  const dp  = dh >= 12 ? 'PM' : 'AM'
  const dh12 = dh > 12 ? dh - 12 : dh === 0 ? 12 : dh
  const dmStr = dm > 0 ? `:${String(dm).padStart(2, '0')}` : ''
  return `${D_NAMES[dl.getDay()]}, ${M_NAMES[dl.getMonth()]} ${dl.getDate()} at ${dh12}${dmStr} ${dp}`
}

/* ── Client reliability ───────────────────────────────────── */
// 'reliable' | 'one-cancellation' | 'noshow'
const CLIENT_RELIABILITY = 'reliable'

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

async function buildStoryCard(tech) {
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

  // ─── Vibe tags ───
  const specialties = tech.specialties ?? []
  const tagY = 1160
  const TAG_H = 90, TAG_PAD = 48, TAG_R = 45
  const tags = specialties.slice(0, 3)
  const tagWidths = tags.map(t => {
    c.font = '38px system-ui, sans-serif'
    return c.measureText(t).width + TAG_PAD * 2
  })
  const totalW = tagWidths.reduce((a, b) => a + b, 0) + (tags.length - 1) * 24
  let tx = W / 2 - totalW / 2
  tags.forEach((tag, i) => {
    const tw = tagWidths[i]
    rrect(c, tx, tagY, tw, TAG_H, TAG_R)
    c.fillStyle = 'rgba(245,213,222,0.7)'; c.fill()
    c.fillStyle = '#c4607a'
    c.font = '38px system-ui, sans-serif'
    c.textBaseline = 'middle'
    c.fillText(tag, tx + tw / 2, tagY + TAG_H / 2)
    c.textBaseline = 'alphabetic'
    tx += tw + 24
  })

  // ─── Branding ───
  c.fillStyle = 'rgba(196,96,122,0.44)'
  c.font = '40px sans-serif'
  c.fillText('✦   glazd.app   ✦', W / 2, 1846)

  return cv
}

/* ── Main component ───────────────────────────────────────── */

export default function BookingScreen({ tech, onBack }) {
  const [stage,        setStage]        = useState('form')
  const [services,     setServices]     = useState(new Set())
  const [selectedDate, setSelectedDate] = useState(null)
  const [viewYear,     setViewYear]     = useState(TODAY_MID.getFullYear())
  const [viewMonth,    setViewMonth]    = useState(TODAY_MID.getMonth())
  const [timeVal,      setTimeVal]      = useState(null)
  const [notes,        setNotes]        = useState('')

  // Payment step state
  const [cardName, setCardName] = useState('')
  const [cardNum,  setCardNum]  = useState('')
  const [expiry,   setExpiry]   = useState('')
  const [cvv,      setCvv]      = useState('')

  const canGoPrev = viewYear > TODAY_MID.getFullYear() ||
    (viewYear === TODAY_MID.getFullYear() && viewMonth > TODAY_MID.getMonth())

  const prevMonth = () => {
    if (!canGoPrev) return
    setSelectedDate(null)
    setTimeVal(null)
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    setSelectedDate(null)
    setTimeVal(null)
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const toggleService = (id) => setServices(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const avail        = selectedDate ? AVAIL[(selectedDate.getDate() - 1) % 7] : null
  const selectedSvcs = SERVICES.filter(s => services.has(s.id))
  const totalPrice   = selectedSvcs.reduce((sum, s) => sum + s.price, 0)
  const ready        = services.size > 0 && selectedDate !== null && timeVal !== null
  const dateStr      = selectedDate ? fmtDate(selectedDate) : ''
  const cardReady    = cardName.trim().length > 1
    && cardNum.replace(/\s/g, '').length === 16
    && expiry.length === 5
    && cvv.length >= 3

  const cancelDeadline = selectedDate && timeVal
    ? getCancelDeadline(selectedDate, timeVal)
    : null

  const handleConfirm = () => { if (ready) setStage('payment') }
  const handlePay     = () => { if (cardReady) setStage('confirmed') }
  const svcLabel      = selectedSvcs.length > 0
    ? selectedSvcs.map(s => s.name).join(' + ')
    : ''

  const handleShare = async () => {
    const cv = await buildStoryCard(tech)
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
        svcs={selectedSvcs}
        total={totalPrice}
        date={dateStr}
        time={timeVal}
        cancelDeadline={cancelDeadline}
        onBack={onBack}
        onShare={handleShare}
      />
    )
  }

  if (stage === 'payment') {
    return (
      <PaymentStage
        tech={tech}
        svcs={selectedSvcs}
        total={totalPrice}
        date={dateStr}
        time={timeVal}
        cardName={cardName}  setCardName={setCardName}
        cardNum={cardNum}    setCardNum={setCardNum}
        expiry={expiry}      setExpiry={setExpiry}
        cvv={cvv}            setCvv={setCvv}
        cardReady={cardReady}
        onBack={() => setStage('form')}
        onPay={handlePay}
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
          <p className="bk-section-title">Choose Services</p>
          <div className="bk-service-list">
            {SERVICES.map(svc => {
              const isSel = services.has(svc.id)
              return (
                <button key={svc.id}
                  className={`bk-service-card ${isSel ? 'sel' : ''} ${svc.isAddon ? 'addon' : ''}`}
                  onClick={() => toggleService(svc.id)}>
                  <div className="bk-svc-left">
                    {svc.isAddon && <span className="addon-badge">Add-on</span>}
                    <p className="bk-svc-name">{svc.name}</p>
                    <p className="bk-svc-meta">{svc.duration} · {svc.desc}</p>
                  </div>
                  <div className="bk-svc-right">
                    <span className="bk-svc-price">{svc.isAddon ? '+' : ''}${svc.price}</span>
                    <div className={`bk-checkbox ${isSel ? 'checked' : ''}`}>
                      {isSel && <span className="bk-checkbox-mark">✓</span>}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          {services.size > 1 && (
            <div className="bk-svc-total-row">
              <span className="bk-svc-total-label">{services.size} services selected</span>
              <span className="bk-svc-total-price">${totalPrice} total</span>
            </div>
          )}
        </div>

        {/* Date — monthly calendar */}
        <div className="bk-section">
          <p className="bk-section-title">Pick a Date</p>

          {/* Month nav */}
          <div className="bk-cal-header">
            <button className="bk-cal-arrow" onClick={prevMonth} disabled={!canGoPrev}>‹</button>
            <p className="bk-cal-month">{M_NAMES[viewMonth]} {viewYear}</p>
            <button className="bk-cal-arrow" onClick={nextMonth}>›</button>
          </div>

          {/* Weekday labels */}
          <div className="bk-cal-weekdays">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
              <span key={d} className="bk-cal-wday">{d}</span>
            ))}
          </div>

          {/* Day grid */}
          <div className="bk-cal-grid">
            {getMonthDays(viewYear, viewMonth).map((day, i) => {
              if (!day) return <div key={`e${i}`} />
              const date    = new Date(viewYear, viewMonth, day)
              const isPast  = date <= TODAY_MID
              const isSel   = selectedDate &&
                selectedDate.getFullYear() === viewYear &&
                selectedDate.getMonth()    === viewMonth &&
                selectedDate.getDate()     === day
              return (
                <button
                  key={day}
                  className={`bk-cal-day${isSel ? ' sel' : ''}${isPast ? ' past' : ''}`}
                  onClick={() => { if (!isPast) { setSelectedDate(date); setTimeVal(null) } }}
                  disabled={isPast}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        {/* Time slots */}
        <div className="bk-section">
          <p className="bk-section-title">
            Pick a Time
            {selectedDate === null && <span className="bk-section-hint"> — select a date first</span>}
          </p>
          <div className="bk-time-grid">
            {SLOTS.map((t, i) => {
              const isAvail = avail ? avail[i] : false
              const isSel   = timeVal === t
              return (
                <button key={t}
                  className={`bk-time-slot ${isSel ? 'sel' : ''} ${(!isAvail || selectedDate === null) ? 'unavail' : ''}`}
                  onClick={() => isAvail && selectedDate !== null && setTimeVal(t)}
                  disabled={!isAvail || selectedDate === null}>
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
              {svcLabel} · {dateStr}
            </span>
            <span className="bk-summary-price">${totalPrice}</span>
          </div>
        )}
        <p className="bk-deposit-note">A $25 deposit is required · cancellation policy applies</p>
        <button className="btn-primary" onClick={handleConfirm} disabled={!ready}>
          Confirm Booking
        </button>
      </div>
    </div>
  )
}

/* ── Payment stage ────────────────────────────────────────── */

function PaymentStage({ tech, svcs, total, date, time, cardName, setCardName, cardNum, setCardNum, expiry, setExpiry, cvv, setCvv, cardReady, onBack, onPay }) {
  return (
    <div className="screen booking-screen">

      {/* Header */}
      <div className="bk-header">
        <button className="btn-ghost bk-back" onClick={onBack}><ArrowLeft /></button>
        <div className="bk-tech-pill">
          <div className="bk-tech-avatar"
            style={{ background: `linear-gradient(135deg, ${tech.g[0]}, ${tech.g[1]})` }}>
            <span>{tech.icon}</span>
          </div>
          <div>
            <p className="bk-tech-name">Secure Payment</p>
            <p className="bk-tech-loc">{tech.name}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="bk-body">

        {/* Booking mini-summary */}
        <div className="bk-pay-summary">
          <div className="bk-pay-summary-left">
            {svcs.map(s => (
              <p key={s.id} className="bk-svc-name">{s.name}</p>
            ))}
            <p className="bk-svc-meta">{date} · {time}</p>
          </div>
          <span className="bk-svc-price">${total}</span>
        </div>

        {/* Cancellation Policy */}
        <div className="bk-policy-card">
          <div className="bk-policy-header">
            <ShieldIcon />
            <span className="bk-policy-title">Cancellation Policy</span>
          </div>
          <div className="bk-policy-rules">
            <div className="bk-policy-rule bk-rule-good">
              <span className="bk-rule-icon bk-rule-icon-good">✓</span>
              <div>
                <p className="bk-rule-title">Cancel 24+ hours before</p>
                <p className="bk-rule-desc">Deposit fully refunded</p>
              </div>
            </div>
            <div className="bk-policy-rule bk-rule-warn">
              <span className="bk-rule-icon bk-rule-icon-warn">!</span>
              <div>
                <p className="bk-rule-title">Cancel within 24 hours</p>
                <p className="bk-rule-desc">Deposit kept by your tech</p>
              </div>
            </div>
            <div className="bk-policy-rule bk-rule-danger">
              <span className="bk-rule-icon bk-rule-icon-danger">✕</span>
              <div>
                <p className="bk-rule-title">No-show</p>
                <p className="bk-rule-desc">50% of service total charged automatically</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deposit amount row */}
        <div className="bk-deposit-row">
          <div>
            <p className="bk-deposit-label">Deposit to confirm booking</p>
            <p className="bk-deposit-sub">Remainder paid at appointment</p>
          </div>
          <span className="bk-deposit-amount">$25</span>
        </div>

        {/* Card form */}
        <div className="bk-section">
          <p className="bk-section-title">Payment Details</p>
          <div className="bk-card-form">
            <input
              className="bk-card-input"
              placeholder="Name on card"
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              autoComplete="cc-name"
            />
            <div className="bk-card-num-wrap">
              <input
                className="bk-card-input"
                placeholder="1234  5678  9012  3456"
                value={cardNum}
                onChange={e => setCardNum(formatCardNum(e.target.value))}
                inputMode="numeric"
                autoComplete="cc-number"
                maxLength={19}
              />
              <span className="bk-card-icon"><CardIcon /></span>
            </div>
            <div className="bk-card-row">
              <input
                className="bk-card-input bk-card-half"
                placeholder="MM/YY"
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                inputMode="numeric"
                autoComplete="cc-exp"
                maxLength={5}
              />
              <div className="bk-cvv-wrap">
                <input
                  className="bk-card-input bk-card-half"
                  placeholder="CVV"
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  maxLength={4}
                />
                <span className="bk-cvv-icon"><LockIcon /></span>
              </div>
            </div>
          </div>
          <p className="bk-secure-note">🔒 Secured by Stripe · 256-bit SSL</p>
        </div>

        <div style={{ height: 8 }} />
      </div>

      {/* Footer */}
      <div className="bk-footer">
        <button className="btn-primary" onClick={onPay} disabled={!cardReady}>
          Pay $25 Deposit →
        </button>
      </div>
    </div>
  )
}

/* ── Confirmation screen ──────────────────────────────────── */

function ConfirmScreen({ tech, svcs, total, date, time, cancelDeadline, onBack, onShare }) {
  const svc = svcs?.[0] // for backward compat fields like svc?.name in details card
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
          {svcs.map((s, i) => (
            <div key={s.id} className="bk-details-row">
              <span className="bk-details-label">{i === 0 ? 'Service' : ''}</span>
              <span className="bk-details-value">{s.name}</span>
            </div>
          ))}
          {[
            { label: 'Date',    value: date },
            { label: 'Time',    value: time },
            { label: 'Deposit', value: '$25 paid', accent: false },
            { label: 'Total',   value: `$${total}`, accent: true },
          ].map(({ label, value, accent }) => (
            <div key={label} className="bk-details-row">
              <span className="bk-details-label">{label}</span>
              <span className={`bk-details-value ${accent ? 'accent' : ''}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="bk-confirm-policy">
        <div className="bk-confirm-policy-header">
          <ShieldIcon />
          <span className="bk-confirm-policy-title">Cancellation Policy</span>
        </div>
        {cancelDeadline && (
          <div className="bk-confirm-deadline">
            <span className="bk-deadline-clock">⏰</span>
            <div>
              <p className="bk-deadline-label">Free cancellation until</p>
              <p className="bk-deadline-value">{cancelDeadline}</p>
            </div>
          </div>
        )}
        <div className="bk-confirm-policy-rules">
          <p className="bk-policy-mini bk-pmini-good">✓ 24+ hrs before — deposit refunded</p>
          <p className="bk-policy-mini bk-pmini-warn">! Within 24 hrs — deposit kept by tech</p>
          <p className="bk-policy-mini bk-pmini-danger">✕ No-show — 50% of service charged</p>
        </div>
      </div>

      {/* Client reliability */}
      <div className="bk-reliability-row">
        <span className="bk-reliability-label">Your reliability score</span>
        <ReliabilityBadge score={CLIENT_RELIABILITY} />
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
          {tech.specialties && (
            <div className="bk-story-vibes">
              {tech.specialties.slice(0, 3).map(s => (
                <span key={s} className="bk-story-vibe-tag">{s}</span>
              ))}
            </div>
          )}
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

/* ── Reliability badge ────────────────────────────────────── */

export function ReliabilityBadge({ score }) {
  const MAP = {
    'reliable':          { label: 'Reliable ✓',     cls: 'rb-reliable' },
    'one-cancellation':  { label: '1 cancellation',  cls: 'rb-warn'     },
    'noshow':            { label: 'No-show history', cls: 'rb-danger'   },
  }
  const cfg = MAP[score] ?? MAP['reliable']
  return <span className={`reliability-badge ${cfg.cls}`}>{cfg.label}</span>
}

/* ── Icons ────────────────────────────────────────────────── */

function ArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function CardIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  )
}
