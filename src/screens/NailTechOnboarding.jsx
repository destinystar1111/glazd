import { useState } from 'react'

/* ── Data ──────────────────────────────────────────────── */

const STEPS = [
  { id: 'basic',        label: 'Basic Info' },
  { id: 'services',     label: 'Services & Pricing' },
  { id: 'vibe',         label: 'Your Vibe' },
  { id: 'bio',          label: 'Bio' },
  { id: 'portfolio',    label: 'Portfolio' },
  { id: 'availability', label: 'Availability' },
]

const VIBE_OPTIONS = [
  { id: 'glam',      emoji: '💎', name: 'Glam' },
  { id: 'witchy',    emoji: '🖤', name: 'Witchy' },
  { id: 'minimal',   emoji: '✨', name: 'Minimalist' },
  { id: 'softgirl',  emoji: '🎀', name: 'Soft Girl' },
  { id: 'character', emoji: '🎨', name: 'Character Art' },
  { id: 'chrome',    emoji: '🪞', name: 'Chrome' },
  { id: 'bridal',    emoji: '🤍', name: 'Bridal' },
  { id: 'bold',      emoji: '🌶️', name: 'Bold' },
]

const DEFAULT_SERVICES = [
  { id: 1, name: 'Builder Gel',   duration: 60, price: 65 },
  { id: 2, name: 'PolyGel',       duration: 75, price: 75 },
  { id: 3, name: 'Fill',          duration: 45, price: 45 },
  { id: 4, name: 'Character Art', duration: 90, price: 95 },
]

