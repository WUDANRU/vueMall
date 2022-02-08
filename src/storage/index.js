//localStorage: 永久存储    sessionStorage: 随着浏览器的关闭，缓存将不在     cookie: 
//   Storage封装    sessionStorage
const STORAGE_KEY = 'mall'; // STORAGE_KEY是存储在mall里的
export default {
    // 存储值
    setItem(key, value, module_name) {
        if (module_name) {
            let val = this.getItem(module_name); //先把user(module_nam)取出来
            val[key] = value; //在user下面多附一个值，"a":2   {"user":{"userName":"jack","age":30,"sex":1,"a":2}}
            this.setItem(module_name, val);
        } else {
            let val = this.getStorage();
            val[key] = value;
            window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(val));
        }
    },
    // 获取某一个模块下面的属性user下面的userName
    getItem(key, module_name) {
        if (module_name) {
            let val = this.getItem(module_name); //this.getItem递归获取
            if (val) return val[key]; //获取某一个模块下面的属性user下面的userName
        }
        return this.getStorage()[key]; //获取到user //sessionStorage的key:mall sessionStorage的value{"user":{"userName":"jack","age":30,"sex":1}} 
    },
    // 获取浏览器缓存的信息
    getStorage() { // STORAGE_KEY是存储在mall里的，所以获取
        return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || '{}'); // '{}' 一开始可能是空的
    },
    clear(key, module_name) {
        let val = this.getStorage(); //指的是{"user":{"userName":"jack","age":30,"sex":1}} 
        if (module_name) {
            if (!val[module_name]) return; //这个没有写会报错，因为当sessionStorage没有key 没有value，这个没有写会报错
            delete val[module_name][key];
        } else {
            delete val[key];
        }
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    }
}