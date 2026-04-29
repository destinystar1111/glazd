import { useState } from 'react'

/* ── Constants ─────────────────────────────────────────── */

const VIBE_EMOJI_MAP = {
  glam: '💎', witchy: '🖤', minimal: '✨', softgirl: '🎀',
  character: '🎨', chrome: '🪞', bridal: '🤍', bold: '🌶️',
}

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

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const VIBE_TAG_LABELS = {
  clean:  'So clean ✨',
  exact:  'Exactly what I wanted 💅',
  art:    'Amazing art 🎨',
  pro:    'Very professional 🤍',
  rebook: 'Would rebook ⭐',
}

const STAR_BREAKDOWN = { 5: 38, 4: 7, 3: 2, 2: 0, 1: 0 }

const MOCK_REVIEWS = [
  { id:1, client:'Mia T.',     avatar:'🌸', stars:5, date:'Apr 28', tags:['clean','exact','rebook'], text:'Absolutely obsessed with my new set! She got exactly what I wanted from my inspo photos.' },
  { id:2, client:'Jade R.',    avatar:'💜', stars:5, date:'Apr 22', tags:['art','pro'],               text:'The character art was UNREAL. Felt so seen and valued the whole time 🖤' },
  { id:3, client:'Sofia K.',   avatar:'✨', stars:4, date:'Apr 15', tags:['clean','rebook'],          text:'Love the PolyGel set. Clean, fast, professional. Definitely coming back!' },
  { id:4, client:'Aaliyah M.', avatar:'🎀', stars:5, date:'Apr 10', tags:['exact','rebook','clean'],  text:'Literally my fave nail tech in the city. Attention to detail is everything 🤍' },
  { id:5, client:'Nova W.',    avatar:'🌷', stars:5, date:'Mar 28', tags:['pro','art'],               text:'' },
  { id:6, client:'Priya S.',   avatar:'💎', stars:5, date:'Mar 20', tags:['clean','rebook'],          text:'So professional and gentle. My nails have never looked this good!' },
  { id:7, client:'Cleo M.',    avatar:'🦋', stars:4, date:'Mar 08', tags:['exact'],                   text:'Beautiful work, really listened to what I wanted.' },
]

const FALLBACK_TILES = [
  { bg:'linear-gradient(135deg,#fde0e8,#f5c6d5)', emoji:'💅' },
  { bg:'linear-gradient(135deg,#e8d5f5,#d5b8f0)', emoji:'💎' },
  { bg:'linear-gradient(135deg,#d5eaf5,#b8d8f0)', emoji:'🎨' },
  { bg:'linear-gradient(135deg,#f5ead5,#f0d8b8)', emoji:'🪞' },
  { bg:'linear-gradient(135deg,#fde8f5,#f5c6e8)', emoji:'🌸' },
  { bg:'linear-gradient(135deg,#e0f5e8,#c6f0d5)', emoji:'✨' },
  { bg:'linear-gradient(135deg,#f5f0d5,#f0e8b8)', emoji:'🌟' },
  { bg:'linear-gradient(135deg,#f5d5e8,#f0b8d5)', emoji:'🎀' },
  { bg:'linear-gradient(135deg,#dde8f5,#c8d8f0)', emoji:'🪄' },
]

/* ── Edit Profile Sub-view ──────────────────────────────── */

