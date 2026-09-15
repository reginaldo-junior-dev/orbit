const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export class ApiError extends Error {
  constructor(status, message, fieldErrors = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

function getCookie(name) {
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null
}

let csrfPromise = null

function loadCsrfToken() {
  return fetch(`${API_URL}/csrf`, { credentials: 'include' }).then((response) => {
    if (!response.ok) {
      throw new ApiError(response.status, 'Could not start a secure session. Please try again.')
    }
    const token = getCookie('XSRF-TOKEN')
    if (!token) {
      throw new ApiError(0, 'Could not start a secure session. Please try again.')
    }
    return token
  })
}

function ensureCsrf() {
  const existing = getCookie('XSRF-TOKEN')
  if (existing) return Promise.resolve(existing)
  if (!csrfPromise) {
    csrfPromise = loadCsrfToken().catch((error) => {
      csrfPromise = null
      throw error
    })
  }
  return csrfPromise
}

async function errorBody(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function apiFetch(path, { method = 'GET', body, headers } = {}) {
  const isMutating = method !== 'GET'
  const csrfHeader = isMutating ? { 'X-XSRF-TOKEN': await ensureCsrf() } : {}

  const response = await fetch(`${API_URL}${path}`, {
    method,
    credentials: 'include',
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...csrfHeader,
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status === 401 && !path.startsWith('/login') && !path.startsWith('/register')) {
    window.dispatchEvent(new Event('orbit:unauthorized'))
  }

  if (!response.ok) {
    const body = await errorBody(response)
    const message =
      body?.mensagem ?? body?.message ?? 'Something went wrong. Please try again.'
    throw new ApiError(response.status, message, body?.erros ?? null)
  }

  if (response.status === 204) return null
  return response.json()
}
