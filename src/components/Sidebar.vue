<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template #title>
                            <i :class="item.icon"></i>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template #title>{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";


export default {
    setup() {
        let menus = JSON.parse(localStorage.getItem("ms_menus"))
        let arr = []
        for (var i = 0; i < menus.length; i++) {
            arr.push({
                icon: menus[i].icon,
                index: menus[i].view,
                title: menus[i].name,
                id: menus[i].id,
                pid: menus[i].pid,
                level: menus[i].level,
                subs: []
            })
        }

        for (let a of arr) {
            findFather(arr, a)
        }
        for (var i = arr.length - 1; i >= 0; i--) {
            if ( arr[i].subs.length == 0 ) {
                arr[i].subs = undefined
            }
        }
        
        arr = JSON.parse(JSON.stringify(arr))
        for (var i = arr.length - 1; i >= 0; i--) {
            if ( arr[i].level != 0 ) {
                arr.splice(i, 1)
            }
        }

        let items = arr

        const route = useRoute();

        const onRoutes = computed(() => {
            return route.path;
        });

        const store = useStore();
        const collapse = computed(() => store.state.collapse);

        return {
            items,
            onRoutes,
            collapse,
            arr:[]
        };
    },
    created(){
        this.da()
    },
    methods:{
        da() {
            //console.log(...arr)
            //this.items.push(...arr) 
        }
    }
};
function findFather(obj, current) {
    for ( let o of obj ) {
        if ( o.id == current.pid ) {
            o.subs.unshift(current)
        }
    }
}

</script>


<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
