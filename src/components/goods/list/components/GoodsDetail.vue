<template>
  <el-card class="form-container">
    <!-- 提示信息区域 -->
    <el-alert :title="formTitle"
              type="info"
              center
              show-icon
              :closable="false">
    </el-alert>
    <!-- 步骤条区域 -->
    <el-steps :space="200"
              :active="+activeIndex"
              finish-status="success"
              align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>

    <!-- 表单区域 -->
    <el-form :model="goods"
             :rules="goodsRules"
             ref="goodsFormRef"
             label-width="100px"
             label-position="top">
      <!-- tabs区域 -->
      <el-tabs v-model="activeIndex"
               tab-position="left"
               :before-leave="beforeTagsLeave"
               @tab-click="tabsClicked">
        <!-- 基本信息表单 -->
        <el-tab-pane label="基本信息"
                     name="0">
          <el-form-item label="商品名称"
                        prop="goods_name">
            <el-input class="input-width"
                      v-model="goods.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格(元)"
                        prop="goods_price">
            <el-input class="input-width"
                      v-model.number="goods.goods_price">
            </el-input>
          </el-form-item>
          <el-form-item label="商品重量(kg)"
                        prop="goods_weight">
            <el-input class="input-width"
                      v-model.number="goods.goods_weight">
            </el-input>
          </el-form-item>
          <el-form-item label="商品数量"
                        prop="goods_number">
            <el-input class="input-width"
                      v-model.number="goods.goods_number">
            </el-input>
          </el-form-item>
          <el-form-item label="商品分类"
                        prop="goods_cat">
            <el-cascader v-model="goods.goods_cat"
                         :options="cateList"
                         :props="cateProps"
                         @change="handleChange"
                         clearable
                         filterable
                         style="width:60%"></el-cascader>
          </el-form-item>
        </el-tab-pane>

        <!-- 商品参数表单 -->
        <el-tab-pane label="商品参数"
                     name="1">
          <!-- 复选框区域 -->
          <el-form-item :label="item.attr_name"
                        v-for="item in manyTableData"
                        :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="value"
                           v-for="(value, index) in item.attr_vals"
                           :key="index"
                           border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <!-- 商品属性 -->
        <el-tab-pane label="商品属性"
                     name="2">
          <el-form-item :label="item.attr_name"
                        v-for="item in onlyTableData"
                        :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <!-- 商品图片上传 -->
        <el-tab-pane label="商品图片"
                     name="3">
          <el-upload :action="actionURL"
                     :on-preview="handlePreview"
                     :on-remove="handleRemove"
                     :on-success="handleSucess"
                     :headers="headerObj"
                     list-type="picture">
            <el-button size="small"
                       type="primary">点击上传</el-button>
            <div slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <!-- 商品内容 -->
        <el-tab-pane label="商品内容"
                     name="4">

          <!-- 富文本编辑器 -->
          <quill-editor v-model="goods.goods_introduce"
                        ref="myQuillEditorRef">
          </quill-editor>
          <el-button type="primary"
                     class="add-goods"
                     @click="onSubmit('goodsFormRef')">提 交</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <el-dialog title="图片预览"
               :visible.sync="previewDialogVisible"
               width="40%">
      <img :src="previewPath"
           style="width:100%">
    </el-dialog>
  </el-card>

</template>

<script>
import { getAllCategories, getCategoriesByIDType, createGoods } from '@/api/goods/category'
import { getGoodsByID, updateGoods } from '@/api/goods/list'
import _ from 'lodash'

