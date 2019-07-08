<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/images/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <el-aside :width="isCollapse? '64px':'200px'">
        <div class="toggle-button" @click="toggle">|||</div>
        <!-- unique-opened保证只有一个打开 -->
        <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#333744"
        text-color="#fff"
        active-text-color="#409eff" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
        <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" :key="item.id" v-for="item in menulist">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" :key="subItem.id" v-for="subItem in item.children" @click="saveNavPath('/'+subItem.path)">
                <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                          </template>
            </el-menu-item>
            </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer><div>江苏传智播客版权所有@copyright2019</div></el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
    export default {
        data() {
            return {
                menulist: [],
                iconsObj: {
                          '125': 'iconfont icon-user',
                          '103': 'iconfont icon-tijikongjian',
                          '101': 'iconfont icon-shangpin',
                          '102': 'iconfont icon-danju',
                          '145': 'iconfont icon-baobiao'
                },
                isCollapse:false,
                //激活的地址默认是个空地址
                activePath:''
            }
        },
        created() {
            this.getMenuList()
            this.activePath=sessionStorage.getItem("activePath")
        },
        methods: {
            handleOpen(key, keyPath) {

            },
            handleClose(key, keyPath) {

            },
            logout() {
                //点击退出，清除session,通过编程式导航跳转到登录页面
                window.sessionStorage.clear()
                this.$router.push('/login')
            },
            async getMenuList() {
                const {
                    data: res
                } = await this.$http.get('menus')
                if (res.meta.status != 200) return this.$message.error(res.meta.msg)
                // console.log(res);
                this.menulist = res.data
            },
            toggle(){
              this.isCollapse=!this.isCollapse
            },
            saveNavPath(path){
              this.activePath=path
              sessionStorage.setItem("activePath",path)
            }
        }
    }
</script>

<style lang="less" scoped>
    // 将顶级容器设置为高度100%，占满全屏
    .home-container {
        height: 100%;
    }
    
    // 设置头部区域的样式
    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #fff;
        font-size: 20px;
        >div {
            display: flex;
            align-items: center;
            span {
                margin-left: 15px;
            }
        }
    }
    
    // 设置侧边栏样式
    .el-aside {
        background-color: #333744;
        .el-menu {
            border-right: none;
        }
    }
    
    // 设置主体样式
    .el-main {
        background-color: #eaedf1;
    }
    
    .iconfont {
        margin-right: 10px;
    }
    
    .toggle-button {
        background-color: #4a5064;
        text-align: center;
        color: #fff;
        font-size: 10px;
        line-height: 24px;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
    .el-footer {
      position: relative;
      text-align: center;
      color: #666;
      font-size: 12px;
      div {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%)
      }
    }
</style>