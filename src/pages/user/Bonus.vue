<template>
    <div class='bkeee'>
        <header class="pubHead">
            <button @click="back" class="PubHeadBack"></button>
            分成规则
        </header>
        <div class="bonus">
            <h4>今日收益</h4>
            <ul>
                <li>
                    <div class="tit">
                        <span>平台收益<i>(总计)</i></span>
                        <span>{{decimal(this.todayResult.platformSum)}} <i>VPP</i></span>
                    </div>
                    <div class="table">
                        <div class="tr">
                            <p>
                                <span>提现手续费</span>
                                <em>{{decimal(this.todayResult.sumWithdrawalGas)}}VPP</em>
                            </p>
                            <p>
                                <span>拍卖手续费</span>
                                <em>{{decimal(this.todayResult.sumAuctionGas)}}VPP</em>
                            </p>
                        </div>
                        <div class="tr">
                            <p>
                                <span>交易手续费</span>
                                <em>{{decimal(this.todayResult.sumCoinguessGas)}}VPP</em>
                            </p>
                            <p>
                                <span>合约总盈利</span>
                                <em>{{decimal(this.todayResult.platformCoinSumIncome)}}VPP</em>
                            </p>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="tit">
                        <span>我的分成<i>(总计)</i></span>
                        <span>{{decimal(this.todayResult.customerSum)}} <i>VPP</i></span>
                    </div>
                    <div class="table">
                        <div class="tr">
                            <p>
                                <span>持币收益</span>
                                <em>{{decimal(this.todayResult.customerBalanceIncome)}}VPP <router-link to="/deposit">去存币</router-link></em>
                            </p>
                            <p>
                                <span>邀请收益</span>
                                <em>{{decimal(this.todayResult.customerInviteIncome)}}VPP <router-link to="/invite">去邀请</router-link></em>
                            </p>
                        </div>
                        <div class="tr">
                            <p>
                                <span>交易收益</span>
                                <em>{{decimal(this.todayResult.customerTransactionIncome)}}VPP <router-link to="/transaction">去交易</router-link></em>
                            </p>
                            <p>
                                <!-- <span>合约总盈利</span>
                                <em>1000VPP</em> -->
                            </p>
                        </div>
                    </div>
                </li>
            </ul>
            <h4>昨日收益</h4>
            <ul class="Yesterday">
                <li>
                    <div class="tit">
                        <span>平台收益<i>(总计)</i></span>
                        <span>{{decimal(this.yesterdayResult.platformSum)}} <i>VPP</i></span>
                    </div>
                    <div class="table">
                        <div class="tr">
                            <p>
                                <span>提现手续费</span>
                                <em>{{decimal(this.yesterdayResult.sumWithdrawalGas)}}VPP</em>
                            </p>
                            <p>
                                <span>拍卖手续费</span>
                                <em>{{decimal(this.yesterdayResult.sumAuctionGas)}}VPP</em>
                            </p>
                        </div>
                        <div class="tr">
                            <p>
                                <span>交易手续费</span>
                                <em>{{decimal(this.yesterdayResult.sumCoinguessGas)}}VPP</em>
                            </p>
                            <p>
                                <span>合约总盈利</span>
                                <em>{{decimal(this.yesterdayResult.platformCoinSumIncome)}}VPP</em>
                            </p>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="tit">
                        <span>我的分成<i>(总计)</i></span>
                        <span>{{decimal(this.yesterdayResult.customerSum)}} <i>VPP</i></span>
                    </div>
                    <div class="table">
                        <div class="tr">
                            <p>
                                <span>持币收益</span>
                                <em>{{decimal(this.yesterdayResult.customerBalanceIncome)}}VPP</em>
                            </p>
                            <p>
                                <span>邀请收益</span>
                                <em>{{decimal(this.yesterdayResult.customerInviteIncome)}}VPP</em>
                            </p>
                        </div>
                        <div class="tr">
                            <p>
                                <span>交易收益</span>
                                <em>{{decimal(this.yesterdayResult.customerTransactionIncome)}}VPP</em>
                            </p>
                            <p>
                                <!-- <span>合约总盈利</span>
                                <em>1000VPP</em> -->
                            </p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <section class="pg4">
            <p v-for='(item,index) in informationArr' :key='index'>{{item}}</p>
        </section>
    </div>
</template>

<script>
export default {
    data() {
        return {
            todayResult: {},
            yesterdayResult: {},
            information: ''
        }
    },
    computed: {
        informationArr() {
            return this.information.split('\r\n')
        }
    },
    methods: {
        back() {
            this.$router.go(-1)
        },
        decimal(numojb) {
            if(numojb){
                let num = new Number(numojb)
                return Math.floor(num*100)/100
            }else return '请稍等'
        }
        
    },
    created() {
        this.$axios.post('find',{}).then(res=>{
            this.todayResult = res.data.data.todayResult
            this.yesterdayResult = res.data.data.yesterdayResult
            this.information = res.data.data.information
            console.log(this.information)
        })
    }
}
</script>

<style scoped>
.bkeee{
    position: fixed;
    left: 50%;
    top: 0;
    height: 100%;
    width: 100%;
    max-width: 640px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;  
    transform: translateX(-50%);
}
.pubHead{
    background: #fff;
    margin-bottom: .02rem;
    border: 0;
}
.bonus{
    background: #fff;
    padding: 0 .4rem;
    overflow: hidden;
}
.bonus h4{
    padding: 0 0 0 .2rem;
    margin: .4rem 0 .3rem;
    border-left: .1rem solid #1BA5FD;
    line-height: .48rem;
    font-size: .34rem;
    color: #000A2E;
}
.bonus li{
    box-shadow: 0 4px 28px 0 rgba(17,17,17,0.09);
    border-radius: 4px;
    margin-bottom: .3rem;
}
.bonus .tit{
    padding: .4rem .3rem;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
}
.bonus .tit span{
    font-size: .4rem;
    color: #3F4D68;
    line-height: .56rem;
}
.bonus .tit span i{
    font-size: .22rem;
    color: #B6B6C9
}
.bonus .tit span:last-child{
    font-size: .45rem;
    color: #1BA5FD;
}
.bonus .tit span:last-child i{
    color: #1BA5FD;
}
.bonus .table .tr{
    overflow: hidden;
    border-bottom: 1px solid #eee;
}
.bonus .table .tr p{
    width: 50%;
    box-sizing: border-box;
    float: left;
    padding: 0 .3rem;

}
.table .tr p span{
    display: block;
    font-size: .28rem;
    color: #3F4D68;
    line-height: .37rem;
    margin-top: .25rem;
}
.table .tr p em a{
    float: right;
}
.table .tr p em{
    display: block;
    font-size: .26rem;
    color: #B6B6C9;
    line-height: .37rem;
    margin: .06rem 0 .25rem;
}
.bonus .table .tr p:first-child{
    border-right: 1px solid #eee;
}
.bonus .table .tr:last-child{
    border: 0;
}
.Yesterday .tit span:last-child{
    color: #3F4D68;
}
.Yesterday .tit span:last-child i{
    color: #3F4D68;
}
.pg4{
    padding: .6rem .4rem 1rem;
}
.pg4 h3{
    font-size: .26rem;
    color: #9DA1A9;
    line-height: .45rem;
}
.pg4 p{
    font-size: .24rem;
    color: #9DA1A9;
    line-height: .45rem;
}
.pg4 p span{
    color: #1BA5FD;
}
</style>

