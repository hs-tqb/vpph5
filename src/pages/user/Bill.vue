<template>
  <div class="container">
    <header><span class="back" @click="back"></span>我的订单</header>
    <div class="no-box" v-if="orderList.length === 0">
      <div class="no-order"></div>
      <p class="no-text">暂无订单</p>
    </div> 
      <!-- <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" :autoFill="false"> -->
      <div ref="wrapper" class="list-container" >
        <div>
          <!-- 顶部提示信息
            <div class="top-tip">
              <span class="refresh-hook">下拉刷新</span>
            </div> -->
            <!-- 列表 -->
          <ul class="list-item list-content list-content-hook ">
            <li v-for="(item,index) in orderList" :key="index" @tap="orderDetail(item)" >
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
          
          <!-- 底部提示信息 -->
           <!-- <div class="bottom-tip" ref="bottomTip">
            <span class="loading-hook">上拉查看更多</span>
          </div> -->
        </div>
      </div>
      
      <!-- </mt-loadmore> -->
  </div>
</template>

<script>
import Bscroll from 'better-scroll'

  export default {
    data() {
      return {
        total: 0,
        currentPage: 1,
        pageSize: 15,
        orderList: [],
        scrollY: '',
        //mint 刷新
        allLoaded: false

      }
    },
    methods: {
      back() {
        this.$router.go(-1)
      },
      loadBottom() {
        conosle.log('load')
        this.currentPage = this.currentPage + 1
        this.$axios.post('/app/coinguess/order/getOrderList',{
          currentPage: this.currentPage,
        }).then(res => {
          this.orderList = this.orderList.concat(res.data.data.rows)
          if(this.orderList.length >= this.total) {
            this.allLoaded = true
          }
          this.$refs.loadmore.onBottomLoaded();
        })
      },
      orderDetail(item) {
        this.$router.push({path: '/orderDetail',query: { id:item.innerOrderId }})
      }
    },
    created() {
      let that = this
      this.$axios.post('getOrderList',{}).then(res => {
        this.total = parseInt(res.data.data.total)
        this.orderList = res.data.data.rows
        this.$nextTick(() => {
          this.scroll = new Bscroll(this.$refs.wrapper, {
            probeType : 2,
            mouseWheel: true,
            pullUpLoad: true,
            tap: true,
            pullUpload: {
              threshold: -30
            }
          })
          this.scroll.on('pullingUp', () => {
              if(that.total <= that.orderList.length){

                that.scroll.finishPullUp()
                that.scroll.refresh()
              }else{
                that.currentPage = that.currentPage + 1
                that.$axios.post('getOrderList',{
                  currentPage: that.currentPage,
                }).then(res => {
                  that.orderList = that.orderList.concat(res.data.data.rows)
                  that.scroll.finishPullUp()
                  that.scroll.refresh()
                })
              }

          })
        })
      })
    }
  }
</script>

<style scoped>
.container {
  height: 100%;
}
header {
  position: relative;
  height: .89rem;
  line-height: .89rem;
  font-weight: 700;
  border-bottom: 2px solid rgba(238,238,238,.5);
  font-size: .32rem;
  color: #000A2E;
  letter-spacing: 0.89px;
  text-align: center;
  }
header span {
  position: absolute;
  top: .3rem;
  left: .28rem;
  display: inline-block;
  width: .29rem;
  height: .29rem;
  background: url(../../assets/backIcon.png) no-repeat;
  background-size: contain;
}
.list-container{
    background: #fff;
    height:calc(100% - 0.89rem);
    overflow-y: auto
  }
  /* 列表项 */
.list-item {
  box-sizing: border-box;
  width: 100%;
  padding:.3rem .3rem .85rem .3rem;
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
  background: url(../../assets/fall.png) no-repeat;
  background-size: .4rem .4rem;
  background-position: right;
}
.title-text-r{
  font-weight: 600;
  display: inline-block;
  padding-right: .54rem;
  background: url(../../assets/rise.png) no-repeat;
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
  margin-top: 3.6rem;
}
.no-order {
  width: 100%;
  height: 1.03rem;
  margin-top: .5rem;
  margin-bottom: .1rem;
  background: url('../../assets/no-order.png') no-repeat;
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
