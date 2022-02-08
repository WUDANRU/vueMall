<template>
  <div class="login">
   <div class="container">
    <a href="/#/index"><img src="/imgs/login-logo.png" alt=""></a>
    </div>
    <div class="wrapper">
      <div class="container">
        <div class="login-form">
          <h3>
            <span class="checked">帐号登录</span><span class="sep-line">|</span><span>扫码登录</span>
          </h3>
          <div class="input">
            <input type="text" placeholder="请输入帐号" v-model="username">
          </div>
          <div class="input">
            <input type="password" placeholder="请输入密码" v-model="password">
          </div>
          <div class="btn-box">
            <a href="javascript:;" class="btn" @click="register">立即注册</a>
          </div>
        </div>
      </div>
      </div>
    </div>
</template>
<script>
export default{
    data(){
return{
      username:'',
      password:''
}
    },
    methods:{
         register(){
        let { username,password } = this;
        this.axios.post('/user/register',{
        username,
        password
      }).then(()=>{
        this.$message.success('注册成功');
      })
    }
    }
}
</script>
<style lang="scss" scoped>
.login{
  &>.container{
    height:113px;
    img{
      width:auto;
      height:100%;
    }
  }
.wrapper{
    background:url('/imgs/login-bg.jpg') no-repeat center;
    .container{
      height:576px;
      .login-form{
        box-sizing: border-box;
        padding-left: 31px;
        padding-right: 31px;
        width:410px;
        height:510px;
        background-color:#ffffff;
        position:absolute;
        bottom:29px;
        right:0;
        h3{
          line-height:23px;
          font-size:24px;
          text-align:center;
          margin:40px auto 49px;
          .checked{
            color:#FF6600;
          }
          .sep-line{
            margin:0 32px;
          }
        }
        .input{
          display:inline-block;
          width:348px;
          height:50px;
          border:1px solid #E5E5E5;
          margin-bottom:20px;
          input{
            width: 100%;
            height: 100%;
            border: none;
            padding: 18px;
          }
        }
        .btn{
          width:100%;
          line-height:50px;
          margin-top:10px;
          font-size:16px;
        }
        .btn-box{
              background: #FF6600;
    text-align: center;
        }
        .btn-box a{
           color:#fff;
        }
      }}} }
</style>