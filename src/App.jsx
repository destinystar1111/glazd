import { useState } from 'react'
import './App.css'

import SplashScreen    from './screens/SplashScreen'
import UserTypeScreen  from './screens/UserTypeScreen'
import ClientOnboarding from './screens/ClientOnboarding'
import DiscoverScreen  from './screens/DiscoverScreen'
import MatchesScreen   from './screens/MatchesScreen'
import ChatScreen      from './screens/ChatScreen'
import BookingScreen   from './screens/BookingScreen'
import MoodboardScreen from './screens/MoodboardScreen'
import BottomNav       from './components/BottomNav'
import { ALL_MATCHES } from './screens/MatchesScreen'

/* ── Placeholder screens ─────────────────────────────────── */

function ProfilePlaceholder() {
  return (
    <div className="screen placeholder-screen">
      <div className="placeholder-icon">👤</div>
      <h2 className="placeholder-title">My Profile</h2>
      <p className="placeholder-sub">
        Manage your style preferences,<br />
        bookings, and account settings.
      </p>
      <span className="placeholder-chip">Coming soon</span>
    </div>
  )
}

function NailTechPlaceholder({ onBack }) {
  return (
    <div className="screen placeholder-screen">
      <div className="placeholder-icon">🎨</div>
      <h2 className="placeholder-title">Nail Tech Onboarding</h2>
      <p className="placeholder-sub">
        The nail tech sign-up flow is<br />coming very soon. ✨
      </p>
      <button className="btn-primary" style={{ maxWidth: 260, marginTop: 8 }} onClick={onBack}>
        Go Back
      </button>
    </div>
  )
}

/* ── Main app (post-onboarding) ──────────────────────────── */

const MAIN_TABS = ['discover', 'matches', 'moodboard', 'profile']
const UNREAD_COUNT = ALL_MATCHES.filter((m) => m.unread).length

function MainApp({ activeTab, setActiveTab }) {
  const [chatUser,    setChatUser]    = useState(null)
  const [bookingTech, setBookingTech] = useState(null)

  const openChat  = (match) => setChatUser(match)
  const closeChat = ()      => setChatUser(null)
  const openBook  = (tech)  => setBookingTech(tech)
  const closeBook = ()      => setBookingTech(null)

  /* Booking overlays everything — no nav */
  if (bookingTech) {
    return (
      <div className="main-app">
        <div className="main-content">
          <BookingScreen tech={bookingTech} onBack={closeBook} />
        </div>
      </div>
    )
  }

  return (
    <div className="main-app">
      <div className="main-content">
        {chatUser ? (
          <ChatScreen match={chatUser} onBack={closeChat} onBook={openBook} />
        ) : (
          <>
            {activeTab === 'discover'  && <DiscoverScreen onBook={openBook} />}
            {activeTab === 'matches'   && <MatchesScreen onChat={openChat} />}
            {activeTab === 'moodboard' && <MoodboardScreen />}
            {activeTab === 'profile'   && <ProfilePlaceholder />}
          </>
        )}
      </div>

      {!chatUser && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadMatches={UNREAD_COUNT}
        />
      )}
    </div>
  )
}

/* ── Root ────────────────────────────────────────────────── */

export default function App() {
  const [screen, setScreen] = useState('splash')

  const isMain = MAIN_TABS.includes(screen)

  return (
    <div className="phone-shell">
      {screen === 'splash' && (
        <SplashScreen onNext={() => setScreen('userType')} />
      )}
      {screen === 'userType' && (
        <UserTypeScreen
          onClient={()   => setScreen('client')}
          onNailTech={()  => setScreen('nailTech')}
          onBack={()      => setScreen('splash')}
        />
      )}
      {screen === 'client' && (
        <ClientOnboarding
          onBack={()     => setScreen('userType')}
          onComplete={()  => setScreen('discover')}
        />
      )}
      {screen === 'nailTech' && (
        <NailTechPlaceholder onBack={() => setScreen('userType')} />
      )}
      {isMain && (
        <MainApp activeTab={screen} setActiveTab={setScreen} />
      )}
    </div>
  )
}
