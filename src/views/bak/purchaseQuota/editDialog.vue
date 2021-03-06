<template>
  <el-dialog
    title="编辑额度"
    :visible.sync="visible"
    width="600px"
    :before-close="handleClose"
  >
    <el-form label-width="80px" :model="form" class="dialog-form">
      <el-form-item label="姓名:">
        <el-input v-model="form.trueName" disabled></el-input>
      </el-form-item>
      <el-form-item label="身份证:">
        <el-input v-model="form.buyerIdCardNo" disabled></el-input>
      </el-form-item>
      <el-form-item label="金额:">
        <el-input-number v-model="form.customsAmount" :min="1" :max="26000"></el-input-number>
      </el-form-item>

      <el-form-item label="身份证正:">
        <div class="base-upload">
          <!--采用七牛云上传图片 只能上传1张.png的图片 且图片大小不能超过1Mb -->
          <du-upload
            ref="duUpload"
            :key="cover"
            :third-type="2"
            :limit="1"
            :size="1"
            :file-url="form.frontIdCard"
            :cover="true"
            @handleUpload="handleUploadFront"
            @handleRemove="handleRemoveFront"
          >
            <el-button size="small" type="primary">
              点击上传
            </el-button>
          </du-upload>
        </div>
      </el-form-item>

      <el-form-item label="身份证反:">
        <div class="base-upload">
          <!--采用七牛云上传图片 只能上传1张.png的图片 且图片大小不能超过1Mb -->
          <du-upload
            ref="duUpload"
            :key="cover"
            :third-type="2"
            :limit="1"
            :size="1"
            :file-url="form.oppositeIdCard"
            :cover="true"
            @handleUpload="handleUploadOpposite"
            @handleRemove="handleRemoveOpposite"
          >
            <el-button size="small" type="primary">
              点击上传
            </el-button>
          </du-upload>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" :loading="editLoading" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    record: {
      type: Object,
      default: () => ({}),
    },
    visible: {
      type: Boolean,
      default: false,
    },
    editLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      cover: 1,
      form: {
        trueName: '',
        buyerIdCardNo: '',
        customsAmount: 1,
        frontIdCard: [],
        oppositeIdCard: [],
      },
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.cover++
        const frontIdCard = []
        const oppositeIdCard = []
        for (const k in this.form) {
          if (k === 'frontIdCard' && this.record[k]) {
            frontIdCard.push(this.record[k])
          } else if (k === 'oppositeIdCard' && this.record[k]) {
            oppositeIdCard.push(this.record[k])
          } else {
            this.form[k] = this.record[k]
          }
        }
        this.form.frontIdCard = frontIdCard
        this.form.oppositeIdCard = oppositeIdCard
      }
    },
  },
  methods: {
    handleClose() {
      this.$emit('handleCB', null)
    },
    handleSubmit() {
      const { customsAmount } = this.form
      const data = { ...this.record, customsAmount }
      if (this.form.frontIdCard.length > 0 && this.form.frontIdCard[0].url !== undefined) {
        data.frontIdCard = this.form.frontIdCard[0].url
      }
      if (this.form.oppositeIdCard.length > 0 && this.form.oppositeIdCard[0].url !== undefined) {
        data.oppositeIdCard = this.form.oppositeIdCard[0].url
      }
      this.$emit('handleCB', data)
    },
    handleUploadOpposite(data) {
      this.form.oppositeIdCard = data
    },
    // 删除
    handleRemoveOpposite() {
      this.form.oppositeIdCard = []
    },
    handleUploadFront(data) {
      this.form.frontIdCard = data
    },
    // 删除
    handleRemoveFront() {
      this.form.frontIdCard = []
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog-form {
  padding-right: 30px;
}
</style>
