import { useState } from 'react'

/* ── Sub-view: Edit a single account field ── */

function EditField({ label, value: init, type = 'text', onBack }) {
  const [value, setValue] = useState(init)
  const [saved,  setSaved]  = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => { setSaved(false); onBack() }, 900)
  }

  return (
    <div className="settings-subview">
      <div className="settings-subview-header">
        <button className="settings-subview-back" onClick={onBack}>← Back</button>
        <h2 className="settings-subview-title">{label}</h2>
        <div style={{ width: 60 }} />
      </div>
      <div className="settings-subview-body">
        <label className="settings-field-label">{label}</label>
        <input
          className="settings-field-input"
          type={type}
          value={value}
          onChange={e => setValue(e.target.value)}
          autoFocus
        />
        <button
          className={`settings-save-btn ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={!value.trim()}
        >
          {saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

/* ── Sub-view: Change Password ── */

function ChangePassword({ onBack }) {
  const [cur,     setCur]     = useState('')
  const [next,    setNext]    = useState('')
  const [confirm, setConfirm] = useState('')
  const [showCur, setShowCur] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [err,     setErr]     = useState('')

  const canSave = cur.length >= 1 && next.length >= 8 && next === confirm

  const handleSave = () => {
    if (next !== confirm) { setErr('Passwords do not match'); return }
    if (next.length < 8)  { setErr('Password must be at least 8 characters'); return }
    setErr('')
    setSaved(true)
    setTimeout(() => { setSaved(false); onBack() }, 1000)
  }

  return (
    <div className="settings-subview">
      <div className="settings-subview-header">
        <button className="settings-subview-back" onClick={onBack}>← Back</button>
        <h2 className="settings-subview-title">Change Password</h2>
        <div style={{ width: 60 }} />
      </div>
      <div className="settings-subview-body">
        <label className="settings-field-label">Current Password</label>
        <div className="settings-pw-wrap">
          <input
            className="settings-field-input"
            type={showCur ? 'text' : 'password'}
            value={cur}
            onChange={e => setCur(e.target.value)}
            placeholder="Enter current password"
            autoFocus
          />
          <button className="settings-pw-eye" onClick={() => setShowCur(v => !v)}>
            {showCur ? '🙈' : '👁️'}
          </button>
        </div>

        <label className="settings-field-label" style={{ marginTop: 18 }}>New Password</label>
        <div className="settings-pw-wrap">
          <input
            className="settings-field-input"
            type={showNew ? 'text' : 'password'}
            value={next}
            onChange={e => setNext(e.target.value)}
            placeholder="Min. 8 characters"
          />
          <button className="settings-pw-eye" onClick={() => setShowNew(v => !v)}>
            {showNew ? '🙈' : '👁️'}
          </button>
        </div>

        <label className="settings-field-label" style={{ marginTop: 18 }}>Confirm New Password</label>
        <input
          className="settings-field-input"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Re-enter new password"
        />

        {err && <p className="settings-field-err">{err}</p>}

        <button
          className={`settings-save-btn ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={!canSave}
          style={{ marginTop: 24 }}
        >
          {saved ? 'Password Updated ✓' : 'Update Password'}
        </button>
      </div>
    </div>
  )
}

/* ── Sub-view: Notifications ── */

