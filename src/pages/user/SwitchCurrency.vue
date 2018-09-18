<template>
    <div class='switch'>
        <header class="pubHead">
            <button @click="close" class="PubHeadBack"></button>
            币种切换
        </header>
        <div class="pg4">
            <p class="ETH" @click="switchselect(1)" :class="{crt:select==1}">ETH币</p>
            <p class="GET" @click="switchselect(2)" :class="{crt:select==2}">GET币</p>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            // select:true
            select:2
        }
    },
    props:['show'],
    methods:{
        close(){
            this.$emit('switch')
        },
        switchselect(ind){
            this.select = ind
            this.$emit('switchselect',ind)
            this.close()
        }
    }
}
</script>

<style scoped>
.switch{
    position:fixed;
    left: 0;
    top: 0;
    width: 100%;
    min-height: 100%;
    background: #eee;
}
.pubHead{
    background: #fff;
}
.pg4{
    padding: .6rem .4rem 0;
    background: #fff;
    overflow: hidden;
}
.pg4 p{
    padding-left: .8rem;
    line-height: .6rem;
    font-size: .28rem;
    color: #3F4D68;
    margin-bottom: .6rem;
}
.pg4 p::after{
    content: ' ';
    float: right;
    display: block;
    width: .5rem;
    height: .5rem;
    background: url(../../assets/noSelect.png) no-repeat left center;
    background-size: cover;
}
.pg4 p.crt::after{
    background: url(../../assets/select.png) no-repeat left center;
    background-size: cover;
}
.pg4 p.GET{
    background: url(../../assets/GET2.png) no-repeat left center;
    background-size: .6rem auto;
}
.pg4 p.ETH{
    background: url(../../assets/ETH2.png) no-repeat left center;
    background-size: .6rem auto;
}
</style>


