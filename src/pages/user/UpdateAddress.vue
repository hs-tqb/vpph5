<template>
  <div class='bkeee'>
    <header class="pubHead">
        <button @click="back" class="PubHeadBack"></button>
        编辑地址
    </header>
    <form>
      <section class="address">
        <label for="address">提现地址</label>
        <input type="text" placeholder="请输入地址" id="address" v-model="withdrawalAddress" style="opacity: .6">
      </section>
      <section class="address">
        <label for="description">备注</label>
        <input type="text" placeholder="请输入备注" id="description" v-model="description">
      </section>
    </form>
    <section class="address">
      <button class="btn_login high" @click="increaseAddress">保存地址</button>
    </section>
    <section class="delect">
      <button @click='delectAddress'>删除地址</button>
    </section>
    <section class="pg4">
      <p>提示：</p>
      <p>1.提现地址：任意支持erc20协议的地址</p>
      <p>2.提现到账时间：24小时内,如超过24小时未到账，请添加官方客服微信（valpromise-vpp）进行反馈</p>
      <p>3.提现手续费：单笔固定收取2000VPP作为手续费(单次提现最低5000VPP）</p>
  </section>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui'
  export default {
    data() {
      return {
        withdrawalAddress: '',
        description: '',
        id: null
      }
    },
    methods: {
      back() {
        this.$router.go(-1)
      },
      showAddress(val) {
        return val.slice(0, 2) + '***' + val.slice(-4)
      },
      increaseAddress() {
        if(this.withdrawalAddress.length === 0){console.log('地址不能为空')}else{
          this.$axios.post('updateWithdrawalAccount',{withdrawalAddress: this.withdrawalAddress, description: this.description, id: this.id}).then(res => {
            console.log(res.data.data)
            Toast({
              message: '修改成功',
              position: 'middle',
              duration: 1000
            });
            setTimeout(()=>{
              this.$router.push({name:'editAddress', params: {showList: true}})
            },1200)
          })
        }
      },
      delectAddress(){
        this.$axios.post('deleteWithdrawalAccount',{id:this.id}).then(res=>{
          Toast({
            message: '删除成功',
            position: 'middle',
            duration: 1000
          });
          setTimeout(()=>{
            this.back()
          },1200)
          
        })
      }
    },
    created() {
      this.withdrawalAddress = this.$route.params.withdrawal_address
      this.description = this.$route.params.description
      this.id = this.$route.params.id ? this.$route.params.id : sessionStorage.getItem('updateId')
    }
  }
</script>

<style scoped>
.pubHead{
    background: #fff;
}
.address{
    padding: .4rem;
    background: #fff;
    display: flex;
    justify-content: space-between;
}
.address label{
  font-size: .28rem;
  line-height: .4rem;
  color: #3F4D68;
}
.address input{
  text-align: right;
  font-size: .28rem;
  color: #000A2E;
  letter-spacing: 0;
  width: 70%;
  line-height:.4rem;
}
.address .btn_login{
  margin-top: .2rem;
}
.delect{
  margin: .2rem 0 .6rem;
  padding: .4rem;
  background: #fff;
}
.delect button{
  font-size: .26rem;
  color: #FE3762;
}
.pg4 p{
    font-size: .24rem;
    color: #9DA1A9;
    line-height: .45rem;
}
</style>
