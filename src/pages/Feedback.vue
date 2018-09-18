<template>
  <div>
    <header>反馈</header>
    <button @click="back">返回</button>
    <section>
      <label for="suggestion">问题和建议</label>
      <textarea name="suggsetion" id="suggestion" cols="30" rows="10" placeholder="请输入您宝贵的建议" v-model="suggestion"></textarea>
    </section>
    <section>
      <label for="email">邮箱</label>
      <input type="email" id="email" v-model="email" placeholder="方便我们和您联系">
    </section>
    <section>
      <button @click="submit">提交</button>
    </section>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        suggestion: '',
        email: ''
      }
    },
    methods: {
      back() {
        this.$router.go(-1)
      },
      submit() {
        this.$axios.post('insert',{title: this.email, description: this.suggestion}).then(res => {
          console.log(res.data.data)
        })
      }
    }
  }
</script>

<style scoped>

</style>
