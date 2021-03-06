<template>
  <el-form ref="form" :model="form" label-width="120px">
    <el-row>
      <el-col
        v-for="(col, key) in formConfig"
        :key="key"
        v-bind="col.colProps ? col.colProps : colProps"
      >
        <el-form-item :label="col.label">
          <el-input
            v-if="col.type === 'el-input'"
            v-model="form[col.prop]"
            clearable
            placeholder="请输入"
            v-bind="col.typeProps ? col.typeProps : {}"
          >
          </el-input>

          <el-date-picker
            v-else-if="col.type === 'el-date-picker'"
            v-model="form[col.prop]"
            clearable
            class="width-100"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy/MM/dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            v-bind="col.typeProps ? col.typeProps : {}"
          >
          </el-date-picker>

        </el-form-item>
      </el-col>
      <el-col v-bind="colProps">
        <el-form-item>
          <el-button
            type="primary"
            @click="handleSearch"
          >
            查询
          </el-button>

          <el-button
            type="default"
            @click="handleReset"
          >
            重置
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>

export default {
  data() {
    return {
      colProps: {
        xs: 24,
        sm: 12,
        lg: 8,
        xl: 6,
      },
      // formConfig配置
      // { prop: 'areaId', label: '国家/地区:', defaultValue: 1, type: '', typeProps: {}, optionList: [], optionValue: 'code', optionLabel: 'name' }
      formConfig: [
        { prop: 'dewuOrderNo', label: '得物订单号:', type: 'el-input' },
        { prop: 'poizonOrderNo', label: 'POIZON订单号:', type: 'el-input' },
        { prop: 'setNo', label: '集包号:', type: 'el-input' },
        { prop: 'waybillNo', label: '航空运单号:', type: 'el-input' },
        { prop: 'sendTime', label: '申报时间:', type: 'el-date-picker', colProps: { xs: 24, sm: 12, lg: 12, xl: 8 } },
      ],
      // 表单数据
      form: {},
      initForm: {},
    }
  },
  mounted() {
    this.getBidStatusList()
  },
  methods: {
    getBidStatusList() {
      this.formConfig = this.formConfig.map(item => {
        return item
      })
    },
    handleSearch() {
      this.$emit('search', this.form)
    },
    // 重置
    handleReset() {
      this.form = { ...this.initForm }
      this.$emit('reset', this.form)
    },
    getParams() {
      return this.form
    },
  },
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
.width-100 {
  width: 100% !important;
}
</style>
