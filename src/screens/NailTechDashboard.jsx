import { useState } from 'react'

/* ── Constants ─────────────────────────────────────────── */

const PAY_STATUS = {
  deposit_paid: { label: 'Deposit Paid',  cls: 'nt-pay-gold'  },
  balance_due:  { label: 'Balance Due',   cls: 'nt-pay-rose'  },
  fully_paid:   { label: 'Fully Paid ✓', cls: 'nt-pay-green' },
  refunded:     { label: 'Refunded',      cls: 'nt-pay-gray'  },
}

const VIBE_TAG_LABELS = {
  clean:  'So clean ✨',
  exact:  'Exactly what I wanted 💅',
  art:    'Amazing art 🎨',
  pro:    'Very professional 🤍',
  rebook: 'Would rebook ⭐',
}

const VIBE_EMOJI_MAP = {
  glam: '💎', witchy: '🖤', minimal: '✨', softgirl: '🎀',
  character: '🎨', chrome: '🪞', bridal: '🤍', bold: '🌶️',
}

/* ── Mock Data ─────────────────────────────────────────── */

const INITIAL_APPTS = [
  { id:1, client:'Mia T.',   service:'Builder Gel',   time:'10:00 AM', reliability:98, avatar:'🌸', total:65, deposit:20, paymentStatus:'deposit_paid' },
  { id:2, client:'Jade R.',  service:'Character Art', time:'1:30 PM',  reliability:84, avatar:'💜', total:95, deposit:25, paymentStatus:'balance_due'  },
  { id:3, client:'Sofia K.', service:'PolyGel Full',  time:'4:00 PM',  reliability:92, avatar:'✨', total:75, deposit:20, paymentStatus:'fully_paid'   },
]

const INITIAL_REQUESTS = [
  { id:1, client:'Aaliyah M.', service:'Chrome Full Set',   date:'Tomorrow, 2:00 PM', avatar:'🎀', price:85 },
  { id:2, client:'Nova W.',    service:'Soft Girl Full Set', date:'Fri, 11:00 AM',     avatar:'🌷', price:70 },
]

const ALL_CLIENTS = [
  { id:1, name:'Mia T.',      avatar:'🌸', lastService:'Builder Gel',   lastDate:'Apr 28', totalSpent:195, reliability:98  },
  { id:2, name:'Jade R.',     avatar:'💜', lastService:'Character Art', lastDate:'Apr 22', totalSpent:285, reliability:84  },
  { id:3, name:'Sofia K.',    avatar:'✨', lastService:'PolyGel Full',  lastDate:'Apr 15', totalSpent:150, reliability:92  },
  { id:4, name:'Aaliyah M.',  avatar:'🎀', lastService:'Chrome Set',    lastDate:'Apr 10', totalSpent:340, reliability:96  },
  { id:5, name:'Nova W.',     avatar:'🌷', lastService:'Soft Girl Set', lastDate:'Mar 28', totalSpent:210, reliability:88  },
  { id:6, name:'Priya S.',    avatar:'💎', lastService:'Fill',          lastDate:'Mar 20', totalSpent:90,  reliability:100 },
  { id:7, name:'Zara K.',     avatar:'🌙', lastService:'Builder Gel',   lastDate:'Mar 14', totalSpent:195, reliability:76  },
  { id:8, name:'Cleo M.',     avatar:'🦋', lastService:'PolyGel Full',  lastDate:'Mar 08', totalSpent:225, reliability:90  },
  { id:9, name:'Taya R.',     avatar:'🌺', lastService:'Character Art', lastDate:'Feb 28', totalSpent:380, reliability:94  },
]

