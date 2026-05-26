import { useState } from 'react'
import { FileText, Download, Loader2, RefreshCw, Upload, CheckCircle2 } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { documentApi } from '../lib/api'
import { DOCUMENT_TYPES } from '../lib/utils'

const DOCUMENT_FIELDS: Record<string, { key: string; label: string; placeholder: string; type?: string }[]> = {
  'FIR Draft': [
    { key: 'complainant_name', label: 'Complainant Name', placeholder: 'Full name' },
    { key: 'address', label: 'Address', placeholder: 'Residential address' },
    { key: 'phone', label: 'Phone Number', placeholder: '9XXXXXXXXX' },
    { key: 'police_station', label: 'Police Station', placeholder: 'Police Station Name' },
    { key: 'district', label: 'District', placeholder: 'District name' },
    { key: 'state', label: 'State', placeholder: 'State name' },
    { key: 'incident_date', label: 'Incident Date', placeholder: 'DD/MM/YYYY' },
    { key: 'incident_place', label: 'Incident Place', placeholder: 'Location of incident' },
    { key: 'accused_name', label: 'Accused Name', placeholder: 'Name of accused (if known)' },
    { key: 'sections', label: 'Applicable Sections', placeholder: 'e.g., Section 302, 307 IPC' },
    { key: 'incident_description', label: 'Incident Description', placeholder: 'Describe the incident in detail...', type: 'textarea' },
    { key: 'evidence', label: 'Evidence Available', placeholder: 'CCTV footage, witnesses, documents...' },
  ],
  'Bail Application': [
    { key: 'accused_name', label: 'Accused Name', placeholder: 'Full name of accused' },
    { key: 'age', label: 'Age', placeholder: 'Age in years' },
    { key: 'father_name', label: "Father's Name", placeholder: "Father's full name" },
    { key: 'address', label: 'Address', placeholder: 'Residential address' },
    { key: 'court', label: 'Court Name', placeholder: 'e.g., Sessions Court, Mumbai' },
    { key: 'case_number', label: 'Case Number', placeholder: 'FIR/Case No.' },
    { key: 'arrest_date', label: 'Arrest Date', placeholder: 'DD/MM/YYYY' },
    { key: 'sections', label: 'Sections Charged', placeholder: 'e.g., Section 302 IPC' },
    { key: 'act', label: 'Act', placeholder: 'Indian Penal Code / Other Act' },
    { key: 'family_details', label: 'Family Details', placeholder: 'Spouse, children, dependents...' },
    { key: 'enroll_number', label: 'Advocate Enroll No.', placeholder: 'Bar Council Number' },
  ],
  'Legal Notice': [
    { key: 'client_name', label: 'Your Client Name', placeholder: 'Client full name' },
    { key: 'client_address', label: 'Client Address', placeholder: 'Client residential address' },
    { key: 'client_description', label: 'Client Description', placeholder: 'Brief background of client' },
    { key: 'recipient_name', label: 'Notice Recipient', placeholder: 'Name of opposite party' },
    { key: 'recipient_address', label: 'Recipient Address', placeholder: 'Address of recipient' },
    { key: 'subject', label: 'Subject of Notice', placeholder: 'e.g., Recovery of money due' },
    { key: 'facts_of_case', label: 'Facts of Case', placeholder: 'Brief facts leading to this notice...', type: 'textarea' },
    { key: 'demand', label: 'Your Demand', placeholder: 'What you are demanding from them' },
    { key: 'days', label: 'Days to Comply', placeholder: '15' },
    { key: 'applicable_law', label: 'Applicable Law', placeholder: 'Relevant sections/acts' },
    { key: 'liability_details', label: 'Liability Details', placeholder: 'Legal basis of liability' },
    { key: 'loss_details', label: 'Loss/Damage', placeholder: 'Amount/nature of damages suffered' },
    { key: 'advocate_name', label: 'Advocate Name', placeholder: 'Your name' },
    { key: 'bar_number', label: 'Bar Council No.', placeholder: 'Enrollment number' },
    { key: 'advocate_address', label: 'Advocate Address', placeholder: 'Your office address' },
    { key: 'advocate_phone', label: 'Advocate Phone', placeholder: 'Contact number' },
  ],
  'RTI Application': [
    { key: 'applicant_name', label: 'Applicant Name', placeholder: 'Your full name' },
    { key: 'father_name', label: "Father's Name", placeholder: "Father's full name" },
    { key: 'applicant_address', label: 'Your Address', placeholder: 'Residential/communication address' },
    { key: 'phone', label: 'Phone Number', placeholder: 'Contact number' },
    { key: 'email', label: 'Email', placeholder: 'your@email.com' },
    { key: 'department', label: 'Department/Ministry', placeholder: 'e.g., Municipal Corporation, Revenue Dept.' },
    { key: 'address', label: 'Department Address', placeholder: 'Address of the public authority' },
    { key: 'question_1', label: 'Information Sought 1', placeholder: 'First specific information request...' },
    { key: 'question_2', label: 'Information Sought 2', placeholder: 'Second specific request...' },
    { key: 'question_3', label: 'Information Sought 3', placeholder: 'Third specific request...' },
    { key: 'question_4', label: 'Information Sought 4', placeholder: 'Fourth specific request (if any)...' },
    { key: 'time_period', label: 'Time Period', placeholder: 'e.g., Last 5 years, 2019-2024' },
    { key: 'format', label: 'Preferred Format', placeholder: 'Hard Copy / Soft Copy / Both' },
  ],
}

