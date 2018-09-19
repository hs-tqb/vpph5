<template>
  <div class="bj-container">
    <div class="bj_box" ref="mychart"></div>
    
    <section class="operation">
      <div class="switch">
        <div class="transaction-btn " :class="{active: orderShow === 0}" @click="changeShow(0)">
          交易
        </div>
        <div class="orderlist-btn" :class="{active: orderShow === 1}" @click="changeShow(1)" >
          订单
        </div>
      </div>
      <div class="order-container" v-if="orderShow === 0">
        <div class="amount-container">
          <div class="orderAmount">
            <label for="orderAmount">下单金额</label>
            <input type="tel" v-model="orderAmount" id="orderAmount" onKeypress="if((event.keyCode<48 || event.keyCode>57)) event.returnValue=false">
             <!--  -->
            <!-- <input type="text" v-model="orderAmount" id="orderAmount" onkeyup="this.value=this.value.replace(/\D/g,'')" > -->
            <div> 
              <mt-range  v-model="orderAmount" :min="0" :max="parseInt(balance)">
                  <div slot="start" class="start">0</div>
                  <div slot="end" class="end">{{Math.floor(this.balance)}}</div>
              </mt-range>
            </div>
            <!-- <div class="scope">0 - {{balance}}</div> -->
          </div> 
          <div class="expect">
            预期收益 <span>{{toBenefit}} VPP</span>
          </div>
        </div>
        <div class="btn-group">
          <button @click="order(0)" class="up">涨<i class="arrow-up"></i></button>
          <button @click="order(1)" class="down">跌<i class="arrow-down"></i></button>
        </div>
      </div>
      <div class="order-list" v-else>
        <order-list></order-list>
      </div>
    </section>
    <!-- test -->
  </div>
</template>

<script>
// var echarts = require('echarts')
//按需引入echarts
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/markLine')
require('echarts/lib/component/markArea')
require('echarts/lib/component/markPoint')

import { Toast } from 'mint-ui'
import { MessageBox } from 'mint-ui';

