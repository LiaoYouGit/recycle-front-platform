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
          <span style="font-size: 16px; font-weight: bold">回收订单管理</span>
          <div>
            <el-select
              v-model="queryStatus"
              placeholder="订单状态"
              clearable
              style="width: 140px; margin-right: 12px"
              @change="loadData"
            >
              <el-option label="待接单" :value="0" />
              <el-option label="已接单" :value="1" />
              <el-option label="已取货" :value="2" />
              <el-option label="已完成" :value="3" />
              <el-option label="已取消" :value="4" />
            </el-select>
            <el-button type="primary" @click="loadData">刷新</el-button>
          </div>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="contactName" label="联系人" width="100" />
        <el-table-column prop="contactPhone" label="联系电话" width="130" />
        <el-table-column prop="itemName" label="回收价" min-width="120" />
        <el-table-column prop="estimatedPrice" label="估价" width="100">
          <template #default="{ row }">
            {{
              row.estimatedPrice ? '¥' + formatMoney(row.estimatedPrice) : '-'
            }}
          </template>
        </el-table-column>
        <el-table-column prop="actualPrice" label="成交价" width="100">
          <template #default="{ row }">
            {{ row.actualPrice ? '¥' + formatMoney(row.actualPrice) : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="ORDER_STATUS_MAP[row.status]?.type || 'info'"
              size="small"
            >
              {{ ORDER_STATUS_MAP[row.status]?.text || '未知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="recyclerName" label="接单人" width="100" />
        <el-table-column prop="createTime" label="提交时间" width="170">
          <template #default="{ row }">{{
            formatDateTime(row.createTime)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 0"
              type="primary"
              size="small"
              @click="handleAccept(row)"
              >接单</el-button
            >
            <el-button
              v-if="row.status === 1"
              type="warning"
              size="small"
              @click="handlePickup(row)"
              >取货付款</el-button
            >
            <el-button
              v-if="row.status === 2"
              type="success"
              size="small"
              @click="handleComplete(row)"
              >完成入库</el-button
            >
            <el-button
              v-if="row.status < 2 && row.status !== 4"
              type="danger"
              size="small"
              @click="handleCancel(row)"
              >取消</el-button
            >
          </template>
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

    <!-- 取货付款弹窗 -->
    <el-dialog v-model="pickupVisible" title="确认取货付款" width="400px">
      <el-form label-width="80px">
        <el-form-item label="回收品类">
          <span>{{ currentOrder?.itemName }}</span>
        </el-form-item>
        <el-form-item label="联系人">
          <span
            >{{ currentOrder?.contactName }} ({{
              currentOrder?.contactPhone
            }})</span
          >
        </el-form-item>
        <el-form-item label="实际付款">
          <el-input-number
            v-model="pickupPrice"
            :min="0"
            :precision="2"
            style="width: 200px"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pickupVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmPickup">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getOrderList,
  acceptOrder,
  pickupOrder,
  completeOrder,
  cancelOrder
} from '@/api'
import { formatMoney, formatDateTime, ORDER_STATUS_MAP } from '@/utils/index'

const loading = ref(false)
const tableData = ref<any[]>([])
const queryStatus = ref<number | undefined>(undefined)
const page = ref(1)
const size = ref(10)
const total = ref(0)

const pickupVisible = ref(false)
const currentOrder = ref<any>(null)
const pickupPrice = ref(0)

const loadData = async () => {
  loading.value = true
  try {
    const res = (await getOrderList({
      status: queryStatus.value || '',
      page: page.value,
      size: size.value
    })) as any
    tableData.value = res?.list || []
    total.value = res?.total || 0
  } finally {
    loading.value = false
  }
}

const handleAccept = async (row: any) => {
  await ElMessageBox.confirm(
    `确认接单联系人【${row.contactName}】【${row.itemName}】？`,
    '提示',
    {
      type: 'warning'
    }
  )
  await acceptOrder(row.id)
  ElMessage.success('接单成功')
  loadData()
}

const handlePickup = (row: any) => {
  currentOrder.value = row
  pickupPrice.value = row.estimatedPrice || 0
  pickupVisible.value = true
}

const confirmPickup = async () => {
  await pickupOrder(currentOrder.value.id, pickupPrice.value)
  ElMessage.success('取货确认成功')
  pickupVisible.value = false
  loadData()
}

const handleComplete = async (row: any) => {
  await ElMessageBox.confirm(`确认完成入库�?{row.itemName}？`, '提示', {
    type: 'warning'
  })
  await completeOrder(row.id)
  ElMessage.success('入库完成')
  loadData()
}

const handleCancel = async (row: any) => {
  await ElMessageBox.confirm(`确认取消订单�?{row.itemName}？`, '提示', {
    type: 'warning'
  })
  await cancelOrder(row.id)
  ElMessage.success('订单已取消')
  loadData()
}

onMounted(() => loadData())
</script>
