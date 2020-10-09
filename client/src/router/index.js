import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
let token = localStorage.eleToken;
const routes = [
  { path: '/', redirect: '/index' },
  {
    path: '/login',
    name: 'login',
    component: ()=>import('../views/Login'),
  },
  {
    path: '/register',
    name: 'register',
    component:()=>import('../views/Register')
  },
  {
    path:'/index',
    name:'index',
    component:()=>import('../views/Index'),
    children:[
      {
        path:'',
        component:()=>import('../views/Home')
      },
      {
        path:'/home',
        name:'home',
        component:()=>import('../views/Home')
      },
      {
        path:'/infoshow',
        name:'infoshow',
        component:()=>import('../views/InfoShow')
      },
      {
        path:'/foundlist',
        name:'foundlist',
        component:()=>import('../views/FoundList')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{
  const isLogin = localStorage.eleToken ? true : false;
  if(isLogin && to.path == "/login"){
    next(`${from.path}`)
  }
  if(to.path == "/login" || to.path == "/register"){
    next();
  }else{
    isLogin ? next() : next('/login');
  }
})

export default router
