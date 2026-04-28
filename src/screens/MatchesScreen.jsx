/* ── Match data ─────────────────────────────────────────────── */

export const ALL_MATCHES = [
  {
    id: 1,
    name: 'Aria Monroe',
    location: 'West Hollywood, CA',
    g: ['#f9c5d1', '#e8758a'],
    icon: '💅',
    isNew: true,
    lastMsg: null,
    time: null,
    unread: false,
  },
  {
    id: 4,
    name: 'Mei Nakamura',
    location: 'Seattle, WA',
    g: ['#ffc8dd', '#ff85a1'],
    icon: '🎀',
    isNew: true,
    lastMsg: null,
    time: null,
    unread: false,
  },
  {
    id: 2,
    name: 'Jade Voss',
    location: 'Brooklyn, NY',
    g: ['#2d1b3d', '#4a2560'],
    icon: '🖤',
    isNew: false,
    lastMsg: "I think we'd be a perfect match ✨",
    time: '2m',
    unread: true,
  },
  {
    id: 3,
    name: 'Chloe Tan',
    location: 'Miami, FL',
    g: ['#ffd700', '#e8a800'],
    icon: '👑',
    isNew: false,
    lastMsg: "Can't wait to see you on Saturday! 💕",
    time: '1h',
    unread: false,
  },
  {
    id: 5,
    name: 'Raven Ellis',
    location: 'Austin, TX',
    g: ['#dde0f5', '#b8c0ee'],
    icon: '🪞',
    isNew: false,
    lastMsg: "Sounds good! I'll send you the booking link",
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 6,
    name: 'Solène Dubois',
    location: 'Chicago, IL',
    g: ['#e8e0d8', '#d4c8be'],
    icon: '🤍',
    isNew: false,
    lastMsg: 'Your moodboard is gorgeous, I love the clean aesthetic',
    time: '3d',
    unread: false,
  },
]

/* ── Helpers ─────────────────────────────────────────────────── */

function Avatar({ match, size = 64 }) {
  return (
    <div
      className="match-avatar"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${match.g[0]}, ${match.g[1]})`,
      }}
    >
      <span style={{ fontSize: size * 0.38 }}>{match.icon}</span>
    </div>
  )
}

/* ── Screen ──────────────────────────────────────────────────── */

export default function MatchesScreen({ onChat }) {
  const newMatches  = ALL_MATCHES.filter((m) => m.isNew)
  const threads     = ALL_MATCHES.filter((m) => !m.isNew)

  return (
    <div className="screen matches-screen">

      {/* Header */}
      <div className="matches-header">
        <h1 className="matches-title">Matches</h1>
        <span className="matches-count">{ALL_MATCHES.length} matches</span>
      </div>

      <div className="matches-body">

        {/* ── New Matches row ── */}
        <div className="new-matches-section">
          <p className="section-eyebrow">New Matches</p>
          <div className="new-matches-row">
            {ALL_MATCHES.map((m) => (
              <button
                key={m.id}
                className={`story-btn ${m.isNew ? 'story-new' : 'story-seen'}`}
                onClick={() => onChat(m)}
                aria-label={`Chat with ${m.name}`}
              >
                <div className="story-ring">
                  <Avatar match={m} size={62} />
                </div>
                <span className="story-name">{m.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="matches-divider" />

        {/* ── Message threads ── */}
        <div className="threads-section">
          <p className="section-eyebrow">Messages</p>
          <div className="thread-list">
            {threads.map((m) => (
              <button
                key={m.id}
                className={`thread-row ${m.unread ? 'thread-unread' : ''}`}
                onClick={() => onChat(m)}
              >
                {/* Avatar with online dot */}
                <div className="thread-avatar-wrap">
                  <Avatar match={m} size={54} />
                  {m.unread && <span className="thread-online-dot" />}
                </div>

                {/* Text */}
                <div className="thread-text">
                  <div className="thread-name-row">
                    <span className="thread-name">{m.name}</span>
                    <span className="thread-time">{m.time}</span>
                  </div>
                  <div className="thread-preview-row">
                    <span className="thread-preview">{m.lastMsg}</span>
                    {m.unread && <span className="thread-unread-dot" />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
