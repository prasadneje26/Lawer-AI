import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lawer_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('lawer_token')
      localStorage.removeItem('lawer_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then(r => r.data),
  register: (data: any) =>
    api.post('/auth/register', data).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
  logout: () => api.post('/auth/logout').then(r => r.data),
}

export const caseApi = {
  search: (payload: any) =>
    api.post('/cases/search', payload).then(r => r.data),
}

export const lawApi = {
  findSections: (payload: any) =>
    api.post('/law-sections', payload).then(r => r.data),
}

export const documentApi = {
  generate: (payload: any) =>
    api.post('/documents/generate-document', payload).then(r => r.data),
  summarize: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/documents/summarize-judgment', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },
  myDocuments: () => api.get('/documents/my-documents').then(r => r.data),
}

export const predictionApi = {
  predict: (payload: any) =>
    api.post('/predictions', payload).then(r => r.data),
  myPredictions: () => api.get('/predictions/my-predictions').then(r => r.data),
}

export const dashboardApi = {
  stats: () => api.get('/dashboard/stats').then(r => r.data),
}

export const adminApi = {
  stats: () => api.get('/admin/stats').then(r => r.data),
  users: (skip = 0, limit = 20) =>
    api.get(`/admin/users?skip=${skip}&limit=${limit}`).then(r => r.data),
  toggleUser: (id: number) =>
    api.patch(`/admin/users/${id}/toggle-active`).then(r => r.data),
  auditLogs: (skip = 0) =>
    api.get(`/admin/audit-logs?skip=${skip}&limit=50`).then(r => r.data),
  analytics: () => api.get('/admin/analytics').then(r => r.data),
}
