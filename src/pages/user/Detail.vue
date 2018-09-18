<template>
  <div class='h100'>
    <div class="dHeader">
      <header class="pubHead">
        <button @click="back" class="PubHeadBack"></button>
        账户明细
      </header>
      <div class="btnTab">
        <button :class='{crt:ind===1}' @click="switchAll">全部明细</button>
        <button :class='{crt:ind===2}' @click="switchDeposit">充值</button>
        <button :class='{crt:ind===3}' @click="switchWithdrawal">提现</button>
      </div>
    </div>
    <div class="list all" v-show="isShow === 'all'" ref="wrapper">
      <ul>
        <li v-for='(item,index) in myall' :key='index'>
          <div class='currency'>
            <span>{{item.title}}</span>
            <em class='push' v-if='item.amount>0?true:false'>
              +{{decimal(item.amount,1)}}<i>vpp</i>
              <!-- <i class='eth'>余额:{{decimal(item.balance,100)}}</i> -->
            </em>
            <em class='push' v-else>
              {{decimal(item.amount,1)}}<i>vpp</i>
            </em>
          </div>
          <div class='time'>
            {{item.gmtCreate}}
            <span>余额:{{decimal(item.balance,1)}}</span>
          </div>
        </li>
      </ul>
      <p v-if='alltrue'>暂无相关数据~</p>
    </div>
    <div class="list" v-show="isShow === 'deposit'" ref="wrapper2">
      <ul>
        <li v-for="(item,index) in myDeposit" :key="index" >
          <div class='currency'>
            <span>{{item.tokenName}}充币</span>
            <em>+{{item.vpp}}<i>vpp</i><i class='eth'>({{decimal(item.amount,10000)}}{{item.tokenName}})</i></em>
          </div>
          <div class='add'><span>充值地址:</span><span>{{item.cashNo}}</span></div>
          <div class='rate'><span>充值汇率：</span>{{item.vppRate}}</div>
          <div class='time'>{{item.gmtCreate}}</div>
          <div class='state undetermined' v-if="item.state === 1">待处理</div>
          <div class='state success' v-else-if="item.state === 2">处理成功</div>
          <div class='state repulse' v-else-if="item.state === 3">打回</div>
          <div class='state success' v-else>处理成功</div>
        </li>
      </ul>
      <p v-if='deptrue'>暂无相关数据~</p>
    </div>
    <div class="list" v-show="isShow === 'withdrawal'" ref="wrapper3">
      <ul>
        <li v-for="(item, index) in myWithdrawal" :key="index">
          <div class='currency' style="padding-bottom:0;">
            <span>VPP提币</span>
            <em>-{{item.vpp}}<i>vpp</i></em>
          </div>
          <div class='add'><span>提现地址:</span><span>{{item.payeeAddress}}</span></div>
          <div class='rate'><span>提现手续费: </span><span>{{item.gas}}</span></div>
          <div class='time'>{{item.gmtCreate}}</div>
          <div class='state undetermined' v-if="item.state === 1">待处理</div>
          <div class='state repulse' v-else-if="item.state === 2">已执行打款</div>
          <div class='state success' v-else-if="item.state === 3">处理成功</div>
          <div class='state fail' v-else-if="item.state === 4">拒绝</div>
          <div class='state fail' v-else>处理失败</div>

        </li>
      </ul>
      <p v-if='withtrue'>暂无相关数据~</p>
    </div>
  </div>
</template>

