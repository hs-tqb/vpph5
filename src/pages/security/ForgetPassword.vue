<template>
  <div>
    <header class="pubHead">
      <button @click="back" class="PubHeadBack"></button>
      重置密码
    </header>
    <div class="pg4">
      <form class="forgetPayPassword">
        <section class="input_container area">
          <label for="area">国家 / 地区</label>
          <!-- <input type="text" id="area" v-model="countryCode"> -->
          <p id="area" @click="showCountry">{{countryName}}</p>
        </section>
        <section class="input_container phone_number">
          <label for="phoneNumber">手机号</label>
          <input type="text" placeholder="请输入手机号" name="phone" maxlength="11" v-model="phoneNumber" id="phoneNumber" onKeypress="if((event.keyCode<48 || event.keyCode>57)) event.returnValue=false" @mousewheel.prevent>
        </section>
        <section class="input_container varifyCode">
          <label for="verifyCode">验证码</label>
          <button @click.prevent="checkMobile"  :class="{right_phone_number: rightPhoneNumber,get_code:getcode}" v-show="!computedTime">获取验证码</button>
          <button @click.prevent v-show="computedTime" disabled>已发送({{computedTime}}s)</button>
          <input type="text" placeholder="请输入验证码" name="verifyCode" id="verifyCode" v-model="verifyCode" oninput="if(value.length>6)value=value.slice(0,6)" onKeypress="if((event.keyCode<48 || event.keyCode>57)) event.returnValue=false" @mousewheel.prevent> 
        </section>
        <section class="input_container newsPassword">
          <label for="Password">新密码</label>
          <input type="password" v-model="newPassword" placeholder="请输入密码" id="newPassword" minlength="6" maxlength="12" >
        </section>
        <section class="input_container confirmPassword">
          <label for="Password">确认密码</label>
          <input type="password" v-model="confirmPassword" placeholder="请输入密码" id="confirmPassword" minlength="6" maxlength="12">
        </section>
      </form>
      <button @click="setPassword" class='btn_login' :disabled="!this.Allinput" :class='{high:this.Allinput}'>
        完成
      </button>
    </div>
    <get-country @countryCode="getCountryCode" v-if="showCountryList" @closeCountryList="closeCountryList"></get-country>
  </div>
</template>

<script>
  import getCountry from '@/components/GetCountry'
  import { Toast } from 'mint-ui'
  export default {
    data() {
      return {
        countryCode: '86',
        countryName: '中国',
        phoneNumber: '',
        verifyCode: '',
        getcode: false,
        checkverifyCode:false, //是否点击获取验证
        rightPhoneNumber: true,
        computedTime: 0,
        newPassword: '',
        confirmPassword:'',
        highSelect:false,
        showCountryList: false,
        plus: '',
        privateKey: '',//私钥
        publicKey: '',//公钥
        securityToken: ''
      }
    },
    components:{
      getCountry
    },
    computed: {
      getPhoneNumber() {
        return this.countryCode + this.phoneNumber
      },
      Allinput() {
        if(this.countryCode.length != 0 && this.phoneNumber.length != 0 &&this.verifyCode != 0 &&this.newPassword.length != 0 &&this.confirmPassword.length != 0){
          return true
        }else return false
      }
    },
    watch: {
      phoneNumber(){
        this.phoneNumber.length != 0 ? this.getcode = true : this.getcode = false
        this.phoneNumber = (this.phoneNumber + '').replace(/\D/g,'')
      },
      verifyCode(newVal,oldVal) {
        this.verifyCode = (this.verifyCode + '').replace(/\D/g,'')
      }
    },
    methods: {
      //关闭地区列表
      closeCountryList() {
        this.showCountryList = false
      },
      showCountry() {
        this.showCountryList = true
      },
      //获取国家区号
      getCountryCode(a) {
        this.countryCode = a.countryCode
        this.countryName =a.cnName
        this.closeCountryList()
      },
      back() {
        this.$router.go(-1)
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
              duration: 1500
            });
            return false
        } else {
            return true
        }


      },
      // 获得验证码
      getVerifyCode() {
        this.$axios.post('getPublicKey', {mobile: this.getPhoneNumber}).then(res => {
          this.publicKey = res.data.data.publicKey
          this.privateKey = res.data.data.privateKey 
          this.computedTime = 30;
          this.timer = setInterval(() => {
              this.computedTime --;
              if (this.computedTime == 0) {
                  clearInterval(this.timer)
              }
          }, 1000)
          this.plus.setPublicKey(this.publicKey)
          let encrypted = this.plus.encrypt(this.getPhoneNumber)
          this.$axios.post('getMobileCode', {mobile: this.getPhoneNumber, skey: encrypted}).then(res => {})
        })
        this.checkverifyCode = true
      },
      //验证手机格式
      checkMobile() {
        if(this.phoneNumber.length != 0){
          //验证中国大陆地区手机号码
          if(this.countryCode == 86){
            let reg=11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
            if(!reg.test(this.phoneNumber)){
              Toast({
                message: '手机格式不正确',
                position: 'middle',
                duration: 1000
              });
            }else{
              // 获得验证码
              this.getVerifyCode()
            }
          }
          //非中国大陆地区手机号码
          else{
            // 获得验证码
            this.getVerifyCode()
          }
        }else {
          Toast({
            message: '请输入手机号',
            position: 'middle',
            duration: 1000
          });
        }
      },
      setPassword() {
        let encrypted = this.plus.encrypt(this.verifyCode)
        let plusnewPassword = this.plus.encrypt(this.newPassword)
        let plusconfirmPassword = this.plus.encrypt(this.confirmPassword)
        if(this.checkverifyCode){
          if(this.newPassword == this.confirmPassword ){
          this.$axios.post('checkCode', {mobile: this.getPhoneNumber, code: encrypted}).then(res => {
            this.securityToken = res.data.data.securityToken
            if(this.webcheckPossword(this.newPassword)&&this.webcheckPossword(this.confirmPassword)){
                this.$axios.post('updatePassword', {mobile: this.getPhoneNumber,securityToken: this.securityToken, newPassword: plusnewPassword, repeatPwd: plusconfirmPassword}).then(res => {
                console.log(res.data.data)
                Toast({
                  message: '修改成功，请成功登陆',
                  position: 'top',
                  duration: 1000
                })
                this.back()
              })
            }else{
              Toast({
                message: '密码格式为数字，字母（包含大小)',
                position: 'middle',
                duration: 1200
              });
            }
            
          })
          }else{
            Toast({
              message: '密码不一致，请重新输入',
              position: 'middle',
              duration: 1200
            })
          }
        }else{
          Toast({
            message: '验证码有误，请重新获取',
            position: 'middle',
            duration: 1200
          });
        }
      },
    },
    mounted() {
      this.plus = new JSEncrypt()
    }
  }
</script>

<style scoped>
.forgetPayPassword{margin-top:0.8rem;}
</style>
