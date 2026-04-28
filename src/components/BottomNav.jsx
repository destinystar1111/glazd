const TABS = [
  {
    id: 'discover',
    label: 'Discover',
    Icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        {/* 4-point sparkle */}
        <path d="M12 2l1.8 7.2L21 12l-7.2 1.8L12 22l-1.8-7.2L3 12l7.2-1.8L12 2z" />
      </svg>
    ),
  },
  {
    id: 'matches',
    label: 'Matches',
    Icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  },
  {
    id: 'moodboard',
    label: 'Moodboard',
    Icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        {/* 2×2 grid / moodboard */}
        <rect x="3"  y="3"  width="8" height="8" rx="2" />
        <rect x="13" y="3"  width="8" height="8" rx="2" />
        <rect x="3"  y="13" width="8" height="8" rx="2" />
        <rect x="13" y="13" width="8" height="8" rx="2" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    Icon: () => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
  },
]

export default function BottomNav({ activeTab, setActiveTab, unreadMatches = 0 }) {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`nav-tab ${activeTab === id ? 'active' : ''}`}
          onClick={() => setActiveTab(id)}
          aria-label={label}
        >
          {/* active pill */}
          {activeTab === id && <span className="nav-pill" />}

          <div className="nav-icon-wrap">
            <Icon />
            {id === 'matches' && unreadMatches > 0 && (
              <span className="nav-badge">{unreadMatches > 9 ? '9+' : unreadMatches}</span>
            )}
          </div>

          <span className="nav-label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
