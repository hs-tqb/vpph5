<template>
  <div class='bkeee'>
    <header class="pubHead">
      <button @click="back" class="PubHeadBack"></button>
      钱包转账
      <!-- <router-link class='headRight' to="/detail">账户明细</router-link> -->
    </header>
  <section class='recharge'>
    <div>充值地址</div>
    <div><img :src="walletCode" alt="qr_code"></div>
    <p id='target'>{{walletAddress}}</p>
    <div class='copy' @click="copy" data-clipboard-action="copy" data-clipboard-target="#target">复制</div>
  </section>
  <div class="calc">
    <h3>汇率换算</h3>
    <p>我 | 的 | 计 | 算 | 器</p>
    <div class="conversion">
      <p class='switch GET' @click="switchOpen" v-if='this.switch'>{{this.realtime[1].name}}币</p>
      <p class='switch ETH' @click="switchOpen" v-else>{{this.realtime[0].name}}币</p>
      <input class='changebefore' type="text" v-model="changebefore" placeholder="0" @keyup='changebeforekeyup' oninput="if(value.length>7)value=value.slice(0,7)" onKeypress="if((event.keyCode<48 || event.keyCode>57)) event.returnValue=false">
      <span v-if='this.switch'>实时汇率：1{{this.realtime[1].name}}≈{{this.realtime[1].rate}}vpp</span>
      <span v-else>实时汇率：1{{this.realtime[0].name}}≈{{this.realtime[0].rate}}vpp</span>
      <p class='VPP'>VPP币</p>
      <input v-if='this.switch' class='changeafter' type="text" v-model="changeafter" placeholder="0"  @keyup='changeafterkeyup' oninput="if(value.length>7)value=value.slice(0,7)" onKeypress="if((event.keyCode<48 || event.keyCode>57)) event.returnValue=false">
      <input v-else class='changeafter' type="text" v-model="changeafter2" placeholder="0"  @keyup='changeafter2keyup' oninput="if(value.length>7)value=value.slice(0,7)" onKeypress="if((event.keyCode<48 || event.keyCode>57)) event.returnValue=false">
    </div>
  </div>
  <section class='recharge-text'>
    <p>1.请勿向该地址充值除VPP、ETH、GET币之外的资产,任何冲入该地址的非VPP、ETH、GET资产将不可找回。</p>
    <p>2.VPP充值需要30个网络确认才可到帐。具体到帐时间将以网络繁荣度而定,一般在30min以内。</p>
    <p>3.最小充值VPP金额为100VPP。</p>
  </section>
  <switch-currency v-show="switchcurrency" @switch='switchClose' @switchselect='switchselect'></switch-currency>
  </div>
</template>

<script>
  import switchCurrency from '@/pages/user/SwitchCurrency'
  import Clipboard from 'clipboard'
  import { Toast } from 'mint-ui'
  export default {
    data() {
      return {
        walletAddress: '',
        walletCode: '',
        changebefore: '',
        // changebefore2:'',
        changeafter: '',
        changeafter2: '',
        realtime: [{},{}],
        switch: true,
        switchcurrency:false
      }
    },
    components: {
      switchCurrency
    },
    watch: {
      changebefore() {
        this.changebefore = (this.changebefore + '').replace(/\D/g,'')
      },
      changeafter() {
        this.changeafter = (this.changeafter + '').replace(/\D/g,'')
      },
      changeafter() {
        this.changeafter2 = (this.changeafter2 + '').replace(/\D/g,'')
      }
    },
    methods: {
      changebeforekeyup() {
        this.changebefore = parseFloat(this.changebefore *1)
        this.changeafter = Math.floor(this.changebefore * this.realtime[1].rate*1000)/1000
        this.changeafter2 = Math.floor(this.changebefore * this.realtime[0].rate*1000)/1000
      },
      changeafterkeyup() {
        this.changeafter = parseFloat(this.changeafter *1)
        this.changebefore = Math.floor(this.changeafter / this.realtime[1].rate*1000)/1000
      },
      changeafter2keyup() {
        this.changeafter2 = parseFloat(this.changeafter2 *1)
        this.changebefore = Math.floor(this.changeafter2 / this.realtime[0].rate*1000)/1000
      },
      back() {
        this.$router.go(-1)
      },
      copy(){
        var targetText=this.inviteCode;
        var clipboard = new Clipboard('.copy')
        clipboard.on('success', e => {
            Toast({
            message: '复制成功',
            position: 'middle',
            duration: 1200
          });     
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          Toast({
            message: '该浏览器不支持自动复制，请手动复制',
            position: 'middle',
            duration: 1200
          });
          clipboard.destroy()
        })
      },
      switchClose(){
        this.switchcurrency = false
      },
        switchOpen(){
          this.switchcurrency = true
        },
      switchselect(ind){
        ind == 1 ? this.switch = false : this.switch = true
        this.changebefore = ''
        this.changeafter = ''
        this.changeafter2 = ''
      }
    },
    created() {
      this.$axios.post('getWalletAddress',{}).then(res => {
        this.walletAddress = res.data.data.walletAddress
        this.walletCode = res.data.data.walletCode
        // this.realtime = res.data.data.rates
        this.realtime= res.data.data.rates.map(res=>{
          return res 
        });
      })
    }
  }