const defaultGoods = {
  goods_name: '',
  goods_price: null,
  goods_number: null,
  goods_weight: null,
  // 商品分类key值
  goods_cat: [],
  // 商品图片地址
  pics: [],
  // 商品描述
  goods_introduce: '',
  // 存放商品动态参数和静态属性
  attrs: []
}
// 封装attr_id和attr_vals属性，供添加商品使用
const infoObj = {
  attr_id: null,
  attr_value: null
}
export default {
  name: 'GoodsDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 步骤条被激活的下标
      activeIndex: '0',
      // 商品表单对象
      goods: Object.assign({}, defaultGoods),
      // 添加/修改商品的校验规则
      goodsRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ type: 'number', required: true, message: '面值只能是数值，限2位小数', trigger: 'blur' }],
        goods_weight: [{ type: 'number', required: true, message: '只能输入正数', trigger: 'blur' }],
        goods_number: [{ type: 'number', required: true, message: '只能输入正整数', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请输入商品分类', trigger: 'blur' }]

      },
      // 所有商品分类数据
      cateList: [],
      // 指定级联选择器的配置对象
      cateProps: {
        // 配置触发选项 hover/click
        expandTrigger: 'hover',
        // 具体选中的值
        value: 'cat_id',
        // 选中后所显示的内容
        label: 'cat_name',
        // 父子嵌套的属性
        children: 'children'
      },
      // 商品参数列表
      manyTableData: [],
      // 商品属性列表
      onlyTableData: [],
      // 上传图片的地址
      actionURL: 'http://timemeetyou.com:8889/api/private/v1/upload',
      // 图片上传时，请求头增加token
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览地址
      previewPath: '',
      // 控制图片预览对话框的显示和隐藏
      previewDialogVisible: false

    }
  },
  created () {
    // 当是编辑框是，渲染页面
    if (this.isEdit) {
      getGoodsByID(this.$route.query.id).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('根据商品ID获取商品信息失败')
        }
        this.goods = res.data
        // 商品分类级联框需要显示为文案
        const dataStrArr = this.goods.goods_cat.split(',')// 分割成字符串数组
        const dataIntArr = []// 保存转换后的整型字符串
        dataStrArr.forEach(item => {
          dataIntArr.push(+item)
        })
        this.goods.goods_cat = dataIntArr
      })
    }
    // 获取商品分类，渲染级联选择器
    this.getCategories()
  },
  computed: {
    // 商品分类ID，只有商品分类是三级选项时才计算
    cateID () {
      if (this.goods.goods_cat.length === 3) {
        return this.goods.goods_cat[2]
      }
      return null
    },
    formTitle () {
      if (this.isEdit) {
        return '修改商品信息'
      }
      return '添加商品信息'
    }

  },
  methods: {
    // 获取所有商品分类
    getCategories () {
      getAllCategories().then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品分类失败')
        }
        this.cateList = res.data
      })
    },
    // 级联选择器选中项变化时触发
    handleChange () {
      if (this.goods.goods_cat.length !== 3) {
        this.goods.goods_cat = []
      }
    },
    // 控制标签页的切换，未完成指定内容填写不允许切换
    beforeTagsLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.goods.goods_cat.length !== 3) {
        // 不满足条件则发起错误提醒
        this.$message.error('请先完成商品分类')
        return false
      }
    },
    // tab 被选中时触发，在渲染页面之前获取数据
    tabsClicked () {
      switch (this.activeIndex) {
        case '1':
          // 根据分类cateID,获取商品动态参数
          this.getCategoriesByType('many')
          break
        case '2':
          // 根据分类cateID,获取商品动态参数
          this.getCategoriesByType('only')
          break
        default:
          break
      }
    },
    // 根据分类ID和属性类型获取商品分类参数
    getCategoriesByType (type) {
      // 根据分类cateID,获取商品动态参数
      getCategoriesByIDType(this.cateID, type)
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取商品参数失败')
          }
          var data = res.data

          // 不同的请求返回值绑定到不同tags表格数据上
          if (type === 'many') {
            // 将attr_vals字段的数据处理为数组
            data.forEach(item => {
              // 前后端约定好以空格分隔
              item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            })
            this.manyTableData = data
          } else {
            this.onlyTableData = data
          }
        })
    },
    // 监听图片上传成功事件
    handleSucess (res) {
      // 1.拼接得到一个图片信息对象 临时路径
      const picInfo = { pic: res.data.tmp_path }
      // 2.将图片信息对象，push到pics数组中
      this.goods.pics.push(picInfo)
    },
    // 处理图片预览效果
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    // 处理移除图片操作
    handleRemove (file) {
      // 1. 获取将要删除图片的临时路径
      const tmpPath = file.response.data.tmp_path
      // 2. 从pics数组中，找到图片对应的索引值
      const index = this.goods.pics.findIndex(item =>
        item.pic === tmpPath
      )
      // 3. 调用splice方法，移除图片信息
      this.goods.pics.splice(index, 1)
    },
    // 添加商品
    onSubmit (formName) {
      this.$refs[formName].validate(async valid => {
        const correctData = this.handleSubmitData()
        console.log('correctData: ', correctData)
        // 开始提交
        if (valid) {
          if (this.isEdit) {
            console.log('this.isEdit: ', this.isEdit)
            // 编辑商品
            updateGoods(this.$route.query.id, correctData).then(res => {
              console.log('this.$route.query.id: ', this.$route.query.id)
              this.$refs[formName].resetFields()
              if (res.meta.status !== 200) {
                return this.$message.error('商品修改失败')
              }
              this.$message.success('商品修改成功')
              this.$router.back()
            })
          } else {
            // 发起请求，保存商品
            createGoods(correctData).then(res => {
              this.$refs[formName].resetFields()
              if (res.meta.status !== 201) {
                return this.$message.error('商品添加失败')
              }
              this.$message.success('商品添加成功')
              // this.$router.push('/goods')
              this.$router.back()
            })
          }
        } else {
          this.$message.error('请填写必要的表单项')
          return false
        }
      })
    },

    handleSubmitData () {
      // 将goods.goods_cat数组该为字符串 后端接口要求
      const form = _.cloneDeep(this.goods)
      form.goods_cat = form.goods_cat.join(',')

      // 因为商品动态参数和静态属性都是保存在商品goods字段attrs中，所以要分开处理
      // 处理商品动态参数
      this.manyTableData.forEach(element => {
        infoObj.attr_id = element.attr_id
        infoObj.attr_value = element.attr_vals.join(',')
        this.goods.attrs.push(infoObj)
      })

      // 处理商品静态属性
      this.onlyTableData.forEach(element => {
        infoObj.attr_id = element.attr_id
        infoObj.attr_value = element.attr_vals
        this.goods.attrs.push(infoObj)
      })
      form.attrs = this.goods.attrs
      return form
    }

  }
}
</script>

<style lang="less" scoped>
.input-width {
  width: 60%;
}

.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.add-goods {
  margin-top: 15px;
}
</style>
