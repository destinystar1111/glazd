import { useState, useRef, useEffect } from 'react'

/* ── Pre-seeded conversations by match ID ─────────────────── */

const SEED_MSGS = {
  2: [
    { id: 1, from: 'them', text: 'Hi! I saw your preferences and I love your taste ✨', time: '2:14 PM' },
    { id: 2, from: 'them', text: 'Witchy and character art are literally my specialties 🖤', time: '2:15 PM' },
    { id: 3, from: 'them', text: "I think we'd be a perfect match ✨", time: '2:16 PM' },
  ],
  3: [
    { id: 1, from: 'them', text: 'Hey gorgeous! 💕 So excited to be matched with you!', time: '10:30 AM' },
    { id: 2, from: 'me',   text: 'Omg your portfolio is EVERYTHING 😭💎 I need those rhinestone sets', time: '10:32 AM' },
    { id: 3, from: 'them', text: "Yesss let's book you in! Do you have a date in mind?", time: '10:33 AM' },
    { id: 4, from: 'me',   text: 'What about this Saturday?', time: '11:00 AM' },
    { id: 5, from: 'them', text: "Perfect! Can't wait to see you on Saturday! 💕", time: '11:02 AM' },
  ],
  5: [
    { id: 1, from: 'them', text: 'Hello! Noticed we matched 🪞✨', time: '2 days ago' },
    { id: 2, from: 'me',   text: 'Raven your glazed chrome sets are unreal, I need them immediately', time: '2 days ago' },
    { id: 3, from: 'them', text: "Thank you so much! I'd love to do a set for you 🤍", time: '2 days ago' },
    { id: 4, from: 'me',   text: 'Yes please! How do I book?', time: '2 days ago' },
    { id: 5, from: 'them', text: "Sounds good! I'll send you the booking link", time: 'Yesterday' },
  ],
  6: [
    { id: 1, from: 'them', text: 'Bonjour! So lovely to match with you ✨', time: '3 days ago' },
    { id: 2, from: 'me',   text: 'Your minimalist French tips are perfection 😍', time: '3 days ago' },
    {
      id: 3, from: 'them', type: 'moodboard',
      vibes: [
        { name: 'Glazed Chrome', icon: '🪞', g: ['#dde0f5','#b8c0ee'] },
        { name: 'Quiet Luxury',  icon: '🤍', g: ['#fdf8f5','#f0e8e0'] },
      ],
      text: "Here's some inspo I put together for you \u2728",
      time: '2 days ago',
    },
    { id: 4, from: 'them', text: 'I love your clean aesthetic — these styles would suit you perfectly', time: '2 days ago' },
  ],
}

let _msgId = 100

/* ── Avatar helper ───────────────────────────────────────── */

