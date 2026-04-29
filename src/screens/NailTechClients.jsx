import { useState } from 'react'

/* ── Mock data ─────────────────────────────────────────── */

const PAY_STATUS = {
  deposit_paid: { label: 'Deposit Paid', cls: 'nt-pay-gold'  },
  balance_due:  { label: 'Balance Due',  cls: 'nt-pay-rose'  },
  fully_paid:   { label: 'Fully Paid',   cls: 'nt-pay-green' },
  refunded:     { label: 'Refunded',     cls: 'nt-pay-gray'  },
}

const ALL_CLIENTS = [
  {
    id: 1, name: 'Mia T.', avatar: '🌸', lastService: 'Builder Gel', lastDate: 'Apr 28',
    totalSpent: 195, reliability: 98,
    styles: ['Chrome', 'Minimalist'],
    notes: 'Prefers coffin shape. Natural nail girl but loves a glazed chrome overlay.',
    history: [
      { id:1, service:'Builder Gel',  date:'Apr 28, 2026', amount:65, status:'deposit_paid' },
      { id:2, service:'Fill',         date:'Mar 14, 2026', amount:45, status:'fully_paid'   },
      { id:3, service:'PolyGel Full', date:'Feb 10, 2026', amount:75, status:'fully_paid'   },
    ],
  },
  {
    id: 2, name: 'Jade R.', avatar: '💜', lastService: 'Character Art', lastDate: 'Apr 22',
    totalSpent: 285, reliability: 84,
    styles: ['Witchy', 'Character Art'],
    notes: 'Loves dark witchy sets. Always brings inspo photos. Sometimes runs 15 min late.',
    history: [
      { id:1, service:'Character Art', date:'Apr 22, 2026', amount:95, status:'balance_due' },
      { id:2, service:'PolyGel Full',  date:'Mar 08, 2026', amount:75, status:'fully_paid'  },
      { id:3, service:'Character Art', date:'Feb 02, 2026', amount:95, status:'fully_paid'  },
    ],
  },
  {
    id: 3, name: 'Sofia K.', avatar: '✨', lastService: 'PolyGel Full', lastDate: 'Apr 15',
    totalSpent: 150, reliability: 92,
    styles: ['Minimalist', 'Soft Girl'],
    notes: 'Neutral tones only. Very detail-oriented — check in throughout the service.',
    history: [
      { id:1, service:'PolyGel Full', date:'Apr 15, 2026', amount:75, status:'fully_paid' },
      { id:2, service:'Fill',         date:'Mar 01, 2026', amount:45, status:'fully_paid' },
      { id:3, service:'Builder Gel',  date:'Jan 20, 2026', amount:65, status:'fully_paid' },
    ],
  },
  {
    id: 4, name: 'Aaliyah M.', avatar: '🎀', lastService: 'Chrome Set', lastDate: 'Apr 10',
    totalSpent: 340, reliability: 96,
    styles: ['Chrome', 'Glam'],
    notes: 'Loves chrome and rhinestones. Refers friends regularly. VIP treatment.',
    history: [
      { id:1, service:'Chrome Set',    date:'Apr 10, 2026', amount:85, status:'fully_paid' },
      { id:2, service:'Builder Gel',   date:'Mar 05, 2026', amount:65, status:'fully_paid' },
      { id:3, service:'Chrome Set',    date:'Feb 01, 2026', amount:85, status:'fully_paid' },
      { id:4, service:'Character Art', date:'Jan 05, 2026', amount:95, status:'fully_paid' },
    ],
  },
  {
    id: 5, name: 'Nova W.', avatar: '🌷', lastService: 'Soft Girl Set', lastDate: 'Mar 28',
    totalSpent: 210, reliability: 88,
    styles: ['Soft Girl'],
    notes: 'Prefers pastel pinks and lavenders. Soft girl aesthetic always.',
    history: [
      { id:1, service:'Soft Girl Set', date:'Mar 28, 2026', amount:70, status:'fully_paid' },
      { id:2, service:'Fill',          date:'Feb 22, 2026', amount:45, status:'fully_paid' },
      { id:3, service:'Soft Girl Set', date:'Jan 18, 2026', amount:70, status:'fully_paid' },
    ],
  },
  {
    id: 6, name: 'Priya S.', avatar: '💎', lastService: 'Fill', lastDate: 'Mar 20',
    totalSpent: 90, reliability: 100,
    styles: ['Minimalist'],
    notes: 'Always early. Never misses. Prefers almond shape, medium length.',
    history: [
      { id:1, service:'Fill',         date:'Mar 20, 2026', amount:45, status:'fully_paid' },
      { id:2, service:'Builder Gel',  date:'Feb 14, 2026', amount:65, status:'fully_paid' },
    ],
  },
  {
    id: 7, name: 'Zara K.', avatar: '🌙', lastService: 'Builder Gel', lastDate: 'Mar 14',
    totalSpent: 195, reliability: 76,
    styles: ['Chrome', 'Bold'],
    notes: 'Has cancelled last minute twice. Send 48hr reminder — she appreciates it.',
    history: [
      { id:1, service:'Builder Gel',  date:'Mar 14, 2026', amount:65, status:'fully_paid' },
      { id:2, service:'Chrome Set',   date:'Feb 06, 2026', amount:85, status:'fully_paid' },
      { id:3, service:'Builder Gel',  date:'Jan 01, 2026', amount:65, status:'refunded'   },
    ],
  },
  {
    id: 8, name: 'Cleo M.', avatar: '🦋', lastService: 'PolyGel Full', lastDate: 'Mar 08',
    totalSpent: 225, reliability: 90,
    styles: ['Character Art', 'Soft Girl'],
    notes: 'Loves butterfly and floral details. Often adds nail art on top of the base set.',
    history: [
      { id:1, service:'PolyGel Full',  date:'Mar 08, 2026', amount:75, status:'fully_paid' },
      { id:2, service:'Character Art', date:'Feb 02, 2026', amount:95, status:'fully_paid' },
      { id:3, service:'Fill',          date:'Jan 10, 2026', amount:45, status:'fully_paid' },
    ],
  },
  {
    id: 9, name: 'Taya R.', avatar: '🌺', lastService: 'Character Art', lastDate: 'Feb 28',
    totalSpent: 380, reliability: 94,
    styles: ['Character Art', 'Glam'],
    notes: 'Obsessed with floral and botanical nail art. Best-reviewed client.',
    history: [
      { id:1, service:'Character Art', date:'Feb 28, 2026', amount:95, status:'fully_paid' },
      { id:2, service:'PolyGel Full',  date:'Feb 01, 2026', amount:75, status:'fully_paid' },
      { id:3, service:'Character Art', date:'Jan 05, 2026', amount:95, status:'fully_paid' },
      { id:4, service:'Builder Gel',   date:'Dec 02, 2025', amount:65, status:'fully_paid' },
    ],
  },
]

