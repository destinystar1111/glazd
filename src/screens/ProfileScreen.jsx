import { useState } from 'react'
import { ReliabilityBadge } from './BookingScreen'

/* ── Mock appointment data ───────────────────────────────── */

const UPCOMING_APPTS = [
  {
    id: 1,
    tech: 'Raven Ellis',
    icon: '🪞',
    g: ['#dde0f5', '#b8c0ee'],
    service: 'Full Set Builder Gel',
    date: 'Fri, May 2',
    time: '2:00 PM',
    price: 85,
    deposit: 25,
  },
]

const PAST_APPTS = [
  {
    id: 1,
    tech: 'Chloe Tan',
    icon: '👑',
    g: ['#ffd700', '#e8a800'],
    service: 'Full Set PolyGel',
    date: 'Mar 15',
    price: 95,
    reviewed: false,
  },
  {
    id: 2,
    tech: 'Aria Monroe',
    icon: '💅',
    g: ['#f9c5d1', '#e8758a'],
    service: 'Fill',
    date: 'Feb 8',
    price: 55,
    reviewed: true,
  },
]

/* ── Vibe options for edit profile ─────────────────────── */

const STYLE_OPTIONS = [
  { id: 'Chrome/Glazed', emoji: '🪞' },
  { id: 'Witchy',        emoji: '🖤' },
  { id: 'Minimalist',    emoji: '✨' },
  { id: 'Soft Girl',     emoji: '🎀' },
  { id: 'Glam',          emoji: '💎' },
  { id: 'Character Art', emoji: '🎨' },
]

const LENGTH_OPTIONS = ['Short', 'Medium', 'Long', 'Extra Long']
const BUDGET_OPTIONS = ['Under $50', '$50 – $100', '$100 – $150', '$150+', 'Flexible']

/* ── Vibe tags for review ───────────────────────────────── */

const REVIEW_TAGS = [
  { id: 'clean',  label: 'So clean ✨' },
  { id: 'exact',  label: 'Exactly what I wanted 💅' },
  { id: 'art',    label: 'Amazing art 🎨' },
  { id: 'pro',    label: 'Very professional 🤍' },
  { id: 'rebook', label: 'Would rebook ⭐' },
]

const STAR_LABELS = ['', 'Disappointing', 'Could be better', 'Good', 'Really great!', 'Absolutely amazing! 🌟']

/* ── Default profile ─────────────────────────────────────── */

const DEFAULT_PROFILE = {
  name:   'Destiny C.',
  city:   'Los Angeles, CA',
  styles: ['Chrome/Glazed', 'Witchy', 'Minimalist'],
  length: 'Medium',
  budget: '$60 – $100',
}

/* ── Review Modal ────────────────────────────────────────── */

