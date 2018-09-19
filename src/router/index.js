import Vue from 'vue'
import Router from 'vue-router'

import transaction from '@/pages/Transaction'
import home from '@/pages/Home'
import login from '@/pages/login/Login'
import signUp from '@/pages/login/SignUp'
import store from '../store'




// import user from '@/pages/user/User'
// import bill from '@/pages/user/Bill'
// import detail from '@/pages/user/Detail'
// import deposit from '@/pages/user/Deposit'
// import withdrawal from '@/pages/user/Withdrawal'
// import updateAddress from '@/pages/user/UpdateAddress'
// import newAddress from '@/pages/user/NewAddress'
// import security from '@/pages/security/Security'
// import invite from '@/pages/Invite'
// import feedback from '@/pages/Feedback'
const user = () => import('@/pages/user/User')
const bill = () => import('@/pages/user/Bill')
const detail = () => import('@/pages/user/Detail')
const deposit = () => import('@/pages/user/Deposit')
const withdrawal = () => import('@/pages/user/Withdrawal')
const editAddress = () => import('@/pages/user/EditAddress')
const updateAddress = () => import('@/pages/user/UpdateAddress')
const newAddress = () => import('@/pages/user/NewAddress')
const bonus = () => import('@/pages/user/Bonus')
const notice = () => import('@/pages/user/Notice')
const noticeDetail = () => import('@/pages/user/NoticeDetail')
const aboutUs = () => import('@/pages/user/AboutUs')
const security = () => import('@/pages/security/Security')
const invite = () => import('@/pages/Invite')
const feedback = () => import('@/pages/Feedback')
const changeMobile = () => import('@/pages/security/ChangeMobile')
const setPassword = () => import('@/pages/security/SetPassword')
const setPayPassword = () => import('@/pages/security/SetPayPassword')
const forgetPassword = () => import('@/pages/security/ForgetPassword')
const validateMobile = () => import('@/pages/security/ValidateMobile')
const validatePassword = () => import('@/pages/security/ValidatePassword')
const validatePaypassword = () => import('@/pages/security/ValidatePaypassword')
const resetPassword = () => import('@/pages/security/reset/ResetPassword')
const resetPayPassword = () => import('@/pages/security/reset/ResetPayPassword')
const orderDetail = () => import('@/pages/OrderDetail')

// test
const getCountry = () => import('@/components/GetCountry')

import { userInfo } from 'os';
Vue.use(Router)

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

const router = new Router({
  mode: 'history',
  routes: [
    //test
    {
      path: '/getCountry',
      name: 'getcountry',
      component: getCountry
    },
    //test
    {
      path: '/',
      name: 'home',
      component: home,
      meta: {
        requireLogin: true,
      }
    },{
      path: '/transaction',
      name: 'transaction',
      component: transaction,
      meta: {
        requireLogin: true
      }
    },{
      path: '/login',
      name: 'login',
      component: login
    },{
      path:'/signup',
      name:'signup',
      component: signUp
    },{
      path:'/user',
      name:'user',
      component: user,
      meta: {
        requireLogin: true 
      }
    },{
      path:'/bill',
      name:'bill',
      component: bill,
      meta: {
        requireLogin: true 
      }
    },{
      path: '/orderDetail',
      name: 'orderDetail',
      component: orderDetail,
      meta: {
        requireLogin: true 
      }
    },{
      path: '/detail',
      name: 'detail',
      component: detail,
      meta: {
        requireLogin: true 
      }
    },{
      path: '/deposit',
      name: 'deposit',
      component: deposit,
      meta: {
        requireLogin: true 
      }
    },{
      path: '/withdrawal',
      name: 'withdrawal',
      component: withdrawal,
      meta: {
        requireLogin: true
      }
    },{
      path: '/editAddress',
      name: 'editAddress',
      component: editAddress,
      meta: {
        requireLogin: true
      }
    },{
      path: '/bonus',
      name: 'bonus',
      component: bonus,
      meta: {
        requireLogin: true
      }
    },{
      path: '/notice',
      name: 'notice',
      component: notice,
      meta: {
        requireLogin: true
      }
    },{
      path: '/noticeDetail',
      name: 'noticeDetail',
      component: noticeDetail,
      meta: {
        requireLogin: true
      }
    },{
      path: '/aboutUs',
      name: 'aboutUs',
      component: aboutUs,
      meta: {
        requireLogin: true
      }
    },{
      path: '/updateAddress',
      name: 'updateAddress',
      component: updateAddress,
      meta: {
        requireLogin: true
      }
    },{
      path: '/newAddress',
      name: 'newAddress',
      component: newAddress,
      meta: {
        requireLogin: true
      }
    },{ //安全中心部分
      path: '/security',
      name: 'security',
      component: security,
      meta: {
        requireLogin: true
      }
    },{
      path: '/validateMobile',
      name: 'validateMobile',
      component: validateMobile,
      meta: {
        requireLogin: true 
      }
    },{
      path: '/validatePassword',
      name: 'validatePassword',
      component: validatePassword,
      meta: {
        requireLogin: true 
      }
    },{
      path: '/validatePaypassword',
      name: 'validatePaypassword',
      component: validatePaypassword,
      meta: {
        requireLogin: true 
      }
    },{
      path: '/changeMobile',
      name: 'changeMobile',
      component: changeMobile,
      meta: {
        requireLogin: true 
      }
    },{
      path: '/setPassword',
      name: 'setPassword',
      component: setPassword,
      meta: {
        requireLogin: true 
      }
    },{
      path: '/setPayPassword',
      name: 'setPayPassword',
      component: setPayPassword,
      meta: {
        requireLogin: true 
      }
    },{
      path: '/forgetPassword',
      name: 'fogetPassword',
      component: forgetPassword
    },{
      path: '/resetPassword',
      name: 'resetPassword',
      component: resetPassword,
      meta: {
        requireLogin: true 
      }
    },{
      path: '/resetPayPassword',
      name: 'resetPayPassword',
      component: resetPayPassword,
      meta: {
        requireLogin: true 
      }
    },{
      path: '/invite',
      name: 'invite',
      component: invite,
      meta: {
        requireLogin: true
      }
    },{
      path: '/feedback',
      name: 'feedback',
      component: feedback,
      meta: {
        requireLogin: true
      }
    }],
})
//路由跳转时鉴权
router.beforeEach((to, from, next) => {
  document.body.scrollTop = document.documentElement.scrollTop =0;
  if(to.matched.some(res => res.meta.requireLogin)) {
    if(localStorage.getItem('token')){
      next()
    }else{
      store.commit('setIncludedComponents','')
      next({
        path:"/login",
        query: { redirect: to.fullPath }
      })
    }
  }else{
    next()
  }
})

export default router;
