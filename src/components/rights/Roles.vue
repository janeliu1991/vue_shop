<template>
  <div>
    <h3>权限列表</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <el-button type="primary" @click='addRoleVisible=true'>添加角色</el-button>
      <el-table :data="rolesList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini" 
            @click='showEditeForm(scope.row.id)'>编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            @click="deletRole(scope.row.id)">删除</el-button>
              <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 弹出的添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleVisible" width="50%" @close="addRoleClosed" class="addRoleDia">
      <!-- 主体内容区域 -->
      <!-- rules属性传入验证规则，prop属性设置为需要校验的字段名，model绑定是表单数据对象 -->
      <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
       
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

<!-- 弹出编辑角色的对话框 -->
    <el-dialog title="修改角色" :visible.sync="editRoleVisible" width="50%" @close="editRoleDialogClosed">
      <!-- 主体内容区域 -->
      <!-- rules属性传入验证规则，prop属性设置为需要校验的字段名，model绑定是表单数据对象 -->
      <el-form label-width="80px" :model="editRoleForm" :rules="addRoleFormRules" ref="editRoleFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      addRoleVisible:false,
      editRoleVisible:false,
      addRoleForm:{
          roleName:'',
          roleDesc:'',
      },
      editRoleForm:{},
      addRoleFormRules:{
          roleName:[
               { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6个字符', trigger: 'blur' }
          ],
          roleDesc:[
               { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 4, max: 10, message: '长度在 4到 10个字符', trigger: 'blur' }
          ]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
      //获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
    //console.log(res.data)
      if(res.meta.status!==200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },
    //监听关闭添加角色的对话窗
    addRoleClosed(){
        this.$refs.addRoleFormRef.resetFields()
    },
    //监听关闭编辑角色的对话窗     重置form表单的内容
    editRoleDialogClosed(){
        this.$refs.editRoleFormRef.resetFields()
    },
    //添加角色
    addRole(){
        this.$refs.addRoleFormRef.validate(async valid=>{
            if(!valid) return
        const {data:res}=await this.$http.post('roles',this.addRoleForm)
        if(res.meta.status!=201){
            return this.$message.error('res.meta.msg')
        } 
        this.$message.success('添加新用户成功')
        this.addRoleVisible=false
        this.getRolesList()
        }) 
    },
    //显示编辑角色的对画框
    async showEditeForm(id){
        //根据id获取当前角色信息
        const {data:res}=await this.$http.get('roles/'+id)
        if(res.meta.status!=200) {
            return this.$message.error("查询角色失败")
        }
        this.editRoleForm=res.data
        this.editRoleVisible=true
    },
    //编辑角色
    editRole(){
        this.$refs.editRoleFormRef.validate(async valid=>{
            if(!valid) return
            const {data:res}=await this.$http.put('roles/'+this.editRoleForm.roleId,{roleName:this.editRoleForm.roleName,roleDesc:this.editRoleForm.roleDesc})
            if(res.meta.status!=200) return this.$message.error("编辑角色提交失败")
            this.$message.success("编辑角色提交成功")
            this.editRoleVisible=false
            this.getRolesList()
        })

    },
    //删除用户角色
    async deletRole(id){
        const confirmRes = await this.$confirm(
        '此操作将删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      //如果用户确认删除，返回字符串confirm，如果取消删除，返回cancle，catch捕获取消的结果
      if (confirmRes !== 'confirm') {
        return this.$message.error('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)

      if (res.meta.status != 200) {
        return this.$message.error('res.meta.msg')
      }
      this.$message.success('删除角色成功')
      this.getRolesList()
    }
  }
}
</script>
<style lang="less" scoped>
</style>


