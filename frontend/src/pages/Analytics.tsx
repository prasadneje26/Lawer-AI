import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts'
import { BarChart2, TrendingUp, FileText, Search, Users } from 'lucide-react'
import { dashboardApi } from '../lib/api'
import { useAuthStore } from '../lib/store'

const COLORS = ['#D4AF37', '#3b82f6', '#22c55e', '#a855f7', '#ef4444', '#f97316']

export default function Analytics() {
  const { user } = useAuthStore()
  const { data: stats } = useQuery({ queryKey: ['dashboard-stats'], queryFn: dashboardApi.stats })

  const weeklyData = [
    { day: 'Mon', searches: 4, documents: 2, predictions: 1 },
    { day: 'Tue', searches: 7, documents: 3, predictions: 2 },
    { day: 'Wed', searches: 3, documents: 1, predictions: 0 },
    { day: 'Thu', searches: 9, documents: 4, predictions: 3 },
    { day: 'Fri', searches: 6, documents: 5, predictions: 2 },
    { day: 'Sat', searches: 2, documents: 1, predictions: 1 },
    { day: 'Sun', searches: 1, documents: 0, predictions: 0 },
  ]

  const docTypes = [
    { name: 'FIR Draft', value: 35 },
    { name: 'Bail App.', value: 25 },
    { name: 'Legal Notice', value: 20 },
    { name: 'Affidavit', value: 12 },
    { name: 'RTI App.', value: 8 },
  ]

  const accuracyData = [
    { month: 'Jan', accuracy: 82 },
    { month: 'Feb', accuracy: 84 },
    { month: 'Mar', accuracy: 85 },
    { month: 'Apr', accuracy: 86 },
    { month: 'May', accuracy: 87 },
    { month: 'Jun', accuracy: 87 },
    { month: 'Jul', accuracy: 89 },
  ]

  const tooltipStyle = {
    background: '#132947',
    border: '1px solid rgba(212,175,55,0.2)',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '0.8rem',
  }

  return (
    <div style={{ maxWidth: '1100px' }}>
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'Total Searches', value: stats?.total_searches ?? 0, icon: Search, color: '#3b82f6' },
          { label: 'Documents', value: stats?.total_documents ?? 0, icon: FileText, color: '#D4AF37' },
          { label: 'Predictions', value: stats?.total_predictions ?? 0, icon: TrendingUp, color: '#22c55e' },
          { label: 'AI Accuracy', value: '87.3%', icon: BarChart2, color: '#a855f7' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>{label}</span>
              <div style={{ width: '32px', height: '32px', background: `${color}18`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={15} color={color} />
              </div>
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f1f5f9' }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Weekly Activity Chart */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div className="section-title">Weekly Activity</div>
            <div className="section-sub">Searches, documents, and predictions this week</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData} barSize={10} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Legend wrapperStyle={{ fontSize: '0.75rem', color: '#94a3b8' }} />
              <Bar dataKey="searches" name="Searches" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="documents" name="Documents" fill="#D4AF37" radius={[4, 4, 0, 0]} />
              <Bar dataKey="predictions" name="Predictions" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Document Types */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div className="section-title">Document Types</div>
            <div className="section-sub">Distribution of generated docs</div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={docTypes} cx="50%" cy="50%" outerRadius={70} dataKey="value" paddingAngle={3}>
                {docTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginTop: '0.5rem' }}>
            {docTypes.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                <span style={{ color: '#94a3b8', flex: 1 }}>{d.name}</span>
                <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Accuracy Trend */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="section-title">AI Prediction Accuracy Trend</div>
          <div className="section-sub">Monthly accuracy improvement</div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={accuracyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[75, 95]} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v}%`, 'Accuracy']} />
            <Line type="monotone" dataKey="accuracy" stroke="#D4AF37" strokeWidth={2.5} dot={{ fill: '#D4AF37', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