function EditNTProfile({ initData, onSave, onBack }) {
  const [name,     setName]     = useState(initData.name)
  const [bizName,  setBizName]  = useState(initData.businessName)
  const [location, setLocation] = useState(initData.location)
  const [bio,      setBio]      = useState(initData.bio)
  const [vibes,    setVibes]    = useState(new Set(initData.vibes))
  const [services, setServices] = useState(initData.services.map(s => ({ ...s })))
  const [schedule, setSchedule] = useState({ ...initData.schedule })
  const [saved,    setSaved]    = useState(false)

  const toggleVibe = (id) => setVibes(prev => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next
  })

  const toggleDay = (day) => setSchedule(prev => ({
    ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled }
  }))

  const updateSvc = (id, key, val) =>
    setServices(prev => prev.map(s => s.id === id ? { ...s, [key]: val } : s))

  const addSvc = () => setServices(prev => [
    ...prev, { id: Date.now(), name: '', duration: 60, price: 0 }
  ])

  const removeSvc = (id) => setServices(prev => prev.filter(s => s.id !== id))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => {
      onSave({ name, businessName: bizName, location, bio, vibes: [...vibes], services, schedule })
    }, 700)
  }

  const canSave = name.trim().length > 0 && location.trim().length > 0

  return (
    <div className="nt-edit-view">
      <div className="nt-edit-header">
        <button className="nt-edit-back" onClick={onBack}>← Back</button>
        <h2 className="nt-edit-title">Edit Profile</h2>
        <div style={{ width: 60 }} />
      </div>

      <div className="nt-edit-body">

        {/* Basic Info */}
        <p className="nt-edit-section-label">Basic Info</p>
        <label className="nt-edit-label">Name</label>
        <input className="nt-edit-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoFocus />

        <label className="nt-edit-label">Business / Studio Name</label>
        <input className="nt-edit-input" value={bizName} onChange={e => setBizName(e.target.value)} placeholder="Optional" />

        <label className="nt-edit-label">Location</label>
        <input className="nt-edit-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="City, State" />

        {/* Bio */}
        <p className="nt-edit-section-label" style={{ marginTop: 20 }}>Philosophy</p>
        <textarea
          className="nt-edit-textarea"
          value={bio}
          onChange={e => setBio(e.target.value)}
          placeholder="My nail philosophy is..."
          rows={4}
          maxLength={280}
        />
        <p className="nt-edit-char-count">{bio.length} / 280</p>

        {/* Vibes */}
        <p className="nt-edit-section-label">Your Vibe</p>
        <div className="nt-edit-vibe-grid">
          {VIBE_OPTIONS.map(v => (
            <button
              key={v.id}
              className={`nt-edit-vibe-chip ${vibes.has(v.id) ? 'active' : ''}`}
              onClick={() => toggleVibe(v.id)}
            >
              {v.emoji} {v.name}
            </button>
          ))}
        </div>

        {/* Services */}
        <p className="nt-edit-section-label">Services & Pricing</p>
        <div className="nt-edit-services">
          {services.map(svc => (
            <div key={svc.id} className="nt-edit-svc-row">
              <div className="nt-edit-svc-top">
                <input
                  className="nt-edit-svc-name"
                  value={svc.name}
                  onChange={e => updateSvc(svc.id, 'name', e.target.value)}
                  placeholder="Service name"
                />
                <button className="nt-edit-svc-del" onClick={() => removeSvc(svc.id)}>✕</button>
              </div>
              <div className="nt-edit-svc-meta">
                <span className="nt-edit-svc-pre">⏱</span>
                <input
                  className="nt-edit-svc-num"
                  type="number" value={svc.duration} min={15} max={300} step={15}
                  onChange={e => updateSvc(svc.id, 'duration', +e.target.value)}
                />
                <span className="nt-edit-svc-unit">min</span>
                <span className="nt-edit-svc-pre" style={{ marginLeft: 12 }}>$</span>
                <input
                  className="nt-edit-svc-num"
                  type="number" value={svc.price} min={0} max={999}
                  onChange={e => updateSvc(svc.id, 'price', +e.target.value)}
                />
              </div>
            </div>
          ))}
          <button className="nt-edit-add-svc" onClick={addSvc}>+ Add Service</button>
        </div>

        {/* Availability */}
        <p className="nt-edit-section-label">Availability</p>
        <div className="nt-edit-days">
          {DAYS.map(day => (
            <button
              key={day}
              className={`nt-edit-day-btn ${schedule[day]?.enabled ? 'on' : ''}`}
              onClick={() => toggleDay(day)}
            >
              {day}
            </button>
          ))}
        </div>

        <button
          className={`nt-edit-save-btn ${saved ? 'saved' : ''}`}
          onClick={handleSave}
          disabled={!canSave}
        >
          {saved ? 'Saved ✓' : 'Save Profile'}
        </button>

        <div style={{ height: 40 }} />
      </div>
    </div>
  )
}

/* ── Screen ────────────────────────────────────────────── */

