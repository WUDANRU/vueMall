<template>
  <div class="header">
    <div class="nav-topbar">
      <div class="container">
        <div class="topbar-menu">
          <a href="javascript:;">小米商城</a>
          <a href="javascript:;">MUI</a>
          <a href="javascript:;">云服务</a>
          <a href="javascript:;">协议规则</a>
        </div>
        <div class="topbar-user">
           <a href="javascript:;" v-if="username">{{username}}</a> <!-- App.vue的this.getUser();拉取用户信息是要从这边保存到vuex的，这个不能在这边写这个方法是因为没有登录,username也是空的 -->
          <a href="javascript:;" v-if="!username" @click="login">登录</a>
          <a href="javascript:;" v-if="username" @click="logout">退出</a>
          <a href="/#/order/list" v-if="username">我的订单</a>
          <a href="javascript:;" class="my-cart" @click="goToCart"><span class="icon-cart"></span>购物车({{cartCount}})</a>
        </div>
      </div>
    </div>
    <div class="nav-header">
      <div class="container">
        <div class="header-logo">
          <a href="/#/index"></a>
        </div>
        <div class="header-menu">
          <div class="item-menu">
            <span>小米手机</span>
            <div class="children">
              <ul>
                <li class="product" v-for="(item,index) in phoneList" :key="index">
                  <a v-bind:href="'/#/product/'+item.id" target="_blank">
                    <div class="pro-img"><img :src="item.mainImage" :alt="item.subtitle"></div>
                    <div class="pro-name">{{item.name}}</div>
                   <div class="pro-price">{{item.price|currency}}</div>  <!-- 过滤器 --> 
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="item-menu">
            <span>RedMi红米</span>
          </div>
          <div class="item-menu">
            <span>电视</span>
            <div class="children">
              <ul>
                <li class="product">
                  <a href="" target="_blank">
                    <div class="pro-img">
                      <img v-lazy="'/imgs/nav-img/nav-3-1.jpg'" alt="">
                    </div>
                    <div class="pro-name">小米壁画电视 65英寸</div>
                    <div class="pro-price">6999元</div>
                  </a>
                </li>
                <li class="product">
                  <a href="" target="_blank">
                    <div class="pro-img">
                      <img v-lazy="'/imgs/nav-img/nav-3-2.jpg'" alt="">
                    </div>
                    <div class="pro-name">小米全面屏电视E55A</div>
                    <div class="pro-price">1999元</div>
                  </a>
                </li>
                <li class="product">
                  <a href="" target="_blank">
                    <div class="pro-img">
                      <img v-lazy="'/imgs/nav-img/nav-3-3.png'" alt="">
                    </div>
                    <div class="pro-name">小米电视4A 32英寸</div>
                    <div class="pro-price">699元</div>
                  </a>
                </li>
                <li class="product">
                  <a href="" target="_blank">
                    <div class="pro-img">
                      <img v-lazy="'/imgs/nav-img/nav-3-4.jpg'" alt="">
                    </div>
                    <div class="pro-name">小米电视4A 55英寸</div>
                    <div class="pro-price">1799元</div>
                  </a>
                </li>
                <li class="product">
                  <a href="" target="_blank">
                    <div class="pro-img">
                      <img v-lazy="'/imgs/nav-img/nav-3-5.jpg'" alt="">
                    </div>
                    <div class="pro-name">小米电视4A 65英寸</div>
                    <div class="pro-price">2699元</div>
                  </a>
                </li>
                <li class="product">
                  <a href="" target="_blank">
                    <div class="pro-img">
                      <img v-lazy="'/imgs/nav-img/nav-3-6.png'" alt="">
                    </div>
                    <div class="pro-name">查看全部</div>
                    <div class="pro-price">查看全部</div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="header-search">
          <div class="wrapper">
            <input type="text" name="keyword">
            <a href="javascript:;"></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';  //mapState 辅助函数
  export default{
    name:'nav-header',
    data(){
      return{
        // username:'jack',
        // username:'',
        // username:this.$store.state.username, //读取变量,这个跟computed里的用一个就可以，因为这个刷新了登录名不会显示
        phoneList:[]
      }
    },
computed:{//index页面的登录名还是显示空的，是因为延迟加载,一开始读取没有值，后面接口返回了值,需要用到computed重新计算

// username(){
//   return this.$store.state.username;
// },

// cartCount(){
//   return this.$store.state.cartCount;
// }

...mapState(['username','cartCount']) //这两个是变量

},

filters:{ //有时候渲染的价格数据不是元是分，需要用到过滤器
currency(val){
  if (!val) return '0.00';
  return '￥'+val.toFixed(2)+'元'; //val.toFixed(2)是两位数
}
    },
    mounted(){
this.getProductList();
let params=this.$route.params;
if(params&&params.from=='login'){
  this.getCarCount(); //优化了当刷新index.vue页面，显示一个sum,没有优化当刷新index.vue页面，显示两个sum
}
// this.getCarCount(); //这个从App.vue复制过来的,会造成资源浪费，需要做优化，刷新index页面network会显示两次sum接口，第一次调用初始化的App.vue，
// 第二次是NavHeader.vue，这样会造成资源浪费，所以做优化: 从登录页面调过来的才需要调用
    },
    methods:{
      getProductList(){  //main.js文件的接口错误拦截的response.data是成功后的数据
        this.axios.get('/products',{
        params:{
categoryId:'100012',
pageSize:6 //6条数据  pageSize:6  res.list.length>=6
          }
        }).then((res)=>{  
// if(res.list.length>=6){
// this.phoneList=res.list.slice(0,6)
// }
  this.phoneList = res.list;

        })  //如果是get传参，用params  如果是post传参，直接写，不需要用params
      },
      login(){
        this.$router.push('/login');
      },
      getCarCount(){//购物车商品数量(从VueX取数据)  //3 这个从App.vue复制过来的,会造成资源浪费，需要做优化
      this.axios.get('/carts/products/sum').then((res=0)=>{
      this.$store.dispatch('saveCartCount',res); //dispatch 派发/拉取数量/存储
      })  //1 登录状态下购物车数量为3，点击退出，显示购物车数量为0，点击登录，购物车数量还是0(没有还原)，所以登录成功之后要去获取购物车的数量，吧数据存储到vuex里，vuex是在内存去存储的，当我们刷新的时候，内存里的数据会自动消失，所以需要重新存储到vuex里
    },    //2 从退出，到登录是单页面，没有刷新，就没有调用App.vue,App.vue在项目第一次进来的时候才会调用，所以需要在NavHeader.vue里重新调用购物车的数量
       logout(){
          this.axios.post('/user/logout').then(()=>{
          this.$message.success('退出成功');
          this.$cookie.set('userId','',{expires:'-1'}); //expires:'-1'即刻过期
          this.$store.dispatch('saveUserName',''); //也可以用mapActions简写
          this.$store.dispatch('saveCartCount','0');
       })
      },
      goToCart(){
        this.$router.push('/cart');  
      }
    }
  }
