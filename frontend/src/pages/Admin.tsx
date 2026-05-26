import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, Search, FileText, TrendingUp, Shield, ToggleLeft, ToggleRight, BarChart2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { adminApi } from '../lib/api'
import { formatDate, formatPercent } from '../lib/utils'

export default function Admin() {
  const qc = useQueryClient()
  const { data: stats } = useQuery({ queryKey: ['admin-stats'], queryFn: adminApi.stats })
  const { data: usersData } = useQuery({ queryKey: ['admin-users'], queryFn: () => adminApi.users() })
  const { data: logsData } = useQuery({ queryKey: ['admin-logs'], queryFn: () => adminApi.auditLogs() })
  const { data: analytics } = useQuery({ queryKey: ['admin-analytics'], queryFn: adminApi.analytics })

  const toggleUser = useMutation({
    mutationFn: adminApi.toggleUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const tooltipStyle = {
    background: '#132947',
    border: '1px solid rgba(212,175,55,0.2)',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '0.8rem',
  }

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'Total Users', value: stats?.total_users ?? 0, icon: Users, color: '#3b82f6' },
          { label: 'Active Users', value: stats?.active_users ?? 0, icon: Shield, color: '#22c55e' },
          { label: "Today's Searches", value: stats?.total_searches_today ?? 0, icon: Search, color: '#D4AF37' },
          { label: 'Documents Generated', value: stats?.total_documents_generated ?? 0, icon: FileText, color: '#a855f7' },
          { label: 'Predictions Made', value: stats?.total_predictions_made ?? 0, icon: TrendingUp, color: '#f97316' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card" style={{ padding: '1.125rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>{label}</span>
              <Icon size={14} color={color} />
            </div>
            <div style={{ fontSize: '1.625rem', fontWeight: 800, color: '#f1f5f9' }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Analytics Chart */}
        {analytics?.weekly_activity && (
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div className="section-title">Platform Activity (7 Days)</div>
              <div className="section-sub">Searches, documents, and predictions</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.weekly_activity} barSize={8} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="searches" name="Searches" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="documents" name="Documents" fill="#D4AF37" radius={[3, 3, 0, 0]} />
                <Bar dataKey="predictions" name="Predictions" fill="#22c55e" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Users by Role */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div className="section-title">Users by Role</div>
          </div>
          {stats?.users_by_role && Object.entries(stats.users_by_role).map(([role, count]: any) => (
            <div key={role} style={{ marginBottom: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'capitalize', fontWeight: 500 }}>{role}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0' }}>{count}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(count / (stats.total_users || 1)) * 100}%` }} />
              </div>
            </div>
          ))}
          {stats?.recent_users && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.625rem' }}>RECENT REGISTRATIONS</div>
              {stats.recent_users.slice(0, 3).map((u: any) => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #D4AF37, #b89222)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700, color: '#0B1F3A', flexShrink: 0,
                  }}>
                    {u.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e2e8f0' }}>{u.name}</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{u.role} · {formatDate(u.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Management */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <div className="section-title">User Management</div>
            <div className="section-sub">Manage platform users and their access</div>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{usersData?.total || 0} total users</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['User', 'Email', 'Role', 'Organization', 'Joined', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ padding: '0.625rem 0.75rem', textAlign: 'left', fontSize: '0.72rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usersData?.users?.map((u: any) => (
                <tr key={u.id} className="table-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.75rem', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' }}>{u.name}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.78rem', color: '#94a3b8' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`badge ${u.role === 'admin' ? 'badge-gold' : u.role === 'lawyer' ? 'badge-blue' : 'badge-purple'}`}>{u.role}</span>
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.78rem', color: '#94a3b8' }}>{u.organization || '—'}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap' }}>{formatDate(u.created_at)}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`badge ${u.is_active ? 'badge-green' : 'badge-red'}`}>{u.is_active ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <button onClick={() => toggleUser.mutate(u.id)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.25rem',
                      display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem',
                    }}>
                      {u.is_active ? <ToggleLeft size={16} color="#ef4444" /> : <ToggleRight size={16} color="#22c55e" />}
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <div className="section-title">Audit Logs</div>
          <div className="section-sub">System activity and security events</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', maxHeight: '300px', overflowY: 'auto' }}>
          {logsData?.logs?.map((log: any) => (
            <div key={log.id} style={{
              display: 'flex', alignItems: 'center', gap: '0.875rem',
              padding: '0.625rem 0.75rem', borderRadius: '8px',
              background: 'rgba(255,255,255,0.02)',
              fontSize: '0.78rem',
            }}>
              <span style={{ fontSize: '0.875rem' }}>
                {log.action === 'login' ? '🔐' : log.action === 'register' ? '👤' : log.action === 'case_search' ? '🔍' : log.action === 'document_generated' ? '📄' : '📋'}
              </span>
              <div style={{ flex: 1 }}>
                <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{log.action.replace(/_/g, ' ')}</span>
                {log.details?.query && <span style={{ color: '#64748b' }}> — "{log.details.query}"</span>}
                {log.details?.type && <span style={{ color: '#64748b' }}> — {log.details.type}</span>}
              </div>
              <span style={{ color: '#4b5563', whiteSpace: 'nowrap' }}>User #{log.user_id}</span>
              <span style={{ color: '#4b5563', whiteSpace: 'nowrap' }}>{formatDate(log.created_at)}</span>
              {log.ip_address && <span style={{ color: '#374151', whiteSpace: 'nowrap', fontSize: '0.7rem' }}>{log.ip_address}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
