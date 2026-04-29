import { useState } from 'react'

/* ── April 2026 starts on Wednesday (Mon=0, so offset=2) ── */

const MONTH_NAME     = 'April 2026'
const DAYS_IN_MONTH  = 30
const FIRST_OFFSET   = 2   // Wed

const PAY_STATUS = {
  deposit_paid: { label: 'Deposit Paid', cls: 'nt-pay-gold'  },
  balance_due:  { label: 'Balance Due',  cls: 'nt-pay-rose'  },
  fully_paid:   { label: 'Fully Paid ✓',cls: 'nt-pay-green' },
  refunded:     { label: 'Refunded',     cls: 'nt-pay-gray'  },
}

const BOOKED_DAYS = {
  7:  [{ id:1,  client:'Priya S.',   service:'Fill',           time:'10:00 AM', avatar:'💎', payStatus:'fully_paid'   }],
  12: [{ id:2,  client:'Zara K.',    service:'Builder Gel',    time:'11:00 AM', avatar:'🌙', payStatus:'deposit_paid' }],
  14: [{ id:3,  client:'Mia T.',     service:'Fill',           time:'2:00 PM',  avatar:'🌸', payStatus:'fully_paid'   }],
  15: [{ id:4,  client:'Cleo M.',    service:'PolyGel Full',   time:'10:30 AM', avatar:'🦋', payStatus:'fully_paid'   }],
  19: [{ id:5,  client:'Jade R.',    service:'Character Art',  time:'1:00 PM',  avatar:'💜', payStatus:'deposit_paid' }],
  21: [{ id:6,  client:'Nova W.',    service:'Soft Girl Set',  time:'11:00 AM', avatar:'🌷', payStatus:'fully_paid'   }],
  22: [{ id:7,  client:'Aaliyah M.', service:'Chrome Set',     time:'3:00 PM',  avatar:'🎀', payStatus:'fully_paid'   }],
  25: [
    { id:8,  client:'Sofia K.',   service:'Builder Gel',    time:'10:00 AM', avatar:'✨', payStatus:'fully_paid'   },
    { id:9,  client:'Taya R.',    service:'Character Art',  time:'2:30 PM',  avatar:'🌺', payStatus:'deposit_paid' },
  ],
  28: [
    { id:10, client:'Mia T.',     service:'Builder Gel',    time:'10:00 AM', avatar:'🌸', payStatus:'deposit_paid' },
    { id:11, client:'Jade R.',    service:'Character Art',  time:'1:30 PM',  avatar:'💜', payStatus:'balance_due'  },
    { id:12, client:'Sofia K.',   service:'PolyGel Full',   time:'4:00 PM',  avatar:'✨', payStatus:'fully_paid'   },
  ],
  29: [{ id:13, client:'Aaliyah M.', service:'Chrome Full Set', time:'2:00 PM',  avatar:'🎀', payStatus:'deposit_paid' }],
  30: [{ id:14, client:'Nova W.',    service:'Soft Girl Set',   time:'11:00 AM', avatar:'🌷', payStatus:'deposit_paid' }],
}

const DEFAULT_BLOCKED = new Set([4, 5, 11, 18, 26])
const TODAY = 28

export default function NailTechCalendar({ onClientTap }) {
  const [selectedDay, setSelectedDay] = useState(TODAY)
  const [blocked,     setBlocked]     = useState(DEFAULT_BLOCKED)

  const isBooked  = (d) => !!BOOKED_DAYS[d]
  const isBlocked = (d) => blocked.has(d) && !BOOKED_DAYS[d]
  const isToday   = (d) => d === TODAY

  const toggleBlock = (day) => {
    if (isBooked(day)) return
    setBlocked(prev => {
      const next = new Set(prev)
      if (next.has(day)) next.delete(day)
      else next.add(day)
      return next
    })
  }

  const dayAppts   = BOOKED_DAYS[selectedDay] ?? []
  const dayBlocked = isBlocked(selectedDay)

  return (
    <div className="nt-sub-screen nt-calendar">

      {/* Month header */}
      <div className="nt-cal-header">
        <button className="nt-cal-arrow">‹</button>
        <h2 className="nt-cal-month">{MONTH_NAME}</h2>
        <button className="nt-cal-arrow">›</button>
      </div>

      {/* Day-of-week labels */}
      <div className="nt-cal-dow-row">
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <div key={i} className="nt-cal-dow">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="nt-cal-grid">
        {Array.from({ length: FIRST_OFFSET }).map((_, i) => (
          <div key={`e${i}`} className="nt-cal-cell nt-cal-empty" />
        ))}
        {Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1).map(day => {
          const booked   = isBooked(day)
          const blocked_ = isBlocked(day)
          const today    = isToday(day)
          const selected = selectedDay === day
          return (
            <button
              key={day}
              className={[
                'nt-cal-cell',
                booked   ? 'nt-cal-booked'   : '',
                blocked_ ? 'nt-cal-blocked'  : '',
                today    ? 'nt-cal-today'    : '',
                selected ? 'nt-cal-selected' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => setSelectedDay(day)}
            >
              <span className="nt-cal-num">{day}</span>
              {booked && <span className="nt-cal-dot" />}
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
        <div className="nt-cal-day-head">
          <h3 className="nt-cal-day-title">
            April {selectedDay}
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
      </div>
    </div>
  )
}
