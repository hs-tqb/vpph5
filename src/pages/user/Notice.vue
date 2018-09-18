<template>
    <div class="notice">
        <header class="pubHead">
            <button @click="back" class="PubHeadBack"></button>
            公告
        </header>
        <div class="lists" ref="wrapper">
            <ul>
                <router-link v-for='(item,index) in lists' :key='index' :to="{path:'/noticeDetail',query:{ id:item.id}}">
                    <h3>{{item.noticeTitle}}</h3>
                    <p>{{item.noticeContent}}</p>
                    <span>{{splicetime(item.gmtCreate)}}</span>
                </router-link>
            </ul>
            <p v-if='nodelist'>暂无相关数据~</p>
        </div>
    </div>
</template>

<script>
import Bscroll from 'better-scroll'
export default {
    data(){
        return{
            liststotal: '',
            listspages: 1,
            lists: [],
            nodelist: false
        }
    },
    methods: {
        back(){
            this.$router.go(-1)
        },
        splicetime(time) {
            let datatime = time.split(' ')
            return datatime[0]
        }
    },
    created() {
        let that = this
        this.$axios.post('limit',{}).then(res=>{
            this.liststotal = res.data.data.total
            // 判断是否有数据
            if(this.liststotal==0){
                this.nodelist =true
            }
            this.lists = res.data.data.rows
            this.$nextTick(() => {
                this.scroll = new Bscroll(this.$refs.wrapper, {
                    probeType : 2,
                    pullUpLoad: true,
                    click: true,
                    tap: true,
                    pullUpload: {
                        threshold: -30
                    }
                })
                this.scroll.on('pullingUp', () => {
                    if(that.liststotal <= that.lists.length){
                        that.scroll.finishPullUp()
                        that.scroll.refresh()
                    }else{
                        that.listspages = that.listspages + 1
                        that.$axios.post('limit',{currentPage: that.listspages,}).then(res=>{
                            that.lists = that.lists.concat(res.data.data.rows)
                            if(that.lists.length >= that.liststotal) {
                            }
                            that.scroll.finishPullUp()
                            that.scroll.refresh()
                        })
                    }
                    
                })
            })
        })
    }
}
</script>

<style scoped>
.notice{
    background: #eee;
    height: 100%;
}
.pubHead{
    border:0;
    margin-bottom: 1px;
    background: #fff;
    box-sizing: border-box;
    height: .99rem;
}
.lists{
    position: relative;
    height: calc(100% - 1rem);
    overflow-y: auto;
}
.lists a{
    background: #fff;
    margin-bottom: .2rem;
    padding: .3rem .3rem .2rem;
}
.lists a h3{
    font-size: .36rem;
    color: #000A2E;
    line-height: .5rem;
    font-weight: 100;
    text-overflow: ellipsis;
    overflow: hidden;
    display:-webkit-box; 
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2; 
        
}
.lists a p{
    padding-top: .08rem;
    font-size: .24rem;
    color: #626262;
    line-height: .39rem;
    text-overflow: ellipsis;
    overflow: hidden;
    display:-webkit-box; 
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
}
.lists a span{
    display: block;
    padding-top: .2rem;
    text-align: right;
    font-size: .24rem;
    line-height: .33rem;
    color: #9DA1A9;
}
.lists > p{
    position: absolute;
    top: 50%;
    left: 50%;
    padding-top: 1.24rem;
    font-size: .28rem;
    line-height: .4rem;
    color: #9DA1A9;
    background: url(../../assets/noinfor.png) no-repeat top center;
    background-size: 100% auto;
    transform: translate3d(-50%,-50%,0)
}
</style>


