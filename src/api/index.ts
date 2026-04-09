import { get, post, put, del } from '../utils/request'

// ===== 认证 =====
export function login(data: { username: string; password: string }) {
  return post('/auth/login', data)
}

// ===== 回收订单 =====
export function getOrderList(params: { status?: number; page: number; size: number }) {
  return get('/order/list', params)
}
export function acceptOrder(id: number) {
  return put(`/order/accept/${id}`)
}
export function pickupOrder(id: number, actualPrice: number) {
  return put(`/order/pickup/${id}`, { actualPrice })
}
export function completeOrder(id: number) {
  return put(`/order/complete/${id}`)
}
export function cancelOrder(id: number) {
  return put(`/order/cancel/${id}`)
}

// ===== 库存 =====
export function getInventoryList(params: { page: number; size: number }) {
  return get('/inventory/list', params)
}
export function addInventory(data: any) {
  return post('/inventory/add', data)
}
export function updateInventory(id: number, data: any) {
  return put(`/inventory/update/${id}`, data)
}
export function deleteInventory(id: number) {
  return del(`/inventory/${id}`)
}

// ===== 财务 =====
export function getFinanceList(params: { type?: number; page: number; size: number }) {
  return get('/finance/list', params)
}
export function addFinanceRecord(data: any) {
  return post('/finance/add', data)
}
export function getFinanceStatistics(params?: { startDate?: string; endDate?: string }) {
  return get('/finance/statistics', params)
}

// ===== 品类管理 =====
export function getCategoryManageList(params: { page: number; size: number }) {
  return get('/category/manage/list', params)
}
export function addCategory(data: { name: string; unit: string; price: number; sortOrder?: number }) {
  return post('/category/manage/add', data)
}
export function updateCategory(id: number, data: any) {
  return put(`/category/manage/update/${id}`, data)
}
export function deleteCategory(id: number) {
  return del(`/category/manage/delete/${id}`)
}
