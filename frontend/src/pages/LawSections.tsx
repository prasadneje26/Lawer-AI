import { useState } from 'react'
import { BookOpen, Search, ChevronDown, Loader2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { lawApi } from '../lib/api'

export default function LawSections() {
  const [query, setQuery] = useState('')
  const [act, setAct] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const { mutate, data, isPending } = useMutation({
    mutationFn: () => lawApi.findSections({ query, act: act || undefined }),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    mutate()
  }

  const ACTS = [
    'Indian Penal Code, 1860',
    'Code of Criminal Procedure, 1973',
    'Code of Civil Procedure, 1908',
    'Indian Evidence Act, 1872',
    'Indian Contract Act, 1872',
    'Constitution of India',
    'Negotiable Instruments Act, 1881',
    'Hindu Marriage Act, 1955',
    'Protection of Women from Domestic Violence Act, 2005',
    'Right to Information Act, 2005',
  ]

  const SUGGESTIONS = [
    'Murder punishment',
    'Bail non-bailable offence',
    'Cheque dishonour penalty',
    'Cruelty by husband',
    'Maintenance wife children',
    'Equality fundamental rights',
    'Right to life liberty',
    'Contract without consideration',
  ]

  return (
    <div style={{ maxWidth: '860px' }}>
      <form onSubmit={handleSearch} style={{ marginBottom: '1.5rem' }}>
        <div style={{ background: 'rgba(19,41,71,0.6)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.75rem', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500, marginBottom: '0.375rem' }}>
                Describe your legal query
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#D4AF37' }} />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="e.g., punishment for murder, bail conditions, cheque bounce..."
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500, marginBottom: '0.375rem' }}>
                Filter by Act
              </label>
              <select value={act} onChange={e => setAct(e.target.value)} className="input-field" style={{ minWidth: '220px' }}>
                <option value="">All Acts</option>
                {ACTS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <button type="submit" disabled={isPending || !query.trim()} className="btn-primary" style={{ height: 'fit-content' }}>
              {isPending ? <Loader2 size={14} /> : <Search size={14} />}
              {isPending ? 'Searching...' : 'Find Sections'}
            </button>
          </div>
        </div>
      </form>

      {!data && !isPending && (
        <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginBottom: '0.75rem' }}>Common searches:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => setQuery(s)} style={{
                background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.15)',
                borderRadius: '20px', padding: '0.3rem 0.875rem',
                color: '#94a3b8', fontSize: '0.78rem', cursor: 'pointer',
              }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {data && (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={15} color="#D4AF37" />
            <span style={{ fontWeight: 700, color: '#f1f5f9' }}>{data.sections.length} sections found</span>
            <span style={{ color: '#64748b', fontSize: '0.875rem' }}>for "{data.query}"</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.sections.map((section: any) => (
              <div key={section.section + section.act} className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #D4AF37, #b89222)',
                        color: '#0B1F3A',
                        fontWeight: 700, fontSize: '0.78rem',
                        padding: '0.2rem 0.625rem',
                        borderRadius: '6px',
                      }}>
                        {section.section}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>{section.act}</span>
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                      {section.title}
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '1.125rem', fontWeight: 800, color: section.relevance_score >= 0.75 ? '#22c55e' : '#D4AF37' }}>
                      {(section.relevance_score * 100).toFixed(0)}%
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>relevance</div>
                  </div>
                </div>

                <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.875rem' }}>
                  <div style={{ width: `${section.relevance_score * 100}%`, height: '100%', background: 'linear-gradient(90deg, #D4AF37, #e8c84a)', borderRadius: '999px' }} />
                </div>

                <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
                  {section.description}
                </p>

                {expanded === section.section && section.related_sections && (
                  <div className="animate-fade-in" style={{ marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>RELATED SECTIONS</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                      {section.related_sections.map((s: string, i: number) => <span key={i} className="tag">{s}</span>)}
                    </div>
                  </div>
                )}

                {section.related_sections?.length > 0 && (
                  <button onClick={() => setExpanded(expanded === section.section ? null : section.section)} className="btn-ghost" style={{ marginTop: '0.75rem', fontSize: '0.78rem' }}>
                    {expanded === section.section ? 'Hide' : 'Related Sections'}
                    <ChevronDown size={11} style={{ transform: expanded === section.section ? 'rotate(180deg)' : 'none' }} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