</script>
<style lang="scss">
  @import './../assets/scss/base.scss';
  @import './../assets/scss/mixin.scss';
  @import './../assets/scss/config.scss';
  .header{
    .nav-topbar{
      height:39px;
      line-height:39px;
      background-color:#333333;
      color:#B0B0B0;
      .container{
        @include flex();
        a{
          display:inline-block;
          color:#B0B0B0;
          margin-right:17px;
        }
        .my-cart{
          width:110px;
          background-color:#FF6600;
          text-align:center;
          color:#ffffff;
          margin-right:0;
          .icon-cart{
            @include bgImg(16px,12px,'/imgs/icon-cart-checked.png');
            margin-right:4px;
          }
        }
      }
    }
    .nav-header{
      .container{
        position:relative;
        height:112px;
        @include flex();
        .header-menu{
          display:inline-block;
          width:643px;
          padding-left:209px;
          .item-menu{
            display:inline-block;
            color:#333333;
            font-weight:bold;
            font-size:16px;
            line-height:112px;
            margin-right:20px;
            span{
              cursor:pointer;
            }
            &:hover{
              color:$colorA;
              .children{
                height:220px;
                opacity:1;
              }
            }
            .children{
              position:absolute;
              top:112px;
              left:0;
              width:1226px;
              height:0;
              opacity:0;
              overflow:hidden;
              border-top:1px solid #E5E5E5;
              box-shadow:0px 7px 6px 0px rgba(0, 0, 0, 0.11);
              z-index: 10;
              transition:all .5s;
              background-color: #ffffff;
              .product{
                position:relative;
                float:left;
                width:16.6%;
                height:220px;
                font-size:12px;
                line-height:12px;
                text-align: center;
                a{
                  display:inline-block;
                }
                img{
                  width:auto;
                  height:111px;
                  margin-top:26px;
                }
                .pro-img{
                  height:137px;
                }
                .pro-name{
                  font-weight:bold;
                  margin-top:19px;
                  margin-bottom:8px;
                  color:$colorB;
                }
                .pro-price{
                  color:$colorA;
                }
                &:before{
                  content:'';
                  position:absolute;
                  top:28px;
                  right:0;
                  border-left:1px solid $colorF;
                  height:100px;
                  width:1px;
                }
                &:last-child:before{ //显示没有最后一条分割线
                  display:none;
                }
              }
            }
          }
        }
        .header-search{
          width:319px;
          .wrapper{
            height:50px;
            border:1px solid #E0E0E0;
            display:flex;
            align-items:center;
            input{
              border:none;
              box-sizing: border-box;
              border-right:1px solid #E0E0E0;
              width:264px;
              height:50px;
              padding-left:14px;
            }
            a{
              @include bgImg(18px,18px,'/imgs/icon-search.png');
              margin-left:17px;
            }
          }
        }
      }
    }
  }
</style>