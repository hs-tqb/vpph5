// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import qs from 'qs'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

import api from './api'
import env from './config/env'
import './config/rem'
import './assets/reset.css' /*引入公共样式*/

import JsEncrypt from 'jsencrypt'//加密
Vue.prototype.$jsEncrypt = JsEncrypt



Vue.use(MintUI)
// import { Toast } from 'mint-ui'
// Vue.component(Toast.name,  Toast)

Vue.config.productionTip = false

//封装axios1
let baseURL = env.baseURL;
let axiosIns = axios.create({})
//本地用了proxyTable代理跨域,生产环境应将baseURL更改为服务器绝对路径
axiosIns.defaults.baseURL = env.baseURL
axiosIns.defaults.timeout = 10000
axiosIns.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8' 

// //获取cookie中token
// var getCookie = function(name){
//   var strcookie = document.cookie;
//   var arrcookie = strcookie.split("; ");
//   for ( var i = 0; i < arrcookie.length; i++) {
//     var arr = arrcookie[i].split("=");
//     if (arr[0] == name){
//       return arr[1];
//     }
//   }
//   return "";
// }
// //清除cookie
// var delCookie = function(name) {
//   var exp = new Date()
//   exp.setTime(exp.getTime() - 1)
//   var cval = getCookie(name)
//   if(cval!='') {
//     document.cookie = name + '=' + cval + ";expires=" + exp.toUTCString()
//   }
// }
// Vue.prototype.$getCookie = getCookie
// Vue.prototype.$delCookie = delCookie

//拦截器
axiosIns.interceptors.request.use(function(config) {
  //url加工,外部地址不加baseURL
  let url = api[config.url] || config.url
  let reduce = new JSEncrypt() //ras 加密
  let plustoken = localStorage.getItem('token') //获取token
  let privateKey = localStorage.getItem('privateKey') // 获取私钥
  reduce.setPrivateKey(privateKey) //获取token
  let token = reduce.decrypt(plustoken) //解密
  console.log(token)
  config.url = (url.indexOf('http')===0)? url: baseURL+url
  //添加token
  if(config.method === 'post') {
    if(token) {
      config.data.token = token
    }
    config.data = qs.stringify(config.data)
  } 
  return config
},function(error) {
  return Promise.reject(error)
})
axiosIns.interceptors.response.use(response => {
  return response
},error =>{
  console.log(error.response.status)
  return Promise.reject(error)
})

// 错误请求处理
let ajaxMethod = ['get', 'post']
let axiosObj = {}
ajaxMethod.forEach( method => {
  axiosObj[method] = function(url, data, config) {
    return new Promise(function(resolve, reject) {
      axiosIns[method](url, data, config).then((response) => {
        //根据后台数据处理
        if(response.data.state === 0){
          if(response.data.errorCode === '4001' || response.data.errorCode === '1001') {
            //token 失效处理
            console.log(response.data.message)
            store.commit('setIncludedComponents','')
            localStorage.clear()
            router.push({
              path: '/login'
            })
          }else if( response.data.errorCode === '10001'){
            console.log(response.data.message)
            MintUI.Toast({
              message: response.data.message,
              position: 'top',
              duration: 1000
            });
            router.push({
              path: '/user'
            })
          }else{
            console.log(response.data.message)
            console.log(response.data.state)
            // config.log(response.data.errorCode)
            MintUI.Toast({
              message: response.data.message,
              position: 'top',
              duration: 1000
            });
          }
        }else{
          console.log(response.data.message)
          resolve(response)
        }
      }).catch((error) => {
        reject(error)
      })
    })
  }
})
Vue.prototype.$axios = axiosObj

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