function ReviewModal({ appt, onSubmit, onClose }) {
  const [stars,   setStars]   = useState(0)
  const [hovered, setHovered] = useState(0)
  const [tags,    setTags]    = useState([])
  const [text,    setText]    = useState('')
  const [done,    setDone]    = useState(false)

  const toggleTag = (id) =>
    setTags(t => t.includes(id) ? t.filter(x => x !== id) : [...t, id])

  const displayStars = hovered || stars

  const handleSubmit = () => {
    if (!stars) return
    setDone(true)
    setTimeout(() => { onSubmit(appt.id, { stars, tags, text }); onClose() }, 1500)
  }

  return (
    <div className="pf-review-overlay" onClick={onClose}>
      <div className="pf-review-sheet" onClick={e => e.stopPropagation()}>
        <div className="pf-review-handle" />

        {done ? (
          <div className="pf-review-success">
            <span className="pf-review-success-icon">🌟</span>
            <p className="pf-review-success-title">Review submitted!</p>
            <p className="pf-review-success-sub">Thank you for your feedback 💕</p>
          </div>
        ) : (
          <>
            {/* Tech info */}
            <div className="pf-review-tech-row">
              <div
                className="pf-review-tech-avatar"
                style={{ background: `linear-gradient(135deg, ${appt.g[0]}, ${appt.g[1]})` }}
              >
                <span>{appt.icon}</span>
              </div>
              <div>
                <p className="pf-review-tech-name">{appt.tech}</p>
                <p className="pf-review-tech-svc">{appt.service} · {appt.date}</p>
              </div>
            </div>

            {/* Stars */}
            <p className="pf-review-section-label">How was your experience?</p>
            <div
              className="pf-review-stars"
              onMouseLeave={() => setHovered(0)}
            >
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  className={`pf-review-star ${displayStars >= n ? 'active' : ''}`}
                  onClick={() => setStars(n)}
                  onMouseEnter={() => setHovered(n)}
                >★</button>
              ))}
            </div>
            {displayStars > 0 && (
              <p className="pf-review-star-label">{STAR_LABELS[displayStars]}</p>
            )}

            {/* Vibe tags */}
            <p className="pf-review-section-label" style={{ marginTop: 16 }}>What stood out?</p>
            <div className="pf-review-tags">
              {REVIEW_TAGS.map(t => (
                <button
                  key={t.id}
                  className={`pf-review-tag ${tags.includes(t.id) ? 'active' : ''}`}
                  onClick={() => toggleTag(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Text */}
            <textarea
              className="pf-review-textarea"
              placeholder={`Tell ${appt.tech.split(' ')[0]} what you loved...`}
              value={text}
              onChange={e => setText(e.target.value)}
              rows={3}
              maxLength={280}
            />

            <button
              className="pf-review-submit-btn"
              onClick={handleSubmit}
              disabled={!stars}
            >
              Submit Review ✨
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Edit Profile View ───────────────────────────────────── */

function EditProfileView({ user, onSave, onBack }) {
  const [name,   setName]   = useState(user.name)
  const [city,   setCity]   = useState(user.city)
  const [styles, setStyles] = useState(new Set(user.styles ?? []))
  const [length, setLength] = useState(user.length ?? '')
  const [budget, setBudget] = useState(user.budget ?? '')
  const [saved,  setSaved]  = useState(false)

  const toggleStyle = (id) => setStyles(prev => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id)
    else              next.add(id)
    return next
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => {
      onSave({ name, city, styles: [...styles], length, budget })
    }, 700)
  }

  const canSave = name.trim().length > 0 && city.trim().length > 0 && styles.size > 0

  return (
    <div className="pf-edit-view">
      <div className="pf-edit-header">
        <button className="pf-edit-back" onClick={onBack}>← Back</button>
        <h2 className="pf-edit-title">Edit Profile</h2>
        <div style={{ width: 60 }} />
      </div>

      <div className="pf-edit-body">

        {/* Photo placeholder */}
        <div className="pf-edit-photo-row">
          <div className="pf-edit-avatar">
            <span className="pf-edit-initials">
              {name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </span>
          </div>
          <button className="pf-edit-photo-btn">Change Photo</button>
        </div>

        <label className="pf-edit-label">Full Name</label>
        <input
          className="pf-edit-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          autoFocus
        />

        <label className="pf-edit-label">City</label>
        <input
          className="pf-edit-input"
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="City, State"
        />

        <label className="pf-edit-label">Nail Style Preferences</label>
        <div className="pf-edit-style-grid">
          {STYLE_OPTIONS.map(s => (
            <button
              key={s.id}
              className={`pf-edit-style-chip ${styles.has(s.id) ? 'active' : ''}`}
              onClick={() => toggleStyle(s.id)}
            >
              {s.emoji} {s.id}
            </button>
          ))}
        </div>

        <label className="pf-edit-label">Nail Length</label>
        <div className="pf-edit-chips">
          {LENGTH_OPTIONS.map(l => (
            <button
              key={l}
              className={`pf-edit-chip ${length === l ? 'active' : ''}`}
              onClick={() => setLength(l)}
            >
              {l}
            </button>
          ))}
        </div>

        <label className="pf-edit-label">Budget (per appointment)</label>
        <div className="pf-edit-chips">
          {BUDGET_OPTIONS.map(b => (
            <button
              key={b}
              className={`pf-edit-chip ${budget === b ? 'active' : ''}`}
              onClick={() => setBudget(b)}
            >
              {b}
            </button>
          ))}
        </div>

        <button
          className={`pf-edit-save-btn ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={!canSave}
        >
          {saved ? 'Saved ✓' : 'Save Changes'}
        </button>

        <div style={{ height: 32 }} />
      </div>
    </div>
  )
}

/* ── Screen ─────────────────────────────────────────────── */

export default function ProfileScreen({ profile, onSettings, onNotifications }) {
  const [userData,      setUserData]      = useState(profile ?? DEFAULT_PROFILE)
  const [editing,       setEditing]       = useState(false)
  const [cancelled,     setCancelled]     = useState(new Set())
  const [reviewed,      setReviewed]      = useState(new Set())
  const [reviewingAppt, setReviewingAppt] = useState(null)
  const [myReviews,     setMyReviews]     = useState([])

  const initials = userData.name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const visibleUpcoming = UPCOMING_APPTS.filter(a => !cancelled.has(a.id))

  if (editing) {
    return (
      <div className="screen profile-screen">
        <EditProfileView
          user={userData}
          onSave={(updated) => { setUserData(updated); setEditing(false) }}
          onBack={() => setEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className="screen profile-screen">
      <div className="pf-scroll">

        {/* ── Hero ── */}
        <div className="pf-hero">
          <div className="pf-hero-orb" />
          <div className="pf-avatar-wrap">
            <div className="pf-avatar">
              <span className="pf-initials">{initials}</span>
            </div>
            <button className="pf-camera-btn" aria-label="Change photo">
              <CameraIcon />
            </button>
          </div>
          <h2 className="pf-name">{userData.name}</h2>
          <p className="pf-location">📍 {userData.city}</p>
          <ReliabilityBadge score="reliable" />
          <button className="pf-edit-profile-btn" onClick={() => setEditing(true)}>
            ✏️ Edit Profile
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="pf-stats">
          <div className="pf-stat">
            <span className="pf-stat-num">{UPCOMING_APPTS.length + PAST_APPTS.length}</span>
            <span className="pf-stat-label">Bookings</span>
          </div>
          <div className="pf-stat-divider" />
          <div className="pf-stat">
            <span className="pf-stat-num">6</span>
            <span className="pf-stat-label">Matches</span>
          </div>
          <div className="pf-stat-divider" />
          <div className="pf-stat">
            <span className="pf-stat-num">4</span>
            <span className="pf-stat-label">Boards</span>
          </div>
        </div>

        {/* ── My Aesthetic ── */}
        <div className="pf-section">
          <p className="pf-section-title">My Aesthetic</p>
          <div className="pf-tags">
            {userData.styles.map(s => (
              <span key={s} className="pf-tag">{s}</span>
            ))}
            {userData.length && <span className="pf-tag pf-tag-meta">{userData.length} length</span>}
            {userData.budget && <span className="pf-tag pf-tag-meta">{userData.budget}</span>}
          </div>
        </div>

        {/* ── Upcoming Appointments ── */}
        <div className="pf-section">
          <p className="pf-section-title">Upcoming</p>
          {visibleUpcoming.length === 0 ? (
            <p className="pf-empty-msg">No upcoming appointments</p>
          ) : (
            visibleUpcoming.map(appt => (
              <div key={appt.id} className="pf-appt-card pf-appt-upcoming">
                <div className="pf-appt-top">
                  <div
                    className="pf-appt-avatar"
                    style={{ background: `linear-gradient(135deg, ${appt.g[0]}, ${appt.g[1]})` }}
                  >
                    <span>{appt.icon}</span>
                  </div>
                  <div className="pf-appt-info">
                    <p className="pf-appt-tech">{appt.tech}</p>
                    <p className="pf-appt-service">{appt.service}</p>
                    <p className="pf-appt-date">{appt.date} · {appt.time}</p>
                  </div>
                  <span className="pf-appt-price">${appt.price}</span>
                </div>
                <div className="pf-appt-footer">
                  <span className="pf-deposit-pill">$25 deposit paid</span>
                  <button
                    className="pf-cancel-btn"
                    onClick={() => setCancelled(prev => new Set([...prev, appt.id]))}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Past Appointments ── */}
        <div className="pf-section">
          <p className="pf-section-title">Past Appointments</p>
          {PAST_APPTS.map(appt => {
            const isReviewed = appt.reviewed || reviewed.has(appt.id)
            return (
              <div key={appt.id} className="pf-appt-card pf-appt-past">
                <div className="pf-appt-top">
                  <div
                    className="pf-appt-avatar"
                    style={{ background: `linear-gradient(135deg, ${appt.g[0]}, ${appt.g[1]})` }}
                  >
                    <span>{appt.icon}</span>
                  </div>
                  <div className="pf-appt-info">
                    <p className="pf-appt-tech">{appt.tech}</p>
                    <p className="pf-appt-service">{appt.service}</p>
                    <p className="pf-appt-date">{appt.date}</p>
                  </div>
                  <span className="pf-appt-price">${appt.price}</span>
                </div>
                <div className="pf-appt-footer">
                  {isReviewed ? (
                    <span className="pf-reviewed-pill">Reviewed ✓</span>
                  ) : (
                    <button
                      className="pf-review-btn"
                      onClick={() => setReviewingAppt(appt)}
                    >
                      Leave a Review ✦
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── My Reviews ── */}
        {myReviews.length > 0 && (
          <div className="pf-section">
            <p className="pf-section-title">My Reviews</p>
            {myReviews.map(r => (
              <div key={r.id} className="pf-my-review-card">
                <div className="pf-my-review-top">
                  <div
                    className="pf-appt-avatar"
                    style={{ background: `linear-gradient(135deg, ${r.g[0]}, ${r.g[1]})` }}
                  >
                    <span>{r.icon}</span>
                  </div>
                  <div className="pf-my-review-info">
                    <p className="pf-my-review-tech">{r.tech}</p>
                    <p className="pf-my-review-service">{r.service} · {r.date}</p>
                  </div>
                  <div className="pf-my-review-stars">
                    {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
                  </div>
                </div>
                {r.tags.length > 0 && (
                  <div className="pf-my-review-tags">
                    {r.tags.map(tag => {
                      const t = REVIEW_TAGS.find(rt => rt.id === tag)
                      return t ? <span key={tag} className="pf-my-review-tag">{t.label}</span> : null
                    })}
                  </div>
                )}
                {r.text.trim() && <p className="pf-my-review-text">"{r.text.trim()}"</p>}
                <p className="pf-my-review-date">{r.submittedDate}</p>
              </div>
            ))}
          </div>
        )}

        <div className="pf-bottom-pad" />
      </div>

      {/* ── Review modal ── */}
      {reviewingAppt && (
        <ReviewModal
          appt={reviewingAppt}
          onSubmit={(id, review) => {
            setReviewed(prev => new Set([...prev, id]))
            const appt = PAST_APPTS.find(a => a.id === id)
            setMyReviews(prev => [...prev, {
              id: Date.now(),
              tech: appt.tech,
              icon: appt.icon,
              g: appt.g,
              service: appt.service,
              date: appt.date,
              stars: review.stars,
              tags: review.tags,
              text: review.text,
              submittedDate: 'Just now',
            }])
          }}
          onClose={() => setReviewingAppt(null)}
        />
      )}
    </div>
  )
}

/* ── Icons ───────────────────────────────────────────────── */

function CameraIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}
