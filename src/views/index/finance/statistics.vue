<template>
  <div>
    <el-card>
      <template #header>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <span style="font-size: 16px; font-weight: bold">财务统计</span>
          <div style="display: flex; gap: 12px; align-items: center">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              style="width: 280px"
            />
            <el-button type="primary" @click="loadData">查询</el-button>
          </div>
        </div>
      </template>

      <div class="stats-grid" v-loading="loading">
        <div class="stat-card purchase">
          <div class="stat-label">采购支出</div>
          <div class="stat-value">
            ¥{{ formatMoney(stats.purchaseExpense) }}
          </div>
        </div>
        <div class="stat-card other">
          <div class="stat-label">其他支出</div>
          <div class="stat-value">¥{{ formatMoney(stats.otherExpense) }}</div>
        </div>
        <div class="stat-card income">
          <div class="stat-label">总收入</div>
          <div class="stat-value">¥{{ formatMoney(stats.totalIncome) }}</div>
        </div>
        <div class="stat-card expense">
          <div class="stat-label">总支出</div>
          <div class="stat-value">¥{{ formatMoney(stats.totalExpense) }}</div>
        </div>
        <div class="stat-card profit">
          <div class="stat-label">净利润</div>
          <div
            class="stat-value"
            :class="{ negative: parseFloat(stats.profit) < 0 }"
          >
            ¥{{ formatMoney(stats.profit) }}
          </div>
        </div>
        <div class="stat-card count">
          <div class="stat-label">
            记录数
            <div class="stat-value">{{ stats.recordCount }}</div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
definePage({ meta: { title: '财务统计' } })
import { ref, reactive, onMounted } from 'vue'
import { getFinanceStatistics } from '@/api'
import { formatMoney } from '@/utils/index'

const loading = ref(false)
const dateRange = ref<string[]>([])

const stats = reactive({
  totalExpense: 0,
  purchaseExpense: 0,
  otherExpense: 0,
  totalIncome: 0,
  profit: 0,
  recordCount: 0
})

const loadData = async () => {
  loading.value = true
  try {
    const params: any = {}
    if (dateRange.value && dateRange.value.length === 2) {
      params.startDate = dateRange.value[0]
      params.endDate = dateRange.value[1]
    }
    const data = (await getFinanceStatistics(params)) as any
    Object.assign(stats, data)
  } finally {
    loading.value = false
  }
}

onMounted(() => loadData())
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.stat-card {
  padding: 24px;
  border-radius: 8px;
  text-align: center;
}

.stat-card.purchase {
  background: #fff1f0;
}
.stat-card.other {
  background: #fff7e6;
}
.stat-card.income {
  background: #f6ffed;
}
.stat-card.expense {
  background: #e6f7ff;
}
.stat-card.profit {
  background: #f9f0ff;
}
.stat-card.count {
  background: #f0f5ff;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.stat-value.negative {
  color: #f56c6c;
}
</style>
