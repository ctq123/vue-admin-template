<template>
  <el-dialog width="800px" :visible="visible" :before-close="onClose">
    <div class="detail-container">
      <div v-for="(val, index) in labelList" :key="index" class="detail-main">
        <div class="detail-label">
          {{ val.label }}:
        </div>
        <div class="text">
          {{ coeDetail[val.key] }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { COE_DETAIL } from './constant'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    coeDetail: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      labelList: COE_DETAIL,
    }
  },
  methods: {
    onClose() {
      this.data = {}
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.detail {
  &-container {
    display: flex;
    flex-wrap: wrap;
  }
  &-main {
    flex: 1 0 50%;
    padding: 0 20px;
    box-sizing: border-box;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  &-label {
    margin-right: 20px;
    white-space: nowrap;
  }
}
.text {
  background-color: #f3f3f3;
  width: 100%;
  padding: 8px 12px;
  border-radius: 3px;
}
</style>
