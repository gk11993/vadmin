import request from '../utils/request';

// 登录
export function loginsss(data) {
    return request({
        url: '/admin/login',
        method: 'post',
        data
    })
}
// 退出登录dropout
export function dropout(data) {
    return request({
        url: '/admin/loginOut',
        method: 'post',
        data
    })
}
// 用户列表
export function indexlist(query) {
    return request({
        url: '/admin/admin/index',
        method: 'get',
        params: query
    })
}
// 用户详情adminread
export function adminread(query) {
return request({
        url: '/admin/admin/read',
        method: 'get',
        params: query
    })
}

// 新增 用户
export function newusers(data) {
    return request({
        url: '/admin/admin/add',
        method: 'post',
        data
    })
}
// 用户信息修改newusersxg
export function newusersxg(data) {
    return request({
        url: '/admin/admin/update',
        method: 'post',
        data
    })
}
// 用户删除deletesc
export function deletesc(data) {
    return request({
        url: '/admin/admin/delete',
        method: 'post',
        data
    })
}

// 获取菜单列表
export function fetchData(data) {
    return request({
        url: '/admin/menu',
        method: 'post',
        data
    })
}