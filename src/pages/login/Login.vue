<template>
  <div class="pg4">
    <div class="loginContainer">
      <h1 class='login_tit'>亲爱的V粉</h1>
      <p class="login_text">欢迎来到VPP，<router-link to="/signup" class='login-signUp-btn'>立即注册</router-link></p>
      <section class="input_container area">
          <label for="area">国家 / 地区</label>
          <p id="area" @click="showCountry">{{countryName}}</p>
      </section>
      <form class="loginForm" v-show="loginWay" onkeydown="if(event.keyCode==13)return false;">
        <section class="input_container phone_number">
          <label for="phoneNumber">手机号</label>
          <input type="text" placeholder="请输入手机号" required name="phone" v-model="phoneNumber" id="phoneNumber" onkeyup="if((event.keyCode<48 || event.keyCode>57)) event.returnValue=false" @mousewheel.prevent>
        </section>
        <section class="input_container varifyCode">
          <label for="verifyCode">验证码</label>
          <button @click.prevent="checkMobile" :class="{right_phone_number: rightPhoneNumber,get_code:getcode}"  v-show="!computedTime">获取验证码</button>
          <button @click.prevent v-show="computedTime" disabled>已发送({{computedTime}}s)</button>
          <input type="text" placeholder="请输入手机验证码" name="verifyCode" id="verifyCode" v-model="verifyCode" onKeypress="if((event.keyCode<48 || event.keyCode>57)) event.returnValue=false" oninput="if(value.length>6)value=value.slice(0,6)"> 
        </section>
      </form>
      <form class="loginForm" onkeydown="if(event.keyCode==13)return false;" v-show="!loginWay">
        <section class="input_container phone_number">
          <label for="phoneNumber">手机号</label>
          <input type="text" placeholder="请输入手机号" name="phone" id="phoneNumber2" v-model="phoneNumber" onKeypress="if((event.keyCode<48 || event.keyCode>57)) event.returnValue=false" @mousewheel.prevent>
        </section>
        <section class="input_container password">
          <label for="passWord">密码</label>
          <input type="password" required id="passWord" placeholder="请输入密码" v-model="passWord" minlength="6" maxlength="12">
        </section>
      </form>
      <section class="v_containerBox">
        <div id="v_container" style="width: 2.4rem;height: 0.82rem;"></div>
        <p @click="vContainerRefresh">换一张</p>
        <input type="text" id="v_container_input" placeholder="请输入图形验证码" v-model="V_verifyCodeInput" oninput="if(value.length>4)value=value.slice(0,4)">
      </section>
      <section>
          <button @click="login" class="btn_login" :disabled="!this.Allinput" :class='{high:this.Allinput}'>登 录</button>
      </section>
      <section class="tabLogin">
        <a href="javascript:void(0);" @click="changeWay">
          <span v-if="this.loginWay">切换为密码登录</span>
          <span v-else>切换为验证码登陆</span>
        </a>
        <router-link to="/forgetPassword">忘记密码</router-link>
      </section>
    </div>
    <get-country @countryCode="getCountryCode" v-if="showCountryList" @closeCountryList="closeCountryList"></get-country>
  </div>
</template>