<script>
  import Bscroll from 'better-scroll'
  export default {
    data() {
      return {
      customerId:'',
      depositTotal: 0,
      withdrawalTotal: 0,
      allTotal:0,
      pageSize: 15,
      depositCurrentPage: 1,
      withdrawalCurrentPage: 1,
      myllCurrentPage: 1,
      myall:[],
      myDeposit: [],
      myWithdrawal: [],
      isShow: 'all',
      ind:1,
      alltrue:false,
      deptrue:false,
      withtrue:false
      }
    },
    methods: {
      decimal(numojb,number) {
        let num = new Number(numojb)
        return Math.floor(numojb*number)/number
      },
      switchAll(){
        this.isShow = 'all'
        this.ind = 1
      },
      switchDeposit() {
        this.isShow = 'deposit'
        this.ind = 2
      },
      switchWithdrawal() {
        this.isShow = 'withdrawal'
        this.ind = 3
      },
      back() {
        this.$router.go(-1)
      },
      showAddress(val) {
        return val.slice(0, 2) + '***' + val.slice(-4)
      },
    },
    created() {
      let that = this
      this.customerId  = sessionStorage.getItem('id')
      this.$axios.post('findLimit',{customerId:this.customerId}).then(res=>{
        
        this.allTotal = parseInt(res.data.data.total)
        if(this.allTotal==0){
          this.alltrue =true
        }
        this.myall = res.data.data.rows
        this.$nextTick(() => {
          this.scroll = new Bscroll(this.$refs.wrapper, {
            probeType : 2,
            //  mouseWheel: false,
            pullUpLoad: true,
            tap: true,
            pullUpload: {
              threshold: -30
            }
          })
          this.scroll.on('pullingUp', () => {
              if(that.allTotal <= that.myall.length){
                that.scroll.finishPullUp()
                this.scroll.refresh() 
              }else{
                that.myllCurrentPage = that.myllCurrentPage + 1
                that.$axios.post('findLimit',{
                  currentPage: that.myllCurrentPage,
                }).then(res => {
                  that.myall = that.myall.concat(res.data.data.rows)
                  that.scroll.finishPullUp()
                  this.scroll.refresh()
                })
              }

          })
        })
      })
      this.$axios.post('selectDepositInfo', {}).then(res => {
        this.depositTotal = parseInt(res.data.data.total)
        if(this.depositTotal==0){
          this.deptrue =true
        }
        this.myDeposit = res.data.data.rows
        this.isShow = 'deposit'
        this.$nextTick(() => {
          this.scroll2 = new Bscroll(this.$refs.wrapper2, {
            probeType : 2,
            //  mouseWheel: false,
            pullUpLoad: true,
            tap: true,
            pullUpload: {
              threshold: -30
            }
          })
          this.isShow = 'all'
          this.scroll2.on('pullingUp', () => {
              if(that.depositTotal <= that.myDeposit.length){
                that.scroll2.finishPullUp()
                this.scroll2.refresh()
              }else{
                that.withdrawalCurrentPage = that.withdrawalCurrentPage + 1
                that.$axios.post('selectDepositInfo',{
                  currentPage: that.withdrawalCurrentPage,
                }).then(res => {
                  that.myDeposit = that.myDeposit.concat(res.data.data.rows)
                  if(that.myDeposit.length >= that.depositTotal) {
                  }
                  that.scroll2.finishPullUp()
                  this.scroll2.refresh()
                })
              }

          })
        })
      }),
      this.$axios.post('withdrawalList',{}).then(res => {
        this.withdrawalTotal = parseInt(res.data.data.total)
        if(this.withdrawalTotal==0){
          this.withtrue =true
        }
        this.myWithdrawal = res.data.data.rows
        this.isShow = 'withdrawal'
        this.$nextTick(() => {
          this.scroll3 = new Bscroll(this.$refs.wrapper3, {
            probeType : 2,
            //  mouseWheel: false,
            pullUpLoad: true,
            tap: true,
            pullUpload: {
              threshold: -30
            }
          })
          this.isShow = 'all'
          this.scroll3.on('pullingUp', () => {
              if(that.withdrawalTotal <= that.myWithdrawal.length){
                that.scroll3.finishPullUp()
                this.scroll3.refresh()
              }else{
                that.withdrawalCurrentPage = that.withdrawalCurrentPage + 1
                that.$axios.post('withdrawalList',{
                  currentPage: that.withdrawalCurrentPage,
                }).then(res => {
                  that.myWithdrawal = that.myWithdrawal.concat(res.data.data.rows)
                  if(that.myWithdrawal.length >= that.withdrawalTotal) {
                  }
                  that.scroll3.finishPullUp()
                  this.scroll3.refresh()
                })
              }

          })
        })
      })
    }
  }
