import { ElMessage, ElMessageBox } from 'element-plus'

const BASE_URL = '/api/manage'

interface RequestOptions {
  url: string
  method?: string
  data?: any
  params?: any
  showMsg?: boolean
}

interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

function getToken(): string {
  return localStorage.getItem('token') || ''
}

async function request<T = any>(options: RequestOptions): Promise<T> {
  const { url, method = 'GET', data, params, showMsg = true } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const queryString = params
    ? '?' + new URLSearchParams(params).toString()
    : ''

  const response = await fetch(BASE_URL + url + queryString, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  })

  const result: ApiResponse<T> = await response.json()

  if (result.code === 200 && result.success) {
    return result.data
  }

  if (result.code === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    ElMessage.error('登录已过期，请重新登录')
    window.location.href = '/login'
    return Promise.reject(new Error(result.message))
  }

  if (showMsg) {
    ElMessage.error(result.message || '请求失败')
  }
  return Promise.reject(new Error(result.message))
}

export function get<T = any>(url: string, params?: any) {
  return request<T>({ url, method: 'GET', params })
}

export function post<T = any>(url: string, data?: any) {
  return request<T>({ url, method: 'POST', data })
}

export function put<T = any>(url: string, data?: any) {
  return request<T>({ url, method: 'PUT', data })
}

export function del<T = any>(url: string, data?: any) {
  return request<T>({ url, method: 'DELETE', data })
}

export { getToken }
