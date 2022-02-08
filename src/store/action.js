// 商城Vuex-actions
export default {
    saveUserName(context, username) {
        context.commit('saveUserName', username); //commit 提交
    }, //context 上下文对象   username 参数
    saveCartCount(context, count) {
        context.commit('saveCartCount', count);
    }
}