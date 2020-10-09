import axios from 'axios'
import {Message,Loading} from 'element-ui'
import { Promise } from 'mongoose'
import router from './router'

let loading

// 加载
function startLoading() {
  loading = Loading.service({
    lock:true,
    text:'加载中...',
    background:'rgba(0,0,0,0.7)'
  })
}
// // 结束
function endLoading() {
  loading.close()
}
// 请求拦截
axios.interceptors.request.use(config=>{
  startLoading()
  if(localStorage.eleToken){
    config.headers.Authorization = localStorage.eleToken;
  }
  return config;
},err =>{
  return Promise.reject(err)
}
)

// 响应拦截
axios.interceptors.response.use(response => {
  endLoading()
  return response
}, error => {

  endLoading()
  // return;
  Message.error(error.response.data)

  const { status } = error.response
  if (status == 401) {
      Message.error('token值无效，请重新登录')
      // 清除token
      localStorage.removeItem('eleToken')

      // 页面跳转
      router.push('/login')
  }
  return Promise.reject(error)
})

export default axios;