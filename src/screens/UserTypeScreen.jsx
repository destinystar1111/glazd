import { useState } from 'react'

const TYPES = [
  {
    id: 'client',
    icon: '💅',
    title: 'Client',
    desc: "I'm looking to find and book the perfect nail tech for my vibe",
  },
  {
    id: 'nailtech',
    icon: '🎨',
    title: 'Nail Tech',
    desc: "I'm an artist ready to showcase my work and find new clients",
  },
]

export default function UserTypeScreen({ onClient, onNailTech, onBack }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (id) => {
    setSelected(id)
    setTimeout(() => {
      if (id === 'client') onClient()
      else onNailTech()
    }, 320)
  }

  return (
    <div className="screen user-type">
      <div className="user-type-header">
        <button className="btn-ghost" onClick={onBack}>
          ← Back
        </button>
        <h2 className="screen-title">I am a…</h2>
        <p className="screen-sub">Tell us how you'll be using Glazd</p>
      </div>

      <div className="user-type-cards">
        {TYPES.map((t) => (
          <div
            key={t.id}
            className={`type-card ${selected === t.id ? 'selected' : ''}`}
            onClick={() => handleSelect(t.id)}
          >
            <div className="type-card-glow" />
            <div className="type-card-check">{selected === t.id ? '✓' : ''}</div>
            <div className="type-card-icon">{t.icon}</div>
            <div className="type-card-title">{t.title}</div>
            <p className="type-card-desc">{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
