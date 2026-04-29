/* ── Client-facing full tech profile ──────────────────── */

const VIBE_TAG_LABELS = {
  clean:  'So clean ✨',
  exact:  'Exactly what I wanted 💅',
  art:    'Amazing art 🎨',
  pro:    'Very professional 🤍',
  rebook: 'Would rebook ⭐',
}

/* Extended portfolio + reviews per tech id */
const TECH_DATA = {
  1: {
    tiles: [
      { bg:'linear-gradient(135deg,#f9c5d1,#e8758a)', emoji:'💎' },
      { bg:'linear-gradient(135deg,#e8d5f5,#c4a8e8)', emoji:'🪞' },
      { bg:'linear-gradient(135deg,#fde8b8,#f5c870)', emoji:'✨' },
      { bg:'linear-gradient(135deg,#c8eef4,#8dd5e8)', emoji:'🌸' },
      { bg:'linear-gradient(135deg,#fde0e8,#f5c6d5)', emoji:'💅' },
      { bg:'linear-gradient(135deg,#d5eaf5,#b8d8f0)', emoji:'🎀' },
      { bg:'linear-gradient(135deg,#f5ead5,#f0d8b8)', emoji:'🌟' },
      { bg:'linear-gradient(135deg,#e8d5f5,#d5b8f0)', emoji:'💫' },
      { bg:'linear-gradient(135deg,#fde8f5,#f5c6e8)', emoji:'🌷' },
    ],
    starBreakdown: { 5:80, 4:28, 3:15, 2:4, 1:1 },
    reviews: [
      { id:1, client:'Emma',  stars:5, date:'Apr 20', tags:['clean','exact'],  text:'Aria is absolutely incredible. My nails were perfection — lasted 4 full weeks.' },
      { id:2, client:'Kayla', stars:5, date:'Apr 12', tags:['rebook','pro'],   text:'So professional, so skilled. Already booked my next appointment!' },
      { id:3, client:'Jess',  stars:4, date:'Mar 30', tags:['clean'],          text:'Beautiful clean set, really listened to what I wanted.' },
      { id:4, client:'Zoe',   stars:5, date:'Mar 18', tags:['exact','rebook'], text:'She understood my vision from my inspo board instantly. Truly gifted.' },
    ],
  },
  2: {
    tiles: [
      { bg:'linear-gradient(135deg,#2d1b3d,#4a2560)', emoji:'🖤' },
      { bg:'linear-gradient(135deg,#1a2a1a,#2d4a2d)', emoji:'🌙' },
      { bg:'linear-gradient(135deg,#3d1a2a,#6a2040)', emoji:'🕷️' },
      { bg:'linear-gradient(135deg,#1a1a2d,#2d2a50)', emoji:'⭐' },
      { bg:'linear-gradient(135deg,#2a1a3d,#50304a)', emoji:'🌑' },
      { bg:'linear-gradient(135deg,#1a2a2d,#2d4a50)', emoji:'🔮' },
    ],
    starBreakdown: { 5:62, 4:22, 3:8, 2:2, 1:0 },
    reviews: [
      { id:1, client:'Violet', stars:5, date:'Apr 19', tags:['art','pro'],   text:'Jade understood my vision immediately. The witchy set was absolutely EVERYTHING.' },
      { id:2, client:'Nyx',    stars:5, date:'Apr 10', tags:['art','exact'], text:'No one does dark nails like Jade. I\'m obsessed every single time.' },
      { id:3, client:'Sam',    stars:4, date:'Mar 22', tags:['pro'],         text:'Very talented. Intricate work that holds up really well.' },
    ],
  },
  3: {
    tiles: [
      { bg:'linear-gradient(135deg,#ffd700,#e8a800)', emoji:'👑' },
      { bg:'linear-gradient(135deg,#ff85a1,#ee3a6d)', emoji:'💅' },
      { bg:'linear-gradient(135deg,#c8c8d4,#a0a0b8)', emoji:'✨' },
      { bg:'linear-gradient(135deg,#ffb347,#e87820)', emoji:'💎' },
      { bg:'linear-gradient(135deg,#ff9ee5,#f060c0)', emoji:'🌸' },
      { bg:'linear-gradient(135deg,#ffd700,#ffa500)', emoji:'⭐' },
      { bg:'linear-gradient(135deg,#e8b4f8,#c880e8)', emoji:'🦄' },
      { bg:'linear-gradient(135deg,#ffcfe8,#ff85a1)', emoji:'🎀' },
    ],
    starBreakdown: { 5:155, 4:42, 3:12, 2:3, 1:0 },
    reviews: [
      { id:1, client:'Destiny', stars:5, date:'Apr 22', tags:['exact','rebook'],        text:'Chloe understood "extra" and delivered. My nails are giving main character energy.' },
      { id:2, client:'Tori',    stars:5, date:'Apr 15', tags:['art','pro','clean'],      text:'The rhinestone work was INSANE. Everyone at the event was asking about my nails.' },
      { id:3, client:'Paris',   stars:5, date:'Apr 02', tags:['rebook','exact'],         text:'Has ruined me for all other nail techs. Best investment I make every month.' },
      { id:4, client:'Bri',     stars:4, date:'Mar 28', tags:['clean'],                 text:'Gorgeous set. A bit longer wait than expected but absolutely worth it.' },
    ],
  },
  4: {
    tiles: [
      { bg:'linear-gradient(135deg,#ffc8dd,#ff85a1)', emoji:'🎀' },
      { bg:'linear-gradient(135deg,#bde0fe,#85c8f8)', emoji:'🌷' },
      { bg:'linear-gradient(135deg,#cdb4db,#b890d0)', emoji:'🍓' },
      { bg:'linear-gradient(135deg,#ffd7b5,#f5b880)', emoji:'🐰' },
      { bg:'linear-gradient(135deg,#f9c5d1,#e8758a)', emoji:'💕' },
      { bg:'linear-gradient(135deg,#e8f4ff,#c0d8f8)', emoji:'🌸' },
    ],
    starBreakdown: { 5:44, 4:16, 3:5, 2:2, 1:0 },
    reviews: [
      { id:1, client:'Hana',  stars:5, date:'Apr 16', tags:['exact','clean'], text:'Mei\'s kawaii sets are the cutest I\'ve ever seen. She nails the aesthetic every time.' },
      { id:2, client:'Lily',  stars:5, date:'Apr 04', tags:['rebook','art'],  text:'So talented and sweet. My pastel set was exactly what I dreamed of.' },
      { id:3, client:'Grace', stars:4, date:'Mar 20', tags:['pro'],           text:'Really professional and detailed. Great experience overall!' },
    ],
  },
  5: {
    tiles: [
      { bg:'linear-gradient(135deg,#dde0f5,#b8c0ee)', emoji:'🪞' },
      { bg:'linear-gradient(135deg,#f0e0ff,#d4b8f5)', emoji:'💜' },
      { bg:'linear-gradient(135deg,#ddf5f5,#b8e8ee)', emoji:'✨' },
      { bg:'linear-gradient(135deg,#f8f0ff,#e0d0f8)', emoji:'🌟' },
      { bg:'linear-gradient(135deg,#e8f0ff,#c8d8f8)', emoji:'🪄' },
      { bg:'linear-gradient(135deg,#f0f8ff,#d0e8f8)', emoji:'💫' },
    ],
    starBreakdown: { 5:110, 4:32, 3:12, 2:4, 1:0 },
    reviews: [
      { id:1, client:'Mia',   stars:5, date:'Apr 24', tags:['clean','exact'],  text:'Raven\'s glazed chrome sets are genuinely unreal. Like liquid glass.' },
      { id:2, client:'Zara',  stars:5, date:'Apr 15', tags:['art','rebook'],   text:'I\'ve never had nails this shiny. She\'s a wizard.' },
      { id:3, client:'Jade',  stars:5, date:'Apr 01', tags:['pro','clean'],    text:'So precise and clean. Exactly the glassy look I was going for.' },
      { id:4, client:'Nova',  stars:4, date:'Mar 22', tags:['exact'],          text:'Beautiful chrome set. Lasted way longer than expected!' },
    ],
  },
  6: {
    tiles: [
      { bg:'linear-gradient(135deg,#fdf8f5,#f0e8e0)', emoji:'🤍' },
      { bg:'linear-gradient(135deg,#f0ece8,#e0d5cc)', emoji:'✦' },
      { bg:'linear-gradient(135deg,#fdf0f3,#f5d5de)', emoji:'🌸' },
      { bg:'linear-gradient(135deg,#e8f0ec,#c8ddd5)', emoji:'🍃' },
      { bg:'linear-gradient(135deg,#fdf8f5,#ede0d8)', emoji:'🕊️' },
    ],
    starBreakdown: { 5:25, 4:12, 3:5, 2:1, 1:0 },
    reviews: [
      { id:1, client:'Claire', stars:5, date:'Apr 18', tags:['clean','pro'],  text:'Solène\'s minimalist French tips are the most elegant nails I\'ve ever had.' },
      { id:2, client:'Marie',  stars:4, date:'Apr 07', tags:['clean'],        text:'So clean and precise. Perfect for a professional setting.' },
      { id:3, client:'Elise',  stars:5, date:'Mar 28', tags:['exact','pro'],  text:'Understands quiet luxury better than anyone.' },
    ],
  },
}

