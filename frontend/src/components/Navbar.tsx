import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'
import { useAuthStore } from '../lib/store'

const PAGE_TITLES: Record<string, { title: string; sub: string }> = {
  '/dashboard': { title: 'Dashboard', sub: 'Overview of your legal workspace' },
  '/case-search': { title: 'Case Search', sub: 'AI-powered similar case retrieval' },
  '/law-sections': { title: 'Law Sections', sub: 'Find relevant legal provisions' },
  '/documents': { title: 'Document Generator', sub: 'Generate professional legal documents' },
  '/predictions': { title: 'Case Predictions', sub: 'ML-based outcome forecasting' },
  '/analytics': { title: 'Analytics', sub: 'Insights and usage statistics' },
  '/admin': { title: 'Admin Dashboard', sub: 'Platform administration' },
}

export default function Navbar() {
  const { user } = useAuthStore()
  const location = useLocation()
  const [search, setSearch] = useState('')

  const info = PAGE_TITLES[location.pathname] || { title: 'Lawer-AI', sub: 'Legal Intelligence Platform' }

  return (
    <header style={{
      height: '60px',
      background: 'rgba(13,17,23,0.95)',
      borderBottom: '1px solid rgba(212,175,55,0.1)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 1.5rem',
      gap: '1rem',
      backdropFilter: 'blur(8px)',
      flexShrink: 0,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1 }}>
          {info.title}
        </div>
        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '1px' }}>
          {info.sub}
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Search size={14} style={{ position: 'absolute', left: '0.625rem', color: '#4b5563' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Quick search..."
          style={{
            background: 'rgba(11,31,58,0.8)',
            border: '1px solid rgba(212,175,55,0.15)',
            borderRadius: '8px',
            color: '#e2e8f0',
            padding: '0.4rem 0.75rem 0.4rem 2rem',
            fontSize: '0.8rem',
            outline: 'none',
            width: '200px',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Notifications */}
      <button style={{
        width: '34px', height: '34px',
        background: 'rgba(212,175,55,0.08)',
        border: '1px solid rgba(212,175,55,0.15)',
        borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
      }}>
        <Bell size={15} color="#D4AF37" />
        <span style={{
          position: 'absolute', top: '6px', right: '6px',
          width: '6px', height: '6px',
          background: '#ef4444', borderRadius: '50%',
        }} />
      </button>

      {/* Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          width: '32px', height: '32px',
          background: 'linear-gradient(135deg, #D4AF37, #b89222)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.75rem', fontWeight: 700, color: '#0B1F3A',
        }}>
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' }}>{user?.name}</div>
          <div style={{ fontSize: '0.65rem', color: '#D4AF37', textTransform: 'capitalize' }}>{user?.role}</div>
        </div>
      </div>
    </header>
  )
}
