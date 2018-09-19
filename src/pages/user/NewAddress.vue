<template>
  <div class='newbk'>
    <header class="pubHead">
        <button @click="back" class="PubHeadBack"></button>
        新增提币地址
    </header>
    <form v-on:submit="formSubmit">
      <section class="addnew">
        <label for="address">提现地址</label>
        <input type="text" placeholder="请输入地址" id="address" v-model="newAddress">
      </section>
      <section class="addnew">
        <label for="description">备注</label>
        <input type="text" placeholder="请输入备注" id="description" v-model="description">
      </section>
      <section>
        <button class="btn_login high" @click="increaseAddress">添加地址</button>
      </section>
    </form>
    <section class="pg4">
      <p>提示：</p>
        <p>1.提现地址：任意支持erc20协议的地址</p>
        <p>2.提现到账时间：24小时内,如超过24小时未到账，请添加官方客服微信（valpromise-vpp）进行反馈</p>
        <p>3.提现手续费：单笔固定收取2000VPP作为手续费(单次提现最低5000VPP）</p>
    </section>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui';
  export default {
    data() {
      return {
        newAddress: '',
        description: '',
      }
    },
    methods: {
      back() {
        this.$router.go(-1)
      },
      increaseAddress() {
        if(this.newAddress.length === 0){
          Toast({
            message: '地址不能为空',
            position: 'middle',
            duration: 5000
          });
          console.log('地址不能为空')
          }else{
          this.$axios.post('insertWithdrawalAccount',{withdrawalAddress: this.newAddress, description: this.description}).then(res => {
            console.log(res.data.message)
            // this.$router.push({name:'withdrawal', params: {showList: true}})
            this.$router.push({name:'editAddress', params: {showList: true}})
          })
        }
      },
      formSubmit(e) {
        e.preventDefault();
      }
    }
  }
</script>

<style scoped>
.newbk{
  min-height: 100%;
  background-image: linear-gradient(-189deg, #9695F9 0%, #5176F5 100%);
}
.pubHead{
  border: 0;
  color: #fff;
}
.PubHeadBack{
  background: url(../../assets/backIcon_white.png) no-repeat left center;
  background-size: cover;
}
form{
  position: relative;
  width: 6.2rem;
  min-height: 1.7rem;
  margin: 1.52rem auto .6rem;
  padding: .85rem .4rem .7rem;
  background: #fff;
  border-radius: 4px;
  text-align: center;
}
form::before{
  content: ' ';
  display: block;
  position: absolute;
  left: 50%;
  top: 0;
  width: 1.3rem;
  height: 1.3rem;
  background: url(../../assets/newAddress.png) no-repeat center;
  background-size: contain;
  transform: translate3d( -50%,-50%,0);
}
form .addnew:first-child{
  margin-bottom: .6rem;
}
.addnew{
  display: flex;
  justify-content: space-between;
}
.addnew label{
  font-size: .28rem;
  line-height: .4rem;
  color: #3F4D68;
}
.addnew input{
  text-align: right;
  font-size: .28rem;
  color: #000A2E;
}
.btn_login{
  background: #1BA5FD;
  box-shadow: 0 2px 20px 0 rgba(12,138,231,0.34);
  border-radius: 4px;
  margin-top: .9rem;
}
.pg4 p{
    font-size: .24rem;
    color: #fff;
    line-height: .45rem;
    opacity: .5;
}
</style>
