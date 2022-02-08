// let baseURL;
// switch (process.env.NODE_ENV) { //node.js的api,因为是在node.js下运行的，所以可以拿到node.js的api
//     case 'development':
//         baseURL = 'http://dev-mall-pre.springboot.cn/api';
//         break;
//     case 'test':
//         baseURL = 'http://test-mall-pre.springboot.cn/api';
//         break;
//     case 'prev':
//         baseURL = 'http://prev-mall-pre.springboot.cn/api';
//         break;
//     case 'prod':
//         baseURL = 'http://mall-pre.springboot.cn/api';
//         break;
//     default:
//         baseURL = 'http://mall-pre.springboot.cn/api';
//         break;
// }

// export default { //这个页面可以注释掉，不影响项目运行
//     baseURL
// }

let baseURL; //aa
switch (process.env.NODE_ENV) {
    case 'development':
        baseURL = 'http://dev-mall-pre.springboot.cn';
        break;
    case 'test':
        baseURL = 'http://test-mall-pre.springboot.cn';
        break;
    case 'prev':
        baseURL = 'http://prev-mall-pre.springboot.cn';
        break;
    case 'prod':
        baseURL = 'http://mall-pre.springboot.cn';
        break;
    default:
        baseURL = 'http://mall-pre.springboot.cn';
        break;
}

export default { //这个页面可以注释掉，不影响项目运行
    baseURL
}