import orderList from './PartOrderList'

  export default {
    data() {
      return {
        data: [],
        myChart: {},
        websocket: null,
        isOrder: false,
        orderPoint: [],
        index: 0,
        orderAmount: 10,
        timePoint: [],
        clickTimeout: false,
        balance: 0,
        orderShow: 0,
        newestOrderTime: 0,
        getHeight: 667,
        payPasswordExist: null
      }
    },
    //父组件传递组件信息
    props: [ 'product' ],
    components: {
      orderList
    },
    computed: {
      orderAmountInt() {
        return parseInt(this.orderAmount)
      },
      getCountDown() {
        let count = this.data[this.data.length - 2].value[0] - this.newestOrderTime
        if(this.newestOrderTime && count < 16){
          return count
        }else{
          return false
        }
      },
      getFontSize() {
        return parseInt(document.documentElement.style.fontSize)
      },
      toBenefit() {
        return (this.orderAmount * 1.8).toFixed(2)
      },
      //echarts初始opt
      opt() {
        let fontSize = this.getFontSize
        let that = this;
        let obj = {
          xAxis: {
            type: 'time',
            // boundaryGap: ['20%', '20%'],
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              length: 0
            },
            axisLabel: {
              margin: 5,
              show: false
            },
            // 坐标间距
            interval: 10 * 1000,
           },
          grid: {
            show: true,
            borderWidth: 0,
            top: '-1',
            bottom: 0.5*fontSize + '',
            left: '0',
            right: '0'
          },
          yAxis: {
            type: 'value',
            // 坐标轴范围
            min: function(value) {
              return value.min*0.9995;
            },
            max: function(value) {
              return value.max*1.0005;
            },
            // 轴标签前横线
            axisTick: {
              length: 0
            },
            // 轴标签样式
            axisLabel: {
              inside: true,
              margin: fontSize*0.97,
              color: '#0D497E',
              fontSize: 0.22*fontSize,
              formatter: function(val) {
                val = val / 1000000
                let valStr = val + ''
                if(valStr.length >=7){
                  valStr = valStr.slice(0, 10)
                  return valStr
                }else{
                  return (Math.floor(val * 100)/100).toFixed(2)
                }
              },
              showMinLabel: false,
              showMaxLabel: false
            },
            // 轴线样式
            axisLine: {
              lineStyle: {
                width: 0
              }
            },
            position: 'right',
            // 坐标轴网线
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(185,189,201,.5)'
              }
            },
            z:3
          },
          series: [{
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: that.data,
            animation: false,
            // smooth: '0.3',
          //标线
            markLine: {
              symbol: ['none', 'none'],
            },
          //填充
            areaStyle:{
              color: {
                type: 'linear',
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                colorStops: [{
                    offset: 0, color: '#ffffff' 
                }, {
                    offset: 0.87, color: 'rgba(70,128,255,.5)' 
                }],
                globalCoord: false 
            }
            },
            lineStyle:{
              color: 'rgba(70,128,255,.8)',
              width: 1
            }
          }]
        }
        return obj
      },
      //websocket断线检测
      heartCheck() {
        let that = this
        let obj = {
          timeout: 3000,
          timeoutObj: null,
          reset: function() {
            clearTimeout(this.timeoutObj)
            return this;
          },
          start: function() {
            this.timeoutObj = setTimeout(function() {
              that.data = []
              console.log('close')
              that.websocket.close()
            }, this.timeout)
          }
        }
        return obj
      },
      //websocket心跳发送
      keepAlive() {
        let that = this
        let obj = {
          timeout: 90000,
          timeoutObj: null,
          reset: function() {
            clearTimeout(this.timeoutObj)
            return this;
          },
          start: function() {
            that.websocket.send(that.str2utf8('keep'))
            this.timeoutObj = setTimeout(function() {
              that.websocket.send(that.str2utf8('keep'))
            }, this.timeout)
          }
        }
        return obj
      }
    },
    methods: {
      test(e) {
        console.log(e)
      },
      //输入排除e
      inputCheck(e) {
        console.log(e)
        // if(e.key === 'e') {
        //   this.orderAmount = this.orderAmount.slice(0,-1)
        //   console.log('ok')
        // }
        // return (/[\d]/.test(e.key))
      },
      changeShow(a) {
        this.orderShow = a
      },
      // echarts初始化
      setEchart() {
        let dom = this.$refs.mychart
        this.myChart = echarts.init(dom)
        this.myChart.setOption(this.opt)
      },
      // echarts更新函数
      updateEchart() {
        // console.log(this.data)
        let fontSize = this.getFontSize

        let pval = this.data[this.data.length-2].value[1]
        let tval = this.data[this.data.length-2].value[0]

        let opt = {
          series: [{
            data:this.data,
            markLine: {
              symbol: ['none','none'],
              silent: true,
              data: [{
                name: 'yAxis标线',
                yAxis: pval,
                lineStyle: {
                  color: '#4680FF',
                  width: 1,
                  type: 'solid'
                }
              },{
                name: '右边',
                xAxis:  this.data[this.data.length - 2].value[0],
                lineStyle: {
                  color: 'rgba(0,205,255,.5)',
                  width: 2,
                  type: 'solid'
                },
              }],
              label: {
                formatter: function(a) {
                  return (a.value / 1000000)
                }
              }
            },
            markPoint: {
              data: [
                {
                  symbol: 'circle',
                  symbolSize: 0.20*fontSize,
                  coord: [tval, pval],
                  itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: '#9695F9' 
                        }, {
                            offset: 1, color: '#5176F5' 
                        }],
                        globalCoord: false 
                    }
                  },
                  label: {
                    show: true,
                    position: [0.18*fontSize, 0.22*fontSize],
                    distance: 3,
                    color: '#fff',
                    formatter: function(){
                      let val = pval/1000000
                      let valStr = val + ''
                      if(valStr.length>9){
                        valStr = valStr.slice(0, 10)
                        return valStr
                      }else{
                        return val.toFixed(2) + ''
                      }
                    },
                    backgroundColor: '#4680FF',
                    borderRadius: 4,
                    fontSize: fontSize*0.22,
                    padding: fontSize*0.03,
                    align: 'center'
                  }
                }
              ]
            },
            // markArea: {
            //   itemStyle: {
            //     color: 'rgba(26,189,122,.1)'
            //   },
            //   data: [
            //    [{
            //       xAxis: this.data[this.data.length - areaRight].value[0]
            //     },{
            //       xAxis: this.data[this.data.length - areaLeft].value[0]
            //     }]
            //   ]
            // }
          }]
        } 

        if(this.newestOrderTime && (this.data[this.data.length -2].value[0] - this.newestOrderTime < 16000)) {
          let countDown = this.data[this.data.length -2].value[0] - this.newestOrderTime
          let areaRight = 2
          let areaLeft = 17 - countDown/1000
          opt.series[0].markArea = {
            itemStyle: {
                color: 'rgba(26,189,122,.1)'
            },
            data: [
              [{
                 xAxis: this.data[this.data.length - areaRight].value[0]
               },{
                 xAxis: this.data[this.data.length - areaLeft].value[0]
               }]
            ],
            z: 5
          }
           opt.series[0].markPoint.data.push({
             x: 5.1*fontSize,
             y: 0.4*fontSize, 
             symbol: 'circle',
             symbolSize: 1,
             itemStyle: {
             },
             label: {
               show: true,
               position: 'inside',
               formatter: function() {
                 return '倒计时\n(' + (15 -countDown/1000) +'s)'
               },
               fontSize: .22*fontSize,
               color: 'rgba(13,73,126,1)',
             },
             
           })
        }else {
          opt.series[0].markArea = {
            itemStyle: {
                color: 'rgba(26,189,122,.1)'
              },
              label: {
                show: false
              },
              data: [
               [{
                  xAxis: 0
                },{
                  xAxis: 0
                }]
              ]
          }
        }

          //x轴时间标记
        for(let i = 0; i < this.timePoint.length; i++) {
          let time = this.timePoint[i]
          opt.series[0].markPoint.data.push({
            xAxis: time,
            y: this.getHeight - 5.44*fontSize,
            symbol: 'rect',
            symbolSize: 20,
            itemStyle: {
              color: 'rgba(0,0,0,0)',
            },
            label: {
              color: '#626F8C',
              fontWeight: 500,
              fontSize: 0.22*fontSize + '',
              show: true,
              positon: 'inside',
              formatter: function() {
                let now = new Date(time)
                return now.getHours() + ':' + (now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()) + ':' + (now.getSeconds() ? now.getSeconds(): '00')
              } 
            }
          })
        }

        //下单打点
        for(let i = 0; i < this.orderPoint.length; i++) {
          let item = this.orderPoint[i]
          let imgSrc = './test.png'
          if(item.price) {
            //买涨
            if(item.direction === 0) {
              opt.series[0].markPoint.data.push({
                symbol: 'image://http://pew7m542c.bkt.clouddn.com/%E6%B6%A8.png',
                symbolSize: [0.3*fontSize,0.6*fontSize],
                symbolOffset: [0, '-22%'],
                coord:[item.time, item.price],
                itemStyle: {
                  color: 'rgb(255,0,0)'
                },
                label: {
                  show: true,
                  position: [fontSize*0.38, 0],
                  distance: 3,
                  offset: [0,0],
                  color: '#fff',
                  formatter:function(){
                    let price = (item.price / 1000000)
                    let valStr = price + ''
                    if(valStr.length>9){
                      valStr = valStr.slice(0, 10)
                      return '{val|' + valStr + '}'
                    }else{
                      return '{val|' + price.toFixed(2) + '}'
                    }
                  },
                  rich: {
                    val: {
                      backgroundColor: '#FE3762',
                      borderRadius: 4,
                      fontSize: fontSize*0.22,
                      padding: fontSize*0.03,
                      color: '#fff',
                      align: 'center'
                    }
                  }
                }
              })
              // opt.series[0].markLine.data.push({
              //   yAxis: item.price,
              //   lineStyle: {
              //     color: 'rgb(255,0,0)',
              //     type: 'solid'
              //   },
              //   label: {
              //     show: false
              //   }
              // })
            //买跌
            }else if(item.direction === 1) {
              opt.series[0].markPoint.data.push({
                symbol: 'image://http://pew7m542c.bkt.clouddn.com/%E8%B7%8C.png',
                symbolSize: [0.3*fontSize,0.6*fontSize],
                symbolOffset: [0, '-22%'],
                coord:[item.time, item.price],
                itemStyle: {
                  color: 'rgb(255,0,0)'
                },
                label: {
                  show: true,
                  position: [fontSize*0.38, 0],
                  distance: 3,
                  offset: [0,0],
                  color: '#fff',
                  formatter:function(){
                    let price = (item.price / 1000000)
                    let valStr = price + ''
                    if(valStr.length>9){
                      valStr = valStr.slice(0, 10)
                      return '{val|' + valStr + '}'
                    }else{
                      return '{val|' + price.toFixed(2) + '}'
                    }
                  },
                  rich: {
                    val: {
                      backgroundColor: '#06D4B6',
                      borderRadius: 4,
                      fontSize: fontSize*0.22,
                      padding: fontSize*0.03,
                      color: '#fff',
                      align: 'center'
                    }
                  }
                }
              })
              // opt.series[0].markLine.data.push({
              //   yAxis: item.price,
              //   lineStyle: {
              //     color: 'rgb(0,255,0)',
              //     type: 'solid'
              //   },
              //   label: {
              //     show: false
              //   }
              // })
            //结果点
            }else {
              if(item.result === 1){
                opt.series[0].markPoint.data.push({
                    symbol: 'image://http://pew7m542c.bkt.clouddn.com/%E9%92%B1.png',
                    symbolSize: [0.34*fontSize,0.34*fontSize],
                    symbolOffset: [0, 0],
                    coord:[item.time, item.price],
                    itemStyle: {
                      color: 'rgb(255,0,0)'
                    },
                    label: {
                      show: true,
                      position: [0.2*fontSize, 0.4*fontSize],
                      distance: 3,
                      offset: [0,0],
                      color: '#fff',
                      formatter:function(){
                        return '{val|+' + item.orderAmount + 'VPP}'
                      },
                      rich: {
                        val: {
                          backgroundColor: '#FFD800',
                          borderRadius: 4,
                          fontSize: fontSize*0.22,
                          padding: fontSize*0.03,
                          color: '#fff',
                          align: 'center'
                        }
                      }
                    }
                  })
              }else{
                opt.series[0].markPoint.data.push({
                  symbol: 'circle',
                  symbolSize: 0.17*fontSize,
                  coord:[item.time, item.price],
                  itemStyle: {
                    color: '#BEC4CC'
                  },
                  label: {
                    show: true,
                    position: [0.1*fontSize, 0.22*fontSize],
                    distance: 3,
                    color: '#fff',
                    formatter: function(){
                      let price = (item.price / 1000000)
                      return '0'
                    },
                    backgroundColor: '#BEC4CC',
                    borderRadius: 4,
                    fontSize: fontSize*0.22,
                    padding: fontSize*0.03,
                    align: 'center'
                  }
                })
              }
              // opt.series[0].markLine.data.push({
              //   yAxis: item.price,
              //   lineStyle: {
              //     color: 'rgb(122,122,122)',
              //     type: 'solid'
              //   },
              //   label: {
              //     show: false
              //   }
              // })
            }
          }
        }
        this.myChart.setOption(opt)
      },
      initWebsocket() {
        const wsuri = this.product.dataSource;
        this.websocket = new WebSocket( wsuri )
        this.websocket.onopen = this.websocketOnOpen
        this.websocket.onmessage = this.websocketOnMessage
        this.websocket.onclose = this.websocketOnClose
      },
      websocketOnOpen() {
        console.log('welcome')
        this.heartCheck.reset().start()
      },
      websocketOnMessage(e) {
        this.heartCheck.reset().start()
        const redata = JSON.parse(e.data)
        const length = redata.length
        // console.log(redata)
        //websocket第一个值为数组
        if(Array.isArray(redata)) {
          //判断是否初始化图表
          if(!this.data.length){
            
            if(redata.length === 70 && (redata[length - 1].time - redata[0].time === 69000)) {
              // console.log(1)
              let staTime = parseInt(redata[0].time)
              for(let i =0; i<70; i++) {
                let itemTime = staTime + i*1000
                let itemPrice = parseFloat(redata[i].price) * 1000000
                this.data.push({value:[itemTime, itemPrice]})

                let itemSeconds = new Date(itemTime).getSeconds()
                if( itemSeconds === 0 || itemSeconds === 20 || itemSeconds === 40 ) {
                  this.timePoint.push(itemTime)
                }
              }
              this.data.push({name: 'none',value:[staTime + 75*1000, null]})
            }else{
              this.data = []
              this.timePoint = []
              this.websocket.close()
            }
            // console.log(this.data)
          }else{
            this.data = []
            this.timePoint = []
            this.websocket.close()
            //时间轴标记处理
            // let itemSeconds = new Date(time).getSeconds()
            // if( itemSeconds === 0 || itemSeconds === 20 || itemSeconds === 40 ) {
            //   this.timePoint.push(time)
            // }
            // if(this.timePoint.length && this.timePoint[0] < this.data[0].value[0]) {
            //   this.timePoint.shift()
            // }
          }
        }else{
          // console.log('2:')
          // console.log(this.data)
          // console.log(this.data[69].value[0])
          let time = parseInt(redata.time)
          //防止精度bug,先放大1000000倍再缩小
          let itemsData = this.data
          let price = parseFloat(redata.price) * 1000000
          let currentTime = itemsData[69].value[0] + 1000
          if(time === currentTime) {
            // if (new Date(time).getSeconds() === 0) {
            //   this.$axios.post('getResult',{lotteryTime: time}).then(res => {
            //     if(res.data.data) { console.log(res.data.data.msg) }
            //   })
            // }
            let item = {value:[time, price]}
            this.data.shift()
            this.data.pop()
            this.data.push(item)
            this.data.push({name: 'none',value: [time + 6000, null]})
            //时间轴标记处理
            let itemSeconds = new Date(time).getSeconds()
            if( itemSeconds === 0 || itemSeconds === 20 || itemSeconds === 40 ) {
              this.timePoint.push(time)
            }
            if(this.timePoint.length && this.timePoint[0] < this.data[0].value[0]) {
              this.timePoint.shift()
            }
          }else {
            this.data = []
            this.timePoint = []
            this.websocket.close()
          }
        }
        //加工打点数组
        this.orderPoint = this.orderPoint.filter(item => {
          return item.time >= this.data[0].value[0]
        })
        this.orderPoint.forEach(item => {
          if(item.time <= this.data[this.data.length-2].value[0] && !item.price){
            item.price = this.data.find(a => {
              return a.value[0] === item.time
            }).value[1]
            if(item.direction === 2) {
              let comparePrice = this.data.find(a => {
                return a.value[0] === item.orderTime
              }).value[1]
              if((item.type === 0 && item.price > comparePrice)||(item.type === 1 && item.price < comparePrice)) {
                item.result = 1
                setTimeout(() => {
                  this.$axios.post('findBalance',{}).then(res => {
                  this.balance = res.data.data.balance
                })
                },5000)
                
              }else {
                item.result = 0
              }
            }
          }
          
          
        })
        
        
        this.setEchart()
        this.updateEchart()
      },
      websocketOnClose(e) {
        //正常断线重连
        console.log('connection closed (' + e.code + ')')
        this.initWebsocket()
      },
      //心跳KEEP转换函数
      str2utf8(str) {
        let encoder = new TextEncoder('utf8');
        return encoder.encode(str);
      },
      order(a) {
        //每秒只许下一单
        if(!this.clickTimeout) {
          let that = this
          if(this.payPasswordExist != 1) {
            this.$router.push('/setPayPassword')
          }else{
            if(!this.orderAmount || this.orderAmount*1 < this.product.minBet){
              Toast({
                    message: '下单金额不能小于' + this.product.minBet,
                    position: 'top',
                    duration: 3000
                  })
            }else{
              if(this.orderAmount > this.balance){
              
                MessageBox({
                  title: '余额不足',
                  message: '余额不足:剩余'+ Math.floor(this.balance) + 'VPP',
                  showCancelButton: true,
                  confirmButtonText:'去充币',
                }).then(action => {
                  this.$router.push('/deposit')
                  // console.log('ok')
                },function(){
                  // 取消
                })
                // MessageBox.confirm('余额不足:剩余'+ this.balance + 'VPP','余额不足').then(action => {
                //   this.$router.push('/deposit')
                // });
                // MessageBox.confirm().then(action => {
                //   this.$router.push('/deposit')
                // });
              
              }else{
                this.clickTimeout = true
                setTimeout(function(){
                  that.clickTimeout = false
                }, 1000)
                let orderTime = this.data[this.data.length-2].value[0]
                let orderPrice = this.data[this.data.length-2].value[1] / 1000000
                let orderDirection = a
                let orderId = this.product.productId
                let orderAmount = this.orderAmount
                
                this.$axios.post('add',{
                  targetId: orderId,
                  orderAmt: orderAmount,
                  orderDir: orderDirection,
                  orderTs: orderTime,
                  orderPrice: orderPrice
                }).then(res => {
                  if(res.data.state === 1) {
                    Toast({
                      message: '支付成功,你可以在本页面切换至订单板块查看合约',
                      position: 'middle',
                      className: 'orderToast',
                      duration: 3000
                    })
                    this.balance = Math.floor(this.balance) - orderAmount
                    if(this.balance < orderAmount){
                      this.orderAmount = this.balance
                    }
                    this.orderPoint.push({time: orderTime + this.product.lotteryInterval * 1000, direction: orderDirection})
                    this.orderPoint.push({time: orderTime + this.product.orderDeadline *1000 , direction: 2, orderTime: orderTime + this.product.lotteryInterval * 1000, type: orderDirection, orderAmount: (orderAmount*18)/10})
                    this.newestOrderTime = orderTime
                  }else {
                    Toast({
                      message: '下单失败',
                      position: 'top',
                      duration: 3000
                    })
                  }
                }).catch(err => {
                })
              }
            }
          }
        }
      },
      //存储order数组
      saveStorage() {
        sessionStorage.setItem(this.product.productId,JSON.stringify(this.orderPoint))
        console.log('save')
      },
      // test
      // test() {
      //   this.$forceUpdate()
      // }
    },
    created() {
      this.initWebsocket()
      let storage = JSON.parse(sessionStorage.getItem(this.product.productId))
      if(Array.isArray(storage)){
        this.orderPoint = storage
      }
      this.$axios.post('findBalance',{}).then(res => {
        this.balance = res.data.data.balance
        if(this.balance < this.orderAmount) {
          this.orderAmount = Math.floor(this.balance)
        }
      })
      this.$axios.post('isExistPayPassword',{}).then(res => {
        this.payPasswordExist = res.data.data.exist
      })
      this.getHeight = document.documentElement.clientHeight
    },
    activated() {
      this.$axios.post('findBalance',{}).then(res => {
        this.balance = res.data.data.balance
        if(this.balance < this.orderAmount) {
          this.orderAmount = this.balance
        }
      })
      this.$axios.post('isExistPayPassword',{}).then(res => {
        this.payPasswordExist = res.data.data.exist
      })
    },
    deactivated() {
      this.saveStorage()
    },
    destroyed() {
      this.myChart.dispose()
      this.websocket.onclose = null
      this.websocket.close()
    },
    watch: {
      orderAmount: function(newVal,oldVal) {
        if(newVal > this.balance) {
          this.orderAmount = Math.floor(this.balance)
        }
        this.orderAmount = (this.orderAmount + '').replace(/\D/g,'')
      }
    }
  }
