import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/home'
import Index from './pages/index'
Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            name: 'home',
            component: Home,
            redirect: '/index', //重定向，默认会跳到index页面
            children: [{
                path: '/index',
                name: 'index',
                component: Index,
            }, {
                path: '/product/:id', //http://localhost:8081/#/product/48
                name: 'product',
                component: () =>
                    import ('./pages/product.vue')
            }, {
                path: '/detail/:id', //http://localhost:8081/#/detail/48
                name: 'detail',
                component: () =>
                    import ('./pages/detail.vue')
            }]
        },
        {
            path: '/register', //query传参用path 
            name: 'register', //params传参用name
            component: () =>
                import ('./pages/register.vue')
        },
        {
            path: '/login', //query传参用path 
            name: 'login', //params传参用name
            component: () =>
                import ('./pages/login.vue')
        },
        {
            path: '/cart',
            name: 'cart',
            component: () =>
                import ('./pages/cart.vue')
        },
        {
            path: '/order',
            name: 'order',
            component: () =>
                import ('./pages/order.vue'),
            //order.vue其实是没有用到的(http://localhost:8081/#/order)，里面写了<router-view>是给children里面的用的(//http://localhost:8081/#/order/confirm)
            children: [{
                    path: 'list', //这个不要写成  path: '/list',  path: '/confirm', 内容会加载不出来
                    name: 'order-list',
                    component: () =>
                        import ('./pages/orderList.vue')
                },
                {
                    path: 'confirm', //http://localhost:8081/#/order/confirm
                    name: 'order-confirm',
                    component: () =>
                        import ('./pages/orderConfirm.vue')
                },
                {
                    path: 'pay', //http://localhost:8081/#/order/pay
                    name: 'order-pay',
                    component: () =>
                        import ('./pages/orderPay.vue')
                },
                {
                    path: 'alipay',
                    name: 'alipay',
                    component: () =>
                        import ('./pages/alipay.vue')
                }
            ]
        }
    ]
});