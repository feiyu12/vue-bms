
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const types={
  // 是否被认证过
  SET_IS_AUTNENTIATED : 'SET_IS_AUTNENTIATED',

  // 用户信息
  SET_USER:'SET_USER'
}

const state = {
  isAutnenticated:false,
  user:{}
}

const getters = {
  isAutnenticated:state => state.isAutnenticated,
  user:user=>state.user
}

const mutations = {
  [types.SET_IS_AUTNENTIATED](state,isAutnenticated){
    if(isAutnenticated){
      state.isAutnenticated = isAutnenticated
    }else{
      state.isAutnenticated = false;
    }
  },
  [types.SET_USER](state,user){
    if(user){
      state.user = user;
    }else{
      state.user = {};
    }
  }
}

const actions = {
  setIsAutnenticated:({commit},isAutnenticated)=>{
    commit(types.SET_IS_AUTNENTIATED,isAutnenticated)
  },
  setUser:({commit},user)=>{
    commit(types.SET_USER,user)
  },
  clearCurrentState:({commit})=>{
    commit(types.SET_IS_AUTNENTIATED,false);
    commit(types.SET_USER,null)
  }
}
export default new Vuex.Store({
 state,
 mutations,
 getters,
 actions
})
