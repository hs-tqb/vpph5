<template>
    <div class="noticeDetail">
        <header class="pubHead">
            <button @click="back" class="PubHeadBack"></button>
            公告详情
        </header>
        <div class="tit">
            <h3>{{list.noticeTitle}}</h3>
            <span>{{splicetime(list.gmtCreate)}}</span>
        </div>
        <div class="text">
            <p v-for="(item,index) in noticeArr" :key="index">{{item}}</p>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            list: {
                noticeTitle: '',
                gmtCreate: '',
                noticeContent: ''
            }
        }
    },
    computed: {
        noticeArr() {
            return this.list.noticeContent.split('\r\n')
        }
    },
    methods: {
        back() {
            this.$router.go(-1)
        },
        splicetime(time) {
            let datatime = time.split(' ')
            return datatime[0]
        },
    },
    created() {
        let listsid = this.$route.query.id;
        this.$axios.post('info',{id:listsid}).then(res=>{
            this.list = res.data.data
        })
    }
}
</script>

<style scoped>
    .pubHead{
        border-width: 1px;
    }
    .tit{
        padding: .5rem .3rem .2rem;;
        border-bottom: .1rem solid #F6F6F6;
    }
    .tit h3{
        font-size: .44rem;
        line-height: .62rem;
        color: #000A2E;
        padding-bottom: .4rem;
    }
    .tit span{
        font-size: .24rem;
        line-height: .33rem;
        color: #9DA1A9;
    }
    .text{
        padding: .3rem;
    }
    .text P{
        font-size: .3rem;
        color: #626262;
        line-height: .57rem;
        text-align: left;
    }
</style>
