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
          <span style="font-size: 16px; font-weight: bold">库存管理</span>
          <el-button type="primary" @click="handleAdd">新增入库</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="itemName" label="物品名称" min-width="120" />
        <el-table-column prop="itemCategory" label="分类" width="100" />
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="unit" label="单位" width="70" />
        <el-table-column prop="costPrice" label="成本" width="100">
          <template #default="{ row }">
            {{ row.costPrice ? '¥' + formatMoney(row.costPrice) : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="stockLocation" label="存放位置" width="120" />
        <el-table-column prop="createTime" label="入库时间" width="170">
          <template #default="{ row }">{{
            formatDateTime(row.createTime)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="handleDelete(row)"
              >删除</el-button
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

    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogVisible" title="新增入库" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="物品名称" required>
          <el-input v-model="form.itemName" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="form.itemCategory" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="form.quantity" :min="1" />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="form.unit" />
        </el-form-item>
        <el-form-item label="成本">
          <el-input-number v-model="form.costPrice" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="存放位置">
          <el-input v-model="form.stockLocation" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { getInventoryList, addInventory, deleteInventory } from '@/api'
import { formatMoney, formatDateTime } from '@/utils/index'

const loading = ref(false)
const tableData = ref<any[]>([])
const page = ref(1)
const size = ref(10)
const total = ref(0)
const dialogVisible = ref(false)

const form = reactive({
  itemName: '',
  itemCategory: '',
  quantity: 1,
  unit: '',
  costPrice: 0,
  stockLocation: '',
  remark: ''
})

const loadData = async () => {
  loading.value = true
  try {
    const res = (await getInventoryList({
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
  Object.assign(form, {
    itemName: '',
    itemCategory: '',
    quantity: 1,
    unit: '',
    costPrice: 0,
    stockLocation: '',
    remark: ''
  })
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!form.itemName) return ElMessage.warning('请输入物品名�?')
  await addInventory(form)
  ElMessage.success('添加成功')
  dialogVisible.value = false
  loadData()
}

const handleDelete = async (row: any) => {
  await ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' })
  await deleteInventory(row.id)
  ElMessage.success('删除成功')
  loadData()
}

onMounted(() => loadData())
</script>
