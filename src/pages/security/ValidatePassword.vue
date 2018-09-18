<template>
    <div>
        <header class="pubHead">
            <button @click="back" class="PubHeadBack"></button>
            验证身份
        </header>
        <div class='validate pg4'>
            <section>
                <label for="area">国家 / 地区</label>
                <p>{{countryName}}</p>
            </section>  
            <section>
                <label for="phoneNumber">手机号</label>
                <p>{{phoneNumber}}</p>
            </section> 
            <form v-if="validateWay" onkeydown="if(event.keyCode==13)return false;">
                <section>
                    <label for="passWord">密码</label>
                    <input type="password" required id="passWord" placeholder="请输入密码" v-model="passWord" maxlength="12" minlength="6">
                </section> 
            </form>
            <form v-else>
                <section class="input_container varifyCode">
                    <label for="verifyCode">验证码</label>
                    <input type="number" placeholder="请输入验证码" name="verifyCode"  v-model="verifyCode" oninput="if(value.length>6)value=value.slice(0,6)" onKeypress="if((event.keyCode<48 || event.keyCode>57)) event.returnValue=false" @mousewheel.prevent>
                    <button @click.prevent="getVerifyCode"  :class="{right_phone_number: rightPhoneNumber}" v-show="!computedTime">获取验证码</button>
                    <button @click.prevent v-show="computedTime" disabled>已发送({{computedTime}}s)</button>
                    
                </section> 
            </form>
            <button @click='next' class="btn_login" :disabled="!this.Allinput" :class='{high:this.Allinput}'>下一步</button>
            <section class="tabValidate">
                <a href="javascript:void(0);" @click="changeWay">
                    <span v-if="validateWay"> 切换至手机验证码验证</span>
                    <span v-else>切换为密码验证</span>
                </a>
            </section>
        </div>
    </div>
</template>

<script>
import { Button,Toast } from 'mint-ui';
export default {
    data(){
        return{
            getPhoneNumber:'',
            countryName:'',
            phoneNumber:'',
            passWord:'',
            verifyCode:'',
            computedTime: 0,
            validateWay:true,
            rightPhoneNumber: true,
            publicKey: '',//公钥
            plus: ''
        }
        
    },
    computed:{
        Allinput(){
            if(this.validateWay){
                if(this.passWord.length != 0){
                    return true
                }else return false
            }else{
                if(this.verifyCode.length != 0){
                    return true
                }else return false
            }
        }
    },
    methods: {
        back(){
            this.$router.go(-1)
        },
        changeWay(){
            this.validateWay = !this.validateWay
        },
        //获得验证码
        getVerifyCode() {
            let encrypted = this.plus.encrypt(this.getPhoneNumber)
            console.log(this.publicKey)
            console.log(encrypted)
            this.$axios.post('getMobileCode', {mobile: this.getPhoneNumber,skey: encrypted}).then(res => {
                this.computedTime = 30;
                this.timer = setInterval(() => {
                    this.computedTime --;
                    if (this.computedTime == 0) {
                        clearInterval(this.timer)
                    }
                }, 1000)
            })
        },
        //下一步
        next() {
            if(!this.validateWay) {
                let encrypted = this.plus.encrypt(this.verifyCode)
                if(this.verifyCode.length != 6){
                    Toast({
                        message: '短信验证码应为6位',
                        position: 'middle',
                        duration: 1200
                    });
                }else{
                    this.$axios.post('checkCode', {mobile: this.getPhoneNumber, code: encrypted}).then(res => {
                        this.$router.push('/resetPassword')
                        sessionStorage.setItem('securityToken',res.data.data.securityToken)
                        console.log(res.data.data.securityToken)
                    })
                }
            }else{
                let encrypted = this.plus.encrypt(this.passWord)
                this.$axios.post('checkPassword',{mobile: this.getPhoneNumber, password: encrypted}).then(res => {
                    this.$router.push('/resetPassword')
                    sessionStorage.setItem('securityToken',res.data.data.securityToken)
                    console.log(res.data.data.securityToken)
                })
            }
        }
    },
    created() {
        this.getPhoneNumber = localStorage.getItem('mobile')
        this.countryName = localStorage.getItem('countryName')
        this.phoneNumber = localStorage.getItem('phoneNumber')
        this.publicKey = localStorage.getItem('publicKey')
    },
    mounted(){
        this.plus = new JSEncrypt()
        this.plus.setPublicKey(this.publicKey)

    }
}
</script>

<style scoped>
.validate{
    padding-top: .2rem;
}
.validate section{
    display: flex;
    justify-content: space-between;
    margin-top: .6rem;
}
.validate section p,.validate section input{
    font-size: .28rem;
    color: #000A2E;
    line-height: .4rem;
}
.validate section input{
    text-align: right;
}
.varifyCode{
    padding:0;
}
.tabValidate a{
    margin: 0 auto;
    text-align: center;
    color: #1BA5FD;
    font-size: .22rem;
}
.input_container button{
    color: #1BA5FD;
}
</style>
