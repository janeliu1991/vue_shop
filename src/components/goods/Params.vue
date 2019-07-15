<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
        style="margin-bottom:10px"
      ></el-alert>

      <!-- 级联选择分类区域 -->
      <el-form :model="selectCateForm">
        <el-form-item label="选择商品分类">
          <!-- options用来指定数据源 -->
          <!-- cascadeProps用来指定配置对象 -->
          <el-cascader
            clearable
            :options="cateList"
            :props="cascadeProps"
            v-model="selectKeys"
            @change="cateChange"
            filterable
            popper-class="cascade"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <!-- 动态参数和静态属性的tabs标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数显示内容区 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addParamsVisible=true">添加参数</el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  class="attrvals"
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(scope.row,i)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deletParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性显示内容 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addParamsVisible=true">添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  class="attrvals"
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(scope.row,i)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deletParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 弹出的添加参数、属性对话框 -->
      <el-dialog title="添加参数" :visible.sync="addParamsVisible" width="50%" @close="addParamsClosed">
        <!-- 主体内容区域 -->
        <!-- rules属性传入验证规则，prop属性设置为需要校验的字段名，model绑定是表单数据对象 -->
        <el-form
          :model="addParamsForm"
          :rules="addParamsFormRules"
          ref="addParamsFormRef"
          label-width="80px"
        >
          <el-form-item label="参数名称" prop="attr_name">
            <el-input v-model="addParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addParamsVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 弹出的编辑参数、属性对话框 -->
      <el-dialog
        title="添加参数"
        :visible.sync="editParamsVisible"
        width="50%"
        @close="editParamsClosed"
      >
        <!-- 主体内容区域 -->
        <!-- rules属性传入验证规则，prop属性设置为需要校验的字段名，model绑定是表单数据对象 -->
        <el-form
          :model="editParamsForm"
          :rules="editParamsFormRules"
          ref="editParamsFormRef"
          label-width="80px"
        >
          <el-form-item label="参数名称" prop="attr_name">
            <el-input v-model="editParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editParamsVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>


<script>
export default {
  data() {
    return {
      //级联分类列表数组
      cateList: [],
      //选中的分类数据对象
      selectCateForm: {},
      //选中的分类Id数组
      selectKeys: [],
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

      //tabs切换中选中的当前类
      activeName: 'many',
      onlyTableData: [],
      manyTableData: [],
      //控制添加参数的对话框显示与隐藏
      addParamsVisible: false,
      //控制编辑参数的对话框显示与隐藏
      editParamsVisible: false,
      //添加参数的绑定数据
      addParamsForm: {
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },

      //先获取当前编辑对象的信息，赋值给这个编辑的绑定数据对象
      editParamsForm: {},

      //添加参数的验证规则
      addParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6个字符', trigger: 'blur' }
        ]
      },

      //编辑参数的验证规则
      editParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6个字符', trigger: 'blur' }
        ]
      },

      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.getAllCate()
  },
  computed: {
    // cateId() {
    //   if (this.selectKeys.length === 3) {
    //     return this.selectKeys[2]
    //   }
    //   return null
    // },
    //控住添加参数、属性按钮的可用性
    isBtnDisabled() {
      if (this.selectKeys.length != 3) {
        return true
      }
      return null
    }
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

    //获取参数
    async getParamsData() {
      if (this.selectKeys.length != 3) {
        this.selectKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      const cateId = this.selectKeys[2]
      const { data: res } = await this.$http.get(
        `categories/${this.selectKeys[2]}/attributes`,
        { params: { sel: this.activeName } }
      )

      if (res.meta.status != 200) {
        return this.$message.error('参数获取失败')
      }
      //遍历参数数组的属性值，如果不为空，就将其属性值分割为数组渲染到页面中
      res.data.forEach(item => {
        if (item.attr_vals.trim() === '') {
          item.attr_vals = []
        } else {
          item.attr_vals = item.attr_vals.split(' ')
        }
        //给每个动态参数添加一个控制显示的属性
        item.inputVisible = false
        item.inputValue = ''
      })

      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },

    //监听级联选择器的改变
    cateChange() {
      this.getParamsData()
    },

    //点击切换静态属性或者动态参数
    handleClick(tab, event) {
      this.getParamsData()
    },

    //监听关闭添加参数的对话框
    addParamsClosed() {
      this.$refs.addParamsFormRef.resetFields()
    },

    //点击确定添加参数
    addParams() {
      this.addParamsForm.attr_sel = this.activeName
      this.$refs.addParamsFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.selectKeys[2]}/attributes`,
          { attr_name: this.addParamsForm.attr_name, attr_sel: this.activeName }
        )
        console.log(res)
        if (res.meta.status != 201) {
          return this.$message.error('res.meta.msg')
        }
        this.$message.success('添加参数成功')
      })
      this.getParamsData()
      this.addParamsVisible = false
    },

    //显示编辑参数的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.selectKeys[2]}/attributes/${id}`
      )
      this.editParamsForm = res.data
      this.editParamsVisible = true
    },

    //点击确认提交编辑参数
    editParams() {
      this.$refs.editParamsFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.editParamsForm.cat_id}/attributes/${this.editParamsForm.attr_id}`,
          {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status != 200) {
          return this.$message.error('res.data.msg')
        }
        this.$message.success('更新数据成功')
        this.getParamsData()
        this.editParamsVisible = false
      })
    },
    //监听关闭编辑参数对话窗
    editParamsClosed() {
      this.$refs.editParamsFormRef.resetFields()
    },

    //删除参数
    async deletParams(id) {
      const confirmRes = await this.$confirm(
        '此操作将删除该分类, 是否继续?',
        '删除权限',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmRes !== 'confirm') {
        return this.$message.error('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.selectKeys[2]}/attributes/${id}`
      )
      if (res.meta.status != 200) {
        return this.$message.error('res.meta.msg')
      }
      this.$message.success('删除属性成功')
      this.getParamsData()
    },

    //显示输入属性值的input框
    showInput(row) {
      row.inputVisible = true
      //input输入框显示出来后立马活得焦点
      //$nextTick的作用是当页面上的元素被重新渲染完之后，才会执行回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    //按回车或失去焦点，确认新增新属性
    async handleInputConfirm(row) {
      if (row.inputValue.trim() === '') {
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue)
      this.saveAttrValues(row)
    },

    //保存属性值的操作
    async saveAttrValues(row) {
      const { data: res } = await this.$http.put(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )

      if (res.meta.status != 200) {
        return this.$message.error('res.meta.msg')
      }
      this.$message.success('更新属性值成功')
      row.inputValue = ''
      row.inputVisible = false
    },

    handleClose(row, index) {
      //删除选中的属性值
      row.attr_vals.splice(index, 1)
      this.saveAttrValues(row)
    }
  }
}
</script>


<style lang="less" scoped>
.attrvals {
  margin: 0 7px;
}

.input-new-tag {
  width: 150px;
}
</style>


