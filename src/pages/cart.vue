<template>
  <div class="cart">
    <order-header title="我的购物车">
      <template v-slot:tip>
        <span>温馨提示：产品是否购买成功，以最终下单为准哦，请尽快结算</span>
      </template>
    </order-header>
    <div class="wrapper">
      <div class="container">
        <div class="cart-box">
          <ul class="cart-item-head">
            <li class="col-1"><span class="checkbox" v-bind:class="{'checked':allChecked}" @click="toggleAll"></span>全选</li>
             <!-- <li class="col-1"><span class="checkbox" v-bind:class="{'checked':allChecked}"></span>全选</li> -->
            <li class="col-3">商品名称</li>
            <li class="col-1">单价</li>
            <li class="col-2">数量</li>
            <li class="col-1">小计</li>
            <li class="col-1">操作</li>
          </ul>
          <ul class="cart-item-list">
            <li class="cart-item" v-for="(item,index) in list" v-bind:key="index">
              <div class="item-check">
                <!-- <span class="checkbox checked"   @click="updateCart(item)"></span> -->
                  <span class="checkbox" v-bind:class="{'checked':item.productSelected}" @click="updateCart(item)"></span> <!-- 'checked':item.productSelected这个值如果是true或者false就是固定的了，不会切换选中或选不中 -->
                   <!-- <span class="checkbox" v-bind:class="{'checked':item.productSelected}"></span> -->
               </div>  <!-- checked 已勾选  productSelected默认是false,是否勾选 -->
              <div class="item-name">
                <img v-lazy="item.productMainImage" alt="">
                <span>{{item.productName + ' , ' + item.productSubtitle}}</span>
              </div>
              <div class="item-price">{{item.productPrice}}</div>
              <div class="item-num">
                <div class="num-box">
                  <a href="javascript:;" @click="updateCart(item,'-')">-</a>
                     <!-- <a href="javascript:;">-</a> -->
                   <span>{{item.quantity}}</span> <!-- quantity 数量 -->
                  <a href="javascript:;"  @click="updateCart(item,'+')">+</a>
                  <!-- <a href="javascript:;">+</a> -->
                </div>
              </div>
              <div class="item-total">{{item.productTotalPrice}}</div>
              <div class="item-del" @click="delProduct(item)"></div>
                <!-- <div class="item-del"></div> -->
            </li>
          </ul>
        </div>
        <div class="order-wrap clearfix">
          <div class="cart-tip fl">
            <a href="/#/index">继续购物</a>
            共<span>{{list.length}}</span>件商品，已选择<span>{{checkedNum}}</span>件
          </div>
          <div class="total fr">
            合计：<span>{{cartTotalPrice}}</span>元
            <a href="javascript:;" class="btn" @click="order">去结算</a>
              <!-- <a href="javascript:;" class="btn">去结算</a> -->
          </div>
        </div>
      </div>
    </div>
    <service-bar></service-bar>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import OrderHeader from './../components/OrderHeader'
  import ServiceBar from './../components/ServiceBar'
  import NavFooter from './../components/NavFooter'
  // import { Message } from 'element-ui';  

  // import Modal from './../components/Modal'
  export default{
    name:'index',
    components:{
      OrderHeader,
      ServiceBar,
      NavFooter
    },
    data(){
      return {
        list:[],//商品列表
        allChecked:false,//是否全选
        cartTotalPrice:0,//商品总金额
        checkedNum:0//选中商品数量
      }
    },
    mounted(){
      this.getCartList();
    },
    methods:{
      // 获取购物车列表
      getCartList(){
          this.axios.get('/carts').then((res)=>{
          // this.list=res.cartProductVoList||[]; //购物车列表  拿不到前面的数据就会拿到空数组，空数组是默认的   即使没有||[]，res.cartProductVoList如果是没有全选的话，接口返回也是空数组
          // this.allChecked=res.selectedAll;
          // this.cartTotalPrice=res.cartTotalPrice;
          // this.checkedNum=this.list.filter(item=>item.productSelected).length; //过滤 item.productSelected是选中的返回 filter 过滤的数组 item指的是拿到每一项
          // this.checkedNum=res.cartTotalQuantity; //cartTotalQuantity商品的总数量
          this.renderData(res);
        })
      },
      // 更新购物车数量和购物车单选状态
      updateCart(item,type){
        let quantity = item.quantity, //购物车数量
            selected = item.productSelected; //购物车单选状态
            //console.log(selected) //默认是没有选中的
        if(type == '-'){
          if(quantity == 1){ //获取当前的数量
            // alert('商品至少保留一件') //吧这句改成下一句
            // Message.info('商品至少保留一件') //或者Message.warning('商品至少保留一件')
            this.$message.warning('商品至少保留一件');
            return; //防止往下走 写了这个点击就不会显示0
          }
          --quantity; //不能写quantity=quantity--,减完的时候不会改变，下次才会改变 比如2=2--，这次是2，下次才是1
        }else if(type == '+'){
          if(quantity > item.productStock){ //productStock 库存数量
          // alert('购买数量不能超过库存数量')
          //  Message.info('购买数量不能超过库存数量')
            this.$message.warning('购买数量不能超过库存数量');
            return;
          }
          ++quantity;
        }else{
          selected = !item.productSelected; //接口是选中就改为未选中，未选中就改为选中
        }
        this.axios.put(`/carts/${item.productId}`,{
          quantity,
          selected
        }).then((res)=>{
          this.renderData(res);
        })
      },

      // 删除购物车商品
      delProduct(item){
        this.axios.delete(`/carts/${item.productId}`).then((res)=>{
        // Message.success('删除成功')
        this.$message.success('删除成功');
        this.renderData(res);
        });
      },

      // 控制全选功能
      toggleAll(){ //this.allChecked如果是true，代表全选就用没全选的接口。如果是false,代表没全选就用全选的接口
        let url = this.allChecked?'/carts/unSelectAll':'/carts/selectAll'; //this.allChecked如果全选拿到后台的是true,点击就是不勾选(不勾选的接口)，如果全选拿到后台的是false,点击就是勾选(勾选的接口)
        this.axios.put(url).then((res)=>{  //get/post/put/delete
        //  this.list=res.cartProductVoList||[]; //购物车列表
        this.renderData(res);
        })
      },

      // 公共赋值
      renderData(res){
        this.list = res.cartProductVoList || [];//商品列表
        this.allChecked = res.selectedAll;//是否全选
        this.cartTotalPrice = res.cartTotalPrice;//商品总金额
        this.checkedNum = this.list.filter(item=>item.productSelected).length;//选中商品数量
      },

      // 购物车下单
      order(){

        //如果每一项都没选中，返回true
        let isCheck = this.list.every(item=>!item.productSelected); //every返回的是布尔值,!item.productSelected这个是没有选中即false  //没有选中商品，点击去结算是没有效果的，有选中商品，点击去结算会跳转到结算页面

        if(isCheck){
          // Message.info('请选择一件商品')
          // alert('请选择一件商品')
          this.$message.warning('请选择一件商品');
        }else{
          this.$router.push('/order/confirm');
        }

      }
    }
  }