function Avatar({ match, size = 38 }) {
  return (
    <div
      className="chat-avatar"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${match.g[0]}, ${match.g[1]})`,
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: size * 0.42 }}>{match.icon}</span>
    </div>
  )
}

/* ── Screen ──────────────────────────────────────────────── */

export default function ChatScreen({ match, onBack, onBook, onRate, sharedMoodboard }) {
  const seed = SEED_MSGS[match.id] ?? []
  const [messages, setMessages] = useState(() => {
    if (sharedMoodboard && sharedMoodboard.length > 0) {
      return [
        ...seed,
        {
          id: 999, from: 'me', type: 'moodboard',
          vibes: sharedMoodboard,
          text: "Here's my moodboard for inspo! \u2728",
          time: 'Just now',
        },
      ]
    }
    return seed
  })
  const [draft, setDraft]       = useState('')
  const bottomRef               = useRef(null)
  const inputRef                = useRef(null)

  /* auto-scroll to bottom on new message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    const text = draft.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { id: ++_msgId, from: 'me', text, time: 'Just now' },
    ])
    setDraft('')
    inputRef.current?.focus()
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="screen chat-screen">

      {/* ── Header ── */}
      <div className="chat-header">
        <button className="btn-ghost chat-back-btn" onClick={onBack}>
          <BackIcon />
        </button>

        <Avatar match={match} size={40} />

        <div className="chat-header-info">
          <span className="chat-header-name">{match.name}</span>
          <span className="chat-header-sub">{match.location}</span>
        </div>

        <button className="chat-book-pill" onClick={() => onBook?.(match)}>Book</button>
      </div>

      {/* ── Messages ── */}
      <div className="chat-messages">

        {/* Match celebration card at top */}
        <div className="chat-match-banner">
          <div
            className="chat-match-avatar"
            style={{ background: `linear-gradient(135deg, ${match.g[0]}, ${match.g[1]})` }}
          >
            <span style={{ fontSize: '2rem' }}>{match.icon}</span>
          </div>
          <p className="chat-match-headline">You matched with {match.name.split(' ')[0]}!</p>
          <p className="chat-match-sub">Start the conversation below ✨</p>
        </div>

        {/* Bubble list */}
        {isEmpty ? (
          <div className="chat-empty">
            <span className="chat-empty-icon">💬</span>
            <p className="chat-empty-label">Say hello!</p>
          </div>
        ) : (
          <div className="chat-bubble-list">
            {messages.map((msg, i) => {
              const isMe   = msg.from === 'me'
              const isLast = i === messages.length - 1 ||
                             messages[i + 1]?.from !== msg.from

              /* ── Moodboard card message ── */
              if (msg.type === 'moodboard') {
                return (
                  <div key={msg.id} className={`bubble-wrap ${isMe ? 'bubble-me' : 'bubble-them'}`}>
                    {!isMe && isLast && <Avatar match={match} size={26} />}
                    {!isMe && !isLast && <div style={{ width: 26 }} />}
                    <div className="bubble-moodboard">
                      <p className="bubble-mb-label">🎨 {isMe ? 'My Moodboard' : 'Style Inspo'}</p>
                      <div className="bubble-mb-vibes">
                        {msg.vibes.map(v => (
                          <div
                            key={v.name}
                            className="bubble-mb-vibe"
                            style={{ background: `linear-gradient(135deg, ${v.g[0]}, ${v.g[1]})` }}
                          >
                            <span className="bubble-mb-vibe-icon">{v.icon}</span>
                            <span className="bubble-mb-vibe-name">{v.name}</span>
                          </div>
                        ))}
                      </div>
                      <p className="bubble-mb-text">{msg.text}</p>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={msg.id}
                  className={`bubble-wrap ${isMe ? 'bubble-me' : 'bubble-them'}`}
                >
                  {!isMe && isLast && (
                    <Avatar match={match} size={26} />
                  )}
                  {!isMe && !isLast && <div style={{ width: 26 }} />}
                  <div className="bubble">
                    <p className="bubble-text">{msg.text}</p>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ── Rate-session banner (shown for completed appointments) ── */}
      {match.id === 3 && (
        <div className="chat-rate-banner" onClick={() => onRate?.(match)}>
          <div className="chat-rate-banner-left">
            <div className="chat-rate-stars">★★★★★</div>
            <div className="chat-rate-text">
              <span className="chat-rate-title">How was your session?</span>
              <span className="chat-rate-sub">Rate your experience with {match.name.split(' ')[0]}</span>
            </div>
          </div>
          <span className="chat-rate-cta">Rate →</span>
        </div>
      )}

      {/* ── Input row ── */}
      <div className="chat-input-row">
        <input
          ref={inputRef}
          className="chat-input"
          type="text"
          placeholder={`Message ${match.name.split(' ')[0]}…`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          className="chat-send-btn"
          onClick={sendMessage}
          disabled={!draft.trim()}
          aria-label="Send"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  )
}

/* ── Icons ───────────────────────────────────────────────── */

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
    </svg>
  )
}
