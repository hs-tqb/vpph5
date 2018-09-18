<template>
  <div class="container">
    <header>
      <div class='menu' @click='showMenu' ></div>
      <div >
        <span @click="showAllProduct">{{productList[headerShow].productId}}</span><i :class="arrow" @click="showAllProduct"></i>
      </div>
      <div class="help-btn" @click="showHelp"></div>
    </header>
    <menu-box v-if='menuShow' @closeMenu='closeMenu'  :crtInd = "index"></menu-box>
    <div class="product-group" v-show="arrowDirection">
      <div class="btn-group">
        <button v-for="(item,index) in productList" :key="index" @click="turnTo(index)" :class="{active: headerShow === index}">{{item.productId}}</button>
      </div>
      <div class="pop" @click="showAllProduct"></div>
    </div>
    
    <div class="product"> 
      <keep-alive>
        <bj-box v-for="(item,index) in productList" v-if="index === currentIndex" :key="index" :product="item" ref="products"></bj-box>
      </keep-alive>
    </div>
    <div class="help" v-if="helpShow">
      <div class="help-box">
        <div class="help-header">说明<span class="close-btn" @click="closeHelp"></span></div>
        <div class="help-content">
          <h3>{{helpMesArr[0]}}</h3>
          <p v-for="(item, index) in helpMesArr.slice(1)" :key="index">{{item}}</p> 
        </div>
        <div class="help-confirm">
          <button @click="closeHelp">确定</button>  
        </div>  
      </div>
    </div>
    <!-- test -->
  </div>
</template>

<script>
  const bjBox = () => import('@/components/Bijia2')
  import menuBox from '@/components/Menu'
  export default {
    data() {
      return {
        productList: [{}],
        currentIndex: -1,
        menuShow: false,
        index: 2,
        test: null,
        arrowDirection: false,
        helpShow: false,
        helpMes: '',
        adMes: ''
      }
    },
    components: {
      bjBox,
      menuBox
    },
    computed: {
      headerShow() {
        return this.currentIndex < 0 ? 0 : this.currentIndex
      },
      arrow() {
        return this.arrowDirection ? 'up-arrow' : 'down-arrow'
      },
      helpMesArr() {
        return this.helpMes.split('\r\n')
      }
    },
    methods: {
      showHelp() {
        this.helpShow = true 
      },
      closeHelp() {
        this.helpShow = false
      },
      showMenu(){
        this.menuShow = !this.menuShow
      },
      closeMenu(){
        this.menuShow = !this.menuShow
      },
      turnTo(index) {
        this.currentIndex = index
        this.arrowDirection = !this.arrowDirection
      },
      showAllProduct() {
        this.arrowDirection = !this.arrowDirection
      },
      // stop() {
      //   var mo=function(e){e.preventDefault();}
      //   document.body.style.overflow='hidden'
      //   document.addEventListener("touchmove",mo,false)
      // },
      // move(){
      //   var mo=function(e){e.preventDefault();}
      //   document.body.style.overflow=''
      //   document.removeEventListener("touchmove",mo,false)
      // }
    },
    name: 'transaction',
    created() {
      this.$axios.post('getList',{}).then(res => {
        this.productList = res.data.data.product
        this.helpMes = res.data.data.help
        this.currentIndex = 0
      })
      this.$nextTick(() => {
        window.addEventListener("beforeunload",()=>{
        if (this.currentIndex != -1){
          this.$refs.products.forEach(item => {
            item.saveStorage()
          })
        }
      })
    })
    },
    deactivated() {
      this.menuShow = false
    }
    // beforeRouteEnter(to, from, next) {
      
    // } 
  }
</script>

<style scoped>
header {
  position: relative;
  height: .89rem;
  line-height: .89rem;
  width: 100%;
  font-family: PingFangSC-Medium;
  font-size: .26rem;
  color: #3F4D68;
  letter-spacing: 0.22px;
  text-align: center;
}
header .menu{
  position:absolute;
  left:.3rem;
  top:50%;
  transform: translateY(-50%);
  width: .45rem;
  height: .38rem;
  background:url(../assets/menuIcon-black.png) no-repeat center;
  background-size: cover;
}
header .down-arrow {
  display: inline-block;
  margin-left: .11rem;
  width: .15rem;
  height: .15rem;
  background: url('../assets/down-arrow.png') no-repeat;
  background-size: .14rem .10rem;
  background-position: left;
}
header .up-arrow {
  display: inline-block;
  transform: rotate(180deg);
  margin-left: .11rem;
  width: .15rem;
  height: .15rem;
  background: url('../assets/down-arrow.png') no-repeat;
  background-size: .14rem .10rem;
  background-position: left;
}
header .help-btn{
  position: absolute;
  width: .35rem;
  height: .35rem;
  top: .27rem;
  right: .3rem;
  background: url('../assets/help.png') no-repeat;
  background-size: cover;
}
.help {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.5)
}
.help-box {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 6.6rem;
  height: 8.2rem;
  margin: auto;
  background-color: #FFFFFF;
  background:url('../assets/white.png') 1px 1px repeat;
  border-radius: .14rem;
  border: 1px solid #BDC6CF;
}
.help-header {
  position: relative;
  margin-top: .4rem;
  height: .4rem;
  width: 100%;
  line-height: .4rem;
  font-size: .32rem;
  color: #000A2E;
  letter-spacing: 0;
  text-align: center;
}
.help-content {
  box-sizing: border-box;
  white-space: pre-line;
  padding: .3rem .37rem;
  height: 6.4rem;
  font-size: .28rem;
  color: #00002C;
  letter-spacing: 0.5px;
  line-height: .46rem;
  border-bottom: 1px solid #eee;
  overflow-y: auto;
}
.help-content p{
  text-align: left;
}
.help-content h3 {
  font-weight: 700;
}
.help-confirm {
  position: relative;
  width: 100%;
  height: 1rem;
}
.help-confirm button{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  font-size: .30rem;
  color: #1BA5FD;
  letter-spacing: .1rem;
  text-align: center;
  line-height: .36rem;
}

.close-btn {
  position: absolute;
  right: .3rem;
  width: .42rem;
  height: .42rem;
  background: url('../assets/close.png') no-repeat;
  background-size: .3rem .3rem;
  background-position: center center;
}
.container {
  position: relative;
  height: 100%;
}
.product-group {
  position: absolute;
  top: .89rem;
  left: 0;
  height: 100%;
  z-index: 20000;
  background:rgba(0,0,0,.5);
  display: flex;
  flex-direction: column;
}
.btn-group {
  padding: .35rem 0;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  background: #FFFFFF;
  border-top: 2px solid rgba(238,238,238, .5);
}
.product-group button {
  width: 1.8rem;
  height: .69rem;
  background: #EEEEEE;
  opacity: 0.5;
  border-radius: .04rem;
  margin: .25rem;
  font-size: .24rem;
  color: #9DA1A9;
  letter-spacing: 1px;
}
.product-group button.active {
  background: #1BA5FD;
  opacity: 1;
  font-size: .26rem;
  color: #FFFFFF;
  letter-spacing: 1.08px;
}
.pop {
  flex: 1;
}
.product {
  width: 100%;
  height: calc(100% - .94rem);
  border-top: 1px solid #EEEEEE;

}
/* .product-trend {
  height: 6.97rem;
} */
</style>
