<template>
  <div class="menu">
      <ul>
        <li :class="{crt:crtInd===1}">
          <router-link to="/" >首页</router-link>
        </li>
        <li :class="{crt:crtInd===2}">
          <router-link to="/transaction" >交易</router-link>
        </li>
        <li :class="{crt:crtInd===3}">
          <router-link to="/user">账户</router-link>
        </li>
      </ul>
      <div class="mask" @click='closeMenu'></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        
      }
    },
    props:['crtInd'],
    methods: {
      closeMenu(){
        this.$emit('closeMenu');
      }
    }
  }
</script>

<style scoped>
.menu{
  position:fixed;
  left:50%;
  top:0;
  z-index: 20001;
  width:100%;
  max-width: 640px;
  height:100%;
  overflow: hidden;
  transform: translateX(-50%);
}
.menu ul{
  float: left;
  width:40%;
  height:100%;
  padding-top: .42rem;
  background: #fff;
  box-sizing: border-box;
}
.menu li{
  width: 100%;
  line-height: 1rem;
  font-size: .32rem;
  color: #626262;
  text-align: center;
}
.menu li.crt{
  background: #F6F6F6;
  color: #1BA5FD;
}
.menu .mask{
  float: right;
  width:60%;
  height:100%;
  background:rgba(0, 0, 0, 0.5);
}

</style>
