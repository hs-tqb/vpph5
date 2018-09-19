<template>
    <div class="AboutUs">
        <header class="pubHead">
            <button @click="back" class="PubHeadBack"></button>
            关于我们
        </header>
        <p>
            ValPromise旨在构建去中心化金融金融合约交易协议，支持各种公链部署。让人人都可以自由发行交易金融合约。目前项目已落地应用（天气合约、数字货币价格期权），领先诸多区块链项目，累计用户过10万人，月活比例超过80%，应用内所有合约均由社群主导,自由提交和交易，单合约日最高交易额超过1200万VPP(约20万USDT)。<br>
            交易所：Fcoin<br>
            投资机构参与：分布式资本沈波，PreAngel Fund王利杰，温州资本，引力资本，裂变资本，Crypto Venture,首联资本，MDT基金会，QKC基金会，Themis基金会，OKEX超级节点帮实资本。项目的人民币业务公司，获得两轮投资，滴滴天使投资人王刚、腾讯创始人吴晓光、墨迹天气、明势资本。<br
            >优秀团队且充分磨合，源自多年沉淀股权投资项目，团队成员在同一项目下共事多年，特性互补，且以如香港中文大学、巴黎综合理工之数学博士、数据科学家等高层次技术人员、社群运营专家为核心，实力雄厚，其业务为中国平安、阳光保险数据天气精算技术服务。
        </p>
    </div>
</template>

<script>
export default {
    data() {
        return{

        }
    },
    methods: {
        back() {
            this.$router.go(-1)
        }
    }
}
</script>

<style scoped>
    .AboutUs{
        position: fixed;
        left: 50%;
        top: 0;
        width: 100%;
        max-width: 640px;
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;  
        transform: translateX(-50%);
    }
    .pubHead{
        border-width: 1px;
    }
    p{
        font-size: .3rem;
        color: #626262;
        line-height: .57rem;
        padding: .3rem;
    }
</style>

