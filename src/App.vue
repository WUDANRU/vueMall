<template>
  <div id="app">
  <router-view></router-view>
  </div>
</template>

<script>
// import storage from './storage';
export default {
  name: "App",

  // computed: {
    
  // },

//   methods:{
  
//   },

//   data(){
// return{
//   res:{}
// }
//   },

  mounted(){
  // storage.setItem('e',2)
  // storage.setItem('user',{a:1})
  // storage.setItem('abc',{a:1},'user')
  // storage.clear('b')
  // storage.clear('abc','user')//删除user下的abc  ( user: {abc: {a: 1}} )

// 本地加载请求静态json文件的形式
  // this.axios.get('/mock/user/login.json').then((res)=>{ //路径不需要加根目录public
  //   this.res=res;  //因为main.js有（import axios from 'axios'   import VueAxios from 'vue-axios'）  axios通过vueaxios挂载到实例上，然后可以用this调用了

  // })// public下的login.json在network-xhr状态显示请求失败(failed)是因为Request URL请求的接口是env.js的development的baseURL地址  要吧main.js注释掉3个 
    // import env from './env'    axios.defaults.baseURL = env.baseURL;(cors跨域 jsonp跨域)     axios.defaults.baseURL = '/api';(接口代理) 
 

// 通过easy-mock平台实现数据mock（使用easy-mock的base url接口）
  // this.axios.get('/user/login').then((res)=>{ 
  //   this.res=res;
  // })


// 本地集成mockjs实现数据mock
  // this.axios.get('/user/login').then((res)=>{
  //   this.res=res;                                            
  // })
// 控制台的cookie，吧JSESSIONID和userId同步，JSESSIONID是后台的，一直在线，需要关掉  userId登录退出是吧cookie保存和关闭 (JSESSIONID绘画级别Session  userId吧用户id改成绘画级别Session) login.vue改为this.$cookie.set('userId',res.id,{expires:'Session'})
// 控制台的cookie能获取到用户id(即useId)就是登录状态，不能获取到就是非登录状态  绘画级别是浏览器没关闭，绘画级别一直在线，浏览器有关闭，绘画级别才会关掉(登录才有user和sum接口，没有退出直接吧浏览器关闭，交互会显示没有登录，控制台的cookie会显示useId还在，退出了，useId才会消失)

// 交互部分没有登录状态下是不会获取用户信息和数量的
// 数据部分没有登录状态下会调到接口，接口会抛出两个异常: Uncaught (in promise) {status: 10, msg: "NEED_LOGIN"}，user和sum接口会显示需要登录，商品接口可以调的到数据
this.getUser();  //1 登录状态下购物车数量为3，点击退出，显示购物车数量为0，点击登录，购物车数量还是0(没有还原)，所以登录成功之后要去获取购物车的数量，吧数据存储到vuex里，vuex是在内存去存储的，当我们刷新的时候，内存里的数据会自动消失，所以需要重新存储到vuex里
this.getCarCount(); //2 从退出，到登录是单页面，没有刷新，就没有调用App.vue,App.vue在项目第一次进来的时候才会调用，所以需要在NavHeader.vue里重新调用购物车的数量
// expires:Session级别的，(登录页面不用退出)当浏览器杀掉，控制台cookie的userId会消失,而expires:1M时userId不会消失，但cookie上的JSESSIONID是一直存在的 (浏览器页面关掉没有消失，要杀掉才会消失)


//这样写，(登录页面不用退出)当吧浏览器杀掉，cookie上的JSESSIONID和useid两个Session级别的会消失(浏览器页面关掉没有消失，要杀掉才会消失)
// if(this.$cookie.get('useId')){ //如果是true当前就是登录状态
// this.getUser();
// this.getCarCount(); //输入账号和密码，xhr的headers的cookie会显示后端凭证JSESSIONID和前端凭证useid=8,吧cookeie带过去就能显示我们是谁了，返回数据给我们( 然后存储到数据库去 )
// }
  },
  methods:{ //index页面和login页面的两个接口都显示msg: "NEED_LOGIN" status: 10，就是需要登录，走的main.js的接口错误拦截的res.status == 10

    getUser(){ //拉取用户信息(从VueX取数据) 拉取一般用get  推送用post
      this.axios.get('/user').then((res={})=>{  //then后不需要用参数   res={}默认值，没有登录时，接口没有返回数据
    this.$store.dispatch('saveUserName',res.username);  //刷新index页面,登录的jack不会显示是因为获取user的接口还没有存，在APP.vue再去存储一次,然后NavHeader.vue再写计算属性
      }) //dispatch是派发/存储/拉取数量
    },
    getCarCount(){//购物车商品数量(从VueX取数据)
      this.axios.get('/carts/products/sum').then((res=0)=>{ //res指的是data里的数据   res=0默认值，没有登录时，接口没有返回数据

 this.$store.dispatch('saveCartCount',res);  //写res是因为sum接口的数据是这样的:
// {status: 0, data: 0}
// data: 0
// status: 0

      })
    }
  }
};
</script>

<style>
@import './assets/scss/reset.scss';
</style>
