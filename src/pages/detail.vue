<template>
  <div class="detail">
    <product-param v-bind:title="product.name"></product-param>
    <div class="wrapper">
      <div class="container clearfix">
        <div class="swiper">
          <swiper :options="swiperOption">
              <swiper-slide><img src="/imgs/detail/phone-1.jpg" alt=""></swiper-slide>
              <swiper-slide><img src="/imgs/detail/phone-2.jpg" alt=""></swiper-slide>
              <swiper-slide><img src="/imgs/detail/phone-3.jpg" alt=""></swiper-slide>
              <swiper-slide><img src="/imgs/detail/phone-4.jpg" alt=""></swiper-slide>
              <!-- Optional controls -->
              <div class="swiper-pagination"  slot="pagination"></div>
          </swiper>
        </div>
        <div class="content">
          <h2 class="item-title">{{product.name}}</h2>
          <p class="item-info">相机全新升级 / 960帧超慢动作 / 手持超级夜景 / 全球首款双频GPS / 骁龙845处理器 / 红<br/>外人脸解锁 / AI变焦双摄 / 三星 AMOLED 屏</p>
          <div class="delivery">小米自营</div>
          <div class="item-price">{{product.price}}元<span class="del">1999元</span></div>
          <div class="line"></div>
          <div class="item-addr">
            <i class="icon-loc"></i>
            <div class="addr">北京 北京市 朝阳区 安定门街道</div>
            <div class="stock">有现货</div>
          </div>
          <div class="item-version clearfix">
            <h2>选择版本</h2>
            
            <div class="phone fl" :class="{'checked':type==1}" @click="version(type=1)">6GB+64GB 全网通</div>
            <div class="phone fr" :class="{'checked':type==2}" @click="version(type=2)">4GB+64GB 移动4G</div>
            <div class="phone fr" :class="{'checked':type==3}" @click="version(type=3)" style="margin-top: 5px;float: left;">移动5G</div> 
          </div>
          <div class="item-color">
            <h2>选择颜色</h2>
            <div class="phone checked">
              <span class="color"></span>
              深空灰
            </div>
          </div>
          <div class="item-total">
            <div class="phone-info clearfix">
              <div class="fl">{{product.name}} {{version(type)}} 深灰色</div>
              <div class="fr">{{product.price}}元</div>
            </div>
            <div class="phone-total">总计：{{product.price}}元</div>
          </div>
          <div class="btn-group">
            <a href="javascript:;" class="btn btn-huge fl" @click="addCart">加入购物车</a>
          </div>
        </div>
      </div>
    </div>
    <div class="price-info">
      <div class="container">
        <h2>价格说明</h2>
        <div class="desc">
          <img src="/imgs/detail/item-price.jpeg" alt="">
        </div>
      </div>
    </div>
    <service-bar></service-bar>
  </div>
