const NOTIFS = [
  { id:1, icon:'✅', text:'Jade V. accepted your booking request',                 time:'Just now',  unread:true,  action:'booking'  },
  { id:2, icon:'⏰', text:'Your appointment tomorrow at 2:00 PM — reminder',       time:'2 hrs ago', unread:true,  action:'calendar' },
  { id:3, icon:'💅', text:"New match! Check out Aria Monroe's profile",            time:'5 hrs ago', unread:false, action:'matches'  },
  { id:4, icon:'⭐', text:'Mia T. left you a 5 star review',                       time:'Yesterday', unread:false, action:'reviews'  },
  { id:5, icon:'💳', text:'Your deposit of $25 was received',                       time:'Yesterday', unread:false, action:'earnings' },
  { id:6, icon:'💬', text:'Raven Ellis sent you a message',                         time:'2 days ago',unread:false, action:'messages' },
  { id:7, icon:'🎉', text:'Add more portfolio photos to get even more matches ✨', time:'3 days ago',unread:false, action:null       },
]

const ACTION_LABELS = {
  booking:  'View booking →',
  calendar: 'Open calendar →',
  matches:  'See matches →',
  reviews:  'See reviews →',
  earnings: 'View earnings →',
  messages: 'Go to messages →',
}

export default function NotificationsScreen({ onBack, onAction }) {
  const handleTap = (action) => {
    if (action && onAction) {
      onAction(action)
    } else {
      onBack()
    }
  }

  return (
    <div className="screen notifs-screen">

      <div className="notifs-header">
        <button className="notifs-back" onClick={onBack}>← Back</button>
        <h1 className="notifs-title">Notifications</h1>
        <div style={{ width: 60 }} />
      </div>

      <div className="notifs-scroll">
        {NOTIFS.map(n => (
          <button
            key={n.id}
            className={`notif-row ${n.unread ? 'notif-unread' : ''} ${n.action ? 'notif-tappable' : ''}`}
            onClick={() => handleTap(n.action)}
          >
            <div className="notif-icon-wrap">{n.icon}</div>
            <div className="notif-content">
              <p className="notif-text">{n.text}</p>
              <div className="notif-meta-row">
                <p className="notif-time">{n.time}</p>
                {n.action && (
                  <p className="notif-cta">{ACTION_LABELS[n.action]}</p>
                )}
              </div>
            </div>
            {n.unread && <div className="notif-dot" />}
          </button>
        ))}
        <p className="notifs-end-note">You're all caught up ✨</p>
      </div>
    </div>
  )
}