</script>

<style scoped>
input {
  -webkit-appearance: none;
}
.bj-container {
  /* position: relative; */
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* overflow: hidden; */
}
.bj_box {
  /* height: calc(100% - 5.1rem); */
  flex: 1;
  width: 100%;
}
.operation {
  /* position: absolute; */
  height: 5.1rem;
  width: 100%;
  /* display: flex; */
  /* flex-direction: column; */
  background: rgba(238,241,244,.5);
  /* flex: 1; */
  /* overflow: hidden; */
}
.switch {
  display: block;
  justify-content: center;
  height: 1.75rem;
  padding: 0 1.5rem;
}
.switch div {
  display: inline-block;
  margin: .5rem .75rem .64rem .75rem;
  padding-bottom: .19rem;
  font-size: .32rem;
  color: rgba(63,77,104,.6);
  letter-spacing: 0.89px;
  text-align: center;
}
.switch div.active {
  position: relative;
  color: #000A2E;
}
.switch div.active::after {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%,0);
  content: '';
  /* display: block; */
  width: .4rem;
  height: 2px;
  background: #000;
  border-radius: 1px;
}
/* .order-container {
  display: flex;
  flex-direction: column;
} */
.order-container > div {
  height: 1.24rem;
  margin: 0 .56rem;
}
.amount-container {
  display: flex;
}
.orderAmount {
  width: 2.8rem;
  position: relative;
  font-size: .28rem;
  color: #000A2E;
  letter-spacing: 0.78px;
}
#orderAmount {
  position: absolute;
  right: 0;
  border: 1px solid rgba(157,161,169,.51);
  border-radius: 4px;
  margin-right: 0;
  padding-right: .1rem;
  width: 1.3rem;
  height: 0.4rem;
  /* border: 1px solid #eee; */
  text-align: right;
  font-size: .32rem;
  color: #FF820C;
  letter-spacing: 0;
}
.scope {
  margin-top: .26rem;
}
.expect {
  flex: 1;
  font-size: .28rem;
  color: #000A2E;
  letter-spacing: 0.78px;
  text-align: center;
  margin: 0!important;
}
.expect span {
  display: block;
  font-size: .38rem;
  color: #FF820C;
  letter-spacing: 0;
  margin-top: .26rem;
}
.btn-group {
  display: flex;
  justify-content: center;
  margin-top: .5rem!important;
  align-items: center;
}
.btn-group button {
  width: 2.8rem;
  height: .8rem;
  margin: 0 .45rem;
  font-size: .30rem;
  color: #FFFFFF;
  letter-spacing: 0.74px;
  text-align: center;
}
.up {
  position: relative;
  background: #FE3762;
  border-radius: 4px;
}
.up::after{
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    background: #000;
    opacity: 0;
    top: 0;
    left: 0;
    border-radius: 4px;
}
.up:active::after{
   opacity: .3;
}
.down {
  position: relative;
  background: #06D4B6;
  border-radius: 4px;
}
.down::after{
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    background: #000;
    opacity: 0;
    top: 0;
    left: 0;
    border-radius: 4px;
}
.down:active::after{
   opacity: .3;
}
.arrow-up {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: .12rem solid transparent;
  border-bottom: .14rem solid #fff;
  border-right: .12rem solid transparent;
  position: relative;
  top: -0.04rem;
  left: .14rem;
}
.arrow-down {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: .12rem solid transparent;
  border-top: .14rem solid #fff;
  border-right: .12rem solid transparent;
  position: relative;
  top: -0.04rem;
  left: .14rem;
}
/* .order-list {
  background: rgba(238,241,244,.5);
  background-position: 0 -3.68rem;
} */
/* .icon-success {
  display: block;
  width: .8rem;
  height: .8rem;
  background: url('../assets/toast-icon.png') no-repeat;
  background-size: .8rem .8rem;
} */
@media screen { 

  .operation {
    height: 4.23rem;
  }
  .bj_box {
    /* height: calc(100% - 4.23rem); */
    flex: 1;
    width: 100%;
  }

  .switch {
    height: 1.45rem;
  }
  .switch div {
    margin: .41rem 0 .54rem 0;
    padding-bottom: .16rem;
    font-size: .27rem;
    width: 48%;
  }


  .order-container > div {
    height: 1rem;
  }
  .orderAmount {
    font-size: .23rem;
  }
  #orderAmount {
    font-size: .26rem;
  }
  .scope {
    margin-top: .22rem;
  }
  .expect {
    font-size: .23rem;
  }
  .expect span {
    font-size: .32rem;
    margin-top: .22rem;
  }
  .btn-group {
    margin-top: .42rem!important;
  }
  .btn-group button {
    height: .66rem;
    font-size: .25rem;
  }
  .up {
    background: #FE3762;
    border-radius: 4px;
  }
  .down {
    background: #06D4B6;
    border-radius: 4px;
  }
  
  

}






</style>
