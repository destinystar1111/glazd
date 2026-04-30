import { useState } from 'react'
import './App.css'

import SplashScreen         from './screens/SplashScreen'
import SignInScreen         from './screens/SignInScreen'
import UserTypeScreen       from './screens/UserTypeScreen'
import ClientOnboarding     from './screens/ClientOnboarding'
import NailTechOnboarding   from './screens/NailTechOnboarding'
import NailTechDashboard    from './screens/NailTechDashboard'
import RatingScreen         from './screens/RatingScreen'
import DiscoverScreen       from './screens/DiscoverScreen'
import MatchesScreen        from './screens/MatchesScreen'
import ChatScreen           from './screens/ChatScreen'
import BookingScreen        from './screens/BookingScreen'
import MoodboardScreen      from './screens/MoodboardScreen'
import ProfileScreen        from './screens/ProfileScreen'
import TechProfileScreen    from './screens/TechProfileScreen'
import SettingsScreen       from './screens/SettingsScreen'
import NotificationsScreen  from './screens/NotificationsScreen'
import BottomNav            from './components/BottomNav'
import { ALL_MATCHES }      from './screens/MatchesScreen'

/* ── Main app (post-onboarding) ──────────────────────────── */

const MAIN_TABS   = ['discover', 'matches', 'moodboard', 'profile']
const UNREAD_COUNT = ALL_MATCHES.filter((m) => m.unread).length

function MainApp({ activeTab, setActiveTab, userProfile, onRate, onSettings, onNotifications, onLogout, sharedMoodboards, onShareToTech, ntBoardShares }) {
  const [chatUser,    setChatUser]    = useState(null)
  const [bookingTech, setBookingTech] = useState(null)
  const [viewingTech, setViewingTech] = useState(null)

  const openChat     = (match) => setChatUser(match)
  const closeChat    = ()      => setChatUser(null)
  const openBook     = (tech)  => setBookingTech(tech)
  const closeBook    = ()      => setBookingTech(null)
  const openProfile  = (tech)  => setViewingTech(tech)
  const closeProfile = ()      => setViewingTech(null)

  /* Booking overlays everything */
  if (bookingTech) {
    return (
      <div className="main-app">
        <div className="main-content">
          <BookingScreen tech={bookingTech} onBack={closeBook} />
        </div>
      </div>
    )
  }

  /* Tech full profile overlay */
  if (viewingTech) {
    return (
      <div className="main-app">
        <div className="main-content">
          <TechProfileScreen tech={viewingTech} onBack={closeProfile} onBook={openBook} />
        </div>
      </div>
    )
  }

  return (
    <div className="main-app">
      <div className="main-content">
        {chatUser ? (
          <ChatScreen
            match={chatUser}
            onBack={closeChat}
            onBook={openBook}
            onRate={onRate}
            sharedMoodboard={sharedMoodboards?.[chatUser.id] ?? null}
            ntSharedBoards={ntBoardShares?.[chatUser.id] ?? []}
          />
        ) : (
          <>
            {activeTab === 'discover'  && (
              <DiscoverScreen
                onBook={openBook}
                onViewProfile={openProfile}
                onSettings={onSettings}
                onNotifications={onNotifications}
                onChat={openChat}
              />
            )}
            {activeTab === 'matches'   && <MatchesScreen onChat={openChat} />}
            {activeTab === 'moodboard' && (
              <MoodboardScreen onShareToTech={onShareToTech} />
            )}
            {activeTab === 'profile'   && (
              <ProfileScreen
                profile={userProfile}
                onSettings={onSettings}
                onNotifications={onNotifications}
              />
            )}
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
  const [screen,          setScreen]          = useState('splash')
  const [userProfile,     setUserProfile]     = useState(null)
  const [ntProfile,       setNtProfile]       = useState(null)
  const [ratingTarget,    setRatingTarget]    = useState(null)
  const [ratings,         setRatings]         = useState([])
  const [settingsFrom,    setSettingsFrom]    = useState('discover')
  const [notifsFrom,      setNotifsFrom]      = useState('discover')
  const [sharedMoodboards,  setSharedMoodboards]  = useState({})
  const [ntBoardShares,     setNtBoardShares]     = useState({})
  const [ntDashInitialTab,  setNtDashInitialTab]  = useState('dashboard')

  const isMain = MAIN_TABS.includes(screen)

  const avgRating = ratings.length
    ? (ratings.reduce((s, r) => s + r.stars, 0) / ratings.length).toFixed(1)
    : '4.9'

  const openSettings = (from) => { setSettingsFrom(from); setScreen('settings') }
  const openNotifs   = (from) => { setNotifsFrom(from);   setScreen('notifications') }

  const handleRate = (match) => {
    setRatingTarget(match)
    setScreen('rate')
  }

  const handleRatingSubmit = (data) => {
    setRatings(r => [...r, data])
    setRatingTarget(null)
    setScreen('matches')
  }

  const handleShareToTech = (vibes, matchIds) => {
    setSharedMoodboards(prev => {
      const next = { ...prev }
      matchIds.forEach(id => { next[id] = vibes })
      return next
    })
  }

  const handleNotifAction = (action) => {
    if (notifsFrom === 'ntDash') {
      const tabMap = {
        booking:  'calendar',
        calendar: 'calendar',
        matches:  'messages',
        reviews:  'profile',
        earnings: 'dashboard',
        messages: 'messages',
      }
      setNtDashInitialTab(tabMap[action] ?? 'dashboard')
      setScreen('ntDash')
    } else {
      const screenMap = {
        booking:  'profile',
        calendar: 'profile',
        matches:  'matches',
        reviews:  'profile',
        earnings: 'profile',
        messages: 'matches',
      }
      setScreen(screenMap[action] ?? 'discover')
    }
  }

  const handleNTShareBoard = (boardLabel, vibes, clientIds) => {
    setNtBoardShares(prev => {
      const next = { ...prev }
      clientIds.forEach(id => {
        next[id] = [...(next[id] ?? []), { boardLabel, vibes }]
      })
      return next
    })
  }

  return (
    <div className="phone-shell">

      {screen === 'splash' && (
        <SplashScreen
          onNext={() => setScreen('userType')}
          onSignIn={() => setScreen('signIn')}
        />
      )}

      {screen === 'signIn' && (
        <SignInScreen
          onBack={() => setScreen('splash')}
          onSignIn={() => setScreen('discover')}
        />
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
        <NailTechDashboard
          profile={ntProfile}
          avgRating={avgRating}
          onSettings={() => openSettings('ntDash')}
          onNotifications={() => openNotifs('ntDash')}
          onShareBoard={handleNTShareBoard}
          initialTab={ntDashInitialTab}
        />
      )}

      {screen === 'settings' && (
        <SettingsScreen
          onBack={() => setScreen(settingsFrom)}
          onLogout={() => setScreen('splash')}
          isNailTech={settingsFrom === 'ntDash'}
        />
      )}

      {screen === 'notifications' && (
        <NotificationsScreen
          onBack={() => setScreen(notifsFrom)}
          onAction={handleNotifAction}
        />
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
          onSettings={() => openSettings(screen)}
          onNotifications={() => openNotifs(screen)}
          onLogout={() => setScreen('splash')}
          sharedMoodboards={sharedMoodboards}
          onShareToTech={handleShareToTech}
          ntBoardShares={ntBoardShares}
        />
      )}
    </div>
  )
}
