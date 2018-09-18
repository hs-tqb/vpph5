<template>
  <div>
    <header class="pubHead">
      <button @click="back" class="PubHeadBack"></button>
    </header>
    <div class="pubTit">
      <img src="../../assets/security.png" alt="">
      <h1>安全中心</h1>
    </div>
    <ul class='pubList pg4'>
      <li>
        <router-link to="/validateMobile">
          更换手机号
          <span>{{this.phoneNumber}}</span>
        </router-link>
      </li>
      <li>
        <router-link to="/validatePassword">登录密码设置</router-link>
        <!-- resetPassword -->
      </li>
      <li>
        <router-link to="/validatePaypassword">支付密码设置</router-link>
        <!-- resetPayPassword -->
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        phoneNumber: ''
      }
    },
    methods:{
      back() {
        this.$router.go(-1)
      }
    },
    created() {
      this.phoneNumber = localStorage.getItem('phoneNumber')
    }
  }
</script>

<style scoped>
.pubHead{
  padding: .3rem .4rem .62rem;
  border: 0;
}
.pubList li a::before{
  right: 0;
}
</style>
