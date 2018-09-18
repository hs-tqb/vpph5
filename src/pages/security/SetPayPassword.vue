<template>
  <div>
      <header class="pubHead">
        <button @click="back" class="PubHeadBack"></button>
        设置支付密码
      </header>
      <div class='pg4'>
        <form class="forgetPayPassword">
          <section class="input_container area">
            <label for="area">国家/地区</label>
            <p id="area">{{countryName}}</p>
          </section>
          <section class="input_container phone_number">
            <label for="phoneNumber">手机号</label>
            <input type="number" placeholder="请输入手机号" required name="phone" v-model="phoneNumber" id="phoneNumber" @mousewheel.prevent>
          </section>
          <section class="input_container varifyCode">
            <label for="verifyCode">验证码</label>
            <button @click.prevent="getVerifyCode"  :class="{right_phone_number: rightPhoneNumber}" v-show="!computedTime">获取验证码</button>
            <button @click.prevent v-show="computedTime" disabled>已发送({{computedTime}}s)</button>
            <input type="number" placeholder="请输入验证码" name="verifyCode" id="verifyCode" v-model="verifyCode" onKeypress="if((event.keyCode<48 || event.keyCode>57)) event.returnValue=false" oninput="if(value.length>6)value=value.slice(0,6)"  @mousewheel.prevent>
          </section>
          <section class="input_container payPassword">
            <label for="payPassword">支付密码</label>
            <input type="password" v-model="newPayPassword" placeholder="请输入支付密码" id="payPassword" oninput="if(value.length>6)value=value.slice(0,6)" onKeypress="if((event.keyCode<48 || event.keyCode>57)) event.returnValue=false">
          </section>
          <section class="input_container payPassword">
            <label for="payPassword">确认支付密码</label>
            <input type="password" v-model="confirmpayPassword" placeholder="请输入支付密码" id="confirmpayPassword" oninput="if(value.length>6)value=value.slice(0,6)" onKeypress="if((event.keyCode<48 || event.keyCode>57)) event.returnValue=false">
          </section>
        </form>
        <button @click="setPayPassword" class='btn_login' :disabled="!this.Allinput" :class='{high:this.Allinput}'>
          设置密码
        </button>
      </div>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui'
  export default {
    data() {
      return {
        countryCode: '86',
        countryName: '',
        phoneNumber: '',
        verifyCode: '',
        rightPhoneNumber: true,
        showCountryList: false,
        computedTime: 0,
        newPayPassword: '',
        confirmpayPassword: '',
        securityToken: '',
        publicKey: '',//公钥
        plus: ''
      }
    },
    computed: {
      getPhoneNumber() {
        return this.countryCode + this.phoneNumber
      },
      Allinput() {
        if(this.countryCode.length != 0 && this.phoneNumber.length != 0 &&this.verifyCode != 0 &&this.newPayPassword.length != 0 &&this.confirmpayPassword.length != 0){
          return true
        }else return false
      }
    },
    methods: {
      back() {
        this.$router.go(-1)
      },
      //获取公钥
      getkey(){
        this.$axios.post('getPublicKey', {mobile: this.getPhoneNumber}).then(res => {
          this.publicKey = res.data.data.publicKey
          // this.privateKey = res.data.data.privateKey
        })
      },
      //前端验证密码格式
      webcheckPossword(obj){
        let rexp = '[^0-9A-Za-z]'
        let rex = new RegExp(rexp)
        if (rex.test(obj)) {
            Toast({
              message: '密码格式为数字，字母（包含大小)',
              position: 'middle',
              duration: 1200
            });
            return false
        }
        if (obj.length < 6) {
            Toast({
              message: '密码最少6位',
              position: 'middle',
              duration: 1200
            });
            return false
        } else {
            return true
        }
      },
      getVerifyCode() {
        let encrypted = this.plus.encrypt(this.getPhoneNumber)
        this.$axios.post('getMobileCode', {mobile: this.getPhoneNumber, skey: encrypted}).then(res => {
          this.computedTime = 30;
          this.timer = setInterval(() => {
              this.computedTime --;
              if (this.computedTime == 0) {
                  clearInterval(this.timer)
              }
          }, 1000)
          })
      },
      setPayPassword() {
        let encrypted = this.plus.encrypt(this.verifyCode)
        let plusnewPayPassword = this.plus.encrypt(this.newPayPassword)
        let plusconfirmpayPassword = this.plus.encrypt(this.confirmpayPassword)
        if(this.newPayPassword.length!=6&&this.confirmpayPassword!=6){
          Toast({
            message: '支付密码必须为6位',
            position: 'middle',
            duration: 1200
          })
        }else{
          if(this.newPayPassword==this.confirmpayPassword){
            this.$axios.post('checkCode', {mobile: this.getPhoneNumber, code: encrypted}).then(res => {
              this.securityToken = res.data.data.securityToken
              console.log(this.securityToken)
              this.$axios.post('updatePayPassword', {securityToken: this.securityToken, newPayPassword: plusnewPayPassword, repeatNewPayPwd: plusconfirmpayPassword}).then(res => {
                  this.back()
              })
            })
          }else{
            Toast({
              message: '密码不一致，请重新输入',
              position: 'middle',
              duration: 1200
            })
          }
        }
        
        
      },
    },
    created() {
      this.phoneNumber = localStorage.getItem('phoneNumber')
      this.publicKey = localStorage.getItem('publicKey')
      this.countryName = localStorage.getItem('countryName')
      this.publicKey ?  this.publicKey : this.getkey()
      
    },
    mounted() {
      this.plus = new JSEncrypt()
      this.plus.setPublicKey(this.publicKey)
    }
  }
</script>

<style scoped>
.forgetPayPassword{margin-top:0.8rem;}
.input_container button{
    color: #1BA5FD;
}
</style>
