<template>
  <div class='bkeee'>
    <!-- v-if="isShow == 1"  -->
    <div> 
      <header class="pubHead">
        <button @click="back" class="PubHeadBack"></button>
        账户提现
        <!-- <router-link class='headRight' to="/detail">账户明细</router-link> -->
      </header>
      <section class='addresses' style="padding-top: .4rem;">
        <span>提现地址</span>
        <div @click="addressList">
          <!-- <span style="color: #0D497E" v-if='newUser'>{{addresses[currentIndex].description}}</span> -->
          <span style="color: #0D497E" v-if='newUser'>{{showAddress(addresses[currentIndex].withdrawal_address,'***')}} ></span>
          <span style="color: #0D497E" v-else>{{showAddress(addresses[currentIndex].withdrawal_address,' ')}} ></span>
        </div>
      </section>
      <section class='addresses'>
        <span>提现币种</span>
        <div>
          <span style="color: #000A2E">VPP</span>
        </div>
      </section>
      <section class='money'>
        <p>提现金额(VPP)</p>
        <!-- onkeyup="value=value.replace(/[^\d]/g,'')" -->
        <input type="text" autofocus v-model="withdrawalAmount" onkeydown="if(event.keyCode==13)event.keyCode=9" onKeypress="if   
((event.keyCode<48 || event.keyCode>57)) event.returnValue=false" oninput="if(value.length>8)value=value.slice(0,8)">
        <div class='allmoney'>当前可用余额 {{decimal(balance,100)}}VPP <button @click="withdrawalAll">全部提现</button></div>
        <button class='btn_login' :class="{high:!isDisable}" @click="confirm" :disabled="isDisable" >确认提现</button>
      </section>

      <section v-if="inputPayPassword" class="payPasswordBox">
        <div class="mask" @click='colsekeyboard'></div>
        <div class="keyboardBox">
          <header class="pubHead">
            <button @click="colsekeyboard" class="PubHeadBack"></button>
            请输入支付密码
          </header>
          <!-- <input type="password" @keyup="checkPayPassword" id="payPassword" autofocus v-model="payPassword" placeholder="请输入支付密码"> -->
          <div class="keyboardint">
            <i :style="{width:iwidth+'%'}"></i>
          </div>
          <button class='forget' @click="forget">忘记支付密码</button>
          <div class="keyboard">
            <ul @click.stop='_handleKeyPress'>
              <li><mt-button type="default" data-num='1'>1</mt-button></li>
              <li><mt-button type="default" data-num='2'>2</mt-button></li>
              <li><mt-button type="default" data-num='3'>3</mt-button></li>
              <li><mt-button type="default" data-num='4'>4</mt-button></li>
              <li><mt-button type="default" data-num='5'>5</mt-button></li>
              <li><mt-button type="default" data-num='6'>6</mt-button></li>
              <li><mt-button type="default" data-num='7'>7</mt-button></li>
              <li><mt-button type="default" data-num='8'>8</mt-button></li>
              <li><mt-button type="default" data-num='9'>9</mt-button></li>
              <li><mt-button disabled type="default">&nbsp;</mt-button></li>
              <li><mt-button type="default" data-num='0'>0</mt-button></li>
              <li><mt-button type="default" data-num='c'>删除</mt-button></li>
            </ul>
          </div>
        </div>
      </section>
      <section class='recharge-text'>
        <p>1.提现地址：任意支持erc20协议的地址</p>
        <p>2.提现到账时间：24小时内,如超过24小时未到账，请添加官方客服微信（valpromise-vpp）进行反馈</p>
        <p>3.提现手续费：单笔固定收取2000VPP作为手续费(单次提现最低5000VPP）</p>
      </section>

    </div>
    
  </div>
</template>

<script>
  import { Button,Toast } from 'mint-ui';
  
  
  export default {
    data() {
      return {
        noaddresses: '',
        addresses: [{
          description: '',
          withdrawal_address: ''
        },{
          description: '',
          withdrawal_address: ''
        }],
        balance: null,
        payPasswordarry: [],
        payPassword: '',
        withdrawalAmount: '',
        inputPayPassword: false,
        // isShow: -1,
        iwidth:0,
        newUser : true
      }
    },
    computed: {
      getPhoneNumber() {
        return this.countryCode + this.phoneNumber
      },
      isDisable() {
        return  this.withdrawalAmount.length < 4 ? true: false 
      },
      currentIndex() {
        return this.$route.params.currentIndex ? this.$route.params.currentIndex : 0
      }
    },
    watch: {
      withdrawalAmount(){
        let balance = this.decimal(this.balance,1)
        this.withdrawalAmount = (this.withdrawalAmount + '').replace(/\D/g,'')
        return this.withdrawalAmount > balance ? this.withdrawalAmount = balance : this.withdrawalAmount = ( this.withdrawalAmount * 1)
        
      }
    },
    methods:{
      back() {
        this.$router.push('/user')
      },
      forget() {
        this.$router.push('/setPayPassword')
      },
      decimal(numojb,number) {
        let num = new Number(numojb)
        return Math.floor(numojb*number)/number
      },
      showAddress(val,string) {
        return val.slice(0, 2) + string + val.slice(-4)
      },
      withdrawalAll() {
        let balance = this.decimal(this.balance,1)
        this.withdrawalAmount = balance
      },
      confirm() {
        if(this.withdrawalAmount >= 5000){
          if(this.noaddresses.length===0){
            Toast({
              message: '请添加提取地址',
              position: 'middle',
              duration: 1000
            });
          }else{
            this.$axios.post('isExistPayPassword',{}).then(res => {
              if(res.data.data.exist === 0) {
                this.forget()
              }else{
                this.inputPayPassword = true
              }
            })
          }
          
        }else{
          Toast({
            message: '提取金额必须5000起',
            position: 'middle',
            duration: 1200
          });
        }
        
      },
      addressList() {
        this.$router.push('/editAddress')
      },
      colsekeyboard(){
        this.inputPayPassword = false
        this.iwidth = 0
        this.payPasswordarry = []
      },
      _handleKeyPress(e){
        let num = e.target.dataset.num
        this.payPasswordarry.push(num);
        this.payPassword = this.payPasswordarry.join('');
        console.log(this.payPasswordarry)
        console.log(this.payPassword)
        switch (String(num)) {
          case 'c':
            this.iwidthreduce()
          break;
          default:
            this.iwidthplus(num)
          break;
        }
        if(this.iwidth == 96){
            this.$axios.post('checkPayPassword', {payPassword: this.payPassword}).then(res => {
              if(res.data.data.success === 1) {
                  this.$axios.post('withdrawal', {payeeAddress: this.addresses[this.currentIndex].withdrawal_address, vpp: this.withdrawalAmount}).then(res => {
                  console.log(res.data.data)
                  Toast({
                    message: '提币成功，您可以在账户明细中查看提现情况',
                    iconClass: 'icon icon-success',
                    duration: 2000
                  })
                  setTimeout(() => {
                    this.colsekeyboard()
                  }, 2000);
                  
                  
              })
              }else {
                this.payPasswordarry = []
                Toast({
                  message: '支付密码错误',
                  position: 'middle',
                  duration: 1000
                });
                this.iwidth = 0
              }
            })
        }
        
      },
      iwidthplus(num){
        this.iwidth >= 96 ? this.iwidth = 96 : this.iwidth += 16

      },
      iwidthreduce(){
        this.iwidth <= 0 ? this.iwidth = 0 : this.iwidth -= 16
      },
    },
    created() {
      this.$axios.post('findBalance',{}).then(res => {
        this.balance = res.data.data.balance
      })
      this.$axios.post('withdrawalAccountList',{}).then(res => {
        if(res.data.data.rows.length===0){
          this.noaddresses = res.data.data.rows
          this.newUser = false
        }else{
          this.addresses = res.data.data.rows
          this.noaddresses = [1]
        }
        
      })

    }
  }
</script>

<style scoped>
.pubHead{
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
.addresses{
  padding: 0 .4rem .6rem;
  display: flex;
  justify-content: space-between;
  background: #fff;
}
.addresses span{
  font-size: .28rem;
  line-height: .4rem;
}
.money{
  padding: .5rem .4rem .7rem;
  background: #eee;
}
.money p{
  font-size: .28rem;
  color: #626262;
  line-height: .4rem;
}
.money input{
  box-sizing: border-box;
  width: 100%;
  line-height: .6rem;
  height: .8rem;
  margin-top: .33rem;
  padding: 0 0 .2rem .6rem;
  border-bottom: 1px solid #D9DCE0;
  background: url(../../assets/appMoneyIcon.png) no-repeat left .1rem;
  background-size: .4rem auto;
  font-size: .6rem;
  color: #000A2E;
}
.allmoney{
  font-size: .24rem;
  color: #9DA1A9;
  line-height: .33rem;
  margin: .23rem 0 .87rem;
}
.allmoney button{
  font-size: .24rem;
  color: #1BA5FD;
}
.btn_login{
  margin: 0 auto;
}
.payPasswordBox{
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
}
.payPasswordBox .mask{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .42);
}
.payPasswordBox .keyboardBox{
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 2;
  width: 100%;
  height: 7.4rem;
  background: rgba(247, 247, 247, 1);
}
.payPasswordBox .pubHead{
  border: 1px solid #eee;
  box-sizing: border-box;
  height: .89rem;
  margin-bottom: .4rem;
}
.keyboard{
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 100%;
  max-width:640px;
  transform: translateX(-50%);
}
.keyboard li{
  width: calc(100% / 3);
  height: 1rem;
  line-height: 1rem;
  font-size: .4rem;
  color: #707894;
  text-align: center;
  float: left;
  box-sizing: border-box;
}
.keyboard li button{
  width: 100%;
  height: 100%;
  line-height: 1rem;
  border-radius: 0;
}
.keyboard li .mint-button--default{
  background: #fff;
}
.keyboardint{
  width: 7rem;
  height: 1rem;
  background: url(../../assets/input.png) no-repeat center;
  background-size: cover;
  margin: 0 auto;
}
.keyboardint i{
  display: block;
  width: 0%;
  height: 100%;
  background: url(../../assets/input2.png) no-repeat left top;
  background-size: 7rem 100%;
}
.forget{
  float: right;
  margin-right: .2rem;
  font-size: .22rem;
  color: #1BA5FD;
  line-height: .3rem;
  padding: .3rem 0;
}
.recharge-text{
  padding: 0rem .4rem .37rem;
}
.recharge-text p{
  font-size: .24rem;
  color: #9DA1A9;
  line-height: .45rem;
}
</style>