</template>
<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import ProductParam from './../components/ProductParam'
import ServiceBar from './../components/ServiceBar';
export default{
  name:'detail',
  data(){
    return {
      // id:''
      id:this.$route.params.id,//获取商品ID
      err:'',
      type:1,//商品版本切换
      product:{},//商品信息
      swiperOption:{
        autoplay:true,
        pagination: {
          el: '.swiper-pagination',
          clickable :true,
        }
      }
    }
  },
  components:{
    Swiper,
    SwiperSlide,
    ProductParam,
    ServiceBar
  },
  mounted(){
    // console.log(this.$route)
    this.getProductInfo();
  },
  methods:{
    version(type){
      if(type==1){
return '6GB+64GB 全网通'
    }else if(type==2){
return '4GB+64GB 移动4G'
    }else{
return '移动5G'
    }
    },
    getProductInfo(){
      //  let id=this.$route.params.id;
      //  this.axios.get(`/products/${id}`)
      this.axios.get(`/products/${this.id}`).then((res)=>{
        this.product = res;
      })
    },
    addCart(){
      this.axios.post('/carts',{
        productId:this.id,
        selected: true //加入购物车之后就是选中的状态
      }).then((res={cartProductVoList:0})=>{ //控制台的console和sources,如果打断点调试了是显示不出控制台报错的，要取消打断点才能看到控制台报错
        
        // 接口报错不应该进到then里，要进到catch里，因为接口状态是10，比较特殊，main.js的状态10没有project,所以进到then里
        // this.$store.dispatch('saveCartCount',res.cartProductVoList.length);  // /#/detail/31没有登录，res是undefined，打断点调试detail.vue需要在detail/31页面，点击加入购物车，才能显示走了这句代码/走了这个断点了
        this.$store.dispatch('saveCartCount',res.cartTotalQuantity); //购物车里实时的数据undefined

        this.$router.push('/cart'); //没有登录console报错，打断点调试会进到上上一句代码，点击加入购物车会跳转到login页面  登录了点击加入购物车会跳转到cart页面
      }).catch((res)=>{ //catch不用写，成功会走then,不成功不会进到then来,因为main.js拦截错误的等于10的状态码写了Promise.reject
      this.err=res //未登录状态下，这个代码和this.$store.dispatch('saveCartCount',res.cartProductVoList.length)都打断点调试，点击加入购物车，会进入到这个代码来，是因为main.js拦截错误的等于10的状态码写了Promise.reject
    }) 
    }
  } // /#/detail/42页面 未登录状态下 第二次刷新会跳到login页面，因为main.js的错误拦截写的代码
}
</script>
<style lang="scss">
  @import './../assets/scss/config.scss';
  @import './../assets/scss/mixin.scss';
  .detail{
    .wrapper{
      .swiper{
        float:left;
        width:642px;
        height:617px;
        margin-top:5px;
        img{
          width:100%;
          height:100%;
        }
      }
      .content{
        float:right;
        width:584px;
        height:870px;
        .item-title{
          font-size:28px;
          padding-top:30px;
          padding-bottom:16px;
          height: 26px;
        }
        .item-info{
          font-size:14px;
          height: 36px;
        }
        .delivery{
          font-size:16px;
          color:#FF6700;
          margin-top:26px;
          margin-bottom:14px;
          height: 15px;
        }
        .item-price{
          font-size:20px;
          color:#FF6700;
          height: 19px;
          .del{
            font-size:16px;
            color:#999999;
            margin-left:10px;
            text-decoration:line-through;
          }
        }
        .line{
          height:0;
          margin-top:25px;
          margin-bottom:28px;
          border-top:1px solid #E5E5E5;
        }
        .item-addr{
          height:108px;
          background-color:#FAFAFA;
          border:1px solid #E5E5E5;
          box-sizing:border-box;
          padding-top:31px;
          padding-left:64px;
          font-size:14px;
          line-height:14px;
          position:relative;
          .icon-loc{
            position: absolute;
            top: 27px;
            left: 34px;
            @include bgImg(20px,20px,'/imgs/detail/icon-loc.png');
          }
          .addr{
            color:#666666;
          }
          .stock{
            margin-top:15px;
            color:#FF6700;
          }
        }
        .item-version,.item-color{
          margin-top:30px;
          h2{
            font-size:18px;
            margin-bottom:20px;
          }
        }
        .item-version,.item-color{
          .phone{
            width:287px;
            height:50px;
            line-height:50px;
            font-size:16px;
            color:#333333;
            border:1px solid #E5E5E5;
            box-sizing: border-box;
            text-align:center;
            cursor:pointer;
            span{
              color:#666666;
              margin-left:15px;
            }
            .color{
              display:inline-block;
              width:14px;
              height:14px;
              background-color:#666666;
            }
            &.checked{
              border:1px solid #FF6600;
              color:#FF6600;
            }
          }
        }
        .item-total{
          height: 108px;
          background: #FAFAFA;
          padding: 24px 33px 29px 30px;
          font-size: 14px;
          margin-top:50px;
          margin-bottom:30px;
          box-sizing: border-box;
         
          .phone-total{
            font-size: 24px;
            color: #FF6600;
            margin-top: 18px;
          }
        }
      }
    }
    .price-info{
      margin-top:50px;
      background-color:#F3F3F3;
      height:340px;
      h2{
        font-size:24px;
        color:#333333;
        padding-top:38px;
        margin-bottom:30px;
      }
    }
     .btn-group .btn-huge{
            display:block;
            text-align:center;
            background:#FF6600;
            color:#fff;
            width:240px;
            height:60px;
            line-height:60px;
            font-size:16px;
          }
  }
</style>