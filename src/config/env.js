const env = { 
  development: {
    baseURL:''
  },
  test: {
    baseURL:''
  },
  production: {
    baseURL:'http://mg.valp.io'
    // baseURL:'http://139.199.85.231:8081'
  }
};
export default env[process.env.ENV_NAME || process.env.NODE_ENV]
