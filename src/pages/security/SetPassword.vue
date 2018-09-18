<template>
  <div>
    <header>密码设置</header>
      <button @click="back">返回</button>
      <div>
        <router-link to="/resetPassword">重置登陆密码</router-link>
      </div>
      <div>
        <router-link to="/resetPayPassword">重置支付密码</router-link>
      </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    methods: {
      back() {
        this.$router.go(-1)
      },
    }
  }
</script>

<style scoped>

</style>
