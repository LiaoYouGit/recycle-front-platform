/**
 * 格式化金额
 */
export function formatMoney(amount: number | string, decimals = 2): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return '0.00'
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 格式化金额带符号
 */
export function formatMoneyWithSymbol(amount: number | string): string {
  return '¥' + formatMoney(amount)
}

/**
 * 解析日期字符串（兼容各种格式）
 */
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null
  // 处理 2026-04-09T15:49:21 或 2026-04-09 15:49:21.123456 等格式
  const cleaned = dateStr.replace(/\.\d+$/, '').replace('T', ' ')
  const parts = cleaned.match(/(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})/)
  if (parts) {
    return new Date(
      parseInt(parts[1]),
      parseInt(parts[2]) - 1,
      parseInt(parts[3]),
      parseInt(parts[4]),
      parseInt(parts[5]),
      parseInt(parts[6])
    )
  }
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d
}

/**
 * 格式化日期时间
 */
export function formatDateTime(dateStr: string | null | undefined): string {
  const date = parseDate(dateStr)
  if (!date) return '-'
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}:${s}`
}

/**
 * 格式化日期（不含时间）
 */
export function formatDate(dateStr: string | null | undefined): string {
  const date = parseDate(dateStr)
  if (!date) return '-'
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * 订单状态映射
 */
export const ORDER_STATUS_MAP: Record<number, { text: string; type: string }> = {
  0: { text: '待接单', type: 'warning' },
  1: { text: '已接单', type: 'primary' },
  2: { text: '已取货', type: '' },
  3: { text: '已完成', type: 'success' },
  4: { text: '已取消', type: 'info' },
}

/**
 * 财务类型映射
 */
export const FINANCE_TYPE_MAP: Record<number, { text: string; type: string }> = {
  0: { text: '采购支出', type: 'danger' },
  1: { text: '其他支出', type: 'warning' },
  2: { text: '收入', type: 'success' },
}

/**
 * 防抖
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay = 300): T {
  let timer: ReturnType<typeof setTimeout> | null = null
  return function (this: any, ...args: any[]) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  } as T
}
