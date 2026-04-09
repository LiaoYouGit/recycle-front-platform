<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside">
      <div class="logo">
        <span class="logo-icon">♻️</span>
        <span v-if="!isCollapse" class="logo-text">上门回收</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        router
        background-color="transparent"
        text-color="rgba(255,255,255,0.65)"
        active-text-color="#fff"
        class="side-menu"
      >
        <el-menu-item index="/category/list">
          <el-icon><PriceTag /></el-icon>
          <template #title>品类管理</template>
        </el-menu-item>
        <el-menu-item index="/order/list">
          <el-icon><List /></el-icon>
          <template #title>回收订单</template>
        </el-menu-item>
        <el-menu-item index="/inventory/list">
          <el-icon><Box /></el-icon>
          <template #title>库存管理</template>
        </el-menu-item>
        <el-menu-item index="/finance/list">
          <el-icon><Document /></el-icon>
          <template #title>财务记录</template>
        </el-menu-item>
        <el-menu-item index="/finance/statistics">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>财务统计</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 头部 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-avatar :size="32" style="background: #07c160; font-size: 14px">
            {{ (userInfo?.realName || userInfo?.username || '管')[0] }}
          </el-avatar>
          <span class="username">{{
            userInfo?.realName || userInfo?.username || '管理员'
          }}</span>
          <el-button type="danger" text size="small" @click="handleLogout"
            >退出</el-button
          >
        </div>
      </el-header>

      <!-- 内容区 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserInfo, clearAuth } from '@/utils/auth'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)
const userInfo = ref(getUserInfo())

const activeMenu = computed(() => route.path)

const currentTitle = computed(() => {
  const map: Record<string, string> = {
    '/category/list': '品类管理',
    '/order/list': '回收订单',
    '/inventory/list': '库存管理',
    '/finance/list': '财务记录',
    '/finance/statistics': '财务统计'
  }
  return map[route.path] || '首页'
})

const handleLogout = () => {
  clearAuth()
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.aside {
  background: linear-gradient(180deg, #001529 0%, #002140 100%);
  transition: width 0.3s;
  overflow: hidden;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0 12px;
  cursor: pointer;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 1px;
  white-space: nowrap;
}

.side-menu {
  border-right: none;
  padding-top: 8px;
}

.side-menu .el-menu-item {
  margin: 2px 8px;
  border-radius: 8px;
  height: 44px;
  line-height: 44px;
}

.side-menu .el-menu-item.is-active {
  background: #07c160 !important;
  color: #fff !important;
}

.side-menu .el-menu-item:hover:not(.is-active) {
  background: rgba(255, 255, 255, 0.08) !important;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  padding: 0 24px;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.collapse-btn:hover {
  color: #07c160;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.main-content {
  background: #f0f2f5;
  padding: 20px;
}
</style>
