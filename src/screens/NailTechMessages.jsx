import { useState, useRef, useEffect } from 'react'

/* ── Mock thread data ───────────────────────────────────── */

const NT_THREADS = [
  { id:1, name:'Aria Monroe',   avatar:'💅', g:['#f9c5d1','#e8758a'], lastMsg:"Can't wait for my appointment! 💕",   time:'2m',        unread:2 },
  { id:2, name:'Jade Voss',     avatar:'🖤', g:['#2d1b3d','#4a2560'], lastMsg:'I just shared my inspo pics 🖤',       time:'1h',        unread:1 },
  { id:6, name:'Solène Dubois', avatar:'🤍', g:['#e8e0d8','#d4c8be'], lastMsg:'Your moodboard is gorgeous 🤍',        time:'Yesterday', unread:0 },
  { id:3, name:'Chloe Tan',     avatar:'👑', g:['#ffd700','#e8a800'], lastMsg:'See you Saturday at 2pm! 💕',          time:'2d',        unread:0 },
  { id:5, name:'Raven Ellis',   avatar:'🪞', g:['#dde0f5','#b8c0ee'], lastMsg:"I'll send the deposit shortly",        time:'3d',        unread:0 },
]

const NT_SEED_MSGS = {
  1: [
    { id:1, from:'them', text:"Hi! Just confirmed my booking 💅", time:'2 days ago' },
    { id:2, from:'me',   text:'Perfect! I have your appointment set for May 2nd at 2pm', time:'2 days ago' },
    { id:3, from:'them', text:"I'm thinking glazed chrome with soft pink tips 🪞", time:'1 day ago' },
    { id:4, from:'me',   text:'Love that combo — I can already picture it ✨', time:'1 day ago' },
    { id:5, from:'them', text:"Can't wait for my appointment! 💕", time:'2m' },
  ],
  2: [
    { id:1, from:'them', text:"Hey! So excited we matched 🖤", time:'3 days ago' },
    { id:2, from:'me',   text:'Same! Your witchy aesthetic is everything 💅', time:'3 days ago' },
    { id:3, from:'them', text:"I just shared my inspo pics 🖤", time:'1h' },
  ],
  6: [
    { id:1, from:'them', text:"Bonjour! Thank you for accepting my booking ✨", time:'5 days ago' },
    { id:2, from:'me',   text:'Of course! Looking forward to creating your set', time:'5 days ago' },
    { id:3, from:'them', text:'Your moodboard is gorgeous 🤍', time:'Yesterday' },
  ],
  3: [
    { id:1, from:'them', text:"Hi! Love your glam portfolio 💎", time:'1 week ago' },
    { id:2, from:'me',   text:'Thank you! We are going to have so much fun ✨', time:'1 week ago' },
    { id:3, from:'them', text:'See you Saturday at 2pm! 💕', time:'2d' },
  ],
  5: [
    { id:1, from:'them', text:"Just booked! Super excited 🪞", time:'5 days ago' },
    { id:2, from:'me',   text:'Yay! I have everything ready for you', time:'5 days ago' },
    { id:3, from:'them', text:"I'll send the deposit shortly", time:'3d' },
  ],
}

/* ── Chat View (inline) ─────────────────────────────────── */

function NTChatView({ thread, onBack }) {
  const [messages, setMessages] = useState(NT_SEED_MSGS[thread.id] ?? [])
  const [draft, setDraft]       = useState('')
  const bottomRef               = useRef(null)
  const msgIdRef                = useRef(100)   // persists across renders

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    const text = draft.trim()
    if (!text) return
    setMessages(prev => [...prev, { id: msgIdRef.current++, from: 'me', text, time: 'Just now' }])
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
        {messages.map(msg => (
          <div key={msg.id} className={`bubble-wrap ${msg.from === 'me' ? 'bubble-me' : 'bubble-them'}`}>
            {msg.from !== 'me' && (
              <div
                className="chat-avatar"
                style={{ width:26, height:26, background:`linear-gradient(135deg,${thread.g[0]},${thread.g[1]})`, flexShrink:0 }}
              >
                <span style={{ fontSize:'0.7rem' }}>{thread.avatar}</span>
              </div>
            )}
            <div className="bubble">
              <p className="bubble-text">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder="Message…"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="chat-send-btn"
          onClick={sendMessage}
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