export default function TechProfileScreen({ tech, onBack, onBook }) {
  if (!tech) return null

  const data         = TECH_DATA[tech.id] ?? {}
  const tiles        = data.tiles ?? tech.tiles?.map(t => ({ bg:`linear-gradient(135deg,${t.g[0]},${t.g[1]})`, emoji: t.icon })) ?? []
  const reviews      = data.reviews ?? []
  const breakdown    = data.starBreakdown ?? {}
  const totalReviews = Object.values(breakdown).reduce((a, b) => a + b, 0) || tech.reviews
  const maxCount     = Object.values(breakdown).length > 0 ? Math.max(...Object.values(breakdown)) : 0
  const specialties  = tech.specialties ?? []
  const rating       = tech.rating ?? '–'

  return (
    <div className="screen tech-profile-screen">

      {/* Scrollable body */}
      <div className="tech-profile-scroll">

        {/* Back */}
        <div className="tech-profile-nav">
          <button className="btn-ghost" onClick={onBack}>← Back</button>
        </div>

        {/* Hero */}
        <div className="tech-profile-hero">
          <div className="tech-profile-pfp">{tech.pfp ?? tech.icon}</div>
          <h1 className="tech-profile-name">{tech.name}</h1>
          <p className="tech-profile-loc">📍 {tech.location}</p>
          <div className="tech-profile-rating-row">
            <span className="tech-profile-rating-num">{rating}</span>
            <span className="nt-star-gold" style={{ fontSize:'1.1rem' }}>★</span>
            <span className="tech-profile-review-count">· {totalReviews} reviews</span>
          </div>
        </div>

        {/* Specialties */}
        {specialties.length > 0 && (
          <div className="tech-profile-section">
            <div className="tech-profile-tags">
              {specialties.map(s => <span key={s} className="tech-profile-tag">{s}</span>)}
            </div>
          </div>
        )}

        {/* Bio */}
        {tech.bio && (
          <div className="tech-profile-section">
            <p className="tech-profile-bio">{tech.bio}</p>
          </div>
        )}

        {/* Portfolio */}
        <div className="tech-profile-section">
          <h2 className="tech-profile-sect-title">Portfolio</h2>
          <div className="tech-profile-portfolio-grid">
            {tiles.map((tile, i) => (
              <div key={i} className="tech-profile-portfolio-tile" style={{ background: tile.bg }}>
                <span className="tech-profile-portfolio-emoji">{tile.emoji}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="tech-profile-section">
          <h2 className="tech-profile-sect-title">Services & Pricing</h2>
          <div className="tech-profile-services">
            {tech.price && (
              <div className="tech-profile-svc-row tech-profile-svc-featured">
                <div className="tech-profile-svc-name">Sets starting from</div>
                <div className="tech-profile-svc-price">${tech.price}</div>
              </div>
            )}
            {specialties.map(s => (
              <div key={s} className="tech-profile-svc-row">
                <div className="tech-profile-svc-name">{s}</div>
                <div className="tech-profile-svc-avail">Available ✓</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="tech-profile-section">
          <h2 className="tech-profile-sect-title">Reviews</h2>

          {/* Rating hero */}
          <div className="tech-profile-rating-hero">
            <div className="tech-profile-avg-big">{rating}</div>
            <div className="tech-profile-avg-stars">
              {[1,2,3,4,5].map(n => (
                <span key={n} className={+rating >= n ? 'nt-star-gold' : 'nt-star-dim'}>★</span>
              ))}
            </div>
            <div className="tech-profile-total-reviews">{totalReviews} reviews</div>
          </div>

          {/* Star breakdown */}
          {maxCount > 0 && (
            <div className="nt-star-breakdown" style={{ margin:'12px 0 20px', padding:'0' }}>
              {[5,4,3,2,1].map(n => {
                const count = breakdown[n] ?? 0
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
          )}

          {/* Review cards */}
          <div className="nt-review-list" style={{ padding:'0' }}>
            {reviews.map(review => (
              <div key={review.id} className="nt-review-card">
                <div className="nt-review-card-head">
                  <div className="nt-review-avatar" style={{ fontSize:'1rem' }}>
                    {review.client[0]}
                  </div>
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
                {review.tags?.length > 0 && (
                  <div className="nt-review-tags">
                    {review.tags.map(t => <span key={t} className="nt-review-tag">{VIBE_TAG_LABELS[t]}</span>)}
                  </div>
                )}
                {review.text && <p className="nt-review-text">"{review.text}"</p>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 96 }} />
      </div>

      {/* Sticky Book Now */}
      <div className="tech-profile-footer">
        {tech.price && <div className="tech-profile-footer-price">from ${tech.price}</div>}
        <button
          className="tech-profile-book-btn"
          onClick={() => onBook?.({ name: tech.name, location: tech.location, g: tech.tiles?.[0]?.g ?? ['#f9c5d1','#e8758a'], icon: tech.pfp ?? tech.icon, specialties: tech.specialties })}
        >
          Book Now ✨
        </button>
      </div>
    </div>
  )
}
