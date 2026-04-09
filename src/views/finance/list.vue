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
          <span style="font-size: 16px; font-weight: bold">财务记录</span>
          <div style="display: flex; gap: 12px">
            <el-select
              v-model="queryType"
              placeholder="类型筛�?"
              clearable
              style="width: 130px"
              @change="loadData"
            >
              <el-option label="采购支出" :value="0" />
              <el-option label="其他支出" :value="1" />
              <el-option label="收入" :value="2" />
            </el-select>
            <el-button type="primary" @click="handleAdd">新增记录</el-button>
          </div>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag
              :type="FINANCE_TYPE_MAP[row.type]?.type || 'info'"
              size="small"
            >
              {{ FINANCE_TYPE_MAP[row.type]?.text || '未知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="{ row }">
            <span
              :style="{
                color: row.type === 2 ? '#67c23a' : '#f56c6c',
                fontWeight: 'bold'
              }"
            >
              {{ row.type === 2 ? '+' : '-' }}¥{{ formatMoney(row.amount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="createTime" label="创建时间" width="170">
          <template #default="{ row }">{{
            formatDateTime(row.createTime)
          }}</template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="page"
        :page-size="size"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="loadData"
        style="margin-top: 16px; justify-content: flex-end"
      />
    </el-card>

    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogVisible" title="新增财务记录" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="类型" required>
          <el-select v-model="form.type" style="width: 100%">
            <el-option label="采购支出" :value="0" />
            <el-option label="其他支出" :value="1" />
            <el-option label="收入" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" required>
          <el-input-number
            v-model="form.amount"
            :min="0"
            :precision="2"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getFinanceList, addFinanceRecord } from '@/api'
import { formatMoney, formatDateTime, FINANCE_TYPE_MAP } from '@/utils/index'

const loading = ref(false)
const tableData = ref<any[]>([])
const queryType = ref<number | undefined>(undefined)
const page = ref(1)
const size = ref(10)
const total = ref(0)
const dialogVisible = ref(false)

const form = reactive({
  type: 0,
  amount: 0,
  description: ''
})

const loadData = async () => {
  loading.value = true
  try {
    const res = (await getFinanceList({
      type: queryType.value || '',
      page: page.value,
      size: size.value
    })) as any
    tableData.value = res?.list || []
    total.value = res?.total || 0
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  Object.assign(form, { type: 0, amount: 0, description: '' })
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!form.amount) return ElMessage.warning('请输入金�?')
  await addFinanceRecord(form)
  ElMessage.success('添加成功')
  dialogVisible.value = false
  loadData()
}

onMounted(() => loadData())
</script>
