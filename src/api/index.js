export default {
  //获取公钥
  getPublicKey: '/m/public/getPublicKey',
  //首页
  index: '/app/index',
  getBannerList: '/app/banner/getBannerList',
  //注册
  getCountryList: '/app/country/getCountryList',
  getMobileCode: '/m/public/getMobileCode',
  register: '/m/public/register',
  //密码登录
  login: '/m/public/login',
  //验证码登录
  // loginCode: '/api/app/loginCode',
  loginCode: '/m/public/loginCode',
  //判断登录密码是否正确
  checkPassword: '/m/public/checkPassword',
  checkCode: '/m/public/checkCode',

  //猜币行情
  add: '/app/coinguess/add',
  getOrderList: '/app/coinguess/order/getOrderList',
  getResult: '/app/coinguess/getResult',
  getDetail: '/app/coinguess/getDetail',
  //产品列表
  getList: '/app/product_coinguess/getList',
  //账户
  customerDetail: '/app/customer/customerDetail',
  loginOut: '/app/loginOut', 
  balance: '/app/customer/balance',
  findBalance: '/app/customer/findBalance', //simple
  //充值
  getWalletAddress: '/app/customer/getWalletAddress',
  selectDepositInfo: '/app/deposit/selectDepositInfo',
  //提现地址
  withdrawalAccountList: '/app/withdrawal/withdrawalAccountList',
  insertWithdrawalAccount: '/app/withdrawal/insertWithdrawalAccount',
  updateWithdrawalAccount: '/app/withdrawal/updateWithdrawalAccount',
  deleteWithdrawalAccount: 'app/withdrawal/deleteWithdrawalAccount',
  //提现
  withdrawal: '/app/withdrawal/withdrawal',
  withdrawalList: '/app/withdrawal/withdrawalList',
  //支付密码
  isExistPayPassword: '/app/customer/isExistPayPassword',
  checkPayPassword: '/app/customer/checkPayPassword',    //校验支付密码
  updatePayPassword: '/m/customer/updatePayPassword',
  forgetPayPassword: '/app/customer/forgetPayPassword',
  //登录密码
  updatePassword: '/m/customer/updatePassword',
  forgetPassword: '/app/customer/forgetPassword',
  //修改手机号码
  updateMobile: '/m/customer/updateMobile',
  //邀请码
  inviteCodePage: '/app/customer/inviteCodePage',
  //反馈
  insert: '/app/sinsertuggestion/',
  //账户明细
  findLimit: '/app/transactions/findLimit',
  selectDepositInfo: '/app/deposit/selectDepositInfo',
  withdrawalList: '/app/withdrawal/withdrawalList',
  // 交易分成
  find: '/m/income/find',
  //公告列表 
  limit: 'app/notice/limit',
  info: 'app/notice/info'



}
