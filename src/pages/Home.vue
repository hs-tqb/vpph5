<template>
  <div>
    <header><div class='menu' @click='showMenu' ></div><span>VPP</span></header>
    <menu-box v-if='menuShow' @closeMenu='closeMenu'  :crtInd = "index"></menu-box>
    <div class="banner">
      <mt-swipe :auto="3000" :speed="300">
        <mt-swipe-item v-for="(item,index) in bannerList" :key="index"><a :href="item.linkUrl"><img :src="item.imgUrl" alt=""></a></mt-swipe-item>
      </mt-swipe>
    </div>
    <div class="notice">
      <div class="notice-text"><router-link :to="{path:'/noticeDetail',query:{id:notice.id}}">{{notice.noticeTitle}}</router-link></div>
      <div class="notice-more" @click="toNotice">更多</div>
    </div>
    <div class="btn-group">
      <div class="toBj" @click="toTransaction">
        <img src="../assets/home-toBj.png" alt="" class="toBj-img">
        <div class="toBj-text">快去交易币价期权</div>
      </div>
    </div>
    <div class="order-list">
      <div class="list-title">
        我的订单
        <div class="toBill" @click="toBill"></div>
      </div>
      <ul class="list-item" v-if="orderList.length != 0">
        <li v-for="(item,index) in orderList" :key="index" @click="orderDetail(item)">
          <div class="item-title item-title-rise" v-if="item.content === '看涨'"><span class="title-text-r"> {{item.title}}</span>
            <span class="title_right">-{{item.amount.split('-')[0].slice(0, -9)}}VPP</span>
          </div>
          <div class="item-title item-title-fall" v-else><span class="title-text-f">{{item.title}}</span>
            <span class="title_right">-{{item.amount.split('-')[0].slice(0, -9)}}VPP</span>
          </div>
          <div v-if="item.status === '0'">
            <div class="item-expect">{{(item.amount.split('-')[0]*1.8).toFixed(2)}}<span>VPP</span></div>
            <div class="item-time">{{item.gmtCreate}}</div>
            <div class="item-status performing" >{{item.statusString}}</div>
          </div>
          <div v-else-if="item.status === '3'">
            <div class="item-result">{{(item.amount.split('-')[0]*1).toFixed(2)}}<span>VPP</span></div>
            <div class="item-time">{{item.gmtCreate}}</div>
            <div class="item-status noPerform" >{{item.statusString}}</div>
          </div>
          <div v-else>
            <div class="item-result">{{item.amount.split('-')[1]}}<span>VPP</span></div>
            <div class="item-time">{{item.gmtCreate}}</div>
            <div class="item-status performed" v-if="item.status === '1'" style="color: #B6B6C9;border: 1px solid #B6B6C9;">{{item.statusString}}</div>
            <div class="item-status performed" v-else>{{item.statusString}}</div>
          </div>
        </li>
      </ul>
      <div v-if="orderList.length===0">
        <div class="no-order">
        </div>
        <p class="no-text">暂无订单奥~</p>
        <div class="btn-box">
          <button class="no-btn" @click="toTransaction">我要去下单</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import menuBox from '@/components/Menu'
  import { MessageBox } from 'mint-ui';

  export default {
    data() {
      return {
        menuShow: false,
        index: 1,
        bannerPageSize: 4,
        bannerList: [],
        orderCurrentPage: 1,
        orderPageSize: 2,
        orderList: [],
        notice: {}
      }
    },
    components: {
      menuBox
    },
    methods: {
      toNotice() {
        this.$router.push('/notice')
      },
      toTransaction() {
        this.$router.push('/transaction')
      },
      showMenu(){
        this.menuShow = !this.menuShow
      },
      closeMenu(){
        this.menuShow = !this.menuShow
      },
      toBill() {
        this.$router.push('/bill')
      },
       orderDetail(item) {
        this.$router.push({path: '/orderDetail',query: { id:item.innerOrderId }})
      }
    },
    created() {
      this.$axios.post('limit',{}).then(res => {
        this.notice = res.data.data.rows[0]
      })
      this.$axios.post('getBannerList',{pageSize: this.bannerPageSize}).then(res => {
        this.bannerList = res.data.data.rows
      })
      this.$axios.post('getOrderList',{currentPage: this.orderCurrentPage, pageSize: this.orderPageSize}).then(res => {
        this.orderList = res.data.data.rows
      })
    },
   
  }
