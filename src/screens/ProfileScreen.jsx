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

const SETTINGS_ITEMS = [
  { id: 'prefs',  icon: '🎨', label: 'Edit Preferences' },
  { id: 'notifs', icon: '🔔', label: 'Notifications'    },
  { id: 'help',   icon: '❓', label: 'Help & Support'   },
]

/* ── Default profile (shown if onboarding skipped) ───────── */

const DEFAULT_PROFILE = {
  name:   'Destiny C.',
  city:   'Los Angeles, CA',
  styles: ['Chrome/Glazed', 'Witchy', 'Minimalist'],
  length: 'Medium',
  budget: '$60 – $100',
}

/* ── Screen ─────────────────────────────────────────────── */

export default function ProfileScreen({ profile }) {
  const user     = profile ?? DEFAULT_PROFILE
  const initials = user.name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const [cancelled, setCancelled] = useState(new Set())
  const [reviewed,  setReviewed]  = useState(new Set())

  const visibleUpcoming = UPCOMING_APPTS.filter(a => !cancelled.has(a.id))

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
          <h2 className="pf-name">{user.name}</h2>
          <p className="pf-location">📍 {user.city}</p>
          <ReliabilityBadge score="reliable" />
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
            {user.styles.map(s => (
              <span key={s} className="pf-tag">{s}</span>
            ))}
            {user.length && <span className="pf-tag pf-tag-meta">{user.length} length</span>}
            {user.budget && <span className="pf-tag pf-tag-meta">{user.budget}</span>}
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
                      onClick={() => setReviewed(prev => new Set([...prev, appt.id]))}
                    >
                      Leave a Review ✦
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Settings ── */}
        <div className="pf-section">
          <p className="pf-section-title">Settings</p>
          <div className="pf-settings">
            {SETTINGS_ITEMS.map(item => (
              <button key={item.id} className="pf-setting-row">
                <span className="pf-setting-icon">{item.icon}</span>
                <span className="pf-setting-label">{item.label}</span>
                <span className="pf-setting-chevron"><ChevronIcon /></span>
              </button>
            ))}
            <div className="pf-settings-divider" />
            <button className="pf-setting-row pf-logout">
              <span className="pf-setting-icon">🚪</span>
              <span className="pf-setting-label">Log Out</span>
            </button>
          </div>
        </div>

        <div className="pf-bottom-pad" />
      </div>
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

function ChevronIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}