<script>
  import gverigy from '@/config/gverigy'
  import getCountry from '@/components/GetCountry'
  import { Toast } from 'mint-ui'
  
  export default {
    data() {
      return {
        countryCode: '86',
        countryName: '中国',
        loginWay: false,
        phoneNumber: '',
        verifyCode: '',
        getcode: false,
        checkverifyCode:false, //是否点击获取验证
        passWord: '',//登陆密码
        rightPhoneNumber: true,
        computedTime: 0,
        V_verifyCode: '',
        V_verifyCodeInput:'',
        highSelect:false,
        showCountryList: false,
        plus: '',
        // reduce: '',
        privateKey: '',//私钥
        publicKey: ''//公钥
      }
    },
    components: {
      getCountry
    },
    computed: {
      //区号组合
      getPhoneNumber() {
        return this.countryCode + this.phoneNumber
      },
      // //加密
      // encryptedPasswd() {
      //   return encrypted
      // },
      Allinput() {
        if(this.loginWay){
          if(this.countryCode.length != 0 && this.phoneNumber.length != 0 &&this.verifyCode != 0 &&this.V_verifyCodeInput.length != 0){
            return true
          }else return false
        }else{
          if(this.countryCode.length != 0 &&this.phoneNumber.length != 0 &&this.passWord != 0 && this.V_verifyCodeInput.length != 0){
            return true
          }else return false
        }
      }
    },
    watch: {
      phoneNumber() {
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
      //改变登录方式
      changeWay() {
        this.loginWay = !this.loginWay
        this.getkey()
      },
      //获得国家地址列表
      getCountry() {
        this.$axios.post('getCountryList').then(res => {
          console.log(res.data.data.rows)
        })
      },
      // 获取公钥
      getkey(){
        this.$axios.post('getPublicKey', {mobile: this.getPhoneNumber}).then(res => {
          this.publicKey = res.data.data.publicKey
          this.privateKey = res.data.data.privateKey
          console.log(this.publicKey)
        })
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
          this.checkverifyCode = true
        })
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
                duration: 1200
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
            duration: 1200
          });
        }
      },
      //密码登陆
      passwordlogin(){
        this.$axios.post('getPublicKey', {mobile: this.getPhoneNumber}).then(res => {
          this.publicKey = res.data.data.publicKey
          this.privateKey = res.data.data.privateKey
          this.plus.setPublicKey(this.publicKey)
          let encrypted = this.plus.encrypt(this.passWord)
          console.log(this.publicKey)
          console.log(this.plus)
            this.$axios.post('login',{mobile: this.getPhoneNumber, password: encrypted}).then(res => {
              //登陆成功时设置token,并跳转主页
              localStorage.setItem('token',res.data.data.token)
              console.log(localStorage.getItem('token'))
              this.$router.push('/')
              //储存登录的账户个别信息,个别页面使用
              localStorage.setItem('mobile', this.getPhoneNumber)
              localStorage.setItem('countryCode', this.countryCode)
              localStorage.setItem('phoneNumber', this.phoneNumber)
              localStorage.setItem('countryName', this.countryName)
              localStorage.setItem('publicKey', this.publicKey)
              localStorage.setItem('privateKey', this.privateKey)
              
              this.$store.commit('setIncludedComponents','bjBox,transaction')
              
            })
        })
      },

      // 登陆
      login() {
        console.log(this.publicKey)
        let res = this.V_verifyCode.validate(this.V_verifyCodeInput)
        if(res){
          if(this.loginWay) {
              if(this.checkverifyCode){
                this.plus.setPublicKey(this.publicKey)
                let encrypted = this.plus.encrypt(this.verifyCode)
                console.log(this.verifyCode)
                this.$axios.post('loginCode', {mobile: this.getPhoneNumber, code: encrypted}).then(res => {
                  console.log(res.data.data.token)
                  //登陆成功时设置token,并跳转主页
                  localStorage.setItem('token',res.data.data.token)
                  console.log(localStorage.getItem('token'))
                  this.$router.push('/')
                  //储存登录的账户个别信息,个别页面使用
                  localStorage.setItem('mobile', this.getPhoneNumber)
                  localStorage.setItem('countryCode', this.countryCode)
                  localStorage.setItem('phoneNumber', this.phoneNumber)
                  localStorage.setItem('countryName', this.countryName)
                  localStorage.setItem('publicKey', this.publicKey)
                  localStorage.setItem('privateKey', this.privateKey)
                  this.$store.commit('setIncludedComponents','bjBox,transaction')
                })
              }else{
                Toast({
                  message: '验证码有误，请重新获取',
                  position: 'middle',
                  duration: 1200
                });
              }
          }else{
            console.log(1)
            if(this.countryCode == '86'){
              console.log(3)
              let reg=11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
              if(!reg.test(this.phoneNumber)){
                Toast({
                  message: '手机格式不正确',
                  position: 'middle',
                  duration: 1200
                });
              }else{
                console.log(4)
                this.passwordlogin()
              }
            }else{
              this.passwordlogin()
            }
          }
        }else{
          console.log(this)
          Toast({
            message: '图形验证码错误',
            position: 'top',
            duration: 1000
          });
        }
      },
      //点击切换验证码图
      vContainerRefresh() {
        this.V_verifyCode.refresh()
      }
    },
    mounted(){
      this.V_verifyCode = new GVerify("v_container");
      this.plus = new JSEncrypt()
      // this.reduce = new JSEncrypt()

      }
  }
</script>

<style>

</style>