/* ── Client list screen ─────────────────────────────────── */

export default function NailTechClients({ initialClientName, onClear }) {
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState(
    () => initialClientName
      ? ALL_CLIENTS.find(c => c.name === initialClientName) ?? null
      : null
  )

  if (selected) {
    return (
      <ClientDetail
        client={selected}
        onBack={() => { setSelected(null); onClear?.() }}
      />
    )
  }

  const filtered = ALL_CLIENTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.lastService.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="nt-sub-screen nt-clients-screen">

      <div className="nt-clients-header">
        <div>
          <h1 className="nt-clients-title">Clients</h1>
          <p className="nt-clients-sub">{ALL_CLIENTS.length} total</p>
        </div>
      </div>

      <div className="nt-clients-search-wrap">
        <span className="nt-search-icon">🔍</span>
        <input
          className="nt-clients-search"
          type="text"
          placeholder="Search by name or service…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="nt-search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      <div className="nt-clients-list">
        {filtered.map(client => {
          const relClass = client.reliability >= 90 ? 'nt-rel-high' : client.reliability >= 75 ? 'nt-rel-mid' : 'nt-rel-low'
          const relLabel = client.reliability >= 90 ? '★ Reliable' : client.reliability >= 75 ? '~ Good' : '⚠ Caution'
          return (
            <button
              key={client.id}
              className="nt-client-card"
              onClick={() => setSelected(client)}
            >
              <div className="nt-client-card-avatar">{client.avatar}</div>
              <div className="nt-client-card-info">
                <div className="nt-client-card-name">{client.name}</div>
                <div className="nt-client-card-last">{client.lastService} · {client.lastDate}</div>
              </div>
              <div className="nt-client-card-right">
                <div className="nt-client-card-spent">${client.totalSpent}</div>
                <div className={`nt-rel-badge ${relClass}`}>{relLabel}</div>
              </div>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <div className="nt-clients-empty">No clients match "{search}"</div>
        )}
      </div>
    </div>
  )
}

/* ── Client detail screen ───────────────────────────────── */

function ClientDetail({ client, onBack }) {
  const [note,    setNote]    = useState(client.notes || '')
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState('')

  const startEdit = () => { setDraft(note); setEditing(true) }
  const saveNote  = () => { setNote(draft); setEditing(false) }

  const relClass = client.reliability >= 90 ? 'nt-rel-high' : client.reliability >= 75 ? 'nt-rel-mid' : 'nt-rel-low'

  return (
    <div className="nt-sub-screen nt-client-detail">

      <div className="nt-client-detail-header">
        <button className="btn-ghost" onClick={onBack}>← Back</button>
      </div>

      <div className="nt-client-detail-body">

        {/* Hero */}
        <div className="nt-client-hero">
          <div className="nt-client-hero-avatar">{client.avatar}</div>
          <h2 className="nt-client-hero-name">{client.name}</h2>
          <div className={`nt-rel-badge ${relClass}`} style={{ fontSize:'0.8rem', padding:'4px 14px' }}>
            {client.reliability}% reliability
          </div>
        </div>

        {/* Stats row */}
        <div className="nt-client-stats-row">
          <div className="nt-client-stat">
            <div className="nt-client-stat-val">${client.totalSpent}</div>
            <div className="nt-client-stat-lbl">Total Spent</div>
          </div>
          <div className="nt-client-stat-div" />
          <div className="nt-client-stat">
            <div className="nt-client-stat-val">{client.history.length}</div>
            <div className="nt-client-stat-lbl">Appointments</div>
          </div>
          <div className="nt-client-stat-div" />
          <div className="nt-client-stat">
            <div className="nt-client-stat-val">{client.lastDate}</div>
            <div className="nt-client-stat-lbl">Last Visit</div>
          </div>
        </div>

        {/* Style preferences */}
        <div className="nt-client-section">
          <h3 className="nt-client-sect-title">Style Preferences</h3>
          <div className="nt-client-styles">
            {client.styles.map(s => (
              <span key={s} className="nt-client-style-tag">{s}</span>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="nt-client-section">
          <div className="nt-client-sect-head">
            <h3 className="nt-client-sect-title">Private Notes</h3>
            {!editing && note && (
              <button className="nt-client-note-edit-btn" onClick={startEdit}>Edit</button>
            )}
          </div>

          {editing ? (
            <div className="nt-client-note-edit-wrap">
              <textarea
                className="nt-client-note-textarea"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                rows={4}
                placeholder={`Notes about ${client.name.split(' ')[0]}…`}
                autoFocus
              />
              <div className="nt-client-note-btns">
                <button className="nt-client-note-cancel" onClick={() => setEditing(false)}>Cancel</button>
                <button className="nt-client-note-save"   onClick={saveNote}>Save ✓</button>
              </div>
            </div>
          ) : note ? (
            <p className="nt-client-note-text">"{note}"</p>
          ) : (
            <button className="nt-client-add-note-btn" onClick={startEdit}>
              + Add a note about {client.name.split(' ')[0]}
            </button>
          )}
        </div>

        {/* Appointment history */}
        <div className="nt-client-section">
          <h3 className="nt-client-sect-title">Past Appointments</h3>
          <div className="nt-client-history">
            {client.history.map(appt => {
              const st = PAY_STATUS[appt.status]
              return (
                <div key={appt.id} className="nt-client-history-row">
                  <div className="nt-client-hist-info">
                    <div className="nt-client-hist-service">{appt.service}</div>
                    <div className="nt-client-hist-date">{appt.date}</div>
                  </div>
                  <div className="nt-client-hist-right">
                    <div className="nt-client-hist-amount">${appt.amount}</div>
                    <span className={`nt-pay-pill ${st.cls}`} style={{ fontSize:'0.6rem' }}>{st.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ height: 24 }} />
      </div>
    </div>
  )
}