</script>

<style scoped>
.dHeader{
  height: 1.9rem;
  background-image: linear-gradient(-189deg, #9695F9 0%, #5176F5 100%);
  position: relative;
  z-index: 2;
}
.pubHead{
  border:0;
  color: #fff;
}
.PubHeadBack{
  background: url(../../assets/backIcon_white.png) no-repeat left center;
  background-size: cover;
}
.btnTab{
  margin-top: .3rem;
  display: flex;
  justify-content:center;
}
.btnTab button{
  position: relative;
  font-size: .26rem;
  color: #FFF;
  opacity: .6;
  line-height: .45rem;
  display: inline-block;
}
.btnTab button.crt{
  font-size: .32rem;
  line-height: .45rem;
  opacity: 1;
}
.btnTab button.crt::before{
  content: ' ';
  display: block;
  position: absolute;
  left: 50%;
  bottom: -.15rem;
  width: .4rem;
  height: .04rem;
  background: #fff;
  transform: translateX(-50%);
}
.btnTab button:nth-child(2){
  margin: 0 1.6rem 0 1.2rem;
}
.list{
  padding: 0 .4rem;
  height: calc(100% - 1.9rem);
  position: relative;
}
.list ul{
  padding-bottom: 1rem;
}
.list li{
  position: relative;
  box-sizing: border-box;
  width: 100%;
  margin-top: .3rem;
  padding: 0 .3rem;
  box-shadow:  1px 1px 20px 3px #eee;
  border-radius: 14px;
}
.list.all li{
  box-shadow:  none;
  border-radius: 0;
  border-bottom: 1px solid #eee;
  padding: 0;
}
.list.all li .currency{
  padding: .1rem 0;
}
.list.all li .currency .eth{
  top: .7rem;
}
.list>p{
  position: absolute;
  top: 50%;
  left: 50%;
  /* width: 30%; */
  padding-top: 1.24rem;
  font-size: .28rem;
  line-height: .4rem;
  color: #9DA1A9;
  background: url(../../assets/noinfor.png) no-repeat top center;
  background-size: 100% auto;
  transform: translate3d(-50%,-50%,0)
}
.list li .currency{
  padding: .3rem 0 .15rem;
  display: flex;
  justify-content: space-between;
}
.list li .currency span{
  font-size: .29rem;
  line-height: .56rem; 
  color: #3F4D68;
}
.list li .currency em{
  position: relative;
  font-size: .45rem;
  line-height: .56rem; 
  color: #3F4D68;
  padding-left: .38rem;
  background:url(../../assets/appMoneyIcon.png) no-repeat left center;
  background-size: .28rem auto;
}
.list li .currency .push{
  color: #1BA5FD;
}
.list.all li .currency em{
  padding: 0;
  background: none;
}
.list li .currency .eth{
  position: absolute;
  right:0;
  top: .56rem;
  font-size: .22rem;
  color: #B6B6C9;
  line-height: .3rem;
  white-space: nowrap;
}
.list li .currency i{
  font-size: .24rem;
  line-height: .56rem;
}
.add{
  overflow: hidden;
}
.add span{
  display: block;
  font-size: .24rem;
  color: #3F4D68;
  line-height: .37rem;
  opacity: .8;
}
.add span:first-child{
  float: left;
}
.add span:last-child{
  float: left;
  width: 100%;
  word-wrap: break-word;
  /* overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap; */
  letter-spacing: 0;
}
.rate{
  font-size: .24rem;
  color: #3F4D68;
  line-height: .37rem;
  opacity: .8;
  padding: .1rem 0 .35rem;
}
.time{
  font-size: .22rem;
  line-height: .3rem;
  color: #B6B6C9;
  padding-bottom: .2rem;
}
.all .time{
  padding-bottom: .2rem;
}
.time span{
  float: right;
}
.state{
  position: absolute;
  right: .3rem;
  bottom: .3rem;
  font-size: .28rem;
  line-height: .4rem;
  
}
.undetermined{
  color: #FF801A;
}
.success{
  color: #06D4B6;
}
.fail{
  color: #FE3762;
}
</style>
