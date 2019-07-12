<template>
  <div>
    <h3>角色列表</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-button type="primary" @click="addRoleVisible=true">添加角色</el-button>

      <!-- 角色权限列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- scope.row接收的是roleslist里当前行角色的数据 -->
          <template slot-scope="scope">
            <!-- 栅格系统分成24列 -->
            <el-row
              class="vcenter"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom',i1===0 ? 'bdtop':'']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable
                      @close="removeRightsById(scope.row.id,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过循环渲染二级权限 -->
                <el-row
                  class="vcenter"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="i2===0? '':'bdtop'"
                >
                  <el-col :span="6">
                    <el-tag type="success" closable
                      @close="removeRightsById(scope.row.id,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 渲染三级权限 -->
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightsById(scope.row.id,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditeForm(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deletRole(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 弹出的添加角色对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addRoleVisible"
        width="50%"
        @close="addRoleClosed"
        class="addRoleDia"
      >
        <!-- 主体内容区域 -->
        <!-- rules属性传入验证规则，prop属性设置为需要校验的字段名，model绑定是表单数据对象 -->
        <el-form
          :model="addRoleForm"
          :rules="addRoleFormRules"
          ref="addRoleFormRef"
          label-width="80px"
        >
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
      <el-dialog
        title="修改角色"
        :visible.sync="editRoleVisible"
        width="50%"
        @close="editRoleDialogClosed"
      >
        <!-- 主体内容区域 -->
        <!-- rules属性传入验证规则，prop属性设置为需要校验的字段名，model绑定是表单数据对象 -->
        <el-form
          label-width="80px"
          :model="editRoleForm"
          :rules="addRoleFormRules"
          ref="editRoleFormRef"
        >
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

      <!-- 弹出分配权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="showRightDialogVisible"
        width="50%"
        @close="setRightDialogClosed"
      >
        <!-- 主体内容区域 -->
        <!-- rules属性传入验证规则，prop属性设置为需要校验的字段名，model绑定是表单数据对象 -->
        <el-tree
          :data="setRightForm"
          show-checkbox
          :default-checked-keys="checkedRoleRightArr"
          default-expand-all
          node-key="id"
          :props="treeProps"
          ref="treeRef"
        ></el-tree>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="showRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //角色列表
      rolesList: [],
      //权限列表
      setRightForm: [],
      //选中的角色权限节点id值
      checkedRoleRightArr: [],
      //控制添加角色对话框的显示与隐藏
      addRoleVisible: false,
      //控制编辑角色对话框的显示与隐藏
      editRoleVisible: false,
      //控制分配权限对话框的显示与隐藏
      showRightDialogVisible: false,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      //编辑角色的信息
      editRoleForm: {},

      //添加角色的验证规则
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 4, max: 10, message: '长度在 4到 10个字符', trigger: 'blur' }
        ]
      },
        //分配权限对话框的树形结构
      treeProps: {
        children: 'children',
        label: 'authName'
      },

      //记录当前编辑的角色id
      roleId:'',
    }
  },


  created() {
    //页面加载时调用角色列表
    this.getRolesList()
  },
  methods: {
    //获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      // console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },

    //监听关闭添加角色的对话窗
    addRoleClosed() {
      this.$refs.addRoleFormRef.resetFields()
    },

    //监听关闭编辑角色的对话窗     重置form表单的内容
    editRoleDialogClosed() {
      this.$refs.editRoleFormRef.resetFields()
    },

    //添加角色
    addRole() {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status != 201) {
          return this.$message.error('res.meta.msg')
        }
        this.$message.success('添加新用户成功')
        this.addRoleVisible = false
        this.getRolesList()
      })
    },
    //显示编辑角色的对画框
    async showEditeForm(id) {
      //根据id获取当前角色信息
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status != 200) {
        return this.$message.error('查询角色失败')
      }
      this.editRoleForm = res.data
      this.editRoleVisible = true
    },

    //编辑角色
    editRole() {
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'roles/' + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }
        )
        if (res.meta.status != 200)
          return this.$message.error('编辑角色提交失败')
        this.$message.success('编辑角色提交成功')
        this.editRoleVisible = false
        this.getRolesList()
      })
    },

    //删除用户角色
    async deletRole(id) {
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
    },

    //根据id删除权限
    async removeRightsById(roleId, rightId) {
      //弹框提示是否删除
      const confirmRes = await this.$confirm(
        '此操作将删除该权限, 是否继续?',
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
        `roles/${roleId}/rights/${rightId}`
      )
      if (res.meta.status != 200) {
        return this.$message.error('res.meta.msg')
      }
      this.$message.success('删除角色权限成功')
      this.getRolesList()
    },

    //显示分配权限的对话框
    async showSetRightDialog(role) {
      //保存需要操作的角色id
      this.roleId=role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status != 200) {
        return this.$message.error('查询权限失败')
      }
      this.setRightForm = res.data
      this.getCheckedRoleRightArr(role, this.checkedRoleRightArr)
      this.showRightDialogVisible = true
    },

    //递归获取三级权限，并把三级权限的所有Id赋值给checkedRoleRightArr数组
    getCheckedRoleRightArr(node, arr) {
      //如果当前节点不包含children属性，就将该节点的id赋值给数组
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getCheckedRoleRightArr(item, arr)
      })
    },

    //监听关闭分配权限
    setRightDialogClosed() {
      this.checkedRoleRightArr = []
    },

    //确认分配权限
    async allotRights(){
      const keys=[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
      // console.log(keys)
      //分割成以逗号连接的字符串
      const idStr=keys.join(',')
      const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if (res.meta.status != 200) {
        return this.$message.error('更新权限失败')
      }
      this.$message.success("更新权限成功")
      this.getRolesList()
      this.$showRightDialogVisible=false
    },

    
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>


