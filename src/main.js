import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import store from './store'
import VueCookie from 'vue-cookie'
import env from './env' //aa


import { Message } from 'element-ui';
import { Pagination, Button } from "element-ui";

import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.$message = Message;
// Vue.component(Pagination.name, Pagination);
// Vue.component(Button.name, Button);
Vue.use(Button)
Vue.use(Pagination)

import axios from 'axios'
import VueAxios from 'vue-axios'

const mock = false;
if (mock) {
    require('./mock/api') //import和require 
}


Vue.use(VueAxios, axios) // axios通过vueaxios挂载到实例上，然后可以(在App.vue)用this调用了
Vue.use(VueCookie);
Vue.use(VueLazyLoad, {
    loading: '/imgs/loading-svg/loading-bars.svg'
})

let baseURL = process.env.NODE_ENV === 'development' ? '/api' : env.baseURL; //aa,这里和App.vue都打印不出process.env.NODE_ENV, npm run build后会显示vue-cli-service build --mode=production
axios.defaults.baseURL = baseURL; //aa

// 根据前端的跨域方式做调整   //axios.defaults.baseURL = '/api';没有这个会显示404，/api这个是接口，是服务器地址
// 这个是接口需要的
// axios.defaults.baseURL = '/api'; // 接口代理  当前接口的域名和前端的域名是一样的称之为接口代理  //jsonp或CORS 前后端不一样时需要这样去写: axios.defaults.baseURL='http://www.baidu.com';
axios.defaults.timeout = 8000; // 超时

//根据环境变量获取不同的请求地址
// axios.defaults.baseURL = env.baseURL;

// interceptors 拦截器
// 针对用户请求拦截 request
// response 错误拦截

// 接口错误拦截  登录和注册的
axios.interceptors.response.use(function(response) { //response是axios插件封装给我们的
        let path = location.hash; // console输入location.hash显示#/index,因为没有登录状态(status:10),刷新index页面会跳转到login页面所以写了这句和下面一句
        let res = response.data; // response.data取到我们接口的数据/取到我们接口的返回值
        if (res.status == 0) { // 转态码返回0，表示成功
            return res.data; // 取到我们接口的返回值返回到axios
        } else if (res.status == 10) { // 未登录，转态码10，要跳转到登录页面

            if (path != '#/index') { // 不等于首页就作跳转,因为没有登录状态(status:10),刷新index页面会跳转到login页面所以写了这句和上面一句,然后输入账号和密码，xhr的headers的cookie会显示后端凭证JSESSIONID和前端凭证useid=8,吧cookeie带过去就能显示我们是谁了，返回数据给我们( 然后存储到数据库去 )
                window.location.href = '/#/login'; // #是hash路由
                // return Promise.reject(res); //这个会走detail页面addCart方法的catch不会走then  写了这个，detail.vue打断点的时候，点击加入购物车就不会走进去: this.$store.dispatch('saveCartCount',res.cartProductVoList.length);

            } // 拉取用户信息要吧没登录状态的index页面设置跳转到login页面，然后登录以后通过cookie拿到返回的数据
            return Promise.reject(res);
            // window.location.href = '/#/login';

            // 如果点击注册会显示提示跟else的代码相关
        } else { // 否则表示不成功
            console.log(res.msg, 'res.msg')
                // alert(res.msg) 吧这个改成下面的一句  
            Message.warning(res.msg) //或者Message.error(res.msg)
                // this.$message.error(res.msg); //其他页面能使用这个，当前文件只能使用上一句
            return Promise.reject(res);
        } // 前面是业务错误的拦截，状态码是成功200的，然后来的报错
    },
    (error) => { // 当微信已支付再点击微信图标报错作的处理
        let res = error.response; // 1这个可以打断点，点击orderPay页面的微信支付图片进入到这句，鼠标移到这句上，可以看出res的信息(res.data.message) //2点击orderPay页面的微信支付，然后不应该跑到orderPay.vue的微信支付的then里，要跑到微信支付的catch里，所以写了return Promise.reject(error);
        // alert(res) // 写了这个定义的res才不会报错，然后给上一句打断点
        Message.error(res.data.message);
        return Promise.reject(error);
    }
); // 报错500/Internal Server Error: http状态码的拦截/xhr的500是服务端错误的拦截，微信扫码已支付再点击就会报错

Vue.config.productionTip = false

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app')