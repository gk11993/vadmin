<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="用户名">
                        <template #prepend>
                            <el-button icon="el-icon-user"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="param.password" show-password
                        @keyup.enter="submitForm()">
                        <template #prepend>
                            <el-button icon="el-icon-lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <p class="login-tips"></p>
            </el-form>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { loginsss } from "../api/index";
export default {
    // setup() {
    //     const router = useRouter();
    //     const param = reactive({
    //         username: "超管",
    //         password: "123456",
    //     });

    //     const rules = {
    //         username: [
    //             {
    //                 required: true,
    //                 message: "请输入用户名",
    //                 trigger: "blur",
    //             },
    //         ],
    //         password: [
    //             { required: true, message: "请输入密码", trigger: "blur" },
    //         ],
    //     };
    //     const login = ref(null);
    //     const submitForm = () => {
    //         login.value.validate((valid) => {
    //             if (valid) {
    //                 ElMessage.success("登录成功");
    //                 localStorage.setItem("ms_username", param.username);
    //                 router.push("/");
    //             } else {
    //                 ElMessage.error("登录成功");
    //                 return false;
    //             }
    //         });
    //     };
        
    //     const store = useStore();
    //     store.commit("clearTags");

    //     return {
    //         param,
    //         rules,
    //         login,
    //         submitForm,
    //     };
    // },
    data() {
    return {
      param: {
        username: '',
        password: ''
      },
      rules:{user_name: [ {required: true,message: "请输入用户名",trigger: "blur",},],
            password: [{ required: true, message: "请输入密码", trigger: "blur" },],}
    }
  },
    methods:{
       submitForm(){
          this.$router.push("/");
      loginsss(this.param)
        .then(response => {
          
          if(response.Code===200){
            localStorage.setItem("ms_username", this.param.username);
            localStorage.setItem("ms_name", response.Data.name);
            localStorage.setItem("ms_userid", response.Data.id);
            localStorage.setItem("ms_menus", JSON.stringify(response.Menus));
            localStorage.setItem("ms_token", response.Token);
            localStorage.setItem("ms_img", response.Data.img);
            this.$router.push('/')
          }else{
            this.$notify.error({
              title: '失败',
              message: response.Msg
            })
          }
          
        })
        .catch(response => {
            // localStorage.setItem("ms_username", this.param.user_name);
            //   this.$router.push('/')
        //    if(response.code==200){
        //      localStorage.setItem("ms_username", param.user_name);
        //       this.$router.push('/')
        //   }else{
        //     this.$notify.error({
        //       title: '失败',
        //       message: response.msg
        //     })
        //   }
        })
    },
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>