import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/auth'

const Layout = () => import('@/views/layout/index.vue')

// 菜单配置：path 对应 views 下的目录
const menuRoutes = [
  { path: '/category/list', name: 'CategoryList', title: '品类管理', view: 'category/index' },
  { path: '/order/list', name: 'OrderList', title: '回收订单', view: 'order/index' },
  { path: '/inventory/list', name: 'InventoryList', title: '库存管理', view: 'inventory/index' },
  { path: '/finance/list', name: 'FinanceList', title: '财务记录', view: 'finance/list' },
  { path: '/finance/statistics', name: 'FinanceStatistics', title: '财务统计', view: 'finance/statistics' },
]

// 预声明所有页面组件的动态 import
const pages = import.meta.glob('@/views/**/*.vue')

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', public: true },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/category/list',
    children: menuRoutes.map((r) => ({
      path: r.path.replace(/^\//, ''),
      name: r.name,
      component: pages[`/src/views/${r.view}.vue`],
      meta: { title: r.title },
    })),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  document.title = (to.meta?.title as string) || '上门回收管理后台'

  if (to.meta?.public) {
    next()
  } else {
    const token = getToken()
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router

export { menuRoutes }