</script>

<style scoped>
header {
  position: relative;
  height: .89rem;
  line-height: .89rem;
  width: 100%;
  font-family: PingFangSC-Medium;
  font-size: .32rem;
  font-weight: 700;
  color: #000A2E;
  letter-spacing: 0.89px;
  text-align: center;
}
header .menu{
  position:absolute;
  /* left:.3rem; */
  margin-left: .3rem;
  top:50%;
  transform: translateY(-50%);
  width: .45rem;
  height: .38rem;
  background:url(../assets/menuIcon-black.png) no-repeat center;
  background-size: cover;
}
.banner {
  width: 100%;
  height: 4rem;
  background: #abcdef;
}
.notice {
  position: relative;
  height: .88rem;
  border-bottom: 2px solid rgba(238, 238, 238, .5)
}
.notice-text {
  position: absolute;
  left: .3rem;
  height: .88rem;
  line-height: .88rem;
  width: calc(100% - 1.5rem);
  padding-left: .35rem;
  background: url(../assets/inoticeIcon.png) no-repeat left center;
  background-size: .24rem auto;
}
.notice-text a {
  font-size: .24rem;
  color: #9DA1A9;
  letter-spacing: 0.65px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.notice-more {
  position: absolute;
  right: .45rem;
  width: .65rem;
  height: .88rem;
  line-height: .88rem;
  font-size: .22rem;
  color: #3F4D68;
  letter-spacing: 0.6px;
  text-align: left;
  background: url('../assets/home-arrow1.png') no-repeat right;
  background-size: .10rem .17rem;

}
.toBj {
  position: relative;
  width: auto;
  height: 2rem;
  box-shadow: 0 0 .25rem 0 rgba(17,17,17,0.07);
  border-radius: .04rem;
  margin: .54rem .3rem .4rem .3rem;
}
.toBj-img {
  position: absolute;
  left: .44rem;
  bottom: .14rem;
  width: 2.45rem;
  height: 2.2rem;
}
.toBj-text {
  position: absolute;
  padding-left: .61rem;
  right: .4rem;
  bottom: .8rem;
  height: .45rem;
  font-size: .28rem;
  text-align: right;
  color: #3F4D68;
  letter-spacing: 0.78px;
  background: url('../assets/home-guess.png') no-repeat;
  background-size: .46rem .46rem;
}
.order-list .list-title {
  position: relative;
  height: .48rem;
  width: auto;
  margin-left: .3rem;
  margin-right: .3rem;
  text-indent: .3rem;
  font-size: .34rem;
  color: #000A2E;
  letter-spacing: 0;
  background: url('../assets/home-arrow2.png') no-repeat right;
  background-size: .15rem .25rem;
}
.list-title::before {
  position: absolute;
  top: .09rem;
  left: 0rem;
  content: '';
  display: inline-block;
  width: .1rem;
  height: .3rem;
  background: #1BA5FD;
}
.list-title .toBill {
  height: 100%;
  width: .25rem;
  float: right;
}
/* 列表 */
.order-list .list-item {
  width: 100%;
  box-sizing: border-box;
  padding:.4rem .3rem .85rem .3rem;
}
.order-list .list-item li {
  position: relative;
  box-sizing: border-box;
  padding: .3rem .2rem .2rem .3rem;
  height: 3.28rem;
  background: #FFFFFF;
  box-shadow: 0 4px 28px 0 rgba(17,17,17,0.09);
  border-radius: 4px;
  margin-bottom: .3rem;
}
/* 列表项 */
.item-title-rise {
  font-size: .34rem;
  color: #3F4D68;
  letter-spacing: 0;
  height: .48rem;
  line-height: .48rem;
}
.item-title-fall {
  font-size: .34rem;
  color: #3F4D68;
  letter-spacing: 0;
  height: .48rem;
  line-height: .48rem;
}
.title-text-f {
  font-weight: 600;
  display: inline-block;
  padding-right: .54rem;
  background: url(../assets/fall.png) no-repeat;
  background-size: .4rem .4rem;
  background-position: right;
}
.title-text-r{
  font-weight: 600;
  display: inline-block;
  padding-right: .54rem;
  background: url(../assets/rise.png) no-repeat;
  background-size: .4rem .4rem;
  background-position: right;
}
.item-title .title_right {
  float: right;
  opacity: 0.8;
  font-size: .26rem;
  color: #3F4D68;
  letter-spacing: 0.74px;
}
.item-title img {
  width: .4rem;
  height: .4rem;
  margin-top: .04rem;
  display: inline-block;
}
.item-expect {
  font-weight: 600;
  position: relative;
  margin-top: .6rem;
  font-size: .60rem;
  color: #3F4D68;
  letter-spacing: 1.09px;
}
.item-expect span {
  margin-left: .25rem;
  font-size: .28rem;
  color: #00002C;
  letter-spacing: 1.09px;
  line-height: .84rem;
}
.item-expect::before {
  font-weight: 100;
  position: absolute;
  top: -.3rem;
  content: '预期收益';
  font-size: .22rem;
  color: #B6B6C9;
  letter-spacing: 0.4px;
}
.item-result{
  font-weight: 600;
  position: relative;
  margin-top: .6rem;
  font-size: .60rem;
  color: #3F4D68;
  letter-spacing: 1.09px;
}
.item-result span {
  margin-left: .25rem;
  font-size: .28rem;
  color: #00002C;
  letter-spacing: 1.09px;
  line-height: .84rem;
}
.item-result::before {
  font-weight: 100;
  position: absolute;
  top: -.3rem;
  content: '实际收益';
  font-size: .22rem;
  color: #B6B6C9;
  letter-spacing: 0.4px;
}
.item-time {
  position: absolute;
  bottom: .21rem;
  font-size: .22rem;
  color: #B6B6C9;
  letter-spacing: 0;
}
.item-status {
  position: absolute;
  right: .25rem;
  bottom: .25rem;
  padding: 0 .2rem;
  /* width: 1.8rem; */
  height: .5rem;
  /* border: 1px solid #06D4B6; */
  border-radius: 1rem; 
  line-height: .5rem;
  text-align: center;
  /* color: #06D4B6; */
  font-size: .24rem;
}

.item-status.performing {
  border: 1px solid #1BA5FD ;
  color: #1BA5FD ;
}
.item-status.performed {
  border: 1px solid #06D4B6;
  color: #06D4B6;
}
.item-status.noPerform {
  border: 1px solid #FE3762;
  color: #FE3762;
}

.no-order {
  width: 100%;
  height: 1.03rem;
  margin-top: .5rem;
  margin-bottom: .1rem;
  background: url('../assets/no-order.png') no-repeat;
  background-size: 1.6rem 1.0rem;
  background-position: center center;
}
.no-text {
  font-size: .24rem;
  color: rgba(157,161,169,.8);
  letter-spacing: 2.31px;
  text-align: center;
}
.btn-box {
  position: relative;
  width: 100%;
  height: .65rem;
  margin-top: .4rem;
  margin-bottom: .7rem;
}
.no-btn {
  display: block;
  margin: 0 auto;
  width: 2.4rem;
  height:.65rem;
  text-align: center;
  font-size: .26rem;
  color: #FFFFFF;
  letter-spacing: 1.27px;
  text-align: center;
  background: #1BA5FD;
  border-radius: 4px;
}
.order-list{
  overflow: hidden;
}
</style>
