import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
Vue.use(Vuex);

const state = {
    username: '', //登录用0
    cartCount: 0, //购物车商品数量
    // cartCount: -1, //测试写了-1会显示0就说明没错
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
});

// // 商城Vuex-muta
// export default {
//     saveUserName(state, username) {
//         state.username = username;
//     },
//     saveCartCount(state, count) {
//         state.cartCount = count;
//     }
// }

// // 商城Vuex-actions
// export default {
//     saveUserName(context, username) {
//         context.commit('saveUserName', username); //commit 提交
//     }, //context 上下文对象   username 参数
//     saveCartCount(context, count) {
//         context.commit('saveCartCount', count);
//     }
// }