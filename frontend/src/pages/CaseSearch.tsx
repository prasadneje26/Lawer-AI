import { useState } from 'react'
import { Search, Filter, ExternalLink, Scale, ChevronDown, Loader2, X } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { caseApi } from '../lib/api'
import { CASE_TYPES } from '../lib/utils'

interface CaseResult {
  case_id: string
  title: string
  summary: string
  case_type?: string
  court?: string
  year?: number
  outcome?: string
  similarity_score: number
  relevant_sections?: string[]
  key_points?: string[]
}

export default function CaseSearch() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ case_type: '', court: '', year_from: '', year_to: '', top_k: '5' })
  const [showFilters, setShowFilters] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const { mutate, data, isPending, isError, error } = useMutation({
    mutationFn: () => caseApi.search({
      query,
      top_k: parseInt(filters.top_k),
      case_type: filters.case_type || undefined,
      court: filters.court || undefined,
      year_from: filters.year_from ? parseInt(filters.year_from) : undefined,
      year_to: filters.year_to ? parseInt(filters.year_to) : undefined,
    }),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    mutate()
  }

  const getScoreColor = (score: number) => score >= 0.85 ? '#22c55e' : score >= 0.70 ? '#D4AF37' : '#94a3b8'
  const getOutcomeClass = (outcome?: string) => {
    if (!outcome) return 'badge-blue'
    if (outcome.toLowerCase().includes('allow')) return 'badge-green'
    if (outcome.toLowerCase().includes('dismiss')) return 'badge-red'
    return 'badge-blue'
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ marginBottom: '1.25rem' }}>
        <div style={{
          background: 'rgba(19,41,71,0.6)',
          border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: '12px',
          padding: '1.25rem',
        }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: showFilters ? '1rem' : 0 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#D4AF37' }} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Describe your legal issue or search by case name, section, or keywords..."
                className="input-field"
                style={{ paddingLeft: '2.5rem', fontSize: '0.925rem', padding: '0.75rem 0.875rem 0.75rem 2.5rem' }}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary"
              style={{ whiteSpace: 'nowrap' }}
            >
              <Filter size={14} />
              Filters
              <ChevronDown size={12} style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </button>
            <button type="submit" disabled={isPending || !query.trim()} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
              {isPending ? <Loader2 size={15} /> : <Search size={15} />}
              {isPending ? 'Searching...' : 'Search'}
            </button>
          </div>

          {showFilters && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(212,175,55,0.1)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 500 }}>Case Type</label>
                <select value={filters.case_type} onChange={e => setFilters(f => ({ ...f, case_type: e.target.value }))} className="input-field" style={{ fontSize: '0.8rem' }}>
                  <option value="">All Types</option>
                  {CASE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 500 }}>Court</label>
                <select value={filters.court} onChange={e => setFilters(f => ({ ...f, court: e.target.value }))} className="input-field" style={{ fontSize: '0.8rem' }}>
                  <option value="">All Courts</option>
                  <option value="Supreme Court">Supreme Court</option>
                  <option value="High Court">High Court</option>
                  <option value="District Court">District Court</option>
                  <option value="Sessions Court">Sessions Court</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 500 }}>Year From</label>
                <input type="number" value={filters.year_from} onChange={e => setFilters(f => ({ ...f, year_from: e.target.value }))} placeholder="2000" className="input-field" style={{ fontSize: '0.8rem' }} min="1950" max="2024" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 500 }}>Results</label>
                <select value={filters.top_k} onChange={e => setFilters(f => ({ ...f, top_k: e.target.value }))} className="input-field" style={{ fontSize: '0.8rem' }}>
                  <option value="3">Top 3</option>
                  <option value="5">Top 5</option>
                  <option value="8">Top 8</option>
                  <option value="10">Top 10</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Suggestions */}
      {!data && !isPending && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginBottom: '0.75rem' }}>Try searching for:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[
              'Triple talaq Muslim women rights',
              'Bail application personal liberty',
              'Cheque bounce dishonour NI Act',
              'Domestic violence shared household',
              'Section 377 LGBTQ fundamental rights',
              'Right to privacy fundamental right',
            ].map(s => (
              <button key={s} onClick={() => { setQuery(s); }} style={{
                background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)',
                borderRadius: '20px', padding: '0.3rem 0.875rem',
                color: '#94a3b8', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#D4AF37'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.15)' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '1rem', color: '#f87171', marginBottom: '1rem' }}>
          {(error as any)?.response?.data?.detail || 'Search failed. Please try again.'}
        </div>
      )}

      {/* Results */}
      {data && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontWeight: 700, color: '#f1f5f9' }}>{data.total} results</span>
              <span style={{ color: '#64748b', fontSize: '0.875rem' }}> for "{data.query}"</span>
            </div>
            <button onClick={() => { }} className="btn-ghost" style={{ fontSize: '0.75rem' }}>
              <X size={12} /> Clear
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.results.map((case_: CaseResult) => (
              <div key={case_.case_id} className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#D4AF37', background: 'rgba(212,175,55,0.1)', padding: '0.1rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.2)' }}>
                        {case_.case_id}
                      </span>
                      {case_.case_type && <span className={`badge badge-blue`}>{case_.case_type}</span>}
                      {case_.outcome && <span className={`badge ${getOutcomeClass(case_.outcome)}`}>{case_.outcome}</span>}
                      {case_.year && <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{case_.year}</span>}
                    </div>
                    <h3 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                      {case_.title}
                    </h3>
                    {case_.court && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>{case_.court}</div>}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: getScoreColor(case_.similarity_score) }}>
                      {(case_.similarity_score * 100).toFixed(0)}%
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>similarity</div>
                  </div>
                </div>

                <div style={{ position: 'relative', marginBottom: '0.875rem' }}>
                  <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${case_.similarity_score * 100}%`, height: '100%', background: `linear-gradient(90deg, ${getScoreColor(case_.similarity_score)}, ${getScoreColor(case_.similarity_score)}80)`, borderRadius: '9999px' }} />
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, margin: 0, marginBottom: '0.875rem' }}>
                  {case_.summary}
                </p>

                {expanded === case_.case_id && (
                  <div className="animate-fade-in" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.875rem' }}>
                    {case_.key_points && (
                      <div style={{ marginBottom: '0.875rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.375rem' }}>KEY POINTS</div>
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          {case_.key_points.map((pt, i) => (
                            <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                              <span style={{ color: '#D4AF37', flexShrink: 0 }}>•</span> {pt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {case_.relevant_sections && (
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.375rem' }}>RELEVANT SECTIONS</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                          {case_.relevant_sections.map((s, i) => <span key={i} className="tag">{s}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button onClick={() => setExpanded(expanded === case_.case_id ? null : case_.case_id)} className="btn-ghost" style={{ fontSize: '0.78rem' }}>
                    {expanded === case_.case_id ? 'Show Less' : 'View Details'}
                    <ChevronDown size={12} style={{ transform: expanded === case_.case_id ? 'rotate(180deg)' : 'none' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
