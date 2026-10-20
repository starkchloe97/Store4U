import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
})

export async function prepareCsrfCookie() {
  const apiOrigin = new URL(http.defaults.baseURL).origin
  await axios.get(`${apiOrigin}/sanctum/csrf-cookie`, {
    withCredentials: true,
    withXSRFToken: true,
  })
}

export default http
