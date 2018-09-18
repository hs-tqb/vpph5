<template>
  <div>
    <header class="pubHead">
      <button @click="back" class="PubHeadBack"></button>
      重置登陆密码
    </header>
    <div class='resetPassword pg4'>
      <input type="password" placeholder="请输入登陆密码" v-model="newPassword" maxlength="12" minlength="6">
      <input type="password" placeholder="再次输入登陆密码" v-model="confirmPassword" maxlength="12" minlength="6">
      <p>密码格式为6-12位数字或字母</p>
      <button @click="updatePassword" class='btn_login' :disabled="!this.Allinput" :class='{high:this.Allinput}'>确认</button>
    </div>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui'
  export default {
    data() {
      return {
        newPassword: '',
        confirmPassword: '',
        publicKey: '',
        securityToken: ''
      }
    },
    computed: {
        Allinput(){
          if(this.newPassword.length>=6&&this.confirmPassword.length>=6){
            return true
          }else return false
        }
    },
    methods: {
      back() {
        this.$router.go(-1)
      },
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
        } else return true
      },
      updatePassword() {
        let plus = new JSEncrypt()
        plus.setPublicKey(this.publicKey)
        let plusnewPassword = plus.encrypt(this.newPassword)
        let plusconfirmPassword = plus.encrypt(this.confirmPassword)
        if(this.newPassword == this.confirmPassword){
          if(this.webcheckPossword(this.newPassword)&&this.webcheckPossword(this.confirmPassword)){
            this.$axios.post('updatePassword',{securityToken: this.securityToken,newPassword: plusnewPassword, repeatPwd: plusconfirmPassword}).then(res => {
              Toast({
                message: '修改成功，请成功登陆',
                position: 'top',
                duration: 1200
              })
              localStorage.clear()
              this.$router.replace('/login')
            })
          }else{
            Toast({
              message: '密码格式为数字，字母（包含大小)',
              position: 'middle',
              duration: 1200
            });
          }
        }else{
          Toast({
            message: '密码不一致，请重新输入',
            position: 'middle',
            duration: 1200
          })
        }
      }
    },
    created() {
      this.securityToken = sessionStorage.getItem('securityToken');
      this.publicKey = localStorage.getItem('publicKey')
    }
  }
</script>

<style scoped>
.btn_login{
  margin-top: 1rem;
}
</style>
