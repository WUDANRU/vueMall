<template>
  <div class="order-list">
    <order-header title="订单列表">
      <template v-slot:tip>
        <span>请谨防钓鱼链接或诈骗电话，了解更多></span>
      </template>
    </order-header>
    <div class="wrapper">
      <div class="container">
        <div class="order-box">
          <loading v-if="loading"></loading>
          <div class="order" v-for="(order,index) in list" :key="index">
            <div class="order-title">
              <div class="item-info fl">
                {{order.createTime}}
                <span>|</span>
                {{order.receiverName}}
                <span>|</span>
                订单号：{{order.orderNo}}
                <span>|</span>
                {{order.paymentTypeDesc}}
              </div>
              <div class="item-money fr">
                <span>应付金额：</span>
                <span class="money">{{order.payment}}</span>
                <span>元</span>
              </div>
            </div>
            <div class="order-content clearfix">
              <div class="good-box fl">
                <div class="good-list" v-for="(item,i) in order.orderItemVoList" :key="i">
                  <div class="good-img">
                    <img v-lazy="item.productImage" alt />
                  </div>
                  <div class="good-name">
                    <div class="p-name">{{item.productName}}</div>
                    <div class="p-money">{{item.totalPrice + 'X' + item.quantity}}元</div>
                  </div>
                </div>
              </div>
              <div class="good-state fr" v-if="order.status == 20">
                <!-- 订单状态:0-已取消-10-未付款，20-已付款，40-已发货，50-交易成功，60-交易关闭 -->
                <a href="javascript:;">{{order.statusDesc}}</a>
              </div>
              <div class="good-state fr" v-else>
                <a href="javascript:;" @click="goPay(order.orderNo)">{{order.statusDesc}}</a>
              </div>
            </div>
          </div>
          <!-- <el-pagination
            v-if="false"
            class="pagination"
            background
            layout="prev, pager, next"
            :pageSize="pageSize"
            :total="total"
            @current-change="handleChange"
          >-->
          <!-- current-page	当前页数，默认值1，改变时会触发 -->
          <!-- </el-pagination> -->
          <!--  :pageSize不能写成page-size "pageSize"可以是这样的变量，也可以是数字10，不能是字符串10 -->

          <div class="load-more" v-if="showNextPage">
            <el-button type="primary" :loading="loading" @click="loadMore">加载更多</el-button>
          </div>
          <!-- <div class="scroll-more"
            v-infinite-scroll="scrollMore"
            infinite-scroll-disabled="true"
            infinite-scroll-distance="410"
            v-if="true" 
          >-->
          <!-- infinite-scroll-distance="410"距离底部多少触发这个方法 -->
          <!-- <img src="/imgs/loading-svg/loading-spinning-bubbles.svg" alt="" v-show="loading"> -->
          <!-- </div> -->

          <no-data v-if="!loading && list.length==0"></no-data>

          <!-- </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import OrderHeader from "./../components/OrderHeader";
