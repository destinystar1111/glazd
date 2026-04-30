import { useState, useRef, useEffect, useContext } from 'react'
import { MessagesContext } from '../MessagesContext'

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

export default function ChatScreen({ match, onBack, onBook, onRate }) {
  const { threads, sendMessage } = useContext(MessagesContext)
  const messages = threads[match.id] ?? []

  const [draft,   setDraft]   = useState('')
  const bottomRef             = useRef(null)
  const inputRef              = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const text = draft.trim()
    if (!text) return
    sendMessage(match.id, text, 'client')
    setDraft('')
    inputRef.current?.focus()
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
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
              const isMe   = msg.from === 'client'
              const isLast = i === messages.length - 1 ||
                             messages[i + 1]?.from !== msg.from

              /* ── Moodboard card message ── */
              if (msg.type === 'moodboard') {
                return (
                  <div key={msg.id} className={`bubble-wrap ${isMe ? 'bubble-me' : 'bubble-them'}`}>
                    {!isMe && isLast && <Avatar match={match} size={26} />}
                    {!isMe && !isLast && <div style={{ width: 26 }} />}
                    <div className="bubble-moodboard">
                      <p className="bubble-mb-label">🎨 {isMe ? 'My Moodboard' : (msg.boardLabel ?? 'Style Inspo')}</p>
                      <div className="bubble-mb-vibes">
                        {msg.vibes.slice(0, 3).map(v => (
                          <div
                            key={v.name}
                            className="bubble-mb-vibe"
                            style={{ background: `linear-gradient(135deg, ${v.g[0]}, ${v.g[1]})` }}
                          >
                            <span className="bubble-mb-vibe-icon">{v.icon}</span>
                            <span className="bubble-mb-vibe-name">{v.name}</span>
                          </div>
                        ))}
                        {msg.vibes.length > 3 && (
                          <p className="bubble-mb-more">+{msg.vibes.length - 3} more vibes</p>
                        )}
                      </div>
                      {msg.text && <p className="bubble-mb-text">{msg.text}</p>}
                      <button className="bubble-mb-view-btn">View Board ↗</button>
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

      {/* ── Rate-session banner ── */}
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
          onClick={handleSend}
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
