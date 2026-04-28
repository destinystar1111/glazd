import { useState } from 'react'

/* ---- Data ---- */

const STEPS = [
  { id: 'name',     label: 'Your Name' },
  { id: 'location', label: 'Location' },
  { id: 'styles',   label: 'Nail Styles' },
  { id: 'length',   label: 'Nail Length' },
  { id: 'budget',   label: 'Budget' },
]

const NAIL_STYLES = [
  { id: 'glam',      emoji: '💎', name: 'Glam',         sub: 'Rhinestones & bold' },
  { id: 'witchy',    emoji: '🖤', name: 'Witchy',        sub: 'Dark & mystical' },
  { id: 'minimal',   emoji: '✨', name: 'Minimalist',    sub: 'Clean quiet luxury' },
  { id: 'softgirl',  emoji: '🎀', name: 'Soft Girl',     sub: 'Pastel & cute' },
  { id: 'character', emoji: '🎨', name: 'Character Art', sub: 'Custom nail art' },
  { id: 'chrome',    emoji: '🪞', name: 'Chrome/Glazed', sub: 'Mirror & holo' },
]

const NAIL_LENGTHS = [
  { id: 'short',  vis: 'short',  name: 'Short',      sub: 'Natural & practical' },
  { id: 'medium', vis: 'medium', name: 'Medium',     sub: 'Balanced & versatile' },
  { id: 'long',   vis: 'long',   name: 'Long',       sub: 'Elegant & statement' },
  { id: 'xl',     vis: 'xl',     name: 'Extra Long', sub: 'Bold & dramatic' },
]

const BUDGETS = [
  { id: 'under50',  emoji: '🌸', range: 'Under $50',   label: 'Budget friendly' },
  { id: '50to100',  emoji: '💕', range: '$50 – $100',  label: 'Mid-range' },
  { id: '100to150', emoji: '💎', range: '$100 – $150', label: 'Premium' },
  { id: '150plus',  emoji: '👑', range: '$150+',       label: 'Luxury' },
  { id: 'flex',     emoji: '✨', range: 'Flexible',    label: 'No limit', full: true },
]

/* ---- Main Component ---- */

