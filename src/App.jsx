import { useState } from 'react'
import './App.css'
import { MessagesContext } from './MessagesContext'

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

/* ── Shared message thread seeds ─────────────────────────── */

const INITIAL_THREADS = {
  1: [
    { id:1, from:'client', text:"Hi! Just confirmed my booking 💅", time:'2 days ago' },
    { id:2, from:'tech',   text:'Perfect! I have your appointment set for May 2nd at 2pm', time:'2 days ago' },
    { id:3, from:'client', text:"I'm thinking glazed chrome with soft pink tips 🪞", time:'1 day ago' },
    { id:4, from:'tech',   text:'Love that combo — I can already picture it ✨', time:'1 day ago' },
    { id:5, from:'client', text:"Can't wait for my appointment! 💕", time:'2m' },
  ],
  2: [
    { id:1, from:'tech',   text:'Hi! I saw your preferences and I love your taste ✨', time:'2:14 PM' },
    { id:2, from:'tech',   text:'Witchy and character art are literally my specialties 🖤', time:'2:15 PM' },
    { id:3, from:'tech',   text:"I think we'd be a perfect match ✨", time:'2:16 PM' },
    { id:4, from:'client', text:"Hey! So excited we matched 🖤", time:'3 days ago' },
    { id:5, from:'tech',   text:'Same! Your witchy aesthetic is everything 💅', time:'3 days ago' },
    { id:6, from:'client', text:"I just shared my inspo pics 🖤", time:'1h' },
  ],
  3: [
    { id:1, from:'tech',   text:'Hey gorgeous! 💕 So excited to be matched with you!', time:'10:30 AM' },
    { id:2, from:'client', text:'Omg your portfolio is EVERYTHING 😭💎 I need those rhinestone sets', time:'10:32 AM' },
    { id:3, from:'tech',   text:"Yesss let's book you in! Do you have a date in mind?", time:'10:33 AM' },
    { id:4, from:'client', text:'What about this Saturday?', time:'11:00 AM' },
    { id:5, from:'tech',   text:"Perfect! Can't wait to see you on Saturday! 💕", time:'11:02 AM' },
    { id:6, from:'client', text:'See you Saturday at 2pm! 💕', time:'2d' },
  ],
  5: [
    { id:1, from:'tech',   text:'Hello! Noticed we matched 🪞✨', time:'2 days ago' },
    { id:2, from:'client', text:'Raven your glazed chrome sets are unreal, I need them immediately', time:'2 days ago' },
    { id:3, from:'tech',   text:"Thank you so much! I'd love to do a set for you 🤍", time:'2 days ago' },
    { id:4, from:'client', text:'Yes please! How do I book?', time:'2 days ago' },
    { id:5, from:'tech',   text:"Sounds good! I'll send you the booking link", time:'Yesterday' },
    { id:6, from:'client', text:"I'll send the deposit shortly", time:'3d' },
  ],
  6: [
    { id:1, from:'tech',   text:'Bonjour! So lovely to match with you ✨', time:'3 days ago' },
    { id:2, from:'client', text:'Your minimalist French tips are perfection 😍', time:'3 days ago' },
    { id:3, from:'tech',   type:'moodboard',
      vibes: [
        { name:'Glazed Chrome', icon:'🪞', g:['#dde0f5','#b8c0ee'] },
        { name:'Quiet Luxury',  icon:'🤍', g:['#fdf8f5','#f0e8e0'] },
      ],
      text: "Here's some inspo I put together for you ✨",
      time:'2 days ago',
    },
    { id:4, from:'tech',   text:'I love your clean aesthetic — these styles would suit you perfectly', time:'2 days ago' },
    { id:5, from:'client', text:'Your moodboard is gorgeous 🤍', time:'Yesterday' },
  ],
}

/* ── Main app (post-onboarding) ──────────────────────────── */

const MAIN_TABS   = ['discover', 'matches', 'moodboard', 'profile']
const UNREAD_COUNT = ALL_MATCHES.filter((m) => m.unread).length

function MainApp({ activeTab, setActiveTab, userProfile, onRate, onSettings, onNotifications, onLogout, onShareToTech }) {
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
  const [ntDashInitialTab,  setNtDashInitialTab]  = useState('dashboard')

  /* ── Shared messages context ── */
  const [threadMessages, setThreadMessages] = useState(INITIAL_THREADS)

  const sendMessage = (threadId, text, role) => {
    setThreadMessages(prev => ({
      ...prev,
      [threadId]: [...(prev[threadId] ?? []), { id: Date.now() + Math.random(), from: role, text, time: 'Just now' }],
    }))
  }

  const addMoodboardMsg = (threadId, msg) => {
    setThreadMessages(prev => ({
      ...prev,
      [threadId]: [...(prev[threadId] ?? []), msg],
    }))
  }

  const msgCtx = { threads: threadMessages, sendMessage, addMoodboardMsg }

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
    matchIds.forEach(id => {
      addMoodboardMsg(id, {
        id: Date.now() + id,
        from: 'client',
        type: 'moodboard',
        vibes,
        text: "Here's my moodboard for inspo! ✨",
        time: 'Just now',
      })
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
    clientIds.forEach(id => {
      addMoodboardMsg(id, {
        id: Date.now() + id,
        from: 'tech',
        type: 'moodboard',
        boardLabel,
        vibes,
        text: `Here's my ${boardLabel} board for inspo ✨`,
        time: 'Just now',
      })
    })
  }

  return (
    <MessagesContext.Provider value={msgCtx}>
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
          onShareToTech={handleShareToTech}
        />
      )}
    </div>
    </MessagesContext.Provider>
  )
}
