<template>
  <div class="container">
    <header :style="{background: bgColor}">
      <div class="back" @click="back" ></div>
      <div >
      合约详情
      </div>
      <div class="help-btn" @click="showHelp"></div>
    </header>
    <div class="expect" :style="{background: bgColor}">
      <p v-if="data.status === 0">预期收益</p>
      <p v-else>实际收益</p>
      <p class="expect-amount" v-if="data.status === 1">0</p>
      <p class="expect-amount" v-else-if="data.status === 2">{{data.profit.toFixed(2)}}</p>
      <p class="expect-amount" v-else-if="data.status === 0">{{data.profit.toFixed(2)}}</p>
      <p class="expect-amount" v-else>{{data.orderAmt.toFixed(2)}}</p>
    </div>
    <div class="price" :style="{background: bgColor}">
      <div class="order-price">
        <p>下单币价</p>
        <p class="priceVal">{{data.orderPrice}}</p>
      </div>
      <div class="lottery-price">
        <p>结束币价</p>
        <p class="priceVal">{{data.actualPrice}}</p>
      </div>
    </div>
    <div class="detail-list">
      <ul>
        <li>货币对<span>{{data.targetId}}</span></li>
        <li>订单号<span>{{data.orderId}}</span></li>
        <li>下单金额<span>{{data.orderAmt}}</span></li>
        <li>下单时间<span v-if="data.gmtCreate">{{data.gmtCreate.slice(0,19)}}</span></li>
      </ul>
    </div>
    <div class="order-type">
      <ul>
        <li>合约类型<span class="icon-rise" v-if="data.orderDir === 0"></span><span class="icon-fall" v-else></span></li>
        <li>合约状态<span v-if="data.status === 0" style="color: #1BA5FD;">等待判定</span><span v-else-if="data.status === 1" style="color: #B6B6C9;">已判定,无需履行</span><span v-else-if="data.status === 2" style="color: #06D4B6;">已判定,已履行</span><span v-else style="color:  #FE3762;">已退款</span></li>
      </ul>
    </div>
    <div class="ok-list" v-if="data.status != 0">
      <ul>
        <li>合约开始<span>{{data.orderTs}}</span></li>
        <li>合约判定<span>{{data.lotteryTime}}</span></li>
      </ul>
    </div>
    <div class="help" v-if="helpShow">
      <div class="help-box">
        <div class="help-header">说明<span class="close-btn" @click="closeHelp"></span></div>
        <div class="help-content">
          <h3>{{helpMesArr[0]}}</h3>
          <p v-for="(item, index) in helpMesArr.slice(1)" :key="index">{{item}}</p> 
        </div>
        <div class="help-confirm">
          <button @click="closeHelp">确定</button>  
        </div>  
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: {status: 1},
        helpShow: false,
        helpMes: '',
        bgColor: '',
        helpMes: ''
      }
    },
    computed: {
      helpMesArr() {
        return this.helpMes.split('\r\n')
      }
    },
    methods: {
      back() {
        this.$router.go(-1)
      },
      showHelp() {
        this.helpShow = true 
      },
      closeHelp() {
        this.helpShow = false
      },
      // stop() {
      //   var mo=function(e){e.preventDefault();}
      //   document.body.style.overflow='hidden'
      //   document.addEventListener("touchmove",mo,false)
      // },
      // move(){
      //   var mo=function(e){e.preventDefault();}
      //   document.body.style.overflow=''
      //   document.removeEventListener("touchmove",mo,false)
      // }
    },
    created() {
      this.$axios.post('getDetail',{orderId: this.$route.query.id}).then(res => {
        this.data = res.data.data
        if(this.data.status === 0) {
          this.bgColor = '#1BA5FD'
        }else {
          this.bgColor = '#FF5332'
        }
      })
      this.$axios.post('getList',{}).then(res => {
        this.helpMes = res.data.data.help
      })
    }
  }
</script>

<style scoped>
.container {
  background: rgba(238,238,238,.5)
}
header {
  position: relative;
  height: .89rem;
  line-height: .89rem;
  width: 100%;
  font-family: PingFangSC-Medium;
  font-size: .32rem;
  color: #FFFFFF;
  letter-spacing: 0.89px;
  text-align: center;
  background: rgba(27,165,253,1);
}
header .back{
  position: absolute;
  top: .3rem;
  left: .28rem;
  display: inline-block;
  width: .29rem;
  height: .29rem;
  background: url(../assets/backIcon-white.png) no-repeat;
  background-size: contain;
}

