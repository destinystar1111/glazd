export default function SplashScreen({ onNext }) {
  return (
    <div className="screen splash">
      {/* Ambient orbs */}
      <div className="splash-orb splash-orb-1" />
      <div className="splash-orb splash-orb-2" />
      <div className="splash-orb splash-orb-3" />

      {/* Logo */}
      <div className="splash-logo-block">
        <span className="splash-sparkle splash-sparkle-1">✦</span>
        <span className="splash-sparkle splash-sparkle-2">✧</span>
        <span className="splash-logo-text">Glazd</span>
        <div className="splash-divider">
          <div className="splash-divider-line" />
          <span className="splash-divider-diamond">◆</span>
          <div className="splash-divider-line" />
        </div>
        <span className="splash-sparkle splash-sparkle-3">✧</span>
        <span className="splash-sparkle splash-sparkle-4">✦</span>
      </div>

      {/* Tagline */}
      <p className="splash-tagline">
        your perfect nail tech,<br />
        one swipe away
      </p>

      {/* Nail emojis */}
      <div className="splash-emoji-row">
        <span>💅</span>
        <span className="splash-emoji-dot" />
        <span>✨</span>
        <span className="splash-emoji-dot" />
        <span>💅</span>
      </div>

      {/* CTA */}
      <div className="splash-cta">
        <button className="btn-primary" onClick={onNext}>
          Get Started
        </button>
        <p className="splash-signin">
          Already have an account?{' '}
          <a href="#">Sign in</a>
        </p>
      </div>
    </div>
  )
}
