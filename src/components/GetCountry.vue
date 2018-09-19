<template>
    <div class="container">
      <header class="pubHead">
        <button @click="back" class="PubHeadBack"></button>
        选择国家
      </header>
      <div class="search-container">
        <input type="text" v-model="value">
        <p class="placeholder" v-show="value.length === 0"><i class="icon-search"></i>国家搜索</p>
      </div>
      <div class="nav-container" ref="nav">
        <ul>
          <li v-for="(item, index) in countryListNav" :key="index" @click="chooseGroup(item)" >
            {{item}}
          </li>
        </ul>
      </div>
      
        <div ref="wrapper" class="list-container" @mousewheel.prevent>
          <ul class="group-container" ref="listGroup">
            <li v-for="(group, a) in searchLetters" :key="a" :id="group.letter" v-if="group.countries.length != 0">
              <h2 class="group-title">{{group.letter}}</h2>
              <ul class="item-container">
                <li class="country-item" v-for="(item, b) in group.countries" :key="b" @tap="chooseCountry(item)">
                  {{item.cnName}}
                </li>
              </ul>
            </li>
          </ul>
        </div> 
    </div>
</template>

<script>
import pinyin from '@/config/pinyin'
import Bscroll from 'better-scroll'

  export default {
    data() {
      return {
        letters: [],  //数据处理数组
        countryList: {},  //原始数据数组
        value: '',
        searchLetters: [], //列表渲染数组
        scrollY: 0,
      }
    },
    components: {
      Bscroll
    },
    computed: {
      countryListNav() {
        return this.letters.map(item => {
          return item.letter
        })
      }
    },
    methods: {
      back() {
        this.$emit('closeCountryList')
      },
      chooseGroup(item) {
        let groupDom = '#' + item
        this.scroll.scrollToElement(groupDom)
      },
      chooseCountry(a) {
        this.$emit('countryCode', a)
      },
      search() {
        //每次搜索重置渲染数组
        for (let i=0; i < this.letters.length; i++) {
          let item = {letter: this.letters[i].letter, countries: []}
          this.searchLetters.push(item)
          this.searchLetters[i].countries = this.letters[i].countries.filter(item => {
            console.log('search')
            return item.pinyin.indexOf(this.value) != -1
          })
        }
      },
    },
    created() {
      //获取数据
      this.$axios.post('getCountryList',{}).then(res => {
        this.countryList = res.data.data
        //添加拼音属性
        this.countryList.rows.forEach(item => {
          item.pinyin = pinyin(item.cnName)
        });
        let countryLetters = this.countryList.rows.map(item => item.initial)
        let lettersArr = [...new Set(countryLetters)]
        for (let l of lettersArr) {
          let countryArr = this.countryList.rows.filter(item => item.initial === l)
          let letterItem = {
            letter: l,
            countries: countryArr
          }
	      this.letters.push(letterItem)
        }
        this.search()
        this.$nextTick(() => {
          this.scroll = new Bscroll(this.$refs.wrapper, {
            probeType : 2,
            mouseWheel: true,
            tap: true
          })
          this.scroll.on('scroll', (pos) => {
            this.scrollY = Math.abs(Math.round(pos.y))
          })
        })
      })
    },
    watch: {
      //监听搜索输入变化
      value : function(newVal,oldVal) {
        this.search()
      }
    }
  }
</script>

<style scoped >
  /* header */
  .pubHead{
    border-bottom: 0 solid #EEE;
  }
  /* search */
  .search-container {
    position: relative;
    box-sizing: border-box;
    padding: .15rem .3rem;
    height: .95rem;
    background: rgba(238,238,238, .5);
  }
  .search-container input {
    text-indent: .2rem;
    height: .65rem;
    width: 100%;
    line-height: .65rem;
    border-radius: .04rem;
    background: #fff;
  }
  .placeholder { 
    position: absolute;
    top: .31rem;
    left: .98rem;
    font-family: PingFangSC-Regular;
    font-size: .24rem;
    color: #CFCFD8;
  }
  .icon-search {
    position: absolute;
    left: -0.45rem;
    top:50%;
    transform:translateY(-50%);
    width: .35rem;
    height: .35rem;
    background: url('../assets/search.png') no-repeat center;
    background-size: cover;
  }
  .container {
    position: absolute;
    background: #fff;
    top: 0;
    left: 50%;
    width: 100%;
    max-width: 640px;
    height: 100%;
    transform: translateX(-50%);
  }
  /* list */
  .nav-container {
    position: absolute;
    top: 2.71rem;
    right: .17rem;
    z-index: 5;
    font-family: PingFangSC-Regular;
    font-size: .22rem;
    color: #1BA5FD;
    text-align: center;
    line-height: .32rem;
  }
  .list-container{
    background: #fff;
    height:calc(100% - 1.84rem);
    overflow-y: auto
  }
  .group-title {
    text-indent: .4rem;
    background: rgba(238,238,238, .5);
    height: .5rem;
    line-height: .5rem;
    font-family: PingFangSC-Regular;
    font-size: .24rem;
    font-weight: 500;
    color: #9DA1A9;
  }
  .country-item{
    margin-left: .3rem;
    height: .8rem;
    line-height: .8rem;
    font-family: PingFangSC-Regular;
    font-size: .28rem;
    color: #3F4D68;
    border-bottom: 1px solid rgba(238,238,238, .5)
  }
  ::-webkit-scrollbar {display:none}
</style>