const PORTFOLIO_FILLS = [
  { bg: 'linear-gradient(135deg, #fde0e8, #f5c6d5)', emoji: '💅' },
  { bg: 'linear-gradient(135deg, #e8d5f5, #d5b8f0)', emoji: '💎' },
  { bg: 'linear-gradient(135deg, #d5eaf5, #b8d8f0)', emoji: '🎨' },
  { bg: 'linear-gradient(135deg, #f5ead5, #f0d8b8)', emoji: '🪞' },
  { bg: 'linear-gradient(135deg, #fde8f5, #f5c6e8)', emoji: '🌸' },
  { bg: 'linear-gradient(135deg, #e0f5e8, #c6f0d5)', emoji: '✨' },
  { bg: 'linear-gradient(135deg, #f5f0d5, #f0e8b8)', emoji: '🌟' },
  { bg: 'linear-gradient(135deg, #f5d5e8, #f0b8d5)', emoji: '🎀' },
  { bg: 'linear-gradient(135deg, #dde8f5, #c8d8f0)', emoji: '🪄' },
  { bg: 'linear-gradient(135deg, #f5e8dd, #f0d8c8)', emoji: '🌷' },
  { bg: 'linear-gradient(135deg, #ede0f5, #e0c8f0)', emoji: '🦋' },
  { bg: 'linear-gradient(135deg, #f0f5dd, #e8f0c8)', emoji: '🍃' },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const DEFAULT_SCHEDULE = DAYS.reduce((acc, d) => {
  acc[d] = {
    enabled: ['Mon','Tue','Wed','Thu','Fri'].includes(d),
    start: '09:00',
    end: '18:00',
  }
  return acc
}, {})

/* ── Main Component ────────────────────────────────────── */

export default function NailTechOnboarding({ onBack, onComplete }) {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [data, setData] = useState({
    name:         '',
    businessName: '',
    location:     '',
    years:        '',
    services:     DEFAULT_SERVICES,
    vibes:        [],
    bio:          '',
    portfolio:    Array(12).fill(null),
    coverPhotos:  [],
    schedule:     DEFAULT_SCHEDULE,
  })

  const isValid = () => {
    if (step === 0) return data.name.trim().length > 0 && data.location.trim().length > 0
    if (step === 1) return data.services.length > 0 && data.services.some(s => s.name.trim())
    if (step === 2) return data.vibes.length > 0
    if (step === 3) return data.bio.trim().length > 0
    if (step === 4) return true
    if (step === 5) return Object.values(data.schedule).some(d => d.enabled)
    return false
  }

  const next = () => {
    if (!isValid()) return
    if (step === STEPS.length - 1) { setDone(true); return }
    setStep(s => s + 1)
  }

  const back = () => {
    if (step === 0) onBack()
    else setStep(s => s - 1)
  }

  if (done) return <NailTechComplete data={data} onComplete={onComplete} />

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="screen onboarding">
      <div className="onboarding-head">
        <button className="btn-ghost" onClick={back}>← Back</button>
        <div className="progress-wrap">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-meta">
            <span className="progress-label">{STEPS[step].label}</span>
            <span className="progress-count"><strong>{step + 1}</strong> of {STEPS.length}</span>
          </div>
        </div>
      </div>

      <div className="onboarding-body">
        {step === 0 && <NTBasicStep    data={data} onChange={setData} />}
        {step === 1 && <NTServicesStep data={data} onChange={setData} />}
        {step === 2 && <NTVibeStep     data={data} onChange={setData} />}
        {step === 3 && <NTBioStep      data={data} onChange={setData} />}
        {step === 4 && <NTPortfolioStep data={data} onChange={setData} />}
        {step === 5 && <NTAvailStep    data={data} onChange={setData} />}
      </div>

      <div className="onboarding-foot">
        <button className="btn-primary" onClick={next} disabled={!isValid()}>
          {step === STEPS.length - 1 ? 'Launch My Profile ✨' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

/* ── Step 1: Basic Info ────────────────────────────────── */

function NTBasicStep({ data, onChange }) {
  const set = (key, val) => onChange(d => ({ ...d, [key]: val }))

  return (
    <>
      <h2 className="step-q">Tell us about you</h2>
      <p className="step-hint">Set up your professional profile 💅</p>
      <div className="step-content">
        <div className="nt-form-stack">
          <div className="input-wrap">
            <span className="input-icon">👤</span>
            <input
              className="input-field"
              type="text"
              placeholder="Your name"
              value={data.name}
              onChange={e => set('name', e.target.value)}
              autoFocus
            />
          </div>
          <div className="input-wrap">
            <span className="input-icon">💼</span>
            <input
              className="input-field"
              type="text"
              placeholder="Business / Studio name (optional)"
              value={data.businessName}
              onChange={e => set('businessName', e.target.value)}
            />
          </div>
          <div className="input-wrap">
            <span className="input-icon">📍</span>
            <input
              className="input-field"
              type="text"
              placeholder="City, State"
              value={data.location}
              onChange={e => set('location', e.target.value)}
            />
          </div>
          <div className="input-wrap">
            <span className="input-icon">🗓️</span>
            <input
              className="input-field"
              type="number"
              placeholder="Years of experience"
              value={data.years}
              onChange={e => set('years', e.target.value)}
              min="0"
              max="50"
            />
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Step 2: Services & Pricing ────────────────────────── */

function NTServicesStep({ data, onChange }) {
  const updateService = (id, key, val) =>
    onChange(d => ({
      ...d,
      services: d.services.map(s => s.id === id ? { ...s, [key]: val } : s),
    }))

  const addService = () => {
    const newId = Math.max(...data.services.map(s => s.id), 0) + 1
    onChange(d => ({
      ...d,
      services: [...d.services, { id: newId, name: '', duration: 60, price: 0 }],
    }))
  }

  const removeService = (id) =>
    onChange(d => ({ ...d, services: d.services.filter(s => s.id !== id) }))

  return (
    <>
      <h2 className="step-q">Services & pricing</h2>
      <p className="step-hint">Edit to match your actual rates ✏️</p>
      <div className="step-content">
        <div className="nt-services-list">
          {data.services.map(svc => (
            <div key={svc.id} className="nt-service-row">
              <div className="nt-svc-top">
                <input
                  className="nt-svc-name"
                  type="text"
                  placeholder="Service name"
                  value={svc.name}
                  onChange={e => updateService(svc.id, 'name', e.target.value)}
                />
                <button className="nt-svc-del" onClick={() => removeService(svc.id)}>✕</button>
              </div>
              <div className="nt-svc-meta">
                <div className="nt-svc-field">
                  <span className="nt-svc-prefix">⏱</span>
                  <input
                    className="nt-svc-num"
                    type="number"
                    value={svc.duration}
                    onChange={e => updateService(svc.id, 'duration', +e.target.value)}
                    min="15"
                    max="300"
                    step="15"
                  />
                  <span className="nt-svc-unit">min</span>
                </div>
                <div className="nt-svc-field">
                  <span className="nt-svc-prefix">$</span>
                  <input
                    className="nt-svc-num"
                    type="number"
                    value={svc.price}
                    onChange={e => updateService(svc.id, 'price', +e.target.value)}
                    min="0"
                    max="999"
                  />
                </div>
              </div>
            </div>
          ))}
          <button className="nt-add-service-btn" onClick={addService}>
            + Add Service
          </button>
        </div>
      </div>
    </>
  )
}

/* ── Step 3: Vibe ──────────────────────────────────────── */

function NTVibeStep({ data, onChange }) {
  const toggle = (id) =>
    onChange(d => ({
      ...d,
      vibes: d.vibes.includes(id)
        ? d.vibes.filter(v => v !== id)
        : [...d.vibes, id],
    }))

  return (
    <>
      <h2 className="step-q">What's your vibe?</h2>
      <p className="step-hint">Let clients know what you specialise in ✨</p>
      <div className="step-content">
        <div className="nt-vibe-grid">
          {VIBE_OPTIONS.map(v => (
            <div
              key={v.id}
              className={`nt-vibe-card ${data.vibes.includes(v.id) ? 'active' : ''}`}
              onClick={() => toggle(v.id)}
            >
              <div className="nt-vibe-emoji">{v.emoji}</div>
              <div className="nt-vibe-name">{v.name}</div>
              <div className="nt-vibe-check">
                {data.vibes.includes(v.id) ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ── Step 4: Bio ───────────────────────────────────────── */

function NTBioStep({ data, onChange }) {
  return (
    <>
      <h2 className="step-q">Your nail philosophy</h2>
      <p className="step-hint">This appears on your profile card to clients</p>
      <div className="step-content">
        <div className="nt-bio-wrap">
          <div className="nt-bio-prompt">My nail philosophy is...</div>
          <textarea
            className="nt-bio-textarea"
            placeholder="making every client feel seen through their nails. Each set is a conversation — I listen, I create, I elevate."
            value={data.bio}
            onChange={e => onChange(d => ({ ...d, bio: e.target.value }))}
            maxLength={280}
            rows={5}
          />
          <div className="nt-bio-count">{data.bio.length} / 280</div>
        </div>
      </div>
    </>
  )
}

/* ── Step 5: Portfolio ─────────────────────────────────── */

function NTPortfolioStep({ data, onChange }) {
  const toggleTile = (idx) =>
    onChange(d => {
      const portfolio = [...d.portfolio]
      const wasFilled = !!portfolio[idx]
      portfolio[idx] = wasFilled ? null : PORTFOLIO_FILLS[idx]
      // removing a photo also removes it from cover picks
      const coverPhotos = wasFilled
        ? d.coverPhotos.filter(c => c !== idx)
        : d.coverPhotos
      return { ...d, portfolio, coverPhotos }
    })

  const toggleCover = (e, idx) => {
    e.stopPropagation()
    onChange(d => {
      if (d.coverPhotos.includes(idx)) {
        return { ...d, coverPhotos: d.coverPhotos.filter(c => c !== idx) }
      }
      if (d.coverPhotos.length >= 4) return d   // max 4 card photos
      return { ...d, coverPhotos: [...d.coverPhotos, idx] }
    })
  }

  const filledCount  = data.portfolio.filter(Boolean).length
  const coverCount   = data.coverPhotos.length
  const coverFull    = coverCount >= 4

  return (
    <>
      <h2 className="step-q">Show your work</h2>
      <p className="step-hint">Up to 12 photos · star up to 4 for your swipe card</p>
      <div className="step-content">
        <div className="nt-cover-count-row">
          <span className={`nt-cover-counter ${coverFull ? 'full' : ''}`}>
            {filledCount}/12 photos · {coverCount}/4 starred{coverFull ? ' ⭐' : ''}
          </span>
        </div>
        <div className="nt-portfolio-grid-3">
          {data.portfolio.map((tile, i) => {
            const isStarred = data.coverPhotos.includes(i)
            return (
              <div
                key={i}
                className={`nt-portfolio-tile ${tile ? 'filled' : ''} ${isStarred ? 'cover' : ''}`}
                style={tile ? { background: tile.bg } : {}}
                onClick={() => toggleTile(i)}
              >
                {tile ? (
                  <>
                    <div className="nt-portfolio-img">{tile.emoji}</div>
                    <button
                      className={`nt-cover-star-btn ${isStarred ? 'starred' : ''}`}
                      onClick={(e) => toggleCover(e, i)}
                      title={isStarred ? 'Remove from card' : 'Feature on card'}
                    >
                      {isStarred ? '⭐' : '☆'}
                    </button>
                  </>
                ) : (
                  <div className="nt-portfolio-add">+</div>
                )}
              </div>
            )
          })}
        </div>
        <p className="nt-portfolio-hint">
          Tap empty slot to add · tap ☆ on a photo to show it on your client card
        </p>
      </div>
    </>
  )
}

/* ── Step 6: Availability ──────────────────────────────── */

function NTAvailStep({ data, onChange }) {
  const toggleDay = (day) =>
    onChange(d => ({
      ...d,
      schedule: {
        ...d.schedule,
        [day]: { ...d.schedule[day], enabled: !d.schedule[day].enabled },
      },
    }))

  const setTime = (day, key, val) =>
    onChange(d => ({
      ...d,
      schedule: {
        ...d.schedule,
        [day]: { ...d.schedule[day], [key]: val },
      },
    }))

  return (
    <>
      <h2 className="step-q">Your availability</h2>
      <p className="step-hint">Set your weekly working hours 🗓️</p>
      <div className="step-content">
        <div className="nt-avail-list">
          {DAYS.map(day => {
            const sched = data.schedule[day]
            return (
              <div key={day} className={`nt-avail-row ${sched.enabled ? 'enabled' : ''}`}>
                <button
                  className={`nt-day-toggle ${sched.enabled ? 'on' : 'off'}`}
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </button>
                {sched.enabled ? (
                  <div className="nt-time-inputs">
                    <input
                      className="nt-time-input"
                      type="time"
                      value={sched.start}
                      onChange={e => setTime(day, 'start', e.target.value)}
                    />
                    <span className="nt-time-sep">–</span>
                    <input
                      className="nt-time-input"
                      type="time"
                      value={sched.end}
                      onChange={e => setTime(day, 'end', e.target.value)}
                    />
                  </div>
                ) : (
                  <span className="nt-avail-off">Unavailable</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

/* ── Complete Screen ───────────────────────────────────── */

function NailTechComplete({ data, onComplete }) {
  const activeVibes = VIBE_OPTIONS.filter(v => data.vibes.includes(v.id))
  const activeDays  = DAYS.filter(d => data.schedule[d].enabled)

  return (
    <div className="screen complete">
      <div className="complete-icon">🎨</div>
      <h2 className="complete-title">You're live,<br />{data.name}!</h2>
      <p className="complete-sub">
        Your profile is ready. Clients can now<br />discover and book you on Glazd.
      </p>

      <div className="complete-card">
        <div className="summary-row">
          <span className="summary-icon">💼</span>
          <div className="summary-text">
            <div className="summary-label">Business</div>
            <div className="summary-val">{data.businessName || data.name}</div>
          </div>
        </div>
        <div className="summary-row">
          <span className="summary-icon">📍</span>
          <div className="summary-text">
            <div className="summary-label">Location</div>
            <div className="summary-val">{data.location}</div>
          </div>
        </div>
        <div className="summary-row">
          <span className="summary-icon">💅</span>
          <div className="summary-text">
            <div className="summary-label">Services</div>
            <div className="summary-val">{data.services.filter(s => s.name.trim()).length} services listed</div>
          </div>
        </div>
        <div className="summary-row">
          <span className="summary-icon">🖼️</span>
          <div className="summary-text">
            <div className="summary-label">Portfolio</div>
            <div className="summary-val">
              {data.portfolio.filter(Boolean).length} photos · {data.coverPhotos.length} on card
            </div>
          </div>
        </div>
        <div className="summary-row">
          <span className="summary-icon">✨</span>
          <div className="summary-text">
            <div className="summary-label">Vibe</div>
            <div className="summary-val">{activeVibes.map(v => v.name).join(', ')}</div>
          </div>
        </div>
        <div className="summary-row">
          <span className="summary-icon">🗓️</span>
          <div className="summary-text">
            <div className="summary-label">Available</div>
            <div className="summary-val">{activeDays.join(', ')}</div>
          </div>
        </div>
      </div>

      <div className="complete-actions">
        <button className="btn-primary" onClick={() => onComplete(data)}>
          Go to My Dashboard ✨
        </button>
      </div>
    </div>
  )
}
