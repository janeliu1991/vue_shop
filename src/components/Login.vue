<template>
  <div class="login_container">
    <!-- 登录盒子  -->
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单 -->
      <!-- model为el-form进行属性绑定,是表单数据对象，ref是为form创建一个表单引用，ref的值就是form的实例对象 -->
      <el-form
        ref="LoginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 prop，传入form组件中的model中的字段-->
        <el-form-item prop="username">
          <!-- 为用户名和密码动态绑定数据 -->
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 8,
            message: '长度在 3 到 8 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      //this代表的是这个Login组件
      // console.log(this)
      //this.refs.LoginFormRef指向这个组件的引用对应到的form实例对象，resetFields()对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.LoginFormRef.resetFields()
    },
    login() {
      //validate进行表单预验证，里面是一个回调函数，参数是验证的结果，是一个boolean值
      this.$refs.LoginFormRef.validate(async valid => {
        // console.log(valid);
        if (!valid) return
        //对象的结构赋值和数组不同，数组是按顺序一一对应的，对象的解构没有顺序，是根据属性名来的，等式的左边的变量必须是右边有的属性名，如果想要更改属性名，用：来重新命名
        //await得到的异步结果中含有data属性的真是数据
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res);
        if (res.meta.status != 200) {
          this.$message.error('登录失败')
        } else {
          this.$message.success('登陆成功')
          //console.log(res)
          //登录成功返回数据里面会带一个token令牌，获取到之后存储到sessionStorage中，页面在不关闭的状态下会一直保存，页面关闭失效
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b5b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>