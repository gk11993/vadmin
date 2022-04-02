import axios from 'axios';
import { ElMessage } from "element-plus";
//  axios.defaults.withCredentials = true
const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
      baseURL: 'http://server.zxhl.com.cn',
      //baseURL: "http://127.0.0.1/vadmin/public",
    // timeout: 30000
});

service.interceptors.request.use(
    config => {
        var tok=localStorage.getItem("ms_token");
        if (tok) {
             config.headers['Authorization'] = tok
          }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject(response);
        }
    },
    error => {
        if(error.response.status === 403){
           console.log(error.response.data.msg)
           ElMessage.error(error.response.data.msg);
           localStorage.removeItem("ms_username");
           localStorage.removeItem("ms_name");
           localStorage.removeItem("ms_userid");
           localStorage.removeItem("ms_menus");
           localStorage.removeItem("ms_token");
           localStorage.removeItem("ms_img");
           this.$router.push('/login');
       }
        return Promise.reject();
    }
);

export default service;
