<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" show-icon :closable="false" style="margin-bottom:10px"></el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addGoodsForm"
        :rules="addGoodsRules"
        ref="addGoodsFormRef"
        label-width="150px"
      >
        <!-- tab栏切换区域 -->
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <!-- 基本信息区域 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" type="number">
              <el-input v-model="addGoodsForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" type="number">
              <el-input v-model="addGoodsForm.goods_number"></el-input>
            </el-form-item>

            <!-- 级联选择分类区域 -->

            <el-form-item label="选择商品分类" prop="goods_cat">
              <!-- options用来指定数据源 -->
              <!-- cascadeProps用来指定配置对象 -->
              <el-cascader
                clearable
                :options="cateList"
                :props="cascadeProps"
                v-model="addGoodsForm.goods_cat"
                filterable
                popper-class="cascade"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <!-- 动态参数区域 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals" class="attr">
                <el-checkbox
                  :label="val"
                  v-for="(val,i) in item.attr_vals"
                  :key="i"
                  border
                  size="small"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <!-- 静态参数区域 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <!-- 上传图片区域 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示要图片要上传的后台API地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headersObj"
              list-type="picture"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>

          <!-- 商品介绍区域 -->
          <el-tab-pane label="商品内容" name="4">
              <quill-editor v-model="addGoodsForm.goods_introduce">

              </quill-editor>
              <!-- 添加商品按钮 -->
              <el-button type="primary" class="addGoods" @click="addGoods">添加商品</el-button>
          </el-tab-pane>


        </el-tabs>
      </el-form>

      <!-- 图片预览区域 -->
      <el-dialog
        title="图片预览"
        :visible.sync="preDialogVisible"
        width="50%"
        @close="handelDialogClose"
      >
        <img :src="this.previewPath" alt width="100%" />
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: 0,
      addGoodsForm: {
        goods_name: '',
        goods_cat: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      previewPath: '',
      cateList: [],
      addGoodsRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      //级联选择器的配置对象
      cascadeProps: {
        //选中后获取到的Id
        value: 'cat_id',
        //看到的内容
        label: 'cat_name',
        children: 'children',
        //鼠标悬停显示下一级
        expandTrigger: 'hover'
      },
      //动态属性
      manyTableData: [],
      //静态属性
      onlyTableData: [],
      //图片上传地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      preDialogVisible: false
    }
  },
  created() {
    this.getAllCate()
  },
  methods: {
    //获取所有分类
    async getAllCate() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 }
      })

      if (res.meta.status != 200) {
        return this.$message.error('获取分类失败')
      }
      this.cateList = res.data
    },

    //监听级联选项的改变，如果不是选中的三级分类，将选择结果置空
    handleChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        return (this.addGoodsForm.goods_cat = [])
      }
    },

    //在tab栏切换过来之前，如果不满足函数里面的条件，则无法切换
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },

    //切换table选项
    async tabClick() {
      //证明是点击的商品参数
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'many' } }
        )
        if (res.meta.status != 200) {
          return this.$message.error(res.meta.status)
        }
        //遍历参数数组的属性值，如果不为空，就将其属性值分割为数组渲染到页面中
        res.data.forEach(item => {
          if (item.attr_vals.trim() === '') {
            item.attr_vals = []
          } else {
            item.attr_vals = item.attr_vals.split(' ')
          }
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'only' } }
        )
        if (res.meta.status != 200) {
          return this.$message.error(res.meta.status)
        }
        this.onlyTableData = res.data
      }
    },
    //处理图片预览
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.preDialogVisible = true
    },
    //监听图片预览对话框的关闭
    handelDialogClose() {
      this.previewPath = ''
      this.preDialogVisible = false
    },
    //处理点击插好移除图片
    handleRemove(file) {
      let path = file.response.data.tmp_path
      let index = this.addGoodsForm.pics.findIndex(item => item.pic == path)
      this.addGoodsForm.pics.splice(index, 1)
    },
    //图片上传成功
    handleSuccess(res) {
      if (res.meta.status != 200) {
        return this.$message.error('图片上传失败')
      }
      const picInfo = { pic: res.data.tmp_path }
      //将对象添加到pics的数组中
      this.addGoodsForm.pics.push(picInfo)
    },
    addGoods(){
        this.$refs.addGoodsFormRef.validate( async valid=>{
            if(!valid){
                return this.$message.error("请输入必填信息")
            }
            
            //执行添加的业务逻辑
            //级联选择器希望得到的是数组，但是发送请求传递过去的必须是空格分隔的字符串，需要在分隔元素组前进行深拷贝
            const form=_.cloneDeep(this.addGoodsForm)
            form.goods_cat=form.goods_cat.join(',')
                        
              //处理动态参数
            this.manyTableData.forEach(item=>{
                const newInfo={
                    attr_id:item.attr_id,
                    //把数组转为逗号分隔的参数序列
                    attr_value:item.attr_vals.join(' ')
                }
                this.addGoodsForm.attrs.push(newInfo)
                
            })
            //处理静态属性
             this.onlyTableData.forEach(item=>{
                const newInfo={
                    attr_id:item.attr_id,
                    attr_value:item.attr_vals
                }
                this.addGoodsForm.attrs.push(newInfo)
                
            })
             form.attrs=this.addGoodsForm.attrs

             console.log(form);
            const {data:res}= await this.$http.post('goods',form)
            console.log(res);
            
            if(res.meta.status!=201){
                return this.$message.error("添加商品失败")
            }
            this.$message.success('创建商品成功')
            this.$router.push('/goods')
             
        })
        
    }

    
  },
  computed: {
    cateId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      } else {
        return null
      }
    }
  }
}
</script>


<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 5px 0 !important;
}
.addGoods{
    margin-top: 10px
}
</style>