const ALL_REVIEWS = [
  { id:1, client:'Mia T.',     avatar:'🌸', stars:5, date:'Apr 28', tags:['clean','exact','rebook'], text:'Absolutely obsessed with my new set! She got exactly what I wanted from my inspo photos.' },
  { id:2, client:'Jade R.',    avatar:'💜', stars:5, date:'Apr 22', tags:['art','pro'],               text:'The character art was UNREAL. Felt so seen and valued the whole time 🖤' },
  { id:3, client:'Sofia K.',   avatar:'✨', stars:4, date:'Apr 15', tags:['clean','rebook'],          text:'Love the PolyGel set. Clean, fast, professional. Definitely coming back!' },
  { id:4, client:'Aaliyah M.', avatar:'🎀', stars:5, date:'Apr 10', tags:['exact','rebook','clean'],  text:'Literally my fave nail tech in the city. Attention to detail is everything 🤍' },
  { id:5, client:'Nova W.',    avatar:'🌷', stars:5, date:'Mar 28', tags:['pro','art'],               text:'' },
  { id:6, client:'Priya S.',   avatar:'💎', stars:5, date:'Mar 20', tags:['clean','rebook'],          text:'So professional and gentle. My nails have never looked this good!' },
  { id:7, client:'Cleo M.',    avatar:'🦋', stars:4, date:'Mar 08', tags:['exact'],                   text:'Beautiful work, really listened to what I wanted.' },
]

const STAR_BREAKDOWN = { 5:38, 4:7, 3:2, 2:0, 1:0 }

const MONTHLY_APPTS = [
  { id:1,  client:'Mia T.',     avatar:'🌸', service:'Builder Gel',   date:'Apr 28', amount:65, paymentStatus:'deposit_paid' },
  { id:2,  client:'Jade R.',    avatar:'💜', service:'Character Art', date:'Apr 28', amount:95, paymentStatus:'balance_due'  },
  { id:3,  client:'Sofia K.',   avatar:'✨', service:'PolyGel Full',  date:'Apr 28', amount:75, paymentStatus:'fully_paid'   },
  { id:4,  client:'Aaliyah M.', avatar:'🎀', service:'Chrome Set',    date:'Apr 25', amount:85, paymentStatus:'fully_paid'   },
  { id:5,  client:'Nova W.',    avatar:'🌷', service:'Soft Girl Set', date:'Apr 23', amount:70, paymentStatus:'fully_paid'   },
  { id:6,  client:'Priya S.',   avatar:'💎', service:'Fill',          date:'Apr 21', amount:45, paymentStatus:'fully_paid'   },
  { id:7,  client:'Zara K.',    avatar:'🌙', service:'Builder Gel',   date:'Apr 19', amount:65, paymentStatus:'fully_paid'   },
  { id:8,  client:'Mia T.',     avatar:'🌸', service:'Fill',          date:'Apr 17', amount:45, paymentStatus:'fully_paid'   },
  { id:9,  client:'Jade R.',    avatar:'💜', service:'PolyGel Full',  date:'Apr 15', amount:75, paymentStatus:'fully_paid'   },
  { id:10, client:'Aaliyah M.', avatar:'🎀', service:'Builder Gel',   date:'Apr 13', amount:65, paymentStatus:'fully_paid'   },
  { id:11, client:'Nova W.',    avatar:'🌷', service:'Character Art', date:'Apr 11', amount:95, paymentStatus:'fully_paid'   },
  { id:12, client:'Sofia K.',   avatar:'✨', service:'Fill',          date:'Apr 08', amount:45, paymentStatus:'fully_paid'   },
]

/* ── Main Dashboard ────────────────────────────────────── */