header .help-btn{
  position: absolute;
  width: .35rem;
  height: .35rem;
  top: .27rem;
  right: .3rem;
  background: url('../assets/help-white.png') no-repeat;
  background-size: cover;
}
.expect {
  box-sizing: border-box;
  height: 2rem;
  padding-top: .3rem;
  width: 100%;
  text-align: center;
  background: rgba(27,165,253,1);
}
.expect p {
  text-align: center;
  font-size: .26rem;
  color: rgba(255,255,255,.7);
  letter-spacing: 1px;
  margin-bottom: .27rem;
}
.expect .expect-amount{
  font-family: Arial-BoldMT;
  display: inline-block;
  font-size: .60rem;
  color: #FFFFFF;
  letter-spacing: 2.31px;
  background: url('../assets/appMoneyIcon.png') no-repeat;
  background-size:  .4rem .4rem;
  background-position: 0 center;
  padding-left: 0.5rem;
}
.price {
  display: flex;
  background: rgba(27,165,253,1); 
}
.price div {
  position: relative;
  flex: 1;
  height: 1.34rem;
  background: rgba(255,255,255,.07);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.price p {
  font-size: .24rem;
  color: rgba(255,255,255,.7);
  letter-spacing: 0.92px;
  text-align: center;
}
.price .priceVal {
  font-size: .30rem;
  color: #FFFFFF;
  letter-spacing: 1.15px;
  text-align: center;
}
.lottery-price::before {
  content: '';
  position: absolute;
  height: .65rem;
  width: 0;
  border:1px solid rgba(255,255,255,.45);
}
.detail-list {
  background: #FFFFFF;
  margin-bottom: .2rem;
}
.detail-list ul {
  height: 4rem;
}
.detail-list ul li {
  height: 1rem;
  line-height: 1rem;
  font-size: .28rem;
  color: #626262;
  letter-spacing: 0.78px;
  margin-left: .3rem;
  padding-right: .3rem;
  border-top: 1px solid rgba(238,238,238,.5);
}
.detail-list ul li span{
  float: right;
}
.order-type {
  background: #fff;
  margin-bottom: .2rem;
}
.order-type ul{
  height: 2rem;
}
.order-type ul li {
  height: 1rem;
  line-height: 1rem;
  font-size: .28rem;
  color: #626262;
  letter-spacing: 0.78px;
  margin-left: .3rem;
  padding-right: .3rem;
  border-top: 1px solid rgba(238,238,238,.5);
}
.order-type ul li span{
  float: right;
  height: 1rem;
}
.ok-list {
  background: #fff;
  margin-bottom: .2rem;
}
.ok-list ul{
  height: 2rem;
}
.ok-list ul li {
  height: 1rem;
  line-height: 1rem;
  font-size: .28rem;
  color: #626262;
  letter-spacing: 0.78px;
  margin-left: .3rem;
  padding-right: .3rem;
  border-top: 1px solid rgba(238,238,238,.5);
}
.ok-list ul li span{
  float: right;
  height: 1rem;
}
.help {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.5)
}
.help-box {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 6.6rem;
  height: 8.2rem;
  margin: auto;
  background-color: #FFFFFF;
  background:url('../assets/white.png') 1px 1px repeat;
  border-radius: .14rem;
  border: 1px solid #BDC6CF;
}
.help-header {
  position: relative;
  margin-top: .4rem;
  height: .4rem;
  width: 100%;
  line-height: .4rem;
  font-size: .32rem;
  color: #000A2E;
  letter-spacing: 0;
  text-align: center;
}
.help-content {
  box-sizing: border-box;
  white-space: pre-line;
  padding: .3rem .37rem;
  height: 6.4rem;
  font-size: .28rem;
  color: #00002C;
  letter-spacing: 0.5px;
  line-height: .46rem;
  border-bottom: 1px solid #eee;
  overflow-y: auto;
}
.help-content p{
  text-align: left;
}
.help-content h3 {
  font-weight: 700;
}
.help-confirm {
  position: relative;
  width: 100%;
  height: 1rem;
}
.help-confirm button{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  font-size: .30rem;
  color: #1BA5FD;
  letter-spacing: .1rem;
  text-align: center;
  line-height: .36rem;
}

.close-btn {
  position: absolute;
  right: .3rem;
  width: .42rem;
  height: .42rem;
  background: url('../assets/close.png') no-repeat;
  background-size: .3rem .3rem;
  background-position: center center;
}
.container {
  position: relative;
  height: 100%;
}
.icon-rise {
  display: inline-block;
  width: .4rem;
  height: .4rem;
  background: url('../assets/rise.png') no-repeat;
  background-size: .4rem .4rem;
  background-position: center center;
}
.icon-fall {
  display: inline-block;
  width: .4rem;
  height: .4rem;
  background: url('../assets/fall.png') no-repeat;
  background-size: .4rem .4rem;
  background-position: center center;
}
</style>
