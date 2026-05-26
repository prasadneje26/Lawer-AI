import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Scale, Loader2 } from 'lucide-react'
import { useAuthStore } from '../lib/store'
import { authApi } from '../lib/api'
import { CASE_TYPES } from '../lib/utils'

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', organization: '',
    specialization: '', experience_years: '', role: 'lawyer',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = { ...form, experience_years: form.experience_years ? parseInt(form.experience_years) : undefined }
      const data = await authApi.register(payload)
      setAuth(data.user, data.access_token)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d1117 0%, #0B1F3A 50%, #0d1117 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px', height: '52px',
            background: 'linear-gradient(135deg, #D4AF37, #b89222)',
            borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.875rem', boxShadow: '0 8px 24px rgba(212,175,55,0.25)',
          }}>
            <Scale size={26} color="#0B1F3A" />
          </div>
          <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
            Join Lawer<span className="gold-text">-AI</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.375rem' }}>
            Create your professional legal account
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem',
              color: '#f87171', fontSize: '0.875rem',
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.3rem' }}>Full Name *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Adv. Raj Kumar" required className="input-field" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.3rem' }}>Role</label>
                <select value={form.role} onChange={e => set('role', e.target.value)} className="input-field">
                  <option value="lawyer">Lawyer</option>
                  <option value="admin">Admin</option>
                  <option value="researcher">Legal Researcher</option>
                  <option value="student">Law Student</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.3rem' }}>Email Address *</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@lawfirm.com" required className="input-field" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.3rem' }}>Password *</label>
              <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Minimum 6 characters" required minLength={6} className="input-field" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.3rem' }}>Organization / Law Firm</label>
              <input value={form.organization} onChange={e => set('organization', e.target.value)} placeholder="ABC Law Associates" className="input-field" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.3rem' }}>Specialization</label>
                <select value={form.specialization} onChange={e => set('specialization', e.target.value)} className="input-field">
                  <option value="">Select area</option>
                  {CASE_TYPES.map(t => <option key={t} value={t}>{t} Law</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.3rem' }}>Experience (Years)</label>
                <input type="number" value={form.experience_years} onChange={e => set('experience_years', e.target.value)} placeholder="5" min="0" max="60" className="input-field" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem' }}>
              {loading && <Loader2 size={15} />}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: 500 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