export default function ClientOnboarding({ onBack, onComplete }) {
  const [step, setStep]   = useState(0)
  const [done, setDone]   = useState(false)
  const [data, setData]   = useState({
    name: '', city: '', styles: [], length: '', budget: '',
  })

  const isValid = () => {
    const v = { name: data.name.trim(), city: data.city.trim(), styles: data.styles, length: data.length, budget: data.budget }
    if (step === 0) return v.name.length > 0
    if (step === 1) return v.city.length > 0
    if (step === 2) return v.styles.length > 0
    if (step === 3) return v.length !== ''
    if (step === 4) return v.budget !== ''
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

  const toggleStyle = (id) => setData(d => ({
    ...d,
    styles: d.styles.includes(id) ? d.styles.filter(s => s !== id) : [...d.styles, id],
  }))

  if (done) return <CompleteScreen data={data} onComplete={onComplete} />

  const progress = (step / STEPS.length) * 100

  return (
    <div className="screen onboarding">
      {/* Header */}
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

      {/* Body */}
      <div className="onboarding-body">
        {step === 0 && (
          <NameStep value={data.name} onChange={v => setData(d => ({ ...d, name: v }))} />
        )}
        {step === 1 && (
          <LocationStep value={data.city} onChange={v => setData(d => ({ ...d, city: v }))} />
        )}
        {step === 2 && (
          <StyleStep selected={data.styles} onToggle={toggleStyle} />
        )}
        {step === 3 && (
          <LengthStep selected={data.length} onSelect={v => setData(d => ({ ...d, length: v }))} />
        )}
        {step === 4 && (
          <BudgetStep selected={data.budget} onSelect={v => setData(d => ({ ...d, budget: v }))} />
        )}
      </div>

      {/* Footer */}
      <div className="onboarding-foot">
        <button className="btn-primary" onClick={next} disabled={!isValid()}>
          {step === STEPS.length - 1 ? 'Finish ✨' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

/* ---- Step: Name ---- */

function NameStep({ value, onChange }) {
  return (
    <>
      <h2 className="step-q">What's your name?</h2>
      <p className="step-hint">So your nail tech can greet you properly ✨</p>
      <div className="step-content">
        <div className="input-wrap">
          <span className="input-icon">👤</span>
          <input
            className="input-field"
            type="text"
            placeholder="Your first name"
            value={value}
            onChange={e => onChange(e.target.value)}
            autoFocus
          />
        </div>
      </div>
    </>
  )
}

/* ---- Step: Location ---- */

function LocationStep({ value, onChange }) {
  return (
    <>
      <h2 className="step-q">Where are you located?</h2>
      <p className="step-hint">We'll show you nail techs near you 📍</p>
      <div className="step-content">
        <div className="input-wrap">
          <span className="input-icon">📍</span>
          <input
            className="input-field"
            type="text"
            placeholder="City, State"
            value={value}
            onChange={e => onChange(e.target.value)}
            autoFocus
          />
        </div>
      </div>
    </>
  )
}

/* ---- Step: Styles ---- */

function StyleStep({ selected, onToggle }) {
  return (
    <>
      <h2 className="step-q">What's your nail style?</h2>
      <p className="step-hint">Pick all that speak to your soul 💅</p>
      <div className="step-content">
        <div className="style-grid">
          {NAIL_STYLES.map(s => (
            <div
              key={s.id}
              className={`style-card ${selected.includes(s.id) ? 'active' : ''}`}
              onClick={() => onToggle(s.id)}
            >
              <div className="style-emoji">{s.emoji}</div>
              <div className="style-name">{s.name}</div>
              <div className="style-sub">{s.sub}</div>
              <div className="style-check">{selected.includes(s.id) ? '✓' : ''}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ---- Step: Length ---- */

function LengthStep({ selected, onSelect }) {
  return (
    <>
      <h2 className="step-q">How long do you like them?</h2>
      <p className="step-hint">Your preferred nail length</p>
      <div className="step-content">
        <div className="length-list">
          {NAIL_LENGTHS.map(l => (
            <div
              key={l.id}
              className={`length-card ${selected === l.id ? 'active' : ''}`}
              onClick={() => onSelect(l.id)}
            >
              <div className={`nail-vis ${l.vis}`}>
                <div className="nail-bar" />
                <div className="nail-bar" />
                <div className="nail-bar" />
              </div>
              <div className="length-info">
                <div className="length-name">{l.name}</div>
                <div className="length-sub">{l.sub}</div>
              </div>
              <div className="length-radio">
                <div className="length-radio-dot" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ---- Step: Budget ---- */

function BudgetStep({ selected, onSelect }) {
  return (
    <>
      <h2 className="step-q">What's your budget?</h2>
      <p className="step-hint">Per appointment, roughly speaking</p>
      <div className="step-content">
        <div className="budget-grid">
          {BUDGETS.map(b => (
            <div
              key={b.id}
              className={`budget-card ${b.full ? 'full' : ''} ${selected === b.id ? 'active' : ''}`}
              onClick={() => onSelect(b.id)}
            >
              <div className="budget-emoji">{b.emoji}</div>
              <div>
                <div className="budget-range">{b.range}</div>
                <div className="budget-label">{b.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ---- Complete Screen ---- */

function CompleteScreen({ data, onComplete }) {
  const styles  = NAIL_STYLES.filter(s => data.styles.includes(s.id))
  const length  = NAIL_LENGTHS.find(l => l.id === data.length)
  const budget  = BUDGETS.find(b => b.id === data.budget)

  return (
    <div className="screen complete">
      <div className="complete-icon">💅</div>

      <h2 className="complete-title">You're all set,<br />{data.name}!</h2>
      <p className="complete-sub">
        We're curating your perfect nail tech matches<br />
        in {data.city} right now.
      </p>

      <div className="complete-card">
        <div className="summary-row">
          <span className="summary-icon">📍</span>
          <div className="summary-text">
            <div className="summary-label">Location</div>
            <div className="summary-val">{data.city}</div>
          </div>
        </div>
        <div className="summary-row">
          <span className="summary-icon">✨</span>
          <div className="summary-text">
            <div className="summary-label">Styles</div>
            <div className="summary-val">{styles.map(s => s.name).join(', ')}</div>
          </div>
        </div>
        <div className="summary-row">
          <span className="summary-icon">💅</span>
          <div className="summary-text">
            <div className="summary-label">Nail Length</div>
            <div className="summary-val">{length?.name}</div>
          </div>
        </div>
        <div className="summary-row">
          <span className="summary-icon">💰</span>
          <div className="summary-text">
            <div className="summary-label">Budget</div>
            <div className="summary-val">{budget?.range}</div>
          </div>
        </div>
      </div>

      <div className="complete-actions">
        <button
          className="btn-primary"
          onClick={() => onComplete({
            name:   data.name,
            city:   data.city,
            styles: NAIL_STYLES.filter(s => data.styles.includes(s.id)).map(s => s.name),
            length: NAIL_LENGTHS.find(l => l.id === data.length)?.name ?? '',
            budget: BUDGETS.find(b => b.id === data.budget)?.range ?? '',
          })}
        >
          Explore Nail Techs ✨
        </button>
      </div>
    </div>
  )
}
