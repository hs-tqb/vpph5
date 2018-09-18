<template>
  <div class="container">
    <div class="bj_box" ref="mychart"></div>
    <button @click="test">下单</button>
  </div>
</template>

<script>
//按需引入echarts
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/markLine')
require('echarts/lib/component/markArea')
require('echarts/lib/component/markPoint')
  export default {
    data() {
      return {
        data: [],
        myChart: {},
        websocket: null,
        isOrder: false,
        orderIndex: null,
        index: 0
      }
    },
    //父组件传递wsURL
    props: [ 'wsUri' ],
    computed: {
      //echarts初始opt
      opt() {
        let that = this;
        let obj = {
          xAxis: {
            type: 'time',
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
              margin: 5
            },
            // 坐标间距
            interval: 15 * 1000,
           },
          grid: {
            show: true,
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
              margin: 10,
              formatter: function(val) {
                return val.toFixed(2)
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
                show: true
            },
            z:2
          },
          series: [{
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: that.data,
            animation: false,
          //标线
            markLine: {
              symbol: ['none', 'none'],
              data: [{
                name: 'xAxis标线',
                xAxis: that.mlLeft
              },{
                xAxis: that.mlright
              }],
              lineStyle: {
                color: 'rgba(45,213,219,1)',
                type: 'solid'
              }
            },
          //填充
            areaStyle:{
              color: 'rgba(130,206,235,.5)'
            },
            lineStyle:{
              color: 'rgba(0,0,255,1)',
              width: 1
            }
          }]
        }
        return obj
      },
      mlLeft() {
        return this.data[75].value[0]
      },
      mlright() {
        return this.data[105].value[0]
      },
      //websocket断线重连
      heartCheck() {
        let that = this
        let obj = {
          timeout: 10000,
          timeoutObj: null,
          reset: function() {
            clearTimeout(this.timeoutObj)
            return this;

          },
          start: function() {
            that.websocket.send('keep')
            console.log(that.websocket)
            this.timeoutObj = setTimeout(function() {
              that.data = []
              console.log('close')
              that.websocket.close()
            }, this.timeout)
          }
        }
        return obj
      }
    },
    methods: {
      // echarts初始化
      setEchart() {
        let dom = this.$refs.mychart
        this.myChart = echarts.init(dom)
        this.myChart.setOption(this.opt)
      },
      // echarts更新函数
      updataEchart(index) {
        let pval = this.data[index].value[1]
        let tval = this.data[index].value[0]
        if(!this.isOrder){
          this.myChart.setOption({
            series: [{
              data:this.data,
              markLine: {
                symbol: ['none','none'],
                silent: true,
                data: [{
                  name: 'yAxis标线',
                  yAxis: pval,
                  lineStyle: {
                    color: 'rgba(0,0,225,1)',
                    width: 1
                  }
                },{
                  name: 'xAxis标线',
                  xAxis: this.mlLeft,
                  label: {
                    show: false
                  }
                },{
                  xAxis: this.mlright,
                  label: {
                    show: false
                  }
              }]
              },
              markPoint: {
                data: [
                  {
                  symbol: 'circle',
                  symbolSize: 6,
                  coord: [tval, pval],
                  itemStyle: {
                    color: 'rgb(0,0,255)'
                  }
                },{
                    x: '66%',
                    y: '11%',
                    symbol: 'rect',
                    symbolSize: 20,
                    itemStyle: {
                      color: 'rgba(0,0,0,0)',
                    },
                    label: {
                      color: '#666',
                      fontWeight: 500,
                      show: true,
                      positon: 'inside',
                      formatter: function() {
                        return '\n合\n约\n开\n始\n'
                      }
                    }
                  },{
                    x: '89%',
                    y: '11%',
                    symbol: 'rect',
                    symbolSize: 20,
                    itemStyle: {
                      color: 'rgba(0,0,0,0)',
                    },
                    label: {
                      color: 'rgba(45,213,219,1)',
                      fontWeight: 500,
                      show: true,
                      positon: 'inside',
                      formatter: function() {
                        return '\n合\n约\n结\n束\n'
                      }
                    }
                  }
                ]
              },
              markArea: {
                silent: true,
                itemStyle: {
                  normal: {
                    color: 'rgba(209,242,228,.6)'
                  }
                },
                data: [[{
                  xAxis: this.mlLeft,
                },{
                  xAxis: this.mlright,
                }
                ]]
              }
            }]
          })
        }else{
          this.myChart.setOption({
            series: [{
              data:this.data,
              markLine: {
                symbol: ['none','none'],
                silent: true,
                data: [{
                  name: 'yAxis标线',
                  yAxis: pval,
                  lineStyle: {
                    color: 'rgba(0,0,225,1)',
                    width: 1
                  }
                },{
                  name: '下单线',
                  yAxis: this.data[this.orderIndex].value[1],
                  lineStyle: {
                    color: 'rgba(255,0,0,1)',
                    width: 1
                  }
                },{
                  name: 'xAxis标线',
                  xAxis: this.mlLeft,
                  label: {
                    show: false
                  }
                },{
                  xAxis: this.mlright,
                  label: {
                    show: false
                  }
              }]
              },
              markPoint: {
                data: [
                  {
                    symbol: 'circle',
                    symbolSize: 6,
                    coord: [this.data[this.orderIndex].value[0], this.data[this.orderIndex].value[1]]
                  },
                  {
                  symbol: 'circle',
                  symbolSize: 6,
                  coord: [tval, pval],
                  itemStyle: {
                    color: 'rgb(0,0,255)'
                  }
                },{
                    x: '66%',
                    y: '11%',
                    symbol: 'rect',
                    symbolSize: 20,
                    itemStyle: {
                      color: 'rgba(0,0,0,0)',
                    },
                    label: {
                      color: '#666',
                      fontWeight: 500,
                      show: true,
                      positon: 'inside',
                      formatter: function() {
                        return '\n合\n约\n开\n始\n'
                      }
                    }
                  },{
                    x: '89%',
                    y: '11%',
                    symbol: 'rect',
                    symbolSize: 20,
                    itemStyle: {
                      color: 'rgba(0,0,0,0)',
                    },
                    label: {
                      color: 'rgba(45,213,219,1)',
                      fontWeight: 500,
                      show: true,
                      positon: 'inside',
                      formatter: function() {
                        return '\n合\n约\n结\n束\n'
                      }
                    }
                  }
                ]
              },
              markArea: {
                silent: true,
                itemStyle: {
                  normal: {
                    color: 'rgba(209,242,228,.6)'
                  }
                },
                data: [[{
                  xAxis: this.mlLeft,
                },{
                  xAxis: this.mlright,
                }
                ]]
              }
            }]
          })
        }
      }
      ,
      initWebsocket() {
        const wsuri = this.wsUri;
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
        this.websocket.send(this.str2utf8('keep'))
        console.log(redata)
        //判断websocket是否首次连接
        if(Array.isArray(redata)) {
          //判断是否为onclose重连,是的话则只取数组最后一个值
          if(this.data.length != 0) {
            let dataItem = redata[length-1]
            let price = parseFloat(dataItem.price)
            let time = dataItem.time
            let index = this.data.findIndex( item => {
              return item.value[0] == time
            })
            if(index === -1) {
              console.log('-1')
            }
            this.index = index
            this.data[index].value[1] = price
            this.updataEchart(index)
          } else{
            //首次连接将e.data数组加工至需要项赋给this.data
            redata.forEach( dataItem => {
              let item = {value: [null,null]}
              item.value[0] = parseInt(dataItem.time)
              item.value[1] = parseFloat(dataItem.price)
              this.data.push(item)
            });
            for(let i = 0; i < 106 - length; i++) {
              let nextTime = parseInt(this.data[this.data.length-1].value[0]) + 1000
              //构造time轴坐标形式
              this.data.push({value:[ nextTime, null ]})
            }
              console.log('ok')
              console.log(this.data)
              console.log('ok2')
              this.setEchart()
              this.updataEchart(length - 1)
          }
      }else
          //未下单逻辑
          if(!this.isOrder && this.data[75].value[1]){
            this.data.splice(0,60)
            for(let i=0; i<60; i++) {
              let nextTime = parseInt(this.data[this.data.length-1].value[0]) + 1000
              this.data.push({value: [ nextTime, null ]})
            }
            let price = parseFloat(redata.price)
            let time = redata.time
            let index = this.data.findIndex(item => {
              return item.value[0] == time
            })
            if(index === -1) {
              console.log('-1')
            }
            this.index = index
            this.data[index].value[1] = price
            this.updataEchart(index)
        }else
          //下单逻辑
          if(this.isOrder && this.data[104].value[1]) {
            console.log(this.data)
            let price = parseFloat(redata.price)
            let time = redata.time
            let index = this.data.findIndex(item => {
              return item.value[0] == time
            })
            if(index === -1) {
              console.log('-1')
            }
            this.index = index
            this.data[index].value[1] = price
            this.updataEchart(index)
            this.isOrder = false
        }else
        {
          //下一轮
          if(this.data[105].value[1]) {
            this.data.splice(0,60)
            for(let i=0; i<60; i++) {
              let nextTime = parseInt(this.data[this.data.length-1].value[0])
              this.data.push({value: [ nextTime, null ]})
            }
          }
          let price = parseFloat(redata.price)
          let time = redata.time
          let index = this.data.findIndex(item => {
            return item.value[0] == time
          })
          this.index = index
          this.data[index].value[1] = price
          if(!this.data[index].value[1]) {
              console.log('index:' + index + 'price' + price)
          }
          console.log(this.data[index].value[1])
          this.updataEchart(index)
        }
      },
      websocketOnClose(e) {
        console.log('connection closed (' + e.code + ')')
        this.initWebsocket()
      },
      str2utf8(str) {
        let encoder = new TextEncoder('utf8');
        return encoder.encode(str);
      },
      // test
      test() {
        this.isOrder = true
        console.log(this.orderIndex)
        this.orderIndex = this.index
        this.updataEchart(this.index)
        this.websocket.send(this.str2utf8('keep'))
        console.log(this.str2utf8('keep'))
        console.log(this.data[this.orderIndex].value[1])
      },
      // test
    },
    created() {
      this.initWebsocket()
    },
    destroyed() {
      this.websocket.close()
    }
  }
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
.bj_box {
  height: 100%;
  width: 100%;
}
</style>