</script>
<style lang="scss" scoped>
// .service{
//      position:absolute;
//     bottom:234px;
//     width:100%;
//     }
// .footer{
//     position:absolute;
//     bottom:0;
//     width:100%;
//     }
  .cart{
    .wrapper{
      background-color:#F5F5F5;
      padding-top:30px;
      padding-bottom:114px;
      .cart-box{
        background-color:#fff;
        font-size:14px;
        color:#999999;
        text-align:center;
        .checkbox{
          display: inline-block;
          width: 22px;
          height: 22px;
          border: 1px solid #E5E5E5;
          vertical-align: middle;
          margin-right: 17px;
          cursor:pointer;
          &.checked{
            background:url('/imgs/icon-gou.png') #FF6600 no-repeat center;
            background-size:16px 12px;
            border:none;
          }
        }
        .cart-item-head{
          display:flex;
          height: 79px;
          line-height: 79px;
          .col-1{
            flex:1;
          }
          .col-2{
            flex:2;
          }
          .col-3{
            flex:3;
          }
        }
        .cart-item-list{
          .cart-item{
            display:flex;
            align-items:center;
            height:125px;
            border-top:1px solid #E5E5E5;
            font-size:16px;
            .item-check{
              flex:1;
            }
            .item-name{
              flex:3;
              font-size: 18px;
              color: #333333;
              display: flex;
              align-items: center;
              img{
                width:80px;
                height:80px;
                vertical-align:middle;
              }
              span{
                margin-left: 30px;
              }
            }
            .item-price{
              flex:1;
              color:#333333;
            }
            .item-num{
              flex:2;
              .num-box{
                display:inline-block;
                width:150px;
                height:40px;
                line-height:40px;
                border:1px solid #E5E5E5;
                font-size:14px;
                a{
                  // display:inline-block;
                  width:50px;
                  color:#333333;
                }
                span{
                  display:inline-block;
                  width:50px;
                  color:#333333;
                }
              }
            }
            .item-total{
              flex:1;
              color:#FF6600;
            }
            .item-del{
              flex:1;
              width:14px;
              height:12px;
              background:url('/imgs/icon-close.png') no-repeat center;
              background-size:contain;
              cursor:pointer;
            }
          }
        }
      }
      .order-wrap{
        font-size:14px;
        color: #666666;
        margin-top: 20px;
        height: 50px;
        line-height: 50px;
        .cart-tip{
          margin-left: 29px;
          a{
            color: #666666;
            margin-right:37px;
          }
          span{
            color:#FF6600;
            margin:0 5px;
          }
        }
        .total{
          font-size:14px;
          color:#FF6600;
          span{
            font-size:24px;
          }
          a{
            width:202px;
            height:50px;
            line-height:50px;
            font-size:18px;
            margin-left:37px;
                background: #FF6600;
    color: #FFF;
    width: 160px;
    display: inline-block;
    text-align: center;
          }
        }
      }
    }
  }
</style>