<template>
  <div class="pg4">
    <h1 class='login_tit'>亲爱的V粉</h1>
    <p class="login_text">欢迎来到VPP，<router-link to="/login" class='login-signUp-btn'>立即登陆</router-link></p>
    <!-- <button @click="back">返回</button> -->
    <form class="signForm" onkeydown="if(event.keyCode==13)return false;">
      <section class="input_container area">
          <label for="area">国家 / 地区</label>
          <!-- <input type="text" id="area" v-model="countryCode"> -->
          <p id="area" @click="showCountry">{{countryName}}</p>
        </section>
      <section class="input_container phone_number">
          <label for="phoneNumber">手机号</label>
          <input type="text" placeholder="请输入手机号" name="phone" v-model="phoneNumber" id="phoneNumber" onKeypress="if((event.keyCode<48 || event.keyCode>57)) event.returnValue=false" @mousewheel.prevent>
      </section>
      <section class="input_container varifyCode">
          <label for="verifyCode">验证码</label>
          <button @click.prevent="checkMobile" :class="{right_phone_number: rightPhoneNumber,get_code:getcode}" v-show="!computedTime">获取验证码</button>
          <button @click.prevent v-show="computedTime" disabled>已发送({{computedTime}}s)</button>
          <input type="text" placeholder="请输入手机验证码" name="verifyCode" id="verifyCode" v-model="verifyCode" oninput="if(value.length>6)value=value.slice(0,6)" onKeypress="if((event.keyCode<48 || event.keyCode>57)) event.returnValue=false" @mousewheel.prevent>
        </section>
        <section class="input_container password">
          <label for="passWord">密码</label>
          <input type="password" id="passWord" placeholder="请输入密码" v-model="passWord" maxlength="12" minlength="6">
        </section>
        <section class="input_container password">
          <label for="passWord">确认密码</label>
          <input type="password" id="confirmPassword" placeholder="请再次输入密码" v-model="confirmPassword" maxlength="12" minlength="6">
        </section>
        <section class="input_container inviteWord">
          <label for="inviteWord">邀请码</label>
          <input type="text" v-model="inviteWord" placeholder="选填">
        </section> 
        
    </form>
    <section>
          <button @click="signUp" class="btn_login" :disabled="!this.Allinput" :class='{high:this.Allinput}'>注 册</button>
    </section>
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
        checkverifyCode:false, //是否点击获取验证
        getcode: false,
        passWord: '',
        confirmPassword: '',
        inviteWord: '',
        rightPhoneNumber: true,
        computedTime: 0,
        showCountryList: false,
        plus: '',
        lastnum:''
      }
    },
    components:{
      getCountry
    },
    computed: {
      //区号组合
      getPhoneNumber() {
        return this.countryCode + this.phoneNumber
      },
      Allinput() {
        
        if(this.countryCode.length != 0 && this.phoneNumber.length != 0 && this.verifyCode.length != 0 && this.passWord.length != 0 && this.confirmPassword.length != 0){
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
      //关闭地区列表 back
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
      //前端验证短信码长度是否等于6
      // webverifyCode(){
      //   if(this.verifyCode.length != 6){
      //     Toast({
      //       message: '短信验证码应为6位',
      //       position: 'middle',
      //       duration: 1500
      //     });
      //   }
      // },
      //前端验证密码格式
      webcheckPossword(obj){
        let rexp = '[^0-9A-Za-z]'
        let rex = new RegExp(rexp)
        if (rex.test(obj)) {
            Toast({
              message: '密码格式为数字，字母（包含大小)',
              position: 'middle',
              duration: 1500
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
      //获取验证码
      getVerifyCode() {
        if(this.phoneNumber.length != 0){
          // 获取公钥
          this.$axios.post('getPublicKey', {mobile: this.getPhoneNumber}).then(res => {
            this.publicKey = res.data.data.publicKey
            this.privateKey = res.data.data.privateKey
            console.log(this.publicKey)
            this.computedTime = 30;
            this.timer = setInterval(() => {
                this.computedTime --;
                if (this.computedTime == 0) {
                    clearInterval(this.timer)
                }
            }, 1000)
            this.plus.setPublicKey(this.publicKey)
            let encrypted = this.plus.encrypt(this.getPhoneNumber)
            this.$axios.post('getMobileCode', {mobile: this.getPhoneNumber, skey: encrypted}).then(res => {
              
            })
            this.checkverifyCode = true
          })
        }else {
          Toast({
            message: '请输入手机号',
            position: 'middle',
            duration: 1000
          });
        }
      },
      Secondnum(lastnum) {
        let result="";
        let i;
        for(i=0;i<parseInt(lastnum);i++){result=result+(parseInt(Math.random()*10)).toString();} 
        console.log(result)
        return  result;
      },
      CodeHandle(verifyCode,place,Secondnum,place2,Secondnum2,lastnum) {
        let verifyCode1 = verifyCode.substring(0,place)
        let verifyCode2 = verifyCode.substring(place,place2)
        let verifyCode3 = verifyCode.substring(place2,verifyCode.length)
        console.log(lastnum)
        console.log(verifyCode1)
        console.log(verifyCode2)
        console.log(verifyCode3)
        console.log(verifyCode1+Secondnum+verifyCode2+Secondnum2+verifyCode3+lastnum)
        return verifyCode1+Secondnum+verifyCode2+Secondnum2+verifyCode3+lastnum;
      },
      signUp() {
        this.CodeHandle(this.verifyCode,2,this.Secondnum(this.lastnum),4,this.Secondnum(this.lastnum+1),this.lastnum)
        if(this.checkverifyCode){
          if(this.webcheckPossword(this.passWord) && this.webcheckPossword(this.confirmPassword)){
            let CodeHandleverifyCode = this.CodeHandle(this.verifyCode,2,this.Secondnum(this.lastnum),4,this.Secondnum(this.lastnum+1),this.lastnum)
            let encrypted = this.plus.encrypt(CodeHandleverifyCode)
            let plusPassword = this.plus.encrypt(this.passWord)
            let plusconfirmPassword = this.plus.encrypt(this.confirmPassword)
            if(this.passWord == this.confirmPassword ){
              this.$axios.post('register',{mobile: this.getPhoneNumber, code: encrypted, password: plusPassword,repeatPwd: plusconfirmPassword, inviteCode: this.inviteWord}).then(res => {
                  localStorage.setItem('token',res.data.data.token)
                  // let reduce = new JSEncrypt()
                  // reduce.setPrivateKey(this.privateKey)
                  // let token = reduce.decrypt(res.data.data.token)
                  // console.log(token)
                  // document.cookie = 'token=' + token
                  // sessionStorage.setItem('payPasswordExist',res.data.data.payPasswordExist + '')
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
                message: '密码不一致，请重新输入',
                position: 'middle',
                duration: 1000
              })
            }
          }else{
            Toast({
              message: '密码最少6位',
              position: 'middle',
              duration: 1200
            });
          }
        }else{
          Toast({
            message: '验证码有误，请重新获取',
            position: 'middle',
            duration: 1200
          });
        }
      }
    },
    mounted() {
      this.plus = new JSEncrypt()
      this.lastnum = Math.floor(Math.random()*9+1);
      console.log(this.lastnum)
      console.log(this.Secondnum(this.lastnum))
    }
  }
</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
}

</style>
