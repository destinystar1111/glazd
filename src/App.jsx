import { useState } from 'react'
import './App.css'

import SplashScreen       from './screens/SplashScreen'
import UserTypeScreen     from './screens/UserTypeScreen'
import ClientOnboarding   from './screens/ClientOnboarding'
import NailTechOnboarding from './screens/NailTechOnboarding'
import NailTechDashboard  from './screens/NailTechDashboard'
import RatingScreen       from './screens/RatingScreen'
import DiscoverScreen     from './screens/DiscoverScreen'
import MatchesScreen      from './screens/MatchesScreen'
import ChatScreen         from './screens/ChatScreen'
import BookingScreen      from './screens/BookingScreen'
import MoodboardScreen    from './screens/MoodboardScreen'
import ProfileScreen      from './screens/ProfileScreen'
import BottomNav          from './components/BottomNav'
import { ALL_MATCHES }    from './screens/MatchesScreen'

/* ── Main app (post-onboarding) ──────────────────────────── */

const MAIN_TABS = ['discover', 'matches', 'moodboard', 'profile']
const UNREAD_COUNT = ALL_MATCHES.filter((m) => m.unread).length

function MainApp({ activeTab, setActiveTab, userProfile, onRate }) {
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
          <ChatScreen match={chatUser} onBack={closeChat} onBook={openBook} onRate={onRate} />
        ) : (
          <>
            {activeTab === 'discover'  && <DiscoverScreen onBook={openBook} />}
            {activeTab === 'matches'   && <MatchesScreen onChat={openChat} />}
            {activeTab === 'moodboard' && <MoodboardScreen />}
            {activeTab === 'profile'   && <ProfileScreen profile={userProfile} />}
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
  const [screen,       setScreen]       = useState('splash')
  const [userProfile,  setUserProfile]  = useState(null)
  const [ntProfile,    setNtProfile]    = useState(null)
  const [ratingTarget, setRatingTarget] = useState(null)
  const [ratings,      setRatings]      = useState([])

  const isMain = MAIN_TABS.includes(screen)

  const avgRating = ratings.length
    ? (ratings.reduce((s, r) => s + r.stars, 0) / ratings.length).toFixed(1)
    : '4.9'

  const handleRate = (match) => {
    setRatingTarget(match)
    setScreen('rate')
  }

  const handleRatingSubmit = (data) => {
    setRatings(r => [...r, data])
    setRatingTarget(null)
    setScreen('matches')
  }

  return (
    <div className="phone-shell">
      {screen === 'splash' && (
        <SplashScreen onNext={() => setScreen('userType')} />
      )}
      {screen === 'userType' && (
        <UserTypeScreen
          onClient={()    => setScreen('client')}
          onNailTech={()  => setScreen('nailTech')}
          onBack={()      => setScreen('splash')}
        />
      )}
      {screen === 'client' && (
        <ClientOnboarding
          onBack={()         => setScreen('userType')}
          onComplete={(data) => { setUserProfile(data); setScreen('discover') }}
        />
      )}
      {screen === 'nailTech' && (
        <NailTechOnboarding
          onBack={()         => setScreen('userType')}
          onComplete={(data) => { setNtProfile(data); setScreen('ntDash') }}
        />
      )}
      {screen === 'ntDash' && (
        <NailTechDashboard profile={ntProfile} avgRating={avgRating} />
      )}
      {screen === 'rate' && (
        <RatingScreen
          tech={ratingTarget}
          onBack={() => setScreen('matches')}
          onSubmit={handleRatingSubmit}
        />
      )}
      {isMain && (
        <MainApp
          activeTab={screen}
          setActiveTab={setScreen}
          userProfile={userProfile}
          onRate={handleRate}
        />
      )}
    </div>
  )
}
