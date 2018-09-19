<template>
  <div class='accountMax'>
    <div class="account">
      <header><div class='menu' @click='showMenu'></div> 账户</header>
      <h3>用户ID：{{id}}</h3>
      <p>账户余额 (VPP)</p>
      <div class='appMoney'>{{decimal(balance)}}</div>
      <div class='money'>{{cashAmount}}</div>
      <div class="btn_container">
        <button @click="toDeposit">充值</button>
        <button @click="toWithdrawal">提现</button>
      </div>
    </div>
    <ul>
      <li class='bill'>
        <router-link to="/bill">我的订单</router-link>
      </li>
      <li class='invite'>
        <router-link to="/invite">邀请有奖</router-link>
      </li>
      <li class='detail'>
        <router-link to="/detail">账户明细</router-link>
      </li>
      <li class='bonus'>
        <router-link to="/bonus">我的分成</router-link>
      </li>
    </ul>
    <ul>
      <li class='notice'>
        <router-link to="/notice">公告</router-link>
      </li>
      <li class='security'>
        <router-link to="/security">安全中心</router-link>
      </li>
      <li class='aboutUs'>
        <router-link to="/aboutUs">关于我们</router-link>
      </li>
    </ul>
    <button @click="exit" class='logOff'>退出登录</button>
    <menu-box v-if='menuShow' @closeMenu='closeMenu' :crtInd='index'></menu-box>
    </div>
</template>

<script>
  import menuBox from '@/components/Menu'
  import { MessageBox } from 'mint-ui';
  export default {
    data() {
      return {
        balance: 0,
        cashAmount: '',
        id: '',
        menuShow: false,
        index:3
      }
    },
    components: {
      menuBox
    },
    methods: {
      decimal(value){
        var value = Math.round(parseFloat(value)*100)/100
        var xsd = value.toString().split(".")
        if(xsd.length==1){
          value=value.toString() + ".00"
          return value
        }
        if(xsd.length>1){
          if(xsd[1].length<2){
            value = value.toString()+"0"
          }
          return value
        }
      },
      showMenu(){
        this.menuShow = !this.menuShow
      },
      closeMenu(){
        this.menuShow = !this.menuShow
      },

      exit() {
        MessageBox({
          confirmButtonText:'退出登录',
          showCancelButton:true})
        MessageBox.confirm('退出后会不会删除任何历史数据，下次登录依然可以使用本账号。','确认退出登录？').then(action => {
          this.$router.push({
            path:'/login'
          })
          this.$axios.post('loginOut', {}).then(res => {
            
          })
          this.$store.commit('setIncludedComponents','')
          localStorage.clear()
          },function(){
            // 取消
          });
      },
      back() {
        this.$router.push('/')
      },
      toDeposit() {
        this.$router.push({
          path: '/deposit'
        })
      },
      toWithdrawal() {
        this.$axios.post('withdrawalAccountList',{}).then(res => {
          this.addresses = res.data.data.rows
          if(this.addresses.length===0){
            this.newUser = false
            this.$router.push({name:'newAddress'})
          }else{
            this.$router.push({
              path: '/withdrawal'
            })
          }
        })
      }
    },
    created() {
      this.$axios.post('customerDetail',{}).then(res => {
        this.balance = res.data.data.balance
        this.cashAmount = res.data.data.cashAmount
        this.id = res.data.data.id
        sessionStorage.setItem('id', this.id)
      })
    }
  }
</script>

<style scoped>
.accountMax{
  width:100%;
  min-height: 100%;
  background:#EEE;
  overflow: hidden;
}
.account{
  box-sizing: border-box;
  width:100%;
  height:6rem;
  padding:0.32rem 0.4rem 0;
  background-image: linear-gradient(-189deg, #9695F9 0%, #5176F5 100%);
  text-align: center;
  color:#fff;
}
.account header{
  position:relative;
  font-size: 0.32rem;
  line-height: 0.45rem;
}
.account .menu{
  position:absolute;
  left:0;
  top:50%;
  transform: translateY(-50%);
  width: .45rem;
  height: .38rem;
  background:url(../../assets/menuIcon.png) no-repeat center;
  background-size: cover;
}
.account h3{
  font-weight: 100;
  font-size:.24rem;
  line-height: .33rem;
  padding:.32rem 0 .4rem;
  letter-spacing: 1px;
}
.account h3::before{
  content: ' ';
  display: inline-block;
  width: .12rem;
  height: .12rem;
  background: #FFD65F;
  border-radius: 24px;
  vertical-align: middle;
  line-height: .33rem;
  margin-right: .1rem;
}
.account p{
  font-weight: 100;
  font-size:.26rem;
  line-height: .37rem;
  padding:0 0 .4rem;
  letter-spacing: 1px;
  text-align: center;
  opacity: .8;
}
.appMoney{
  font-size: .6rem;
  letter-spacing: 2px;
  line-height: .7rem;
  font-family: 'Arial-BoldMT';
  margin-bottom: .2rem;
}
.appMoney::before{
  content: ' ';
  display: inline-block;
  width: .6rem;
  height: .6rem;
  background: url(../../assets/appMoneyIcon.png) no-repeat center;
  background-size: cover;
  margin-right: .14rem;
}
.money{
  font-size: .26rem; 
  opacity: .8;
  line-height: .37rem;
}
.btn_container{
  padding: .5rem .45rem 0;
  display:flex;
  justify-content: space-between;
}
.btn_container button{
  width: 2.4rem;
  height: .8rem;
  line-height: .8rem;
  text-align: center;
  font-size: .3rem;
  color: #fff;
  border: 1px solid #fff;
  border-radius: 100px;
}
.accountMax ul{
  margin-bottom: .2rem;
}
.accountMax li{
  height: 1rem;
  background: #fff;
  margin-bottom: 1px;
  padding: 0 .4rem;
}
.accountMax li a{
  position: relative;
  line-height: 1rem;
  font-size: .28rem;
  color: #3F4D68;
}
.accountMax li a::after{
  position:absolute;
  right: 0;
  top: 50%;
  content: ' ';
  display: block;
  width: .15rem;
  height: .15rem;
  background: url(../../assets/moreIcon.png) no-repeat center;
  background-size: cover;
  transform: translateY(-50%);
}
.accountMax li a::before{
  content: ' ';
  display: inline-block;
  width: .52rem;
  height: .47rem;
  margin-right: .2rem;
  vertical-align: middle;
}
.accountMax li.bill a::before{
  background: url(../../assets/billIcon.png) no-repeat center;
  background-size: auto 100%;
}
.accountMax li.invite a::before{
  background: url(../../assets/inviteIcon.png) no-repeat center;
  background-size: auto 100%;
}
.accountMax li.detail a::before{
  background: url(../../assets/detailIcon.png) no-repeat center;
  background-size: auto 100%;
}
.accountMax li.notice a::before{
  background: url(../../assets/noticeIcon.png) no-repeat center;
  background-size: auto 100%;
}
.accountMax li.security a::before{
  background: url(../../assets/securityIcon.png) no-repeat center;
  background-size: auto 100%;
}
.accountMax li.aboutUs a::before{
  background: url(../../assets/aboutUsIcon.png) no-repeat center;
  background-size: auto 100%;
}
.accountMax li.bonus a::before{
  background: url(../../assets/bonus.png) no-repeat center;
  background-size: auto 100%;
}
.logOff{
  margin: 1rem auto .6rem;
  background: #1BA5FD;
  color: #fff;
  box-shadow: 0 2px 20px 0 rgba(12,138,231,0.34);
}
.mint-msgbox-message{
  line-height: 25px;
}
</style>
