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
          <div class="input"> <!-- @keyup.enter="login()只能写在input里，有焦点按回车才能登录，没有焦点按回车登录不了 -->
            <input type="text" placeholder="请输入帐号" @keyup.enter="login()"  v-model="username">
          </div>
          <div class="input">
            <input type="password" placeholder="请输入密码" @keyup.enter="login()"  v-model="password">
          </div>
          <div class="btn-box">
            <a href="javascript:;" class="btn" @click="login" >登录</a>
          </div>
          <div class="tips">
            <div class="sms">手机短信登录/注册</div>
            <div class="reg"><span @click="register">立即注册</span><span>|</span><span>忘记密码？</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-link">
        <a href="https://www.imooc.com/u/1343480" target="_blank">河畔一角主页</a><span>|</span>
        <a href="https://coding.imooc.com/class/113.html" target="_blank">Vue全栈课程</a><span>|</span>
        <a href="https://coding.imooc.com/class/236.html" target="_blank">React全家桶课程</a><span>|</span>
        <a href="https://coding.imooc.com/class/343.html" target="_blank">微信支付专项课程（H5+小程序/云+Node+MongoDB）</a>
      </div>
      <p class="copyright">Copyright ©2019 mi.futurefe.com All Rights Reserved.</p>
    </div>
  </div>
</template>
<script>
// import { Input } from "element-ui";
import { mapActions } from 'vuex'; //mapActions 辅助函数  有多个变量,方法的时候可以使用，还是一样会派发dispatch
export default {
  name: 'login',
  data(){
    return {
      username:'',
      password:'',
      userId:'',//这个是前端用来连接后端的凭证
      // res:{}
    }
  },
  // components: {
  //   [Input.name]: Input 
  //   },
    
  mounted() {

    document.addEventListener('keyup', (e) => {
      if (e.keyCode == 13 || e.keyCode == 100) {
        this.login()
      }
    })
  },
  methods:{
    login(){
      let { username,password } = this;
      this.axios.post('/user/login',{
        username,
        password
      }).then((res)=>{
          // this.res=res; //xhr的login接口可以看到数据，需要里面的id(即res.id),登录成功就会有login的接口(需要吧main.js的mock关闭，即true改为false)
          // this.$router.push('/index')  //页面刷新保存的用户名和密码就不见了，需要吧它存在vuex里
       
       // this.$cookie.set('userId',res.id,{expires:'1M'}); //userId存储在cookie里，存储1个月时间
         this.$cookie.set('userId',res.id,{expires:'Session'}); //吧expires1个月的改成Session级别
// this.$cookie.set('userId',res.id,{expires:'30s'}); //登录后，如果尝试用这个，试完吧cookie的清除掉再刷新浏览器，才会显示未登录

// Session级别的浏览器杀掉，控制台cookie的userId会消失

         // this.$store.dispatch('saveUserName',res.username); //dispatch派发saveUserName方法 (这里是存储  action.js是传输 mutations.js和NavHeader.vue的data里的username是读取)
         //刷新index页面,登录的jack不会显示是因为获取user的接口还没有存，去APP.vue再去存储一次，然后NavHeader.vue再写计算属性

         //用这个mapActions,吧上一句注释掉，然后写了下面这句
        this.saveUserName(res.username);//调用这个方法，吧值放进去      //dispatch是派发/存储/拉取数量
        
        //  this.$router.push('/index')

        // this.$router.push({
        //   path:'/index',
        //   query:{ //query是get传参，query的传参是一直在路由上的，一直挂着的(http://localhost:8080/#/index?from=login)
        //     from:'login', //登录页面拼接成: http://localhost:8080/#/index?from=login
        //   }
        // }) 

        // this.$cookie.set('userId',res.id,{expires:'Session'});
        // // this.$store.dispatch('saveUserName',res.username);
        // this.saveUserName(res.username);
        this.$router.push({
          name:'index',
          params:{
            from:'login' //给NavHeader.vue的this.getCarCount()打断点，登录账号密码，console输入this.$route.params会显示{from: "login"}，在内存里保存的路径
          }
        }); //传参方式：一种是query,一种是params
      })
      // .catch((err)=>{
      //   console.log(err) //main.js写了return Promise.reject(res);和这边写catch，这个catch可以不写，没有这个catch，console那里一样会显示跟catch一样的内容
      // })
    },
    ...mapActions(['saveUserName']),
    register(){
      this.$router.push('/register')
    //   this.axios.post('/user/register',{
    //     username:'admin1',
    //     password:'admin1',
    //     email:'admin1@163.com'
    //   }).then(()=>{
    //     // alert('注册成功');
    //     this.$message.success('注册成功'); //点击注册会显示main.js的else的提升信息:用户名不存在，需要吧main.js的else注释掉，才会显示注册成功
    //   })
    }
  }
}
</script>
<style lang="scss">
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
        .tips{
          margin-top:14px;
          display:flex;
          justify-content:space-between;
          font-size:14px;
          cursor:pointer;
          .sms{
            color:#FF6600;
          }
          .reg{
            color:#999999;
            span{
              margin:0 7px;
            }
          }
        }
      }
    }
  }
  .footer{
    height:100px;
    padding-top:60px;
    color:#999999;
    font-size:16px;
    text-align:center;
    .footer-link{
      a{
        color:#999999;
        display:inline-block;
      }
      span{
        margin:0 10px;
      }
    }
    .copyright{
      margin-top:13px;
    }
  }
}
</style>