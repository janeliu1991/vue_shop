<template>
  <div>
    <h3>商品分类</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-button type="primary" @click="showAddCatFormDialog" style="margin-bottom:10px">添加分类</el-button>

      <!-- 分类列表主体区域 -->
      <!-- 数据表格
        :data="cateList" :设置数据来源
        :columns="columns" ：配置每列需要显示的数据
        :selection-type="false" :将每行数据配置为没有复选框
        :expand-type="false" ：每行数据无需扩展
        show-index :添加索引列
        index-text="#" ：设置索引列的列头
        :show-row-hover="false" ：设置鼠标悬停不要变色
      -->
      <tree-table
        :data="categoryList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-type="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color:lightgreen"></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>

        <!-- 排序 -->
        <template slot-scope="scope" slot="oder">
          <el-tag size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.cat_level==1" type="success">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot-scope="scope" slot="opt">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteCat(scope.row)"
          >删除</el-button>
        </template>
      </tree-table>

      <!-- 分页导航 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 显示添加分类的对话框区域 -->
      <el-dialog title="提示" :visible.sync="addCatFormVisble" width="50%">
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="80px"
          @close="addCateFormClose"
        >
          <!-- 分类名称区域 -->
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>

          <!-- 父级分类选择区域 -->
          <el-form-item label="父级分类">
            <!-- options用来指定数据源 -->
            <!-- cascadeProps用来指定配置对象 -->
            <el-cascader
              clearable
              :options="parentCateList"
              :props="cascadeProps"
              v-model="selectKeys"
              @change="parentCateChange"
              filterable
              popper-class="cascade"
            ></el-cascader>
          </el-form-item>
        </el-form>

        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCatFormVisble = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 2
      },
      //分类总数
      total: 0,
      //树状结构数据渲染的规则
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'oder'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      //控制添加分类的对话框现实与隐藏
      addCatFormVisble: false,

      //   绑定添加分类的表单数据
      addCateForm: {
        //分类名称
        cat_name: '',
        //分类父Id
        cat_pid: 0,
        //分类层级
        cat_level: 0
      },
      parentCateList: [],

      //指定级联对象的配置选择器
      cascadeProps: {
        //value:指定选项的值为选项对象的某个属性值
        // lable:指定看到的内容为选项对象的某个属性值
        // children:指定选项的子选项为选项对象的某个属性值
        //checkStrictly,控制是否可以值选择一个节点
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      //选中的父级分类的Id数组
      selectKeys: [],
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    //获取分类列表数据
    async getCategoryList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status != 200) {
        return this.$message.error('获取分类失败')
      }
      this.categoryList = res.data.result
      this.total = res.data.total
    },

    //监听显示尺寸的改变
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCategoryList()
    },

    //监听当前页的改变
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCategoryList()
    },

    //删除分类
    async deleteCat(row) {
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
      const { data: res } = await this.$http.delete('categories/' + row.cat_id)

      if (res.meta.status != 200) {
        return this.$message.error('res.meta.msg')
      }
      this.$message.success('删除分类成功')
      this.getCategoryList()
    },

    //显示添加分类的对话框
    showAddCatFormDialog() {
      this.getParentCateList()
      this.addCatFormVisble = true
    },

    //获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg)
      }
      this.parentCateList = res.data
    },

    // 级联选择器的选择发生变化时触发
    parentCateChange() {
      // console.log(this.selectKeys)
      //如果至少选中了一个
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        this.addCateForm.cat_level = this.selectKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },

    //确认添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status != 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.addCatFormVisble = false
        this.getCategoryList()
      })
    },

    //监听添加分类的对话框关闭
    addCateFormClose() {
      this.selectKeys = []
      this.addCateForm = {}
    }
  }
}
</script>


<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>


