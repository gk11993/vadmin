import {createRouter, createWebHashHistory} from "vue-router";
import Home from "../views/Home.vue";

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
            }, {
                path: "/admin",
                name: "admin",
                meta: {
                    title: '用户管理'
                },
                component: () => import ( /* webpackChunkName: "admin" */ "../views/Admin.vue")
            }, {
                path: "/menu",
                name: "Menu",
                meta: {
                    title: '菜单'
                },
                component: () => import ( /* webpackChunkName: "menu" */ "../views/Menu.vue")
            }, {
                path: '/404',
                name: '404',
                meta: {
                    title: '找不到页面'
                },
                component: () => import (/* webpackChunkName: "404" */ '../views/404.vue')
            }, {
                path: '/403',
                name: '403',
                meta: {
                    title: '没有权限'
                },
                component: () => import (/* webpackChunkName: "403" */ '../views/403.vue')
            }, {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心'
                },
                component: () => import (/* webpackChunkName: "user" */ '../views/User.vue')
            }, {
                path: '/role',
                name: 'role',
                meta: {
                    title: '管理员分组'
                },
                component: () => import (/* webpackChunkName: "user" */ '../views/Role.vue')
            }, {
                path: '/editpic',
                name: 'editpic',
                meta: {
                    title: '图片'
                },
                component: () => import (/* webpackChunkName: "user" */ '../views/Editpic.vue')
            }, {
                path: '/editvideo',
                name: 'editvideo',
                meta: {
                    title: '视频'
                },
                component: () => import (/* webpackChunkName: "user" */ '../views/Editvideo.vue')
            }
        ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import ( /* webpackChunkName: "login" */ "../views/Login.vue")
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_username');
    
    if (!role && to.path !== '/login') {
        next('/login');
    } else if ( role && to.path == '/login' ) {
        next('/dashboard')
    } else {
         next()
    }
});

export default router;