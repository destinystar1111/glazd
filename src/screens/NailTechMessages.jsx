import { useState, useRef, useEffect, useContext } from 'react'
import { MessagesContext } from '../MessagesContext'

/* ── Thread metadata (name, avatar, gradient) ────────────── */

const NT_THREADS = [
  { id:1, name:'Aria Monroe',   avatar:'💅', g:['#f9c5d1','#e8758a'], lastMsg:"Can't wait for my appointment! 💕",   time:'2m',        unread:2 },
  { id:2, name:'Jade Voss',     avatar:'🖤', g:['#2d1b3d','#4a2560'], lastMsg:'I just shared my inspo pics 🖤',       time:'1h',        unread:1 },
  { id:6, name:'Solène Dubois', avatar:'🤍', g:['#e8e0d8','#d4c8be'], lastMsg:'Your moodboard is gorgeous 🤍',        time:'Yesterday', unread:0 },
  { id:3, name:'Chloe Tan',     avatar:'👑', g:['#ffd700','#e8a800'], lastMsg:'See you Saturday at 2pm! 💕',          time:'2d',        unread:0 },
  { id:5, name:'Raven Ellis',   avatar:'🪞', g:['#dde0f5','#b8c0ee'], lastMsg:"I'll send the deposit shortly",        time:'3d',        unread:0 },
]

/* ── Chat View ───────────────────────────────────────────── */

function NTChatView({ thread, onBack }) {
  const { threads, sendMessage } = useContext(MessagesContext)
  const messages = threads[thread.id] ?? []

  const [draft,   setDraft]   = useState('')
  const bottomRef             = useRef(null)
  const inputRef              = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const text = draft.trim()
    if (!text) return
    sendMessage(thread.id, text, 'tech')
    setDraft('')
  }

  return (
    <div className="chat-screen">
      {/* Header */}
      <div className="chat-header">
        <button className="chat-back-btn" onClick={onBack} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div
          className="chat-avatar"
          style={{ width:38, height:38, background:`linear-gradient(135deg,${thread.g[0]},${thread.g[1]})` }}
        >
          <span style={{ fontSize:'1rem' }}>{thread.avatar}</span>
        </div>
        <div className="chat-header-info">
          <p className="chat-header-name">{thread.name}</p>
          <p className="chat-header-sub">Client</p>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-msgs">
        {messages.map((msg, i) => {
          const isMe   = msg.from === 'tech'
          const isLast = i === messages.length - 1 || messages[i + 1]?.from !== msg.from

          /* Moodboard message */
          if (msg.type === 'moodboard') {
            return (
              <div key={msg.id} className={`bubble-wrap ${isMe ? 'bubble-me' : 'bubble-them'}`}>
                {!isMe && isLast && (
                  <div
                    className="chat-avatar"
                    style={{ width:26, height:26, background:`linear-gradient(135deg,${thread.g[0]},${thread.g[1]})`, flexShrink:0 }}
                  >
                    <span style={{ fontSize:'0.7rem' }}>{thread.avatar}</span>
                  </div>
                )}
                {!isMe && !isLast && <div style={{ width: 26 }} />}
                <div className="bubble-moodboard">
                  <p className="bubble-mb-label">🎨 {isMe ? 'My Board' : 'Client Moodboard'}</p>
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
                  </div>
                  {msg.text && <p className="bubble-mb-text">{msg.text}</p>}
                </div>
              </div>
            )
          }

          return (
            <div key={msg.id} className={`bubble-wrap ${isMe ? 'bubble-me' : 'bubble-them'}`}>
              {!isMe && isLast && (
                <div
                  className="chat-avatar"
                  style={{ width:26, height:26, background:`linear-gradient(135deg,${thread.g[0]},${thread.g[1]})`, flexShrink:0 }}
                >
                  <span style={{ fontSize:'0.7rem' }}>{thread.avatar}</span>
                </div>
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

      {/* Input */}
      <div className="chat-input-row">
        <input
          ref={inputRef}
          className="chat-input"
          placeholder="Message…"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!draft.trim()}
          aria-label="Send"
        >›</button>
      </div>
    </div>
  )
}

/* ── Thread list ────────────────────────────────────────── */

export default function NailTechMessages() {
  const [activeThread, setActiveThread] = useState(null)

  if (activeThread) {
    return (
      <div className="nt-chat-wrap">
        <NTChatView thread={activeThread} onBack={() => setActiveThread(null)} />
      </div>
    )
  }

  const totalUnread = NT_THREADS.reduce((s, t) => s + t.unread, 0)

  return (
    <div className="nt-sub-screen nt-messages-screen">
      <div className="nt-msgs-header">
        <h2 className="nt-msgs-title">Messages</h2>
        {totalUnread > 0 && (
          <span className="nt-msgs-unread-total">{totalUnread} unread</span>
        )}
      </div>

      <div className="nt-msgs-list">
        {NT_THREADS.map(thread => (
          <button
            key={thread.id}
            className={`nt-msgs-thread ${thread.unread > 0 ? 'nt-msgs-thread-unread' : ''}`}
            onClick={() => setActiveThread(thread)}
          >
            <div
              className="nt-msgs-avatar"
              style={{ background:`linear-gradient(135deg,${thread.g[0]},${thread.g[1]})` }}
            >
              <span>{thread.avatar}</span>
            </div>
            <div className="nt-msgs-content">
              <div className="nt-msgs-top-row">
                <p className="nt-msgs-name">{thread.name}</p>
                <p className="nt-msgs-time">{thread.time}</p>
              </div>
              <div className="nt-msgs-bottom-row">
                <p className="nt-msgs-preview">{thread.lastMsg}</p>
                {thread.unread > 0 && (
                  <span className="nt-msgs-badge">{thread.unread}</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
