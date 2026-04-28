import { useState } from 'react'

/* ── Data ──────────────────────────────────────────────── */

const VIBE_TAGS = [
  { id: 'clean',   label: 'So clean',              emoji: '✨' },
  { id: 'exact',   label: 'Exactly what I wanted', emoji: '💅' },
  { id: 'art',     label: 'Amazing art',            emoji: '🎨' },
  { id: 'pro',     label: 'Very professional',      emoji: '🤍' },
  { id: 'rebook',  label: 'Would rebook',           emoji: '⭐' },
]

const STAR_LABELS = ['', 'Disappointing', 'Could be better', 'Good', 'Really great!', 'Absolutely amazing! 🌟']

/* ── Main Screen ───────────────────────────────────────── */

export default function RatingScreen({ tech, onBack, onSubmit }) {
  const [stars,     setStars]     = useState(0)
  const [hovered,   setHovered]   = useState(0)
  const [tags,      setTags]      = useState([])
  const [review,    setReview]    = useState('')
  const [submitted, setSubmitted] = useState(false)

  const toggleTag = (id) =>
    setTags(t => t.includes(id) ? t.filter(x => x !== id) : [...t, id])

  const handleSubmit = () => {
    if (!stars) return
    setSubmitted(true)
    setTimeout(() => onSubmit({ stars, tags, review }), 1800)
  }

  const techFirstName = tech?.name?.split(' ')[0] ?? 'your nail tech'
  const displayStars  = hovered || stars

  if (submitted) {
    return (
      <div className="screen rating-success">
        <div className="rating-success-icon">🌟</div>
        <h2 className="rating-success-title">Thank you!</h2>
        <p className="rating-success-sub">
          Your review helps {techFirstName} grow 💕
        </p>
        <div className="rating-success-stars">
          {[...Array(stars)].map((_, i) => (
            <span key={i} className="rating-success-star">★</span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="screen rating-screen">

      {/* Header */}
      <div className="rating-header">
        <button className="btn-ghost" onClick={onBack}>← Back</button>
      </div>

      {/* Scrollable body */}
      <div className="rating-body">

        {/* Tech avatar */}
        <div
          className="rating-tech-avatar"
          style={tech?.g ? {
            background: `linear-gradient(135deg, ${tech.g[0]}, ${tech.g[1]})`,
          } : {}}
        >
          <span>{tech?.icon ?? '💅'}</span>
        </div>

        <h2 className="rating-title">How was your experience?</h2>
        <p className="rating-sub">Rate your session with {techFirstName}</p>

        {/* Stars */}
        <div
          className="rating-stars"
          onMouseLeave={() => setHovered(0)}
        >
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              className={`rating-star ${displayStars >= n ? 'active' : ''}`}
              onClick={() => setStars(n)}
              onMouseEnter={() => setHovered(n)}
            >
              ★
            </button>
          ))}
        </div>

        <p className="rating-stars-label">
          {displayStars > 0 ? STAR_LABELS[displayStars] : 'Tap to rate'}
        </p>

        {/* Vibe tags */}
        <div className="rating-tags-wrap">
          <p className="rating-tags-label">What stood out?</p>
          <div className="rating-tags">
            {VIBE_TAGS.map(t => (
              <button
                key={t.id}
                className={`rating-tag ${tags.includes(t.id) ? 'active' : ''}`}
                onClick={() => toggleTag(t.id)}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Written review */}
        <div className="rating-review-wrap">
          <p className="rating-review-label">Leave a note (optional)</p>
          <textarea
            className="rating-review-input"
            placeholder={`Tell ${techFirstName} what you loved about your session...`}
            value={review}
            onChange={e => setReview(e.target.value)}
            rows={3}
            maxLength={300}
          />
          {review.length > 0 && (
            <div className="rating-review-count">{review.length} / 300</div>
          )}
        </div>

      </div>

      {/* Sticky footer */}
      <div className="rating-footer">
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={!stars}
        >
          Submit Review ✨
        </button>
      </div>

    </div>
  )
}
