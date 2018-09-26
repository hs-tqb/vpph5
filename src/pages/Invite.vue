<template>
  <div class='invite'>
    <header class="pubHead">
      <button @click="back" class="PubHeadBack"></button>
      邀请有奖
    </header>
    <section class='inviteMain'>
      <p>您的邀请链接</p>
      <div class='inviteCode' id='target'>http://localhost:8080/signup?inviteCode={{inviteData.inviteCode}}</div>
      <!-- {{inviteData.inviteCode}} -->
      <div class='copy' @click="copy" data-clipboard-action="copy" data-clipboard-target="#target">复制</div>
      <!-- <span><span>剩余邀请次数: {{inviteData.noUseInviteCode}}|</span><span>您的邀请码总次数: {{inviteData.inviteUp}}</span></span> -->
      <!-- <div class='picCode'>
        <img :src="inviteData.qrCode" alt="qr">
        <div class='picCodetext'>
          <h3>微信扫码</h3>
          <p>即可直接下载<br />ValPromise App！</p>
        </div>
      </div> -->
    </section>
    <section class='inviteFoot pg4'>
      <p>平台内所有合约经营者每日总盈利的30%作为用户拉新佣金（未盈利的经营者不参与提取佣金），返还给为平台带来新用户的老用户，按照“新用户交易量/平台总交易量”给对应拉新老用户返佣，每日结算。</p>
      <h3>拉新方案</h3>
      <p>1.佣金：平台内所有合约所有者总盈利的30%</p>
      <p>2.返佣规则：用户返佣 VPP数=（该用户所拉新用户总交易量 / 平台总交易量） *合约所有者总盈利30% </p>
      <p>3.新用户标准：根据特定邀请链接注册的账户</p>
    </section>
  </div>
</template>

<script>
  import Clipboard from 'clipboard'
  import { Toast } from 'mint-ui'
  export default {
    data() {
      return {
        lang: 'zh_CN',
        inviteData: {},
      }
    },
    methods: {
      back() {
        this.$router.go(-1)
      },
      copy(){
        var targetText=this.inviteCode;
        var clipboard = new Clipboard('.copy')
        clipboard.on('success', e => {
            Toast({
            message: '复制成功',
            position: 'middle',
            duration: 1200
          });     
          // 释放内存
          clipboard.destroy()
        })
        clipboard.on('error', e => {
          Toast({
            message: '该浏览器不支持自动复制，请手动复制',
            position: 'middle',
            duration: 1200
          });
          clipboard.destroy()
        })
      }
    },
    created() {
      this.$axios.post('inviteCodePage',{lang: this.lang}).then(res => {
        this.inviteData = res.data.data
      })
    }
  }
</script>

<style scoped>
.invite{
  width: 100%;
  min-height: 100%;
  background: url(../assets/invitebk.png) no-repeat center;
  background-size: cover;
}
.pubHead{
  border:0;
  color: #fff;
}
.PubHeadBack{
  background: url(../assets/backIcon_white.png) no-repeat left center;
  background-size: cover;
}
.inviteMain{
  position: relative;
  width: 6.2rem;
  min-height: 3.5rem;
  margin: 1.52rem auto .6rem;
  padding-top: 1.2rem;
  background: #fff;
  border-radius: 15px;
  text-align: center;
  box-shadow: 1px 1px 20px 0 #fff;
}
.inviteMain::before{
  content: ' ';
  display: block;
  position: absolute;
  left: 50%;
  top: 0;
  width: 3.25rem;
  height: 2.3rem;
  background: url(../assets/prize.png) no-repeat center;
  background-size: contain;
  transform: translate3d( -50%,-50%,0);
}
.inviteMain p{
  text-align: center;
  font-size: .26rem;
  color: #626262;
  line-height: .37rem;
}
.inviteMain p span{
  font-size: .22rem;
  color: #1BA5FD;
  line-height: .3rem;
}
.inviteMain .inviteCode{
  /* width: 2.78rem; */
  height: .91rem;
  /* line-height: .91rem; */
  font-size:  .24rem;
  color: #000A2E;
  margin: .1rem auto .5rem;
  /* border: 1px solid #626262; */
  /* border-radius: 4px; */
}
.inviteMain .copy{
  width: 2.05rem;
  height: .8rem;
  line-height: .8rem;
  font-size: .3rem;
  color: #FFFFFF;
  background: #1BA5FD;
  border-radius: 100px;
  margin: 0 auto .2rem; 
}
.picCode{
  display: flex;
  justify-content: space-between;
  padding-right: .33rem;
  margin-top: .8rem;
  text-align: left;
}
.picCodetext{
  width: 3.2rem;
  overflow: hidden;
}
.picCodetext::before{
  content: ' ';
  display: block;
  float: left;
  width: 1px;
  height: .81rem;
  margin: .3rem .3rem .15rem 0;
  opacity: 0.5;
  background: #9DA1A9;
}
.picCode h3{
  float:left;
  font-size: .3rem;
  color: #626262;
  line-height: .42rem;
}
.picCode h3::after{
  content: ' ';
  display: block;
  width: .34rem;
  height: .06rem;
  background: #626262;
  margin: .11rem 0 .15rem;
}
.picCode p{
  float:left;
  text-align: left;
  font-size: .24rem;
  color: #626262;
  line-height: .33rem;
}
.picCode img{
  width: 1.58rem;
  height: 1.58rem;
  margin-left: .8rem;
}
.inviteFoot{
  padding-bottom: .5rem;
}
.inviteFoot h3{
  font-size: .28rem;
  color: #FFFFFF;
  line-height: .45rem;
  padding:.3rem 0 .1rem;
}
.inviteFoot p{
  font-size: .24rem;
  color: #FFFFFF;
  line-height: .45rem;
}
</style>