import Loading from "./../components/Loading";
import NoData from "./../components/NoData";
// import { Pagination, Button } from "element-ui";
// import infiniteScroll from 'vue-infinite-scroll'
export default {
  name: "order-list", //http://localhost:8080/#/order/list
  components: {
    OrderHeader,
    Loading,
    NoData,
    // [Pagination.name]: Pagination, //[Pagination.name]指的是这个标签 <el-pagination></el-pagination>
    // [Button.name]: Button
  },
  // directives: {
  //   infiniteScroll //指令
  // },
  data() {
    return {
      loading: false,
      list: [],
      pageSize: 10, //一页10条数据   pageSize:1
      pageNum: 1, //当前第几页
      total: 0,
      showNextPage: true, //加载更多：是否显示按钮
      busy: false //滚动加载，是否触发  false表示滚动有效，true表示禁止滚动
    };
  },
  mounted() {
    this.getOrderList();
  },
  methods: {
    getOrderList() {
      this.loading = true;
      // this.busy = true; //(初始化会显示加载xhr的接口数据=1) 不写这个的话默认会加载第二条数据 xhr显示接口数据=2
      this.axios.get("/orders", {
          params: {
            pageSize: 10,
            pageNum: this.pageNum
          }
        })
        .then(res => {
          this.loading = false;
          this.list = this.list.concat(res.list); //this.list=res.list这个就是没有往下拼接 //this.list=[]||res.list;拿不到数据就是空的
          this.total = res.total;
          this.showNextPage = res.hasNextPage; //有下一页就吧加载按钮隐藏，这句代码也可以写成另一种if的代码
          // xhr的接口数据同时加载了=1和=2，改为先加载=1，当滚动了再加载=2
          // this.busy = false; //(初始化会显示加载xhr的接口数据=1) 不写这个的话默认会加载第二条数据 xhr显示接口数据=2
        })
        .catch(() => {
          this.loading = false;
        });
    },
    goPay(orderNo) {
      // 三种路由跳转方式
      // this.$router.push('/order/pay')
      /* this.$router.push({
          name:'order-pay',
          params:{
            orderNo
          }
        }) */
      this.$router.push({
        path: "/order/pay",
        query: {
          orderNo
        }
      });
    },
    // 第一种方法：分页器
    // handleChange(pageNum){
    //   // console.log(pageNum) //当点击页码时才会显示
    //   this.pageNum = pageNum;
    //   this.getOrderList();}
    // 第二种方法：加载更多按钮
    loadMore() {
      this.pageNum++; //一开始默认就调用this.getOrderList()，一开始就是第一页，到这里才是第二页，(concat是第二页拼接在第一页后面)
      this.getOrderList();
    }
  

  // 第三种方法：滚动加载，通过npm插件实现
  // scrollMore(){
  //   this.busy = true;
  //   setTimeout(()=>{
  //     console.log(this.pageNum)
  //     this.pageNum++;
  //     console.log(this.pageNum)
  //     this.getList();
  //     console.log(this.pageNum)
  //   },500);
  // },
  // // 专门给scrollMore使用
  // getList(){ //这个是跟getOrderList()类似的，只是用同一个多了太笨重
  //   this.loading = true;
  //   this.axios.get('/orders',{
  //     params:{
  //       pageSize:10,
  //       pageNum:this.pageNum
  //     }
  //   }).then((res)=>{
  //     this.list = this.list.concat(res.list);
  //     this.loading = false;
  //     if(res.hasNextPage){ //如果有下一页就继续滚动加载，否则就不滚动了
  //       this.busy=false;
  //     }else{
  //       this.busy=true;
  //     }
  //   });
  // },
  }
};
</script>
<style lang="scss">
@import "./../assets/scss/config.scss";
@import "./../assets/scss/mixin.scss";
.order-list {
  .wrapper {
    background-color: $colorJ;
    padding-top: 33px;
    padding-bottom: 110px;
    .order-box {
      .order {
        @include border();
        background-color: $colorG;
        margin-bottom: 31px;
        &:last-child {
          margin-bottom: 0;
        }
        .order-title {
          @include height(74px);
          background-color: $colorK;
          padding: 0 43px;
          font-size: 16px;
          color: $colorC;
          .item-info {
            span {
              margin: 0 9px;
            }
          }
          .money {
            font-size: 26px;
            color: $colorB;
          }
        }
        .order-content {
          padding: 0 43px;
          .good-box {
            width: 88%;
            .good-list {
              display: flex;
              align-items: center;
              height: 145px;
              .good-img {
                width: 112px;
                img {
                  width: 100%;
                }
              }
              .good-name {
                font-size: 20px;
                color: $colorB;
              }
            }
          }
          .good-state {
            @include height(145px);
            font-size: 20px;
            color: $colorA;
            a {
              color: $colorA;
            }
          }
        }
      }
      .pagination {
        text-align: right;
      }
      .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #ff6600;
      }
      .el-button--primary {
        background-color: #ff6600;
        border-color: #ff6600;
      }
      .load-more,
      .scroll-more {
        text-align: center;
      }
    }
  }
}
</style>