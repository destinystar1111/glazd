import { useState } from 'react'

/* ── Constants ──────────────────────────────────────────── */

const M_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

const PAY_STATUS = {
  deposit_paid: { label: 'Deposit Paid', cls: 'nt-pay-gold'  },
  balance_due:  { label: 'Balance Due',  cls: 'nt-pay-rose'  },
  fully_paid:   { label: 'Fully Paid ✓',cls: 'nt-pay-green' },
  refunded:     { label: 'Refunded',     cls: 'nt-pay-gray'  },
}

/* ── Mock appointment data keyed by "year-month" ────────── */

const APPTS_BY_MONTH = {
  '2026-3': {  // April 2026
     7: [{ id:1,  client:'Priya S.',   service:'Fill',            time:'10:00 AM', avatar:'💎', payStatus:'fully_paid'   }],
    12: [{ id:2,  client:'Zara K.',    service:'Builder Gel',     time:'11:00 AM', avatar:'🌙', payStatus:'deposit_paid' }],
    14: [{ id:3,  client:'Mia T.',     service:'Fill',            time:'2:00 PM',  avatar:'🌸', payStatus:'fully_paid'   }],
    15: [{ id:4,  client:'Cleo M.',    service:'PolyGel Full',    time:'10:30 AM', avatar:'🦋', payStatus:'fully_paid'   }],
    19: [{ id:5,  client:'Jade R.',    service:'Character Art',   time:'1:00 PM',  avatar:'💜', payStatus:'deposit_paid' }],
    21: [{ id:6,  client:'Nova W.',    service:'Soft Girl Set',   time:'11:00 AM', avatar:'🌷', payStatus:'fully_paid'   }],
    22: [{ id:7,  client:'Aaliyah M.', service:'Chrome Set',      time:'3:00 PM',  avatar:'🎀', payStatus:'fully_paid'   }],
    25: [
      { id:8,  client:'Sofia K.',   service:'Builder Gel',    time:'10:00 AM', avatar:'✨', payStatus:'fully_paid'   },
      { id:9,  client:'Taya R.',    service:'Character Art',  time:'2:30 PM',  avatar:'🌺', payStatus:'deposit_paid' },
    ],
    28: [
      { id:10, client:'Mia T.',    service:'Builder Gel',     time:'10:00 AM', avatar:'🌸', payStatus:'deposit_paid' },
      { id:11, client:'Jade R.',   service:'Character Art',   time:'1:30 PM',  avatar:'💜', payStatus:'balance_due'  },
      { id:12, client:'Sofia K.',  service:'PolyGel Full',    time:'4:00 PM',  avatar:'✨', payStatus:'fully_paid'   },
    ],
    29: [{ id:13, client:'Aaliyah M.', service:'Chrome Full Set', time:'2:00 PM',  avatar:'🎀', payStatus:'deposit_paid' }],
    30: [{ id:14, client:'Nova W.',    service:'Soft Girl Set',   time:'11:00 AM', avatar:'🌷', payStatus:'deposit_paid' }],
  },
  '2026-4': {  // May 2026
     4: [{ id:15, client:'Jade R.',   service:'Fill',          time:'11:00 AM', avatar:'💜', payStatus:'deposit_paid' }],
     8: [{ id:16, client:'Mia T.',    service:'Builder Gel',   time:'10:00 AM', avatar:'🌸', payStatus:'deposit_paid' }],
    15: [{ id:17, client:'Sofia K.',  service:'PolyGel Full',  time:'2:00 PM',  avatar:'✨', payStatus:'deposit_paid' }],
    22: [{ id:18, client:'Aaliyah M.','service':'Chrome Set',  time:'3:00 PM',  avatar:'🎀', payStatus:'deposit_paid' }],
  },
}

const BLOCKED_BY_MONTH = {
  '2026-3': new Set([4, 5, 11, 18, 26]),
  '2026-4': new Set([3, 10, 17]),
}

/* ── Today (stable module-level reference) ──────────────── */

const TODAY = new Date()
TODAY.setHours(0, 0, 0, 0)

/* ── Calendar grid helpers ──────────────────────────────── */

