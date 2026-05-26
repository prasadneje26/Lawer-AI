import { useState } from 'react'
import { TrendingUp, Loader2, Scale, ChevronUp, ChevronDown } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { predictionApi } from '../lib/api'
import { CASE_TYPES, formatPercent } from '../lib/utils'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

export default function Predictions() {
  const [form, setForm] = useState({ case_description: '', case_type: '', jurisdiction: '' })
  const [activeTab, setActiveTab] = useState<'predict' | 'history'>('predict')

  const { mutate, data, isPending } = useMutation({
    mutationFn: () => predictionApi.predict(form),
  })

  const { data: history } = useQuery({
    queryKey: ['my-predictions'],
    queryFn: predictionApi.myPredictions,
    enabled: activeTab === 'history',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.case_description.trim()) return
    mutate()
  }

  const EXAMPLE_CASES = [
    { type: 'Cheque Bounce', desc: 'Cheque of Rs. 5 lakhs issued for a loan repayment was returned by bank due to insufficient funds. Legal notice sent within 30 days. Accused failed to repay within 15 days.' },
    { type: 'Criminal', desc: 'Eyewitness account, CCTV footage, and forensic evidence establish accused presence at scene. FIR registered promptly. Strong evidence of premeditated act.' },
    { type: 'Family', desc: 'Wife seeking divorce on grounds of cruelty and dowry harassment. Multiple hospital records documenting injuries. Police complaints on record.' },
  ]

  const chartData = data ? [
    { name: 'Win', value: Math.round(data.win_probability * 100) },
    { name: 'Lose', value: Math.round(data.lose_probability * 100) },
  ] : []

  const COLORS = ['#22c55e', '#ef4444']

  const getOutcomeStyle = (outcome: string) => {
    if (outcome.toLowerCase().includes('favorable') || outcome.toLowerCase().includes('win'))
      return { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' }
    if (outcome.toLowerCase().includes('unfavorable') || outcome.toLowerCase().includes('lose'))
      return { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' }
    return { color: '#D4AF37', bg: 'rgba(212,175,55,0.1)', border: 'rgba(212,175,55,0.25)' }
  }

  return (
    <div style={{ maxWidth: '1000px' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.5rem', background: 'rgba(11,31,58,0.5)', borderRadius: '10px', padding: '0.25rem', width: 'fit-content' }}>
        {[{ key: 'predict', label: 'New Prediction' }, { key: 'history', label: 'My Predictions' }].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key as any)} style={{
            padding: '0.5rem 1.125rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.15s',
            background: activeTab === t.key ? 'linear-gradient(135deg, #D4AF37, #b89222)' : 'transparent',
            color: activeTab === t.key ? '#0B1F3A' : '#94a3b8',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'predict' && (
        <div style={{ display: 'grid', gridTemplateColumns: data ? '1fr 1fr' : '1fr', gap: '1.25rem' }}>
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '1rem' }}>Case Details for Prediction</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.3rem' }}>Case Type</label>
                    <select value={form.case_type} onChange={e => setForm(f => ({ ...f, case_type: e.target.value }))} className="input-field">
                      <option value="">Select type</option>
                      {CASE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.3rem' }}>Jurisdiction</label>
                    <select value={form.jurisdiction} onChange={e => setForm(f => ({ ...f, jurisdiction: e.target.value }))} className="input-field">
                      <option value="">Select court</option>
                      <option value="Supreme Court">Supreme Court</option>
                      <option value="High Court">High Court</option>
                      <option value="Sessions Court">Sessions Court</option>
                      <option value="District Court">District Court</option>
                      <option value="Magistrate Court">Magistrate Court</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.3rem' }}>Case Description *</label>
                  <textarea
                    value={form.case_description}
                    onChange={e => setForm(f => ({ ...f, case_description: e.target.value }))}
                    placeholder="Describe the case facts, evidence available, parties involved, legal issues, and any relevant circumstances that may impact the outcome..."
                    className="input-field"
                    style={{ minHeight: '160px', resize: 'vertical' }}
                    required
                  />
                </div>

                <button type="submit" disabled={isPending || !form.case_description.trim()} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '0.75rem' }}>
                  {isPending ? <Loader2 size={15} /> : <TrendingUp size={15} />}
                  {isPending ? 'Analyzing Case...' : 'Predict Outcome'}
                </button>
              </div>
            </form>

            {/* Examples */}
            <div className="glass-card" style={{ padding: '1.125rem', marginTop: '1rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', marginBottom: '0.75rem' }}>TRY EXAMPLE CASES</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {EXAMPLE_CASES.map((ex, i) => (
                  <button key={i} onClick={() => setForm(f => ({ ...f, case_type: ex.type, case_description: ex.desc }))} style={{
                    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px', padding: '0.75rem', textAlign: 'left', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                  >
                    <div style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 600, marginBottom: '0.25rem' }}>{ex.type}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5 }}>{ex.desc.substring(0, 100)}...</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          {data && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Outcome Card */}
              {(() => {
                const style = getOutcomeStyle(data.predicted_outcome)
                return (
                  <div style={{ background: style.bg, border: `1px solid ${style.border}`, borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: style.color, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>PREDICTED OUTCOME</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 800, color: style.color }}>{data.predicted_outcome}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.375rem' }}>
                      Confidence: <span style={{ color: style.color }}>{formatPercent(data.confidence)}</span>
                    </div>
                  </div>
                )
              })()}

              {/* Chart */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '1rem' }}>WIN/LOSE PROBABILITY</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <ResponsiveContainer width={120} height={120}>
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={3}>
                        {chartData.map((_, index) => <Cell key={index} fill={COLORS[index]} />)}
                      </Pie>
                      <Tooltip formatter={(val: any) => [`${val}%`]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 600 }}>Win Probability</span>
                        <span style={{ fontWeight: 700, color: '#22c55e' }}>{formatPercent(data.win_probability)}</span>
                      </div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${data.win_probability * 100}%`, background: 'linear-gradient(90deg, #22c55e, #4ade80)' }} /></div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>Lose Probability</span>
                        <span style={{ fontWeight: 700, color: '#ef4444' }}>{formatPercent(data.lose_probability)}</span>
                      </div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${data.lose_probability * 100}%`, background: 'linear-gradient(90deg, #ef4444, #f87171)' }} /></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Factors */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.875rem' }}>KEY FACTORS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {data.key_factors?.slice(0, 5).map((f: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ flexShrink: 0 }}>
                        {f.impact === 'Positive'
                          ? <ChevronUp size={14} color="#22c55e" />
                          : f.impact === 'Negative'
                            ? <ChevronDown size={14} color="#ef4444" />
                            : <Scale size={14} color="#D4AF37" />
                        }
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 500, color: '#e2e8f0' }}>{f.factor}</div>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: f.impact === 'Positive' ? '#22c55e' : f.impact === 'Negative' ? '#ef4444' : '#D4AF37' }}>
                        {f.impact}
                      </div>
                      <div style={{ width: '60px' }}>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: `${f.weight * 100}%` }} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reasoning */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.625rem' }}>AI REASONING</div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>{data.reasoning}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          {history?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {history.map((p: any) => {
                const style = getOutcomeStyle(p.predicted_outcome)
                return (
                  <div key={p.id} className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '42px', height: '42px', background: style.bg, border: `1px solid ${style.border}`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <TrendingUp size={17} color={style.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0' }}>{p.predicted_outcome}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {p.case_type} · Win: {formatPercent(p.win_probability)} · Confidence: {formatPercent(p.confidence)} · {new Date(p.created_at).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#4b5563' }}>
              <TrendingUp size={40} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.3 }} />
              <p style={{ margin: 0 }}>No predictions yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