</script>

<style scoped>
.pubHead{
  border: 0;
  background: #fff;
}
.headRight{
  position: absolute;
  right: .4rem;
  top: 50%;
  font-size: .24rem;
  line-height: .33rem;
  color: #1BA5FD;
  transform: translate3d(0,-50%,0);
}
.recharge{
  text-align: center;
  font-size: .26rem;
  color: #000A2E;
  line-height: .37rem;
  padding: .6rem .4rem .5rem;
}
.recharge img{
  width: 2rem;
  margin: .3rem auto 0;
}
.recharge p{
  text-align: center;
  font-size: .22rem;
  line-height: .37rem;
  color: #3F4D68;
  padding: .2rem 0 .4rem;
  letter-spacing: 0px;
}
.copy{
  width: 2.05rem;
  height: .8rem;
  line-height: .8rem;
  font-size: .3rem;
  color: #FFFFFF;
  background: #1BA5FD;
  border-radius: 100px;
  margin: 0 auto; 
}
.recharge-text{
  padding: .73rem .4rem .37rem;
}
.recharge-text p{
  font-size: .24rem;
  color: #9DA1A9;
  line-height: .45rem;
}
.calc{
  padding: .4rem .4rem 0;
  text-align: center;
  background: #fff;
}
.calc h3{
  font-size: .34rem;
  color: #000A2E;
  line-height: .48rem;
  padding-bottom: .2rem;
}
.calc > p{
  font-size: .2rem;
  color: #000A2E;
  line-height: .28rem;
  text-align: center;
  opacity: .5;
}
.conversion{
  padding-top: .58rem;
}
.conversion p{
  position: relative;
  padding-left: .94rem;
  line-height: .7rem;
  font-size: .28rem;
  color: #3F4D68;
}
.conversion .switch::after{
  content: ' ';
  display: inline-block;
  width: .2rem;
  height: .22rem;
  background: url(../../assets/switch_btn.png) no-repeat center;
  background-size: auto 100%;
}
.conversion p.GET{
  float: left;
  background: url(../../assets/GET.png) no-repeat left center;
  background-size: .7rem auto;
}
.conversion p.ETH{
  background: url(../../assets/ETH.png) no-repeat left center;
  background-size: .7rem auto;
}
.conversion p.VPP{
  background: url(../../assets/VPP.png) no-repeat left center;
  background-size: .7rem auto;
}
.conversion input{
  width: 100%;
  line-height: .74rem;
  font-size: .5rem;
  text-align: right;
  padding-bottom: .19rem;
  border-bottom: 1px solid #eee;
}
.conversion input::-moz-placeholder, textarea::-moz-placeholder { color: #B6B6C9; }
.conversion input:-ms-input-placeholder, textarea:-ms-input-placeholder { color: #B6B6C9; }
.conversion input::-webkit-input-placeholder, textarea::-webkit-input-placeholder { color: #B6B6C9; }
.conversion input.changebefore{
  color: #1BA5FD;
}
.conversion input.changeafter{
  color: #000A2E;
}
.conversion span{
  display: block;
  width: 100%;
  padding: .2rem 0;
  text-align: right;
  font-size: .24rem;
  color: #B6B6C9;
  line-height: .33rem;
}
</style>
