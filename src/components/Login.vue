<template>
    <div class="login_container">
        <!-- 登录盒子  -->
        <div class="login_box">
            <!-- 头像 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单 -->
            <!-- 为el-form进行属性绑定 -->
            <el-form  ref="LoginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <!-- 为用户名和密码动态绑定数据 -->
                    <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
                </el-form-item> 
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="loginForm.password"></el-input>
                </el-form-item> 
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary">登录</el-button>
                    <el-button type="info">重置</el-button>
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
                    username: '',
                    password: ''
                },
                loginFormRules: {
                    username: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }, {
                        min: 3,
                        max: 8,
                        message: '长度在 3 到 8 个字符',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }, {
                        min: 6,
                        max: 15,
                        message: '长度在 6 到 15 个字符',
                        trigger: 'blur'
                    }]
                }
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