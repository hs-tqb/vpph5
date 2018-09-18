<template>
  <div>
    <header class="pubHead">
      <button @click="back" class="PubHeadBack"></button>
      重置支付密码
    </header>
    <div class='resetPassword pg4'>
      <input type="password" placeholder="请输入支付密码" v-model="newPayPassword" maxlength="6" onKeypress="if((event.keyCode<48 || event.keyCode>57)) event.returnValue=false">
      <input type="password" placeholder="再次输入支付密码" v-model="confirmPayPassword" maxlength="6" onKeypress="if((event.keyCode<48 || event.keyCode>57)) event.returnValue=false">
      <p>密码格式为6数字</p>
      <button @click="updatePayPassword" class='btn_login' :disabled="!this.Allinput" :class='{high:this.Allinput}'>确认</button>
    </div>
  </div>
</template>

<script>
  import { Button,Toast } from 'mint-ui';
  export default {
    data() {
      return {
        newPayPassword: '',
        confirmPayPassword: '',
        publicKey: '',
        securityToken: ''
      }
    },
    computed: {
        Allinput(){
          if(this.newPayPassword.length>=6&&this.confirmPayPassword.length>=6){
            return true
          }else return false
        }
    },
    methods: {
      back() {
        this.$router.go(-1)
      },
      webcheckPossword(obj){
        let rexp = '[^0-9]'
        let rex = new RegExp(rexp)
        if (rex.test(obj)) {
            Toast({
              message: '密码格式为数字',
              position: 'middle',
              duration: 1200
            });
            return false
        } else return true
      },
      updatePayPassword() {
        let plus = new JSEncrypt()
        plus.setPublicKey(this.publicKey)
        let plusnewPayPassword = plus.encrypt(this.newPayPassword)
        let plusconfirmPayPassword = plus.encrypt(this.confirmPayPassword)
        if(this.newPayPassword == this.confirmPayPassword){
          if(this.webcheckPossword(this.newPayPassword)&&this.webcheckPossword(this.confirmPayPassword)){
            this.$axios.post('updatePayPassword',{securityToken: this.securityToken,newPayPassword: plusnewPayPassword, repeatNewPayPwd: plusconfirmPayPassword}).then(res => {
              console.log(res.data.data)
              // this.showPage = 1
              Toast({
                message: '修改成功',
                position: 'top',
                duration: 1200
              })
              this.$router.replace('/security')
            })
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
      console.log(this.securityToken)
      this.publicKey = localStorage.getItem('publicKey')
    }
  }
</script>

<style scoped>

</style>
