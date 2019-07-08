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
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
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
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
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
    <el-dialog
  title="添加用户"
  :visible.sync="dialogVisible"
  width="50%"
  :before-close="handleClose">
  <span>这是一段信息</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        pagesize: 2,
        pagenum: 1,
        query: ''
      },
      userList: [],
      total: 0,
      //控制添加用户对话框的显示与隐藏
      dialogVisible:false
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
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },

    //分页当前页的改变
    handleCurrentChange (newnum) {
      this.queryInfo.pagenum = newnum
      this.getUserList()
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
    //监听用户状态改变
    async userStateChange(userinfo){
        const uid=userinfo.id
        const type=userinfo.mg_state
        //此处可以用模板字符串${变量名}
        const {data:res}=await this.$http.put('users/'+uid+'/state/'+type)
        console.log(res);
        if(res.meta.status!=200){
            //如果状态没有更新成功，要把状态在更改回去
            userinfo.mg_state=!userinfo.mg_stat
            return this.$message.error(res.meta.msg)
        } 
        this.$message.success("更新状态成功")

    }
  }
}
</script>
<style lang="less" scoped>
</style>