<template>
  <div class="container">
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
      <div class="no-box" v-if="orderList.length === 0">
        <div class="no-order"></div>
        <p class="no-text">暂无订单</p>
      </div> 
  </div>
</template>

<script>
  export default {
    data() {
      return {
        orderCurrentPage: 1,
        orderPageSize: 10,
        orderList: []
      }
    },
    methods: {
      orderDetail(item) {
        this.$router.push({path: '/orderDetail',query: { id:item.innerOrderId }})
      }
    },
    created() {
      this.$axios.post('getOrderList',{currentPage: this.orderCurrentPage, pageSize: this.orderPageSize}).then(res => {
        this.orderList = res.data.data.rows
      })
    },
  }
</script>

<style scoped>

 .list-item {
  background: rgba(238,241,244,.5);
  background-position: 0 -3.68rem;
  width: 100%;
  box-sizing: border-box;
  padding:0 .3rem .85rem .3rem;

}
 .list-item li {
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

.no-box {
  margin-bottom: 1.45rem;
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
</style>