export default function NailTechDashboard({ profile, avgRating }) {
  const [appts,      setAppts]      = useState(INITIAL_APPTS)
  const [requests,   setRequests]   = useState(INITIAL_REQUESTS)
  const [accepted,   setAccepted]   = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [modal,      setModal]      = useState(null)       // { type, apptId }
  const [statsPanel, setStatsPanel] = useState(null)       // 'clients' | 'reviews' | 'monthly'
  const [activeTab,  setActiveTab]  = useState('dashboard')

  const [refundType,   setRefundType]   = useState('deposit')
  const [refundAmt,    setRefundAmt]    = useState('')
  const [refundReason, setRefundReason] = useState('')

  const handleAccept  = (id) => {
    setAccepted(a => [...a, requests.find(r => r.id === id)])
    setRequests(r => r.filter(x => x.id !== id))
  }
  const handleDecline = (id) => setRequests(r => r.filter(x => x.id !== id))
  const toggleExpand  = (id) => setExpandedId(v => v === id ? null : id)

  const setApptPayment = (id, status) =>
    setAppts(a => a.map(x => x.id === id ? { ...x, paymentStatus: status } : x))

  const openModal = (type, apptId) => {
    setRefundType('deposit'); setRefundAmt(''); setRefundReason('')
    setModal({ type, apptId })
  }
  const closeModal = () => setModal(null)

  const handleChargeConfirm = () => { setApptPayment(modal.apptId, 'fully_paid'); closeModal(); setExpandedId(null) }
  const handleRefundConfirm = () => { setApptPayment(modal.apptId, 'refunded');   closeModal(); setExpandedId(null) }
  const handleMarkComplete  = (id) => { setApptPayment(id, 'fully_paid'); setExpandedId(null) }

  const modalAppt     = modal ? appts.find(a => a.id === modal.apptId) : null
  const displayRating = avgRating ?? '4.9'
  const name          = profile?.name || 'Beautiful'

  return (
    <div className="screen nt-dash">
      <div className="nt-dash-scroll">

        {/* ── Header ── */}
        <div className="nt-dash-header">
          <div className="nt-dash-header-left">
            <p className="nt-greeting-label">Good morning</p>
            <h1 className="nt-greeting-name">{name} 💅</h1>
          </div>
          <button className="nt-settings-btn">⚙️</button>
        </div>

        {/* ── Clickable Stats Strip ── */}
        <div className="nt-stats-strip">
          <button className="nt-stat nt-stat-btn" onClick={() => setStatsPanel('clients')}>
            <div className="nt-stat-val">47</div>
            <div className="nt-stat-label">Clients</div>
          </button>
          <div className="nt-stat-divider" />
          <button className="nt-stat nt-stat-btn" onClick={() => setStatsPanel('reviews')}>
            <div className="nt-stat-val">{displayRating} ★</div>
            <div className="nt-stat-label">Rating</div>
          </button>
          <div className="nt-stat-divider" />
          <button className="nt-stat nt-stat-btn" onClick={() => setStatsPanel('monthly')}>
            <div className="nt-stat-val">23</div>
            <div className="nt-stat-label">This Month</div>
          </button>
        </div>

        {/* ── Today's Schedule ── */}
        <div className="nt-section">
          <div className="nt-section-head">
            <h2 className="nt-section-title">Today's Schedule</h2>
            <span className="nt-section-badge">{appts.length} appointments</span>
          </div>
          <div className="nt-appt-list">
            {appts.map(appt => (
              <ApptCard
                key={appt.id}
                appt={appt}
                expanded={expandedId === appt.id}
                onToggle={() => toggleExpand(appt.id)}
                onCharge={() => openModal('charge', appt.id)}
                onRefund={() => openModal('refund', appt.id)}
                onComplete={() => handleMarkComplete(appt.id)}
              />
            ))}
          </div>
        </div>

        {/* ── Booking Requests ── */}
        <div className="nt-section">
          <div className="nt-section-head">
            <h2 className="nt-section-title">Booking Requests</h2>
            {requests.length > 0 && (
              <span className="nt-section-badge nt-badge-urgent">{requests.length} pending</span>
            )}
          </div>
          {requests.length === 0 ? (
            <div className="nt-empty-state">
              <span className="nt-empty-icon">🎉</span>
              <p className="nt-empty-text">All caught up!</p>
              {accepted.length > 0 && (
                <p className="nt-empty-sub">You accepted {accepted.length} request{accepted.length > 1 ? 's' : ''} today</p>
              )}
            </div>
          ) : (
            <div className="nt-request-list">
              {requests.map(req => (
                <RequestCard
                  key={req.id} req={req}
                  onAccept={() => handleAccept(req.id)}
                  onDecline={() => handleDecline(req.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Earnings ── */}
        <div className="nt-section">
          <div className="nt-section-head">
            <h2 className="nt-section-title">Earnings</h2>
            <span className="nt-earnings-month">April 2026</span>
          </div>
          <div className="nt-earnings-card">
            <div className="nt-earnings-main">
              <div className="nt-earnings-amount">$1,840</div>
              <div className="nt-earnings-label">This Month</div>
              <div className="nt-earnings-trend">↑ 12% from last month</div>
            </div>
            <div className="nt-earnings-row">
              <div className="nt-earnings-item">
                <div className="nt-earnings-sub-val">$2,210</div>
                <div className="nt-earnings-sub-label">Last Month</div>
              </div>
              <div className="nt-earnings-item">
                <div className="nt-earnings-sub-val">$78</div>
                <div className="nt-earnings-sub-label">Avg / Appt</div>
              </div>
              <div className="nt-earnings-item">
                <div className="nt-earnings-sub-val">23</div>
                <div className="nt-earnings-sub-label">Appointments</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Profile Preview ── */}
        <div className="nt-section">
          <div className="nt-section-head">
            <h2 className="nt-section-title">My Profile</h2>
            <span className="nt-preview-label">Client view</span>
          </div>
          <ProfilePreview profile={profile} />
        </div>

        <div style={{ height: 16 }} />
      </div>

      {/* ── Bottom Nav ── */}
      <div className="nt-bottom-nav">
        {[
          { key:'dashboard', icon:'🏠', label:'Dashboard' },
          { key:'calendar',  icon:'📅', label:'Calendar'  },
          { key:'clients',   icon:'👥', label:'Clients'   },
          { key:'profile',   icon:'👤', label:'Profile'   },
        ].map(({ key, icon, label }) => (
          <button
            key={key}
            className={`nt-nav-btn ${activeTab === key ? 'nt-nav-active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            <span className="nt-nav-icon">{icon}</span>
            <span className="nt-nav-label">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Stats Panels ── */}
      {statsPanel === 'clients' && (
        <ClientListPanel onClose={() => setStatsPanel(null)} />
      )}
      {statsPanel === 'reviews' && (
        <ReviewsPanel onClose={() => setStatsPanel(null)} avgRating={displayRating} />
      )}
      {statsPanel === 'monthly' && (
        <MonthlyPanel onClose={() => setStatsPanel(null)} />
      )}

      {/* ── Payment Modal ── */}
      {modal && modalAppt && (
        <div className="nt-modal-overlay" onClick={closeModal}>
          <div className="nt-modal-sheet" onClick={e => e.stopPropagation()}>
            {modal.type === 'charge' && (
              <ChargeModal appt={modalAppt} onConfirm={handleChargeConfirm} onCancel={closeModal} />
            )}
            {modal.type === 'refund' && (
              <RefundModal
                appt={modalAppt}
                refundType={refundType}   setRefundType={setRefundType}
                refundAmt={refundAmt}     setRefundAmt={setRefundAmt}
                refundReason={refundReason} setRefundReason={setRefundReason}
                onConfirm={handleRefundConfirm} onCancel={closeModal}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Appointment Card ──────────────────────────────────── */

function ApptCard({ appt, expanded, onToggle, onCharge, onRefund, onComplete }) {
  const relClass = appt.reliability >= 90 ? 'nt-rel-high' : appt.reliability >= 75 ? 'nt-rel-mid' : 'nt-rel-low'
  const relLabel = appt.reliability >= 90 ? 'Reliable' : appt.reliability >= 75 ? 'Good' : 'Caution'
  const remaining  = appt.total - appt.deposit
  const status     = PAY_STATUS[appt.paymentStatus]
  const canCharge  = appt.paymentStatus === 'deposit_paid' || appt.paymentStatus === 'balance_due'
  const canComplete = appt.paymentStatus !== 'fully_paid' && appt.paymentStatus !== 'refunded'

  return (
    <div className={`nt-appt-card ${expanded ? 'expanded' : ''}`}>
      <div className="nt-appt-main" onClick={onToggle}>
        <div className="nt-appt-avatar">{appt.avatar}</div>
        <div className="nt-appt-info">
          <div className="nt-appt-client">{appt.client}</div>
          <div className="nt-appt-service">{appt.service}</div>
        </div>
        <div className="nt-appt-right">
          <div className="nt-appt-time">{appt.time}</div>
          <div className={`nt-rel-badge ${relClass}`}>{appt.reliability}% · {relLabel}</div>
        </div>
        <div className="nt-appt-chevron">{expanded ? '▲' : '▼'}</div>
      </div>

      {expanded && (
        <div className="nt-pay-panel">
          <div className="nt-pay-status-row">
            <span className={`nt-pay-pill ${status.cls}`}>{status.label}</span>
            <span className="nt-pay-detail">
              {appt.paymentStatus === 'deposit_paid' && `Deposit $${appt.deposit} · Balance $${remaining} due`}
              {appt.paymentStatus === 'balance_due'  && `Balance $${remaining} due`}
              {appt.paymentStatus === 'fully_paid'   && `$${appt.total} total received`}
              {appt.paymentStatus === 'refunded'     && 'Refund issued'}
            </span>
          </div>
          <div className="nt-pay-actions">
            {canCharge && (
              <button className="nt-pay-charge-btn" onClick={onCharge}>
                💳 Charge ${remaining}
              </button>
            )}
            <button className="nt-pay-refund-btn" onClick={onRefund}>↩ Refund</button>
            {canComplete && (
              <button className="nt-complete-btn" onClick={onComplete}>✓ Complete</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Request Card ──────────────────────────────────────── */

function RequestCard({ req, onAccept, onDecline }) {
  return (
    <div className="nt-request-card">
      <div className="nt-request-top">
        <div className="nt-request-avatar">{req.avatar}</div>
        <div className="nt-request-info">
          <div className="nt-request-client">{req.client}</div>
          <div className="nt-request-service">{req.service}</div>
          <div className="nt-request-date">{req.date} · ${req.price}</div>
        </div>
      </div>
      <div className="nt-request-actions">
        <button className="nt-decline-btn" onClick={onDecline}>Decline</button>
        <button className="nt-accept-btn"  onClick={onAccept}>Accept ✓</button>
      </div>
    </div>
  )
}

/* ── Charge Modal ──────────────────────────────────────── */

function ChargeModal({ appt, onConfirm, onCancel }) {
  const remaining = appt.total - appt.deposit
  return (
    <>
      <div className="nt-modal-handle" />
      <div className="nt-modal-icon">💳</div>
      <h3 className="nt-modal-title">Charge Remaining Balance</h3>
      <p className="nt-modal-sub">{appt.client} · {appt.service}</p>
      <div className="nt-modal-amount">${remaining}<span>.00</span></div>
      <p className="nt-modal-note">Total ${appt.total} · Deposit ${appt.deposit} already paid</p>
      <div className="nt-modal-actions">
        <button className="nt-modal-cancel" onClick={onCancel}>Cancel</button>
        <button className="nt-modal-confirm" onClick={onConfirm}>Charge ${remaining} ✓</button>
      </div>
    </>
  )
}

/* ── Refund Modal ──────────────────────────────────────── */

function RefundModal({ appt, refundType, setRefundType, refundAmt, setRefundAmt, refundReason, setRefundReason, onConfirm, onCancel }) {
  const refundAmount = refundType === 'deposit' ? appt.deposit : (+refundAmt || 0)
  const canSubmit    = refundAmount > 0 && refundReason.trim().length > 0
  return (
    <>
      <div className="nt-modal-handle" />
      <h3 className="nt-modal-title">Issue Refund</h3>
      <p className="nt-modal-sub">{appt.client} · {appt.service}</p>
      <div className="nt-refund-options">
        {[
          { id:'deposit', lbl:'Full deposit', sub:`$${appt.deposit}.00` },
          { id:'custom',  lbl:'Custom amount', sub:null },
        ].map(opt => (
          <div
            key={opt.id}
            className={`nt-refund-opt ${refundType === opt.id ? 'selected' : ''}`}
            onClick={() => setRefundType(opt.id)}
          >
            <div className="nt-refund-radio"><div className="nt-refund-dot" /></div>
            <div style={{ flex:1 }}>
              <div className="nt-refund-opt-label">{opt.lbl}</div>
              {opt.sub && <div className="nt-refund-opt-sub">{opt.sub}</div>}
              {opt.id === 'custom' && refundType === 'custom' && (
                <div className="nt-refund-custom-row">
                  <span className="nt-refund-custom-sym">$</span>
                  <input
                    className="nt-refund-custom-input"
                    type="number" value={refundAmt}
                    onChange={e => setRefundAmt(e.target.value)}
                    placeholder="0" min="1" max={appt.total} autoFocus
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="nt-refund-reason-wrap">
        <label className="nt-refund-reason-label">Reason for refund</label>
        <textarea
          className="nt-refund-reason-input"
          placeholder="e.g. Client cancelled, service issue, scheduling conflict..."
          value={refundReason} onChange={e => setRefundReason(e.target.value)} rows={3}
        />
      </div>
      <div className="nt-modal-actions">
        <button className="nt-modal-cancel" onClick={onCancel}>Cancel</button>
        <button className="nt-modal-confirm nt-modal-refund-btn" onClick={onConfirm} disabled={!canSubmit}>
          Refund {refundAmount > 0 ? `$${refundAmount}` : '—'}
        </button>
      </div>
    </>
  )
}

/* ── Profile Preview ───────────────────────────────────── */

function ProfilePreview({ profile }) {
  const vibes = (profile?.vibes || ['glam', 'softgirl', 'chrome']).slice(0, 4)
  const coverPhotos = profile?.coverPhotos ?? []
  const portfolio   = profile?.portfolio   ?? []
  const cardSlots   = coverPhotos.length > 0
    ? coverPhotos.map(i => portfolio[i]).filter(Boolean)
    : portfolio.filter(Boolean).slice(0, 4)
  const fallback = [
    { bg:'linear-gradient(135deg,#fde0e8,#f5c6d5)', emoji:'💅' },
    { bg:'linear-gradient(135deg,#e8d5f5,#d5b8f0)', emoji:'💎' },
    { bg:'linear-gradient(135deg,#d5eaf5,#b8d8f0)', emoji:'🎨' },
    { bg:'linear-gradient(135deg,#f5ead5,#f0d8b8)', emoji:'🪞' },
  ]
  const thumbs = cardSlots.length > 0 ? [...cardSlots, ...fallback].slice(0, 4) : fallback

  return (
    <div className="nt-profile-preview">
      <div className="nt-preview-header">
        <div className="nt-preview-avatar">💅</div>
        <div className="nt-preview-info">
          <div className="nt-preview-name">{profile?.name || 'Your Name'}</div>
          <div className="nt-preview-biz">{profile?.businessName || 'Your Studio'}</div>
          <div className="nt-preview-loc">📍 {profile?.location || 'Your City'}</div>
        </div>
        <div className="nt-preview-rating">⭐ 4.9</div>
      </div>
      <div className="nt-preview-vibes">
        {vibes.map(v => (
          <span key={v} className="nt-preview-vibe">
            {VIBE_EMOJI_MAP[v] ?? '✨'} {v.charAt(0).toUpperCase() + v.slice(1)}
          </span>
        ))}
      </div>
      <div className="nt-preview-bio">
        "{profile?.bio || 'Every set tells a story. Let me tell yours.'}"
      </div>
      <div className="nt-preview-portfolio">
        {thumbs.map((t, i) => (
          <div key={i} className="nt-preview-thumb" style={{ background: t.bg }}>
            <span className="nt-preview-thumb-emoji">{t.emoji}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Stat Panel: Clients ───────────────────────────────── */

function ClientListPanel({ onClose }) {
  const totalSpent = ALL_CLIENTS.reduce((s, c) => s + c.totalSpent, 0)

  return (
    <div className="nt-stat-panel">
      <div className="nt-panel-header">
        <button className="nt-panel-back" onClick={onClose}>← Back</button>
        <h2 className="nt-panel-title">All Clients</h2>
        <div style={{ width: 56 }} />
      </div>

      <div className="nt-panel-summary-strip">
        <div className="nt-panel-sum-item">
          <div className="nt-panel-sum-val">{ALL_CLIENTS.length}</div>
          <div className="nt-panel-sum-label">Total Clients</div>
        </div>
        <div className="nt-panel-sum-divider" />
        <div className="nt-panel-sum-item">
          <div className="nt-panel-sum-val">${totalSpent.toLocaleString()}</div>
          <div className="nt-panel-sum-label">Lifetime Revenue</div>
        </div>
        <div className="nt-panel-sum-divider" />
        <div className="nt-panel-sum-item">
          <div className="nt-panel-sum-val">91%</div>
          <div className="nt-panel-sum-label">Avg Reliability</div>
        </div>
      </div>

      <div className="nt-panel-scroll">
        {ALL_CLIENTS.map(client => {
          const relClass = client.reliability >= 90 ? 'nt-rel-high' : client.reliability >= 75 ? 'nt-rel-mid' : 'nt-rel-low'
          return (
            <div key={client.id} className="nt-client-row">
              <div className="nt-client-avatar">{client.avatar}</div>
              <div className="nt-client-info">
                <div className="nt-client-name">{client.name}</div>
                <div className="nt-client-last">{client.lastService} · {client.lastDate}</div>
              </div>
              <div className="nt-client-right">
                <div className="nt-client-spent">${client.totalSpent}</div>
                <div className={`nt-rel-badge ${relClass}`}>{client.reliability}%</div>
              </div>
            </div>
          )
        })}
        <div className="nt-panel-footer-note">Showing {ALL_CLIENTS.length} of 47 clients</div>
      </div>
    </div>
  )
}

/* ── Stat Panel: Reviews ───────────────────────────────── */

function ReviewsPanel({ onClose, avgRating }) {
  const totalReviews = Object.values(STAR_BREAKDOWN).reduce((a, b) => a + b, 0)
  const maxCount     = Math.max(...Object.values(STAR_BREAKDOWN))

  return (
    <div className="nt-stat-panel">
      <div className="nt-panel-header">
        <button className="nt-panel-back" onClick={onClose}>← Back</button>
        <h2 className="nt-panel-title">Reviews</h2>
        <div style={{ width: 56 }} />
      </div>

      <div className="nt-panel-scroll">
        {/* Average hero */}
        <div className="nt-reviews-hero">
          <div className="nt-reviews-avg">{avgRating}</div>
          <div className="nt-reviews-stars">
            {[1,2,3,4,5].map(n => (
              <span key={n} className={+avgRating >= n ? 'nt-star-gold' : 'nt-star-dim'}>★</span>
            ))}
          </div>
          <div className="nt-reviews-count">{totalReviews} reviews</div>
        </div>

        {/* Star breakdown bars */}
        <div className="nt-star-breakdown">
          {[5,4,3,2,1].map(n => {
            const count = STAR_BREAKDOWN[n] ?? 0
            const pct   = maxCount > 0 ? (count / maxCount) * 100 : 0
            return (
              <div key={n} className="nt-breakdown-row">
                <span className="nt-breakdown-label">{n}★</span>
                <div className="nt-breakdown-track">
                  <div
                    className="nt-breakdown-fill"
                    style={{ width: `${pct}%`, opacity: count > 0 ? 1 : 0.2 }}
                  />
                </div>
                <span className="nt-breakdown-count">{count}</span>
              </div>
            )
          })}
        </div>

        {/* Review cards */}
        <div className="nt-section-head" style={{ padding:'0 18px', marginTop:18 }}>
          <h3 className="nt-section-title">Written Reviews</h3>
        </div>

        <div className="nt-review-list">
          {ALL_REVIEWS.map(review => (
            <div key={review.id} className="nt-review-card">
              <div className="nt-review-card-head">
                <div className="nt-review-avatar">{review.avatar}</div>
                <div className="nt-review-meta">
                  <div className="nt-review-client">{review.client}</div>
                  <div className="nt-review-date">{review.date}</div>
                </div>
                <div className="nt-review-stars-row">
                  {[1,2,3,4,5].map(n => (
                    <span key={n} className={review.stars >= n ? 'nt-star-gold' : 'nt-star-dim'}>★</span>
                  ))}
                </div>
              </div>
              {review.tags.length > 0 && (
                <div className="nt-review-tags">
                  {review.tags.map(t => (
                    <span key={t} className="nt-review-tag">{VIBE_TAG_LABELS[t]}</span>
                  ))}
                </div>
              )}
              {review.text && (
                <p className="nt-review-text">"{review.text}"</p>
              )}
            </div>
          ))}
        </div>

        <div className="nt-panel-footer-note">Showing {ALL_REVIEWS.length} written reviews</div>
      </div>
    </div>
  )
}

/* ── Stat Panel: Monthly ───────────────────────────────── */

function MonthlyPanel({ onClose }) {
  const totalEarned = MONTHLY_APPTS
    .filter(a => a.paymentStatus === 'fully_paid')
    .reduce((s, a) => s + a.amount, 0)
  const pendingAmt = MONTHLY_APPTS
    .filter(a => a.paymentStatus !== 'fully_paid' && a.paymentStatus !== 'refunded')
    .reduce((s, a) => s + a.amount, 0)

  return (
    <div className="nt-stat-panel">
      <div className="nt-panel-header">
        <button className="nt-panel-back" onClick={onClose}>← Back</button>
        <h2 className="nt-panel-title">April 2026</h2>
        <div style={{ width: 56 }} />
      </div>

      <div className="nt-panel-summary-strip">
        <div className="nt-panel-sum-item">
          <div className="nt-panel-sum-val">23</div>
          <div className="nt-panel-sum-label">Appointments</div>
        </div>
        <div className="nt-panel-sum-divider" />
        <div className="nt-panel-sum-item">
          <div className="nt-panel-sum-val">${totalEarned}</div>
          <div className="nt-panel-sum-label">Collected</div>
        </div>
        <div className="nt-panel-sum-divider" />
        <div className="nt-panel-sum-item">
          <div className="nt-panel-sum-val">${pendingAmt}</div>
          <div className="nt-panel-sum-label">Pending</div>
        </div>
      </div>

      <div className="nt-panel-scroll">
        <div className="nt-month-list">
          {MONTHLY_APPTS.map(appt => {
            const status = PAY_STATUS[appt.paymentStatus]
            return (
              <div key={appt.id} className="nt-month-row">
                <div className="nt-month-avatar">{appt.avatar}</div>
                <div className="nt-month-info">
                  <div className="nt-month-client">{appt.client}</div>
                  <div className="nt-month-service">{appt.service} · {appt.date}</div>
                </div>
                <div className="nt-month-right">
                  <div className="nt-month-amount">${appt.amount}</div>
                  <span className={`nt-pay-pill ${status.cls}`} style={{ fontSize:'0.62rem' }}>
                    {status.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <div className="nt-panel-footer-note">Showing {MONTHLY_APPTS.length} of 23 appointments</div>
      </div>
    </div>
  )
}
