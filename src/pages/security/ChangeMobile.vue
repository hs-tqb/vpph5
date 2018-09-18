<template>
  <div>
    <header class="pubHead">
      <button @click="back" class="PubHeadBack"></button>
    </header>
    <div class="pubTit">
      <img src="../../assets/telIcon.png" alt="">
      <h1>更换手机号</h1>
    </div>
    <form class='pg4'>
      <section class="input_container area">
        <label for="area">国家/地区</label>
        <p id="area" @click="showCountry">{{countryName}}</p>
      </section>
      <section class="input_container phone_number">
        <label for="phoneNumber">手机号</label>
        <input type="number" placeholder="请输入手机号" required name="phone" v-model="phoneNumber" id="phoneNumber" @mousewheel.prevent >
      </section>
      <section class="input_container varifyCode">
        <label for="verifyCode">验证码</label>
        <button @click.prevent="checkMobile"  :class="{right_phone_number: rightPhoneNumber,get_code:getcode}" v-show="!computedTime">获取验证码</button>
        <button @click.prevent v-show="computedTime" disabled>已发送({{computedTime}}s)</button>
        <input type="number" maxlength="4" placeholder="请输入验证码" name="verifyCode" id="verifyCode" v-model="verifyCode" @mousewheel.prevent>
      </section>
    </form>
    <button @click="changeMobile" class="btn_login" :disabled="!this.Allinput" :class='{high:this.Allinput}'>确认</button>
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
        phoneNumber: '',
        getcode:false,
        verifyCode: '',
        rightPhoneNumber: true,
        computedTime: 0,
        timer: null,
        countryName: '中国',
        showCountryList: false,
        securityToken: '',
        publicKey: '',
        newpublicKey: '',
        newprivateKey: ' ',
        newplus:'',
        newplusMobile: ''
      }
    },
    components: {
      getCountry
    },
    watch: {
      phoneNumber(){
        this.phoneNumber.length != 0 ? this.getcode = true : this.getcode = false
      }
    },
    computed: {
      getPhoneNumber() {
        return this.countryCode + this.phoneNumber
      },
      Allinput() {
        if(this.countryCode.length != 0 && this.phoneNumber.length != 0 && this.verifyCode.length != 0){
          return true
        }else return false
      }
    },
    methods: {
      back() {
        this.$router.go(-1)
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
      getVerifyCode() {
          this.$axios.post('getPublicKey', {mobile: this.getPhoneNumber}).then(res => {
            this.newpublicKey = res.data.data.publicKey
            this.newprivateKey = res.data.data.privateKey
          
            this.computedTime = 30;
            this.timer = setInterval(() => {
                this.computedTime --;
                if (this.computedTime == 0) {
                    clearInterval(this.timer)
                }
            }, 1000)
            this.newplus.setPublicKey(this.newpublicKey)
            this.newplusMobile = this.newplus.encrypt(this.getPhoneNumber)
            this.$axios.post('getMobileCode', {mobile: this.getPhoneNumber, skey: this.newplusMobile}).then(res => {
              
            })
          })
        },
      changeMobile() {
        let plus = new JSEncrypt()
        plus.setPublicKey(this.publicKey)
        let encrypted = plus.encrypt(this.getPhoneNumber)
        this.$axios.post('updateMobile', {securityToken: this.securityToken,newMobile: encrypted, code: this.verifyCode}).then(res => {
            Toast({
              message: '修改成功，请成功登陆',
              position: 'top',
              duration: 1200
            });
            this.$delCookie('token')
            this.$router.replace('/login')
          // this.phoneNumber = ''
          // this.verifyCode = ''
          // this.rightPhoneNumber = true
          // this.showPage = -1
        })
      },
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
      }
    },
    created(){
      this.securityToken = sessionStorage.getItem('securityToken');
      this.publicKey = localStorage.getItem('publicKey')
    },
    mounted(){
        this.newplus = new JSEncrypt()
    }
  }
</script>

<style scoped>
.pubHead{
  padding: .3rem .4rem .62rem;
  border: 0;
}
.pubTit{
  margin-bottom: .6rem;
}
</style>