export default function Documents() {
  const [docType, setDocType] = useState('')
  const [fields, setFields] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<'generate' | 'summarize' | 'history'>('generate')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [copied, setCopied] = useState(false)

  const { mutate: generate, data: genData, isPending: genLoading, reset } = useMutation({
    mutationFn: () => documentApi.generate({ document_type: docType, details: fields }),
  })

  const { mutate: summarize, data: sumData, isPending: sumLoading } = useMutation({
    mutationFn: () => documentApi.summarize(uploadFile!),
  })

  const { data: history } = useQuery({
    queryKey: ['my-documents'],
    queryFn: documentApi.myDocuments,
    enabled: activeTab === 'history',
  })

  const handleFieldChange = (key: string, val: string) => setFields(f => ({ ...f, [key]: val }))

  const handleDownload = () => {
    if (!genData) return
    const blob = new Blob([genData.document], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${genData.document_type.replace(/\s+/g, '_')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = () => {
    if (genData) {
      navigator.clipboard.writeText(genData.document)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const currentFields = DOCUMENT_FIELDS[docType] || []

  return (
    <div style={{ maxWidth: '1000px' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.5rem', background: 'rgba(11,31,58,0.5)', borderRadius: '10px', padding: '0.25rem', width: 'fit-content' }}>
        {[
          { key: 'generate', label: 'Generate Document' },
          { key: 'summarize', label: 'Summarize Judgment' },
          { key: 'history', label: 'My Documents' },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key as any)} style={{
            padding: '0.5rem 1.125rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 500,
            transition: 'all 0.15s',
            background: activeTab === t.key ? 'linear-gradient(135deg, #D4AF37, #b89222)' : 'transparent',
            color: activeTab === t.key ? '#0B1F3A' : '#94a3b8',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'generate' && (
        <div style={{ display: 'grid', gridTemplateColumns: genData ? '1fr 1fr' : '1fr', gap: '1.25rem' }}>
          <div>
            {/* Doc Type Selector */}
            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.625rem' }}>
                SELECT DOCUMENT TYPE
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                {DOCUMENT_TYPES.map(type => (
                  <button key={type} onClick={() => { setDocType(type); setFields({}); reset() }} style={{
                    padding: '0.625rem 0.875rem',
                    borderRadius: '8px',
                    border: `1px solid ${docType === type ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.06)'}`,
                    background: docType === type ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.02)',
                    color: docType === type ? '#D4AF37' : '#94a3b8',
                    fontSize: '0.8rem',
                    fontWeight: docType === type ? 600 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}>
                    <FileText size={13} style={{ display: 'inline', marginRight: '0.375rem', verticalAlign: 'middle' }} />
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Fields */}
            {docType && (
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '1rem' }}>
                  {docType} — Details
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {currentFields.map(f => (
                    <div key={f.key}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.3rem' }}>{f.label}</label>
                      {f.type === 'textarea'
                        ? <textarea value={fields[f.key] || ''} onChange={e => handleFieldChange(f.key, e.target.value)} placeholder={f.placeholder} className="input-field" style={{ minHeight: '80px', resize: 'vertical' }} />
                        : <input value={fields[f.key] || ''} onChange={e => handleFieldChange(f.key, e.target.value)} placeholder={f.placeholder} className="input-field" />
                      }
                    </div>
                  ))}
                  {!currentFields.length && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.3rem' }}>Party Names</label>
                        <input value={fields.parties || ''} onChange={e => handleFieldChange('parties', e.target.value)} placeholder="Names of parties involved" className="input-field" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.3rem' }}>Subject</label>
                        <input value={fields.subject || ''} onChange={e => handleFieldChange('subject', e.target.value)} placeholder="Subject of document" className="input-field" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.3rem' }}>Details</label>
                        <textarea value={fields.details || ''} onChange={e => handleFieldChange('details', e.target.value)} placeholder="Provide relevant details..." className="input-field" style={{ minHeight: '100px' }} />
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={() => generate()} disabled={genLoading || !docType} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '0.75rem' }}>
                  {genLoading ? <Loader2 size={15} /> : <FileText size={15} />}
                  {genLoading ? 'Generating...' : 'Generate Document'}
                </button>
              </div>
            )}
          </div>

          {genData && (
            <div className="glass-card animate-fade-in" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9' }}>{genData.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{genData.word_count} words</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={handleCopy} className="btn-ghost" style={{ fontSize: '0.75rem' }}>
                    {copied ? <CheckCircle2 size={13} color="#22c55e" /> : null}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button onClick={handleDownload} className="btn-primary" style={{ fontSize: '0.78rem' }}>
                    <Download size={13} /> Download
                  </button>
                  <button onClick={() => generate()} className="btn-secondary" style={{ fontSize: '0.75rem' }}>
                    <RefreshCw size={12} />
                  </button>
                </div>
              </div>
              <div style={{
                flex: 1, overflowY: 'auto',
                background: 'rgba(11,31,58,0.6)',
                border: '1px solid rgba(212,175,55,0.1)',
                borderRadius: '8px',
                padding: '1rem',
                fontFamily: '"Courier New", monospace',
                fontSize: '0.78rem',
                lineHeight: 1.7,
                color: '#cbd5e1',
                whiteSpace: 'pre-wrap',
                maxHeight: '500px',
              }}>
                {genData.document}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'summarize' && (
        <div style={{ maxWidth: '680px' }}>
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '1rem' }}>
              Upload Judgment for AI Summarization
            </div>
            <div
              style={{
                border: `2px dashed ${uploadFile ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '10px', padding: '2rem', textAlign: 'center',
                background: uploadFile ? 'rgba(212,175,55,0.04)' : 'transparent',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload size={28} color={uploadFile ? '#D4AF37' : '#4b5563'} style={{ margin: '0 auto 0.75rem', display: 'block' }} />
              {uploadFile
                ? <><div style={{ color: '#D4AF37', fontWeight: 600, fontSize: '0.875rem' }}>{uploadFile.name}</div><div style={{ color: '#64748b', fontSize: '0.75rem' }}>{(uploadFile.size / 1024).toFixed(1)} KB</div></>
                : <><div style={{ color: '#94a3b8', fontWeight: 500 }}>Click to upload PDF, DOCX, or TXT</div><div style={{ color: '#4b5563', fontSize: '0.75rem', marginTop: '0.25rem' }}>Judgment document for AI summarization</div></>
              }
              <input id="file-upload" type="file" accept=".pdf,.docx,.txt" style={{ display: 'none' }} onChange={e => setUploadFile(e.target.files?.[0] || null)} />
            </div>
            <button onClick={() => summarize()} disabled={!uploadFile || sumLoading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '0.75rem' }}>
              {sumLoading ? <Loader2 size={15} /> : <FileText size={15} />}
              {sumLoading ? 'Analyzing...' : 'Summarize Judgment'}
            </button>
          </div>

          {sumData && (
            <div className="glass-card animate-fade-in" style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem' }}>Judgment Analysis</div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.5rem' }}>SUMMARY</div>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>{sumData.summary}</p>
              </div>
              {sumData.verdict && (
                <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', padding: '0.875rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 600, marginBottom: '0.25rem' }}>VERDICT</div>
                  <div style={{ fontSize: '0.875rem', color: '#e2e8f0' }}>{sumData.verdict}</div>
                </div>
              )}
              {sumData.key_points?.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.5rem' }}>KEY POINTS</div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {sumData.key_points.map((pt: string, i: number) => (
                      <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                        <span style={{ color: '#D4AF37' }}>•</span> {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          {history?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {history.map((doc: any) => (
                <div key={doc.id} className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '38px', height: '38px', background: 'rgba(212,175,55,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={17} color="#D4AF37" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0' }}>{doc.title || doc.document_type}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{doc.document_type} · {doc.word_count} words · {new Date(doc.created_at).toLocaleDateString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#4b5563' }}>
              <FileText size={40} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.3 }} />
              <p style={{ margin: 0, fontSize: '0.875rem' }}>No documents generated yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
