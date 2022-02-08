<template>
  <div class="ali-pay">
    <loading v-if="loading"></loading>
     <div class="form" v-html="content"></div>  <!-- document.forms[0]指的是class="form"，这里只有一个form -->
  </div>
</template>
<script>
  import Loading from './../components/Loading'
  export default{
    name:'alipay',
    components:{
      Loading
    },
    data(){
      return {
        orderId:this.$route.query.orderId, //从orderPay.vue跳到这个alipay.vue页面
        content:'',
        loading:true
      }
    },
    mounted(){
      this.paySubmit();
      // console.log(this);
      // console.log(this.$route) //要测试这个，要吧this.paySubmit()注释,还要重新点击orderPay的支付宝付款图标，跳转到支付宝付款页面，刷新支付宝付款页面不管用
   },
    methods:{
      paySubmit(){
         this.axios.post('/pay',{  //状态码如果是500，可能服务器垮掉了，也可能是写错了代码，导致发送的参数少了一个，所以状态码显示500
          orderId:this.orderId, //这是发送的参数
          orderName:'Vue高仿小米商城',
          amount:0.01, //单位元
          payType:1 //1支付宝，2微信
        }).then((res)=>{
          console.log(res) //点击支付宝图标跳转到新页面，再刷新一次，然后要打印这个需要吧后面部分注释掉，或者注释以后有network有/pay的接口
          this.content = res.content;
          setTimeout(()=>{ 
           this.loading=false; //loading可以不用关，直接跳转到新页面
           document.forms[0].submit(); //document.forms表单拿到的是一堆，[0]是第一个
          },100)
        })
      }
    }
  }
</script>