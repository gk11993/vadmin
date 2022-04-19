//import request from '../utils/request';

let HOST = 'http://server.zxhl.com.cn/'
let IsDumpRequest = true
let RequestIncrement = 0
let RequestTime = 0
export { HOST }

export let request = obj => {
    return new Promise((resolve, reject) => {
        if ( obj.url.indexOf("http") == -1 ) obj.url = HOST + obj.url
        if ( !obj.data ) obj.data = obj.params
        if ( obj.method.toUpperCase() == 'GET' ) {
            let data = obj.data
            let ar = []
            for (let i in data) data[i] && typeof(data[i])!='object' ? ar.push(`${i}=${data[i]}`) : undefined
            obj.url = `${obj.url}?${ar.join('&')}`
        }

        let x = new XMLHttpRequest()
        x.open(obj.method, obj.url, true)
        for (let i in obj.headers) x.setRequestHeader(i, obj.headers[i])
        let tok = localStorage.getItem("ms_token")
        if (tok) x.setRequestHeader('Authorization', tok)
        if ( obj.headerJson !== false ) x.setRequestHeader('Content-Type', 'application/json')
        if ( IsDumpRequest ) RequestTime = new Date*1
        obj.headerJson !== false?x.send(JSON.stringify(obj.data)):x.send(obj.data)
        x.onreadystatechange = () => {
            if (x.readyState === 4) {
                if (x.status >= 200 && x.status < 300 || x.status === 304) {
                    if ( IsDumpRequest ) {
                        console.log(`-------------- ${RequestIncrement} --------------`)
                        console.log('%c     url: '+obj.url, 'background:rgba(250, 255, 0, 0.4);')
                        console.log('%c  method: '+obj.method, 'background:rgba(250, 255, 0, 0.4);')
                        console.log('%c   param: '+JSON.stringify(obj.data), 'background:rgba(250, 255, 0, 0.4);')
                        console.log('%cresponse: '+x.response, 'background:rgba(250, 255, 0, 0.4);')
                        console.log(JSON.parse(x.response))
                        console.log('%cfinish in %c'+(new Date*1-RequestTime)+" %cms", 'background:rgba(250, 255, 0, 0.4);', 'color:red;background:rgba(250, 255, 0, 0.4);', 'color:black;background:rgba(250, 255, 0, 0.4);')
                        RequestIncrement++
                    }
                    resolve(JSON.parse(x.response))
                } else {
                    reject({code: x.status, msg: JSON.parse(x.response)})
                }
            }
        }
    })
}



// 登录
export function loginsss(data) {
    return request({
        url: 'admin/login',
        method: 'post',
        data
    })
}
// 退出登录dropout
export function dropout(data) {
    return request({
        url: 'admin/loginOut',
        method: 'post',
        data
    })
}
// 获取菜单列表
export function fetchData(data={}) {
    return request({
        url: 'admin/menu',
        method: 'post',
        data
    })
}


// 模板查询
export function read(controllor, query) {
    return request({
        url: `${controllor}/read`,
        method: 'get',
        params: query
    })
}
// 模板查询单条
export function edit(controllor, data) {
return request({
        url: `${controllor}/${data.id}/edit`,
        method: 'get',
        data
    })
}
// 模板新增
export function save(controllor, data) {
    return request({
        url: `${controllor}`,
        method: 'post',
        data
    })
}
// 模板修改
export function update(controllor, data) {
    return request({
        url: `${controllor}/${data.id}`,
        method: 'put',
        data
    })
}
// 模板删除
export function del(controllor, data) {
    return request({
        url: `${controllor}/${data.id}`,
        method: 'delete',
        data
    })
}




// 删除图片
export function removeImg(data) {
    return request({
        url: 'upload/remove_img',
        method: 'post',
        params: data
    })
}

