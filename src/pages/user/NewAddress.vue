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
      <p>1. 地址为任意支持erc20协议的地址，都可作为提现地址。</p>
      <p>2. 提现后最晚24小时内完成转账。</p>
      <p>3. 若超过本时间未查询到账，请通过App内“个人中心-反馈”进行反馈，或联系客服人员：888-886。</p>
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
