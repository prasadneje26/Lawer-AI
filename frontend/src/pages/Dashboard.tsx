import { useQuery } from '@tanstack/react-query'
import { Search, FileText, TrendingUp, Clock, ArrowRight, BarChart2, Scale, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { dashboardApi } from '../lib/api'
import { useAuthStore } from '../lib/store'
import { formatDate, getActionLabel, getActionIcon } from '../lib/utils'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.stats,
  })

  const statCards = [
    { label: 'Cases Searched', value: stats?.total_searches ?? 0, icon: Search, color: '#3b82f6', week: stats?.searches_this_week ?? 0 },
    { label: 'Documents Generated', value: stats?.total_documents ?? 0, icon: FileText, color: '#D4AF37', week: stats?.documents_this_week ?? 0 },
    { label: 'Predictions Made', value: stats?.total_predictions ?? 0, icon: TrendingUp, color: '#22c55e', week: 0 },
    { label: 'AI Accuracy', value: '87.3%', icon: BarChart2, color: '#a855f7', week: null },
  ]

  const quickActions = [
    { to: '/case-search', icon: Search, label: 'Search Cases', desc: 'Find similar legal cases using AI', color: '#3b82f6' },
    { to: '/documents', icon: FileText, label: 'Draft Document', desc: 'Generate FIR, bail application & more', color: '#D4AF37' },
    { to: '/predictions', icon: TrendingUp, label: 'Predict Outcome', desc: 'ML-based case outcome forecasting', color: '#22c55e' },
    { to: '/law-sections', icon: BookOpen, label: 'Find Law Sections', desc: 'Relevant IPC, CrPC, Constitution provisions', color: '#a855f7' },
  ]

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Welcome */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
          Welcome back, <span className="gold-text">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.375rem' }}>
          {user?.organization ? `${user.organization} · ` : ''}{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
        {statCards.map(({ label, value, icon: Icon, color, week }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{label}</div>
              <div style={{ width: '34px', height: '34px', background: `${color}18`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color={color} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>
              {isLoading ? <div style={{ width: '3rem', height: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }} /> : value}
            </div>
            {week !== null && (
              <div style={{ fontSize: '0.72rem', color: '#4b5563', marginTop: '0.5rem' }}>
                <span style={{ color: '#22c55e' }}>+{week}</span> this week
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Quick Actions */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div className="section-title">Quick Actions</div>
            <div className="section-sub">Jump into your most-used tools</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {quickActions.map(({ to, icon: Icon, label, desc, color }) => (
              <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                  padding: '0.875rem',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.15s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = `${color}30`)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)')}
                >
                  <div style={{ width: '38px', height: '38px', background: `${color}15`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={17} color={color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0' }}>{label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{desc}</div>
                  </div>
                  <ArrowRight size={14} color="#4b5563" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <div className="section-title">Recent Activity</div>
              <div className="section-sub">Your latest actions</div>
            </div>
            <Clock size={15} color="#64748b" />
          </div>
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ height: '48px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }} />
              ))}
            </div>
          ) : stats?.recent_activity?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {stats.recent_activity.slice(0, 7).map((log: any) => (
                <div key={log.id} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.625rem 0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.02)',
                }}>
                  <span style={{ fontSize: '1rem' }}>{getActionIcon(log.action)}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 500, color: '#e2e8f0' }}>{getActionLabel(log.action)}</div>
                    {log.details?.query && <div style={{ fontSize: '0.7rem', color: '#64748b' }}>"{log.details.query}"</div>}
                    {log.details?.type && <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{log.details.type}</div>}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#4b5563', whiteSpace: 'nowrap' }}>
                    {formatDate(log.created_at)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#4b5563' }}>
              <Scale size={32} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.3 }} />
              <p style={{ fontSize: '0.875rem', margin: 0 }}>No activity yet</p>
              <p style={{ fontSize: '0.75rem', margin: '0.25rem 0 0' }}>Start by searching for cases</p>
            </div>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div style={{
        marginTop: '1.25rem',
        background: 'linear-gradient(135deg, rgba(11,31,58,0.8), rgba(19,41,71,0.6))',
        border: '1px solid rgba(212,175,55,0.2)',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        display: 'flex', alignItems: 'center', gap: '1rem',
      }}>
        <div style={{
          width: '42px', height: '42px', flexShrink: 0,
          background: 'rgba(212,175,55,0.1)',
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Scale size={20} color="#D4AF37" />
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0' }}>
            Lawer-AI 2.0 — Professional Legal Intelligence
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>
            Connect your OpenAI API key to unlock full AI-powered RAG case search, intelligent document generation, and ML-based outcome prediction.
          </div>
        </div>
        <Link to="/case-search" className="btn-primary" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
          Get Started
        </Link>
      </div>
    </div>
  )
}
