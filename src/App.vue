<template>
  <div id="app">
    <keep-alive :include="$store.state.includedComponents">
      <router-view ></router-view>
    </keep-alive>
    <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/*   */
#app {
  height: 100%;
}
body,html {
  -webkit-overflow-scrolling: touch;
}

/*修改mint默认样式*/
.mint-msgbox{
  width: 5.5rem;
}
.mint-msgbox-btn{
  border-width: 1px;
}
.mint-swipe-indicator {
  width: .08rem;
  height: .08rem;
  opacity: .5;
  background: #FFF;
}
.mint-swipe-indicator.is-active {
  opacity: 1;
  width: .12rem;
  height: .12rem;
}
.mt-range {
  margin-top: .2rem;
}
.mt-range-content {
  margin-right: 0.2rem;
}
/*滑块*/
.mt-range-thumb{
  top: 50%;
  padding: 0.1rem;
  transform: translate(-0.15rem, -50%);
  width: 0.3rem;
  height: 0.3rem;
  background: #1BA5FD;
  background-clip: content-box;
  /* box-shadow: 0 2px 5px 0 rgba(70,128,255,0.40); */
  box-shadow: none;
}
.mt-range-runway {
  width: 2.8rem;
  height: .3rem;
  background: url(./assets/range-runway.png) no-repeat;
  background-size: 100% 100%;
  border: 0;
}
.mt-range-progress {
  max-width: 100%;
  height: .3rem!important;
  background: url(./assets/range-progress.png) no-repeat;
  background-size: 2.8rem .3rem;
  border: 0;
}
.start{
  position: absolute;
  top: .3rem;
  font-size: .20rem;
  color: #626262;
  letter-spacing: 0.56px;
  text-align: center;
}
.end{ 
    position: absolute;
    top: .3rem;
    right: 0;
    font-size: .20rem;
    color: #626262;
    letter-spacing: 0.56px;
    text-align: center;
}
/* .orderToast {
  top: 25%!important;
} */
/* .mint-toast-icon {
  display: block;
  width: .8rem;
  height: .8rem;
  background: url('../assets/toast-icon.png') no-repeat;
  background-size: .8rem .8rem;
}  */
::-webkit-scrollbar {display:none}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
}
</style>
