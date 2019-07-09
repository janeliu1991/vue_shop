<template>
  <div>
    <h3>用户列表组件</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <!-- slot-scope接收组件prop传递过来的值 ，scope.row获取的就是当前数据 -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)" clearable></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        v-model="userList"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,2,5,10,20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 弹出的添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 主体内容区域 -->
      <!-- rules属性传入验证规则，prop属性设置为需要校验的字段名，model绑定是表单数据对象 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" >
          <el-input v-model="addForm.password" type='password'></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹出编辑用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 主体内容区域 -->
      <!-- rules属性传入验证规则，prop属性设置为需要校验的字段名，model绑定是表单数据对象 -->
      <el-form  label-width="70px" :model="editForm" :rules="addFormRules" ref="editFormRef">
        <el-form-item label="用户名" >
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱，直接调用cb代表验证通过
        return cb()
      }
      //cb里面有错误对象，代表验证不通过
      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }

    return {
      queryInfo: {
        pagesize: 2,
        pagenum: 1,
        query: '',
      },
      userList: [],
      total: 0,
      //控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      editDialogVisible: false,
      editForm:{
      },
      //添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },{validator:checkEmail,trigger:'blur'}
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },{validator:checkMobile,trigger:'blur'}
        ]
      },

    }
  },
  created() {
    //页面加载的时候就获取用户列表数据
    this.getUserList()
  },
  methods: {
    //获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      //   console.log(res)
      if (res.meta.status != 200)
        return this.$message.console.error(res.meta.msg)
      //将用户数据赋值给用户列表数组
      this.userList = res.data.users
      //将数据的total赋值给data里的total
      this.total = res.data.total
    },

    //分页尺寸改变操作
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },

    //分页当前页的改变
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum
      this.getUserList()
    },
    //监听用户状态改变
    async userStateChange(userinfo) {
      const uid = userinfo.id
      const type = userinfo.mg_state
      //此处可以用模板字符串${变量名}
      const { data: res } = await this.$http.put(
        'users/' + uid + '/state/' + type
      )
      console.log(res)
      if (res.meta.status != 200) {
        //如果状态没有更新成功，要把状态在更改回去
        userinfo.mg_state = !userinfo.mg_stat
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('更新状态成功')
    },
    //监听关闭添加用户的对话框
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    //点击确认按钮添加新用户
    addUser(){
      this.$refs.addFormRef.validate(async valid=>{
        //如果表单预验证不通过，就什么都不做
        if(!valid) return
        //表单验证通过，发送axios请求，返回的状态是200，将dialogVisble置为false
        const {data:res}=await this.$http.post('users',this.addForm)
        // console.log(res);
        if(res.meta.status!=201) {
          this.$message.error("res.meta.msg")
        }
        this.$message.success("添加新用户成功")
        //关闭对话框
        this.addDialogVisible=false
        //重新加载用户列表
        this.getUserList()
      })
     
    },
    //点击编辑显示编辑用户的对话框
    async showEditDialog(id){
      const {data:res}=await this.$http.get('users/'+id)
      // console.log(res);
      if(res.meta.status!=200) {
        return this.$message.error("查询用户信息失败")
      }
      this.editForm=res.data
      this.editDialogVisible=true
    },
    //关闭编辑用户的对话框,重置表单，移除校验结果
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    editUser(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return
        const {data:res}=await this.$http.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
        console.log(res);
        
        if(res.meta.status!=200){
          return this.$message.error(res.meta.msg)
        }
        this.$message.success("修改成功")
        this.editDialogVisible=false
        this.getUserList()
      })
    },
  }
}
</script>
<style lang="less" scoped>
</style>