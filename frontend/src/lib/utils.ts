export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

export function formatPercent(val: number): string {
  return `${(val * 100).toFixed(1)}%`
}

export function getActionLabel(action: string): string {
  const labels: Record<string, string> = {
    login: 'Logged In',
    register: 'Account Created',
    case_search: 'Case Searched',
    document_generated: 'Document Generated',
    prediction_made: 'Prediction Made',
  }
  return labels[action] || action
}

export function getActionIcon(action: string): string {
  const icons: Record<string, string> = {
    login: '🔐',
    register: '👤',
    case_search: '🔍',
    document_generated: '📄',
    prediction_made: '⚖️',
  }
  return icons[action] || '📋'
}

export const DOCUMENT_TYPES = [
  'FIR Draft',
  'Bail Application',
  'Legal Notice',
  'Affidavit',
  'Agreement',
  'RTI Application',
  'Petition',
  'Contract',
  'Complaint Letter',
  'Court Application',
]

export const CASE_TYPES = [
  'Criminal',
  'Civil',
  'Constitutional',
  'Family',
  'Property',
  'Cheque Bounce',
  'Labour',
  'Tax',
  'Intellectual Property',
  'Consumer',
]