function NotificationsSettings({ onBack }) {
  const [notifs, setNotifs] = useState({
    bookings:   true,
    messages:   true,
    reminders:  true,
    matches:    true,
    promotions: false,
  })
  const toggle = (key) => setNotifs(prev => ({ ...prev, [key]: !prev[key] }))

  const items = [
    { key: 'bookings',   icon: '📅', label: 'Booking updates',       sub: 'Confirmations, cancellations, changes' },
    { key: 'messages',   icon: '💬', label: 'New messages',           sub: 'When a match or tech messages you' },
    { key: 'reminders',  icon: '⏰', label: 'Appointment reminders',  sub: '24 hours before your appointment' },
    { key: 'matches',    icon: '💅', label: 'New matches',            sub: 'When a nail tech matches with you' },
    { key: 'promotions', icon: '✨', label: 'Tips & promotions',      sub: 'Deals and Glazd tips' },
  ]

  return (
    <div className="settings-subview">
      <div className="settings-subview-header">
        <button className="settings-subview-back" onClick={onBack}>← Back</button>
        <h2 className="settings-subview-title">Notifications</h2>
        <div style={{ width: 60 }} />
      </div>
      <div className="settings-subview-body">
        <div className="settings-card">
          {items.map((item, i) => (
            <div key={item.key}>
              {i > 0 && <div className="settings-divider" />}
              <div className="settings-row settings-notif-row">
                <div className="settings-row-left">
                  <span className="settings-row-icon">{item.icon}</span>
                  <div>
                    <p className="settings-row-title">{item.label}</p>
                    <p className="settings-row-sub">{item.sub}</p>
                  </div>
                </div>
                <button
                  className={`settings-toggle ${notifs[item.key] ? 'on' : ''}`}
                  onClick={() => toggle(item.key)}
                  aria-label={`Toggle ${item.label}`}
                >
                  <div className="settings-toggle-knob" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Sub-view: Bank Account ── */

function BankAccount({ onBack }) {
  const [acct,  setAcct]  = useState('Chase ••••4821')
  const [saved, setSaved] = useState(false)
  const handleSave = () => { setSaved(true); setTimeout(() => { setSaved(false); onBack() }, 900) }

  return (
    <div className="settings-subview">
      <div className="settings-subview-header">
        <button className="settings-subview-back" onClick={onBack}>← Back</button>
        <h2 className="settings-subview-title">Bank Account</h2>
        <div style={{ width: 60 }} />
      </div>
      <div className="settings-subview-body">
        <div className="settings-bank-hero">
          <span className="settings-bank-icon">🏦</span>
          <div>
            <p className="settings-bank-name">Chase Bank</p>
            <p className="settings-bank-num">Checking ••••4821</p>
          </div>
          <span className="settings-bank-badge">Connected ✓</span>
        </div>
        <label className="settings-field-label" style={{ marginTop: 24 }}>Account nickname</label>
        <input
          className="settings-field-input"
          value={acct}
          onChange={e => setAcct(e.target.value)}
        />
        <button className="settings-save-btn" onClick={handleSave}>
          {saved ? 'Saved ✓' : 'Update Account'}
        </button>
        <button className="settings-danger-link">Remove bank account</button>
      </div>
    </div>
  )
}

/* ── Sub-view: Payout Schedule ── */

function PayoutSchedule({ onBack }) {
  const [schedule, setSchedule] = useState('weekly')
  const options = [
    { key: 'daily',    label: 'Daily',    sub: 'Funds transferred every business day' },
    { key: 'weekly',   label: 'Weekly',   sub: 'Every Monday (most popular)' },
    { key: 'biweekly', label: 'Biweekly', sub: 'Every other Friday' },
    { key: 'monthly',  label: 'Monthly',  sub: 'First of each month' },
  ]

  return (
    <div className="settings-subview">
      <div className="settings-subview-header">
        <button className="settings-subview-back" onClick={onBack}>← Back</button>
        <h2 className="settings-subview-title">Payout Schedule</h2>
        <div style={{ width: 60 }} />
      </div>
      <div className="settings-subview-body">
        <div className="settings-card">
          {options.map((opt, i) => (
            <div key={opt.key}>
              {i > 0 && <div className="settings-divider" />}
              <button
                className="settings-radio-row"
                onClick={() => { setSchedule(opt.key); setTimeout(onBack, 600) }}
              >
                <div className="settings-radio-left">
                  <p className="settings-row-title">{opt.label}</p>
                  <p className="settings-row-sub">{opt.sub}</p>
                </div>
                <div className={`settings-radio-dot ${schedule === opt.key ? 'on' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Sub-view: Earnings History ── */

const PAYOUT_HISTORY = [
  { id:1, date:'Apr 22', amount:690, appts:8,  status:'paid'    },
  { id:2, date:'Apr 15', amount:560, appts:7,  status:'paid'    },
  { id:3, date:'Apr 8',  amount:380, appts:5,  status:'paid'    },
  { id:4, date:'Apr 1',  amount:210, appts:3,  status:'paid'    },
  { id:5, date:'Mar 25', amount:520, appts:6,  status:'paid'    },
  { id:6, date:'Mar 18', amount:450, appts:5,  status:'paid'    },
]

function EarningsHistory({ onBack }) {
  const total = PAYOUT_HISTORY.reduce((s, p) => s + p.amount, 0)

  return (
    <div className="settings-subview">
      <div className="settings-subview-header">
        <button className="settings-subview-back" onClick={onBack}>← Back</button>
        <h2 className="settings-subview-title">Earnings History</h2>
        <div style={{ width: 60 }} />
      </div>
      <div className="settings-subview-body">
        <div className="settings-earnings-total">
          <p className="settings-earnings-label">Total earned</p>
          <p className="settings-earnings-amount">${total.toLocaleString()}</p>
        </div>
        <div className="settings-card">
          {PAYOUT_HISTORY.map((p, i) => (
            <div key={p.id}>
              {i > 0 && <div className="settings-divider" />}
              <div className="settings-row">
                <div className="settings-row-left">
                  <span className="settings-row-icon">💸</span>
                  <div>
                    <p className="settings-row-title">Week of {p.date}</p>
                    <p className="settings-row-sub">{p.appts} appointments</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="settings-earnings-row-amt">${p.amount}</p>
                  <p className="settings-earnings-row-status">Paid ✓</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Sub-view: Privacy Settings ── */

function PrivacySettings({ onBack }) {
  const [prefs, setPrefs] = useState({
    location:   true,
    analytics:  false,
    visibility: true,
  })
  const toggle = (key) => setPrefs(prev => ({ ...prev, [key]: !prev[key] }))

  const items = [
    { key: 'location',   icon: '📍', label: 'Share location data',  sub: 'Used for local nail tech matching' },
    { key: 'analytics',  icon: '📊', label: 'Usage analytics',      sub: 'Help improve the app (anonymous)' },
    { key: 'visibility', icon: '👁️', label: 'Public profile',       sub: 'Allow techs to discover your profile' },
  ]

  return (
    <div className="settings-subview">
      <div className="settings-subview-header">
        <button className="settings-subview-back" onClick={onBack}>← Back</button>
        <h2 className="settings-subview-title">Privacy Settings</h2>
        <div style={{ width: 60 }} />
      </div>
      <div className="settings-subview-body">
        <div className="settings-card">
          {items.map((item, i) => (
            <div key={item.key}>
              {i > 0 && <div className="settings-divider" />}
              <div className="settings-row settings-notif-row">
                <div className="settings-row-left">
                  <span className="settings-row-icon">{item.icon}</span>
                  <div>
                    <p className="settings-row-title">{item.label}</p>
                    <p className="settings-row-sub">{item.sub}</p>
                  </div>
                </div>
                <button
                  className={`settings-toggle ${prefs[item.key] ? 'on' : ''}`}
                  onClick={() => toggle(item.key)}
                >
                  <div className="settings-toggle-knob" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Sub-view: Location Preferences ── */

function LocationPrefs({ onBack }) {
  const [city,  setCity]  = useState('Los Angeles, CA')
  const [radius, setRadius] = useState(15)
  const [saved, setSaved] = useState(false)

  return (
    <div className="settings-subview">
      <div className="settings-subview-header">
        <button className="settings-subview-back" onClick={onBack}>← Back</button>
        <h2 className="settings-subview-title">Location</h2>
        <div style={{ width: 60 }} />
      </div>
      <div className="settings-subview-body">
        <label className="settings-field-label">City</label>
        <input
          className="settings-field-input"
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="e.g. Los Angeles, CA"
          autoFocus
        />
        <label className="settings-field-label" style={{ marginTop: 20 }}>
          Search radius — <strong>{radius} miles</strong>
        </label>
        <input
          className="settings-range-input"
          type="range"
          min={5}
          max={50}
          step={5}
          value={radius}
          onChange={e => setRadius(+e.target.value)}
        />
        <div className="settings-range-labels">
          <span>5 mi</span><span>50 mi</span>
        </div>
        <button
          className={`settings-save-btn ${saved ? 'saved' : ''}`}
          onClick={() => { setSaved(true); setTimeout(() => { setSaved(false); onBack() }, 900) }}
          style={{ marginTop: 28 }}
        >
          {saved ? 'Saved ✓' : 'Save Location'}
        </button>
      </div>
    </div>
  )
}

/* ── Sub-view: Profile Visibility ── */

function ProfileVisibility({ onBack }) {
  const [vis, setVis] = useState('everyone')
  const options = [
    { key: 'everyone',  label: 'Everyone',       sub: 'Any nail tech on Glazd can see you' },
    { key: 'matches',   label: 'Matches only',   sub: 'Only techs you have matched with' },
    { key: 'private_location', label: 'Private Location', sub: 'Profile visible, exact location hidden · shows general area like "Phoenix Area"' },
  ]

  return (
    <div className="settings-subview">
      <div className="settings-subview-header">
        <button className="settings-subview-back" onClick={onBack}>← Back</button>
        <h2 className="settings-subview-title">Profile Visibility</h2>
        <div style={{ width: 60 }} />
      </div>
      <div className="settings-subview-body">
        <div className="settings-card">
          {options.map((opt, i) => (
            <div key={opt.key}>
              {i > 0 && <div className="settings-divider" />}
              <button
                className="settings-radio-row"
                onClick={() => { setVis(opt.key); setTimeout(onBack, 600) }}
              >
                <div className="settings-radio-left">
                  <p className="settings-row-title">{opt.label}</p>
                  <p className="settings-row-sub">{opt.sub}</p>
                </div>
                <div className={`settings-radio-dot ${vis === opt.key ? 'on' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Sub-view: Help & Support / FAQ ── */

const FAQ_ITEMS = [
  {
    q: 'How does matching work?',
    a: 'Glazd uses your style preferences, location, and budget to surface nail techs that match your aesthetic. Swipe right to match, swipe left to pass.',
  },
  {
    q: 'How do I book an appointment?',
    a: 'Once matched, tap "Book" in chat or on a tech\'s profile. Choose your service, date, and time. A deposit secures the booking.',
  },
  {
    q: 'Can I cancel a booking?',
    a: 'Yes — go to your Profile tab, find your upcoming appointment, and tap Cancel. Cancellation policies vary by tech.',
  },
  {
    q: 'How do deposits work?',
    a: 'Deposits are a percentage of the service price, set by the nail tech. They secure your slot and are deducted from the final price.',
  },
  {
    q: 'How do I contact support?',
    a: 'Email us at hello@glazd.app or tap the chat icon on this screen. We respond within 24 hours.',
  },
]

function HelpSupport({ onBack }) {
  const [open, setOpen] = useState(null)

  return (
    <div className="settings-subview">
      <div className="settings-subview-header">
        <button className="settings-subview-back" onClick={onBack}>← Back</button>
        <h2 className="settings-subview-title">Help & Support</h2>
        <div style={{ width: 60 }} />
      </div>
      <div className="settings-subview-body">
        <div className="settings-faq-hero">
          <span className="settings-faq-emoji">💬</span>
          <p className="settings-faq-tagline">We're here to help</p>
          <a className="settings-faq-contact" href="mailto:hello@glazd.app">hello@glazd.app</a>
        </div>
        <p className="settings-field-label" style={{ marginBottom: 10 }}>Frequently Asked Questions</p>
        <div className="settings-card">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i}>
              {i > 0 && <div className="settings-divider" />}
              <button
                className="settings-faq-row"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <p className="settings-row-title">{item.q}</p>
                <span className={`settings-faq-chevron ${open === i ? 'open' : ''}`}>›</span>
              </button>
              {open === i && (
                <p className="settings-faq-answer">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Sub-view: Terms / Policy ── */

function TextPage({ title, content, onBack }) {
  return (
    <div className="settings-subview">
      <div className="settings-subview-header">
        <button className="settings-subview-back" onClick={onBack}>← Back</button>
        <h2 className="settings-subview-title">{title}</h2>
        <div style={{ width: 60 }} />
      </div>
      <div className="settings-subview-body">
        <div className="settings-text-page">
          {content.map((section, i) => (
            <div key={i} className="settings-text-section">
              <p className="settings-text-heading">{section.heading}</p>
              <p className="settings-text-body">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const TERMS_CONTENT = [
  { heading: 'Last updated: April 2025', body: 'By using Glazd, you agree to these terms. Glazd is a platform that connects clients with independent nail technicians.' },
  { heading: 'Bookings & Payments', body: 'Appointments are between you and the nail technician. Glazd facilitates the booking but is not liable for the quality of services rendered.' },
  { heading: 'Cancellations', body: 'Cancellation policies are set by individual nail technicians. Deposits may be non-refundable based on each tech\'s policy.' },
  { heading: 'Code of Conduct', body: 'All users must treat others with respect. Harassment, discrimination, or abuse of any kind will result in immediate account termination.' },
  { heading: 'Contact', body: 'Questions? Email legal@glazd.app' },
]

const POLICY_CONTENT = [
  { heading: 'What we collect', body: 'We collect your name, email, location, and style preferences to power matching. Payment data is processed by Stripe and never stored on our servers.' },
  { heading: 'How we use it', body: 'Your data is used solely to match you with nail technicians, facilitate bookings, and improve the app. We do not sell your data.' },
  { heading: 'Location data', body: 'Location is used to show nearby nail techs. You can disable location sharing in Privacy Settings at any time.' },
  { heading: 'Your rights', body: 'You can request a copy of your data or deletion at any time by emailing privacy@glazd.app.' },
]

/* ── Logout confirmation dialog ── */

function LogoutConfirm({ onConfirm, onCancel }) {
  return (
    <div className="settings-dialog-overlay" onClick={onCancel}>
      <div className="settings-dialog" onClick={e => e.stopPropagation()}>
        <p className="settings-dialog-icon">🚪</p>
        <h3 className="settings-dialog-title">Log out?</h3>
        <p className="settings-dialog-sub">You can always sign back in.</p>
        <button className="settings-dialog-danger" onClick={onConfirm}>Log Out</button>
        <button className="settings-dialog-cancel" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

/* ── Main Settings Screen ── */

export default function SettingsScreen({ onBack, onLogout, isNailTech = false }) {
  const [view,       setView]       = useState('main')
  const [showLogout, setShowLogout] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const goBack = () => setView('main')

  /* ── Sub-view routing ── */
  if (view === 'editName')     return <EditField label="Name"  value="Destiny C."          onBack={goBack} />
  if (view === 'editEmail')    return <EditField label="Email" value="destiny@email.com"    onBack={goBack} type="email" />
  if (view === 'editPhone')    return <EditField label="Phone" value="+1 (555) 000-0000"    onBack={goBack} type="tel" />
  if (view === 'changePassword') return <ChangePassword onBack={goBack} />
  if (view === 'notifications')  return <NotificationsSettings onBack={goBack} />
  if (view === 'bank')           return <BankAccount onBack={goBack} />
  if (view === 'payoutSchedule') return <PayoutSchedule onBack={goBack} />
  if (view === 'earningsHistory') return <EarningsHistory onBack={goBack} />
  if (view === 'privacy')        return <PrivacySettings onBack={goBack} />
  if (view === 'location')       return <LocationPrefs onBack={goBack} />
  if (view === 'visibility')     return <ProfileVisibility onBack={goBack} />
  if (view === 'help')           return <HelpSupport onBack={goBack} />
  if (view === 'terms')          return <TextPage title="Terms of Service" content={TERMS_CONTENT} onBack={goBack} />
  if (view === 'policy')         return <TextPage title="Privacy Policy"   content={POLICY_CONTENT} onBack={goBack} />

  return (
    <div className="screen settings-screen">

      <div className="settings-header">
        <button className="settings-back" onClick={onBack}>← Back</button>
        <h1 className="settings-title">Settings</h1>
        <div style={{ width: 60 }} />
      </div>

      <div className="settings-scroll">

        {/* ── Account ── */}
        <p className="settings-section-label">Account</p>
        <div className="settings-card">
          <SettingsRow icon="👤" title="Name"            sub="Destiny C."          onClick={() => setView('editName')} />
          <SettingsDivider />
          <SettingsRow icon="✉️" title="Email"           sub="destiny@email.com"   onClick={() => setView('editEmail')} />
          <SettingsDivider />
          <SettingsRow icon="📱" title="Phone"           sub="+1 (555) 000-0000"   onClick={() => setView('editPhone')} />
          <SettingsDivider />
          <SettingsRow icon="🔒" title="Change Password"                           onClick={() => setView('changePassword')} />
        </div>

        {/* ── Notifications ── */}
        <p className="settings-section-label">Notifications</p>
        <div className="settings-card">
          <SettingsRow icon="🔔" title="Notification Preferences" sub="Manage what you hear about" onClick={() => setView('notifications')} />
        </div>

        {/* ── Payments (NT only) ── */}
        {isNailTech && (
          <>
            <p className="settings-section-label">Payments</p>
            <div className="settings-card">
              <SettingsRow icon="🏦" title="Connected Bank Account" sub="Chase ••••4821"        onClick={() => setView('bank')} />
              <SettingsDivider />
              <SettingsRow icon="💸" title="Payout Schedule"        sub="Weekly · Every Monday" onClick={() => setView('payoutSchedule')} />
              <SettingsDivider />
              <SettingsRow icon="📊" title="Earnings History"       sub="View all payouts"      onClick={() => setView('earningsHistory')} />
            </div>
          </>
        )}

        {/* ── Privacy ── */}
        <p className="settings-section-label">Privacy</p>
        <div className="settings-card">
          <SettingsRow icon="🔐" title="Privacy Settings"     sub="Data & analytics"      onClick={() => setView('privacy')} />
          <SettingsDivider />
          <SettingsRow icon="📍" title="Location Preferences" sub="Los Angeles, CA · 15mi" onClick={() => setView('location')} />
          <SettingsDivider />
          <SettingsRow icon="👁️" title="Profile Visibility"   sub="Everyone"              onClick={() => setView('visibility')} />
        </div>

        {/* ── Support ── */}
        <p className="settings-section-label">Support</p>
        <div className="settings-card">
          <SettingsRow icon="❓" title="Help & Support"   sub="FAQ & contact"    onClick={() => setView('help')} />
          <SettingsDivider />
          <SettingsRow icon="📝" title="Terms of Service"                        onClick={() => setView('terms')} />
          <SettingsDivider />
          <SettingsRow icon="🛡️" title="Privacy Policy"                         onClick={() => setView('policy')} />
        </div>

        {/* ── Log out ── */}
        <button className="settings-logout-btn" onClick={() => setShowLogout(true)}>
          Log Out
        </button>

        {/* ── Delete account ── */}
        {!showDelete ? (
          <button className="settings-delete-link" onClick={() => setShowDelete(true)}>
            Delete Account
          </button>
        ) : (
          <div className="settings-delete-confirm-box">
            <p className="settings-delete-warn">
              ⚠️ This cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="settings-delete-actions">
              <button className="settings-delete-cancel-btn" onClick={() => setShowDelete(false)}>
                Cancel
              </button>
              <button className="settings-delete-forever-btn" onClick={() => onLogout?.()}>
                Delete Forever
              </button>
            </div>
          </div>
        )}

        <div style={{ height: 40 }} />
      </div>

      {/* ── Logout confirmation overlay ── */}
      {showLogout && (
        <LogoutConfirm
          onConfirm={() => { setShowLogout(false); onLogout?.() }}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </div>
  )
}

/* ── Helpers ── */

function SettingsRow({ icon, title, sub, onClick }) {
  return (
    <button className="settings-row settings-row-btn" onClick={onClick}>
      <div className="settings-row-left">
        <span className="settings-row-icon">{icon}</span>
        <div>
          <p className="settings-row-title">{title}</p>
          {sub && <p className="settings-row-sub">{sub}</p>}
        </div>
      </div>
      <span className="settings-row-arrow">›</span>
    </button>
  )
}

function SettingsDivider() {
  return <div className="settings-divider" />
}