export default function NailTechProfile({ profile, avgRating }) {
  const [editing, setEditing] = useState(false)
  const [localProfile, setLocalProfile] = useState(null)

  const src = localProfile ?? profile

  const displayRating = avgRating ?? '4.9'
  const name      = src?.name         || 'Your Name'
  const bizName   = src?.businessName || 'Glazd Studio'
  const location  = src?.location     || 'Los Angeles, CA'
  const bio       = src?.bio          || 'Every set tells a story. Let me tell yours — from concept to cuticle, I create nail art that\'s uniquely you.'
  const vibes     = (src?.vibes       || ['glam', 'softgirl', 'chrome', 'character']).slice(0, 6)
  const services  = src?.services     || [
    { id:1, name:'Builder Gel',   duration:60, price:65 },
    { id:2, name:'PolyGel',       duration:75, price:75 },
    { id:3, name:'Fill',          duration:45, price:45 },
    { id:4, name:'Character Art', duration:90, price:95 },
  ]
  const schedule  = src?.schedule     || {
    Mon:{enabled:true}, Tue:{enabled:true}, Wed:{enabled:true},
    Thu:{enabled:true}, Fri:{enabled:true}, Sat:{enabled:false}, Sun:{enabled:false},
  }
  const activeDays = Object.entries(schedule)
    .filter(([, v]) => v.enabled)
    .map(([k]) => k)

  // Portfolio tiles
  const portfolio   = profile?.portfolio   ?? []
  const coverPhotos = profile?.coverPhotos ?? []
  const filledSlots = coverPhotos.length > 0
    ? coverPhotos.map(i => portfolio[i]).filter(Boolean)
    : portfolio.filter(Boolean)
  const displayTiles = filledSlots.length > 0
    ? [...filledSlots, ...FALLBACK_TILES].slice(0, 12)
    : FALLBACK_TILES

  const totalReviews = Object.values(STAR_BREAKDOWN).reduce((a, b) => a + b, 0)
  const maxCount     = Math.max(...Object.values(STAR_BREAKDOWN))

  if (editing) {
    return (
      <div className="nt-sub-screen">
        <EditNTProfile
          initData={{ name, businessName: bizName, location, bio, vibes, services, schedule }}
          onSave={(updated) => { setLocalProfile(updated); setEditing(false) }}
          onBack={() => setEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className="nt-sub-screen nt-profile-screen">

      {/* ── Hero ── */}
      <div className="nt-profile-hero">
        <div className="nt-profile-hero-avatar">💅</div>
        <h1 className="nt-profile-hero-name">{name}</h1>
        <p className="nt-profile-hero-biz">{bizName}</p>
        <p className="nt-profile-hero-loc">📍 {location}</p>
        <div className="nt-profile-hero-rating">
          <span className="nt-profile-rating-num">{displayRating}</span>
          <span className="nt-star-gold" style={{ fontSize:'1.1rem' }}>★</span>
          <span className="nt-profile-rating-count">· {totalReviews} reviews</span>
        </div>
        <button className="nt-profile-edit-btn" onClick={() => setEditing(true)}>
          ✏️ Edit Profile
        </button>
      </div>

      {/* ── Vibe tags ── */}
      <div className="nt-profile-section">
        <div className="nt-profile-vibes">
          {vibes.map(v => (
            <span key={v} className="nt-profile-vibe-tag">
              {VIBE_EMOJI_MAP[v] ?? '✨'} {v.charAt(0).toUpperCase() + v.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {/* ── Bio ── */}
      <div className="nt-profile-section">
        <p className="nt-profile-bio">"{bio}"</p>
      </div>

      {/* ── Portfolio ── */}
      <div className="nt-profile-section">
        <h2 className="nt-profile-sect-title">Portfolio</h2>
        <div className="nt-profile-portfolio-grid">
          {displayTiles.map((tile, i) => (
            <div key={i} className="nt-profile-portfolio-tile" style={{ background: tile.bg }}>
              <span className="nt-profile-portfolio-emoji">{tile.emoji}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Services ── */}
      <div className="nt-profile-section">
        <h2 className="nt-profile-sect-title">Services & Pricing</h2>
        <div className="nt-profile-services">
          {services.filter(s => s.name?.trim()).map(svc => (
            <div key={svc.id} className="nt-profile-svc-row">
              <div className="nt-profile-svc-name">{svc.name}</div>
              <div className="nt-profile-svc-meta">
                <span className="nt-profile-svc-dur">{svc.duration} min</span>
                <span className="nt-profile-svc-price">${svc.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Availability ── */}
      <div className="nt-profile-section">
        <h2 className="nt-profile-sect-title">Availability</h2>
        <div className="nt-profile-days">
          {activeDays.map(day => (
            <span key={day} className="nt-profile-day-pill">{day}</span>
          ))}
        </div>
      </div>

      {/* ── Reviews ── */}
      <div className="nt-profile-section">
        <h2 className="nt-profile-sect-title">Reviews</h2>

        <div className="nt-profile-rating-hero">
          <div className="nt-profile-avg-big">{displayRating}</div>
          <div className="nt-profile-avg-stars">
            {[1,2,3,4,5].map(n => (
              <span key={n} className={+displayRating >= n ? 'nt-star-gold' : 'nt-star-dim'}>★</span>
            ))}
          </div>
          <div className="nt-profile-review-count">{totalReviews} reviews</div>
        </div>

        <div className="nt-star-breakdown" style={{ margin:'12px 0 20px', padding:'0' }}>
          {[5,4,3,2,1].map(n => {
            const count = STAR_BREAKDOWN[n] ?? 0
            const pct   = maxCount > 0 ? (count / maxCount) * 100 : 0
            return (
              <div key={n} className="nt-breakdown-row">
                <span className="nt-breakdown-label">{n}★</span>
                <div className="nt-breakdown-track">
                  <div className="nt-breakdown-fill" style={{ width:`${pct}%`, opacity: count > 0 ? 1 : 0.2 }} />
                </div>
                <span className="nt-breakdown-count">{count}</span>
              </div>
            )
          })}
        </div>

        <div className="nt-review-list" style={{ padding:'0' }}>
          {MOCK_REVIEWS.map(review => (
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
                  {review.tags.map(t => <span key={t} className="nt-review-tag">{VIBE_TAG_LABELS[t]}</span>)}
                </div>
              )}
              {review.text && <p className="nt-review-text">"{review.text}"</p>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 24 }} />
    </div>
  )
}