// Returns offset (Mon-based) for the first day of the month
function firstMondayOffset(year, month) {
  const dow = new Date(year, month, 1).getDay() // 0=Sun
  return (dow + 6) % 7
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

/* ── Component ──────────────────────────────────────────── */

export default function NailTechCalendar({ onClientTap }) {
  const [viewYear,    setViewYear]    = useState(2026)
  const [viewMonth,   setViewMonth]   = useState(3)        // April
  const [selectedDay, setSelectedDay] = useState(TODAY.getMonth() === 3 && TODAY.getFullYear() === 2026 ? TODAY.getDate() : 1)
  const [userBlocked, setUserBlocked] = useState({})       // overrides per "year-month"

  /* ── Derived for current view ── */
  const monthKey    = `${viewYear}-${viewMonth}`
  const bookedDays  = APPTS_BY_MONTH[monthKey]  ?? {}
  const baseBlocked = BLOCKED_BY_MONTH[monthKey] ?? new Set()
  const userBlockedSet = userBlocked[monthKey]   ?? new Set()
  // merge: userBlocked additions + base (but respect user deletions stored as negative)
  const blocked = new Set([...baseBlocked, ...userBlockedSet])

  const totalDays   = daysInMonth(viewYear, viewMonth)
  const offset      = firstMondayOffset(viewYear, viewMonth)
  const monthLabel  = `${M_NAMES[viewMonth]} ${viewYear}`

  /* ── Month navigation ── */
  const prevMonth = () => {
    setSelectedDay(null)
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    setSelectedDay(null)
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  /* ── Day helpers ── */
  const isBooked  = (d) => !!bookedDays[d]
  const isBlocked = (d) => blocked.has(d) && !bookedDays[d]
  const isToday   = (d) =>
    TODAY.getFullYear() === viewYear &&
    TODAY.getMonth()    === viewMonth &&
    TODAY.getDate()     === d

  const toggleBlock = (day) => {
    if (isBooked(day)) return
    setUserBlocked(prev => {
      const prevSet = new Set(prev[monthKey] ?? [])
      if (prevSet.has(day)) prevSet.delete(day)
      else prevSet.add(day)
      return { ...prev, [monthKey]: prevSet }
    })
  }

  const dayAppts   = selectedDay ? (bookedDays[selectedDay] ?? []) : []
  const dayBlocked = selectedDay ? isBlocked(selectedDay) : false

  return (
    <div className="nt-sub-screen nt-calendar">

      {/* Month header */}
      <div className="nt-cal-header">
        <button className="nt-cal-arrow" onClick={prevMonth}>‹</button>
        <h2 className="nt-cal-month">{monthLabel}</h2>
        <button className="nt-cal-arrow" onClick={nextMonth}>›</button>
      </div>

      {/* Day-of-week labels (Mon → Sun) */}
      <div className="nt-cal-dow-row">
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <div key={i} className="nt-cal-dow">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="nt-cal-grid">
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`e${i}`} className="nt-cal-cell nt-cal-empty" />
        ))}
        {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => {
          const booked_   = isBooked(day)
          const blocked_  = isBlocked(day)
          const today_    = isToday(day)
          const selected_ = selectedDay === day
          return (
            <button
              key={day}
              className={[
                'nt-cal-cell',
                booked_   ? 'nt-cal-booked'   : '',
                blocked_  ? 'nt-cal-blocked'  : '',
                today_    ? 'nt-cal-today'    : '',
                selected_ ? 'nt-cal-selected' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => setSelectedDay(day)}
            >
              <span className="nt-cal-num">{day}</span>
              {booked_ && <span className="nt-cal-dot" />}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="nt-cal-legend">
        <div className="nt-cal-leg-item"><div className="nt-cal-leg-dot rose" /><span>Booked</span></div>
        <div className="nt-cal-leg-item"><div className="nt-cal-leg-dot gray" /><span>Blocked</span></div>
        <div className="nt-cal-leg-item"><div className="nt-cal-leg-dot gold" /><span>Today</span></div>
      </div>

      {/* Day panel */}
      <div className="nt-cal-day-panel">
        {selectedDay ? (
          <>
            <div className="nt-cal-day-head">
              <h3 className="nt-cal-day-title">
                {M_NAMES[viewMonth]} {selectedDay}
                {isToday(selectedDay) && <span className="nt-cal-today-chip">Today</span>}
              </h3>
              <button
                className={`nt-cal-block-btn ${dayBlocked ? 'active' : ''}`}
                onClick={() => toggleBlock(selectedDay)}
                disabled={isBooked(selectedDay)}
              >
                {dayBlocked ? '🔒 Unblock' : 'Block off'}
              </button>
            </div>

            {dayAppts.length === 0 ? (
              <div className="nt-cal-empty-day">
                <span className="nt-cal-empty-icon">{dayBlocked ? '🔒' : '📅'}</span>
                <p className="nt-cal-empty-txt">{dayBlocked ? 'Day blocked off' : 'No appointments'}</p>
              </div>
            ) : (
              <div className="nt-cal-appt-list">
                {dayAppts.map(appt => {
                  const st = PAY_STATUS[appt.payStatus]
                  return (
                    <div key={appt.id} className="nt-cal-appt-row">
                      <div className="nt-cal-appt-avatar">{appt.avatar}</div>
                      <div className="nt-cal-appt-info">
                        <button
                          className="nt-cal-appt-client nt-cal-client-btn"
                          onClick={() => onClientTap?.(appt.client)}
                        >
                          {appt.client} ›
                        </button>
                        <div className="nt-cal-appt-service">{appt.service}</div>
                      </div>
                      <div className="nt-cal-appt-right">
                        <div className="nt-cal-appt-time">{appt.time}</div>
                        <span className={`nt-pay-pill ${st.cls}`}>{st.label}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          <div className="nt-cal-empty-day">
            <span className="nt-cal-empty-icon">📅</span>
            <p className="nt-cal-empty-txt">Tap a day to see appointments</p>
          </div>
        )}
      </div>
    </div>
  )
}
