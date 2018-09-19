<template>
    <div class='bkeee'>
        <header class="pubHead">
            <button @click="back" class="PubHeadBack"></button>
            提现地址管理
        </header>
        <section class='address' v-for="(item, index) in addresses" :key="index" @click="toShow(index)">
            <span>提现地址{{index+1}}</span>
            <span>{{showAddress(item.withdrawal_address)}}</span>
            <span>{{item.description}}</span>
            <button @click.stop="updateAddress(item)"></button>
        </section>
        <section class="pg4">
            <button class='btn_login high' @click="newAddress">新增地址</button>
            <p>提示：</p>
            <p>1.提现地址：任意支持erc20协议的地址</p>
            <p>2.提现到账时间：24小时内,如超过24小时未到账，请添加官方客服微信（valpromise-vpp）进行反馈</p>
            <p>3.提现手续费：单笔固定收取2000VPP作为手续费(单次提现最低5000VPP）</p>
        </section>
    </div>
</template>

<script>
export default {
    data(){
        return{
            addresses: [],
        }
    },
    methods:{
        back(){
            this.$router.push({name:'withdrawal'})
        },
        showAddress(val) {
            return val.slice(0, 2) + '***' + val.slice(-4)
        },
        toShow(index) {
            this.$router.push({name:'withdrawal', params: {currentIndex: index}})
        },
        updateAddress(address) {
            sessionStorage.setItem('updateId', address.id)
            this.$router.push({name: 'updateAddress', params: address})
        },
        newAddress() {
            this.$router.push('/newAddress')
        },
    },
    created(){
        this.$axios.post('withdrawalAccountList',{}).then(res => {
            this.addresses = res.data.data.rows
        })
    }
}
</script>

<style scoped>
.pubHead{
    background: #fff;
}
.address{
    padding: .4rem;
    margin-bottom: 1px;
    background: #fff;
    display: flex;
    justify-content: space-between;
}
.address span{
    font-size: .28rem;
    line-height: .4rem;
}
.address span:first-child{
    color: #626262;
}
.address span:nth-child(2){
    color: #0D497E;
}
.address span:nth-child(3){
    font-size: .26rem;
    color: #626262;
}
.address button{
    display: block;
    width: .33rem;
    height: .4rem;
    background: url(../../assets/edit.png) no-repeat center;
    background-size: cover;

}
.btn_login{
    margin: .6rem auto;
}
.pg4 p{
    font-size: .24rem;
    color: #9DA1A9;
    line-height: .45rem;
}
</style>


