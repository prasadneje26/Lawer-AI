import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Search, BookOpen, FileText, BarChart2,
  Shield, Settings, LogOut, Scale, ChevronRight, TrendingUp
} from 'lucide-react'
import { useAuthStore } from '../lib/store'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/case-search', icon: Search, label: 'Case Search' },
  { to: '/law-sections', icon: BookOpen, label: 'Law Sections' },
  { to: '/documents', icon: FileText, label: 'Document Generator' },
  { to: '/predictions', icon: TrendingUp, label: 'Case Predictions' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
]

const adminItems = [
  { to: '/admin', icon: Shield, label: 'Admin Dashboard' },
]

export default function Sidebar() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <aside style={{
      width: '240px',
      minWidth: '240px',
      background: 'rgba(11, 31, 58, 0.95)',
      borderRight: '1px solid rgba(212, 175, 55, 0.12)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(212,175,55,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #D4AF37, #b89222)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Scale size={20} color="#0B1F3A" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f1f5f9', lineHeight: 1 }}>
              Lawer-AI
            </div>
            <div style={{ fontSize: '0.65rem', color: '#D4AF37', fontWeight: 500, letterSpacing: '0.05em' }}>
              LEGAL INTELLIGENCE
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0.75rem 0.5rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#4b5563', fontWeight: 600, padding: '0.5rem 0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Legal Tools
          </div>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {user?.role === 'admin' && (
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#4b5563', fontWeight: 600, padding: '0.5rem 0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Administration
            </div>
            {adminItems.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* User Profile */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
        <div style={{
          background: 'rgba(212,175,55,0.06)',
          borderRadius: '10px',
          padding: '0.75rem',
          marginBottom: '0.5rem',
          border: '1px solid rgba(212,175,55,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, #D4AF37, #b89222)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, color: '#0B1F3A',
              flexShrink: 0,
            }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#D4AF37', textTransform: 'capitalize' }}>
                {user?.role}
              </div>
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-item" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.5rem 0.875rem' }}>
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
