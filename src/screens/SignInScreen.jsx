import { useState } from 'react'

export default function SignInScreen({ onBack, onSignIn }) {
  const [view,       setView]       = useState('signIn') // 'signIn' | 'forgotPw' | 'resetSent'
  const [credential, setCredential] = useState('')
  const [password,   setPassword]   = useState('')
  const [showPw,     setShowPw]     = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [resetEmail, setResetEmail] = useState('')

  const canSubmit = credential.trim().length > 0 && password.length >= 1

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setTimeout(() => { setLoading(false); onSignIn?.() }, 900)
  }

  const handleSendReset = () => {
    if (!resetEmail.includes('@')) return
    setView('resetSent')
  }

  /* ── Forgot password view ── */
  if (view === 'forgotPw') {
    return (
      <div className="screen signin-screen">
        <div className="signin-orb signin-orb-1" />
        <div className="signin-orb signin-orb-2" />

        <button className="signin-back-btn" onClick={() => setView('signIn')}>← Back</button>

        <div className="signin-logo-block">
          <span className="signin-logo">Glazd</span>
          <p className="signin-logo-sub">reset password ✦</p>
        </div>

        <div className="signin-form">
          <p className="signin-reset-desc">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <div className="signin-field-wrap">
            <label className="signin-label">Email Address</label>
            <input
              className="signin-input"
              type="email"
              placeholder="you@email.com"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
              autoFocus
            />
          </div>

          <button
            className="btn-primary signin-submit-btn"
            onClick={handleSendReset}
            disabled={!resetEmail.includes('@')}
          >
            Send Reset Email
          </button>
        </div>

        <div className="signin-footer">
          <p className="signin-footer-txt">
            Remember it?{' '}
            <button className="signin-link" onClick={() => setView('signIn')}>Back to sign in</button>
          </p>
        </div>
      </div>
    )
  }

  /* ── Reset email sent confirmation ── */
  if (view === 'resetSent') {
    return (
      <div className="screen signin-screen">
        <div className="signin-orb signin-orb-1" />
        <div className="signin-orb signin-orb-2" />

        <div className="signin-reset-sent-wrap">
          <div className="signin-reset-icon">📬</div>
          <h2 className="signin-reset-title">Check your email</h2>
          <p className="signin-reset-body">
            We sent a password reset link to
          </p>
          <p className="signin-reset-email">{resetEmail}</p>
          <p className="signin-reset-hint">
            Didn't receive it? Check your spam folder or try again.
          </p>
          <button
            className="btn-primary signin-submit-btn"
            onClick={() => setView('signIn')}
          >
            Back to Sign In
          </button>
          <button
            className="signin-forgot"
            style={{ marginTop: 12 }}
            onClick={() => { setResetEmail(''); setView('forgotPw') }}
          >
            Resend email
          </button>
        </div>
      </div>
    )
  }

  /* ── Main sign in view ── */
  return (
    <div className="screen signin-screen">
      <div className="signin-orb signin-orb-1" />
      <div className="signin-orb signin-orb-2" />

      <button className="signin-back-btn" onClick={onBack}>← Back</button>

      <div className="signin-logo-block">
        <span className="signin-logo">Glazd</span>
        <p className="signin-logo-sub">welcome back ✦</p>
      </div>

      <form className="signin-form" onSubmit={handleSubmit}>

        <div className="signin-field-wrap">
          <label className="signin-label">Email or Phone Number</label>
          <input
            className="signin-input"
            type="text"
            placeholder="you@email.com or +1 234 567 8900"
            value={credential}
            onChange={e => setCredential(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="signin-field-wrap">
          <label className="signin-label">Password</label>
          <div className="signin-pw-wrap">
            <input
              className="signin-input signin-pw-input"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="signin-pw-toggle"
              onClick={() => setShowPw(v => !v)}
            >
              {showPw ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button type="button" className="signin-forgot" onClick={() => setView('forgotPw')}>
          Forgot password?
        </button>

        <button
          type="submit"
          className="btn-primary signin-submit-btn"
          disabled={!canSubmit || loading}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <div className="signin-footer">
        <p className="signin-footer-txt">
          Don't have an account?{' '}
          <button className="signin-link" onClick={onBack}>Get started →</button>
        </p>
      </div>
    </div>
  )
}
