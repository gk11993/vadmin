<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 菜单
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 下拉选择框 -->
       
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" @click="handleCreate" class="gk_add">添加</el-button> 
                <el-select v-model="query.address" placeholder="搜索字段" class="handle-select mr10">
                    <el-option key="1" label="名称" value="name"></el-option>
                    
                </el-select>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch" class="gk_search">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
               
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.page"
                    :page-size="query.limit" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-model="editVisible" width="30%">
            <el-form label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="权限列表">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="menu in menus" :label="menu.id" :key="menu">{{menu.name}}</el-checkbox>
                    </el-checkbox-group>

                </el-form-item>

            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { read,edit,save,update,del,fetchData } from "../api/index";

export default {
    name: "menu",
    setup() {
        const query = reactive({
            address:"",
            name:"",
            limit:10,
            page:1
        });
        const tableData = ref([])
        const pageTotal = ref(0)
        // 获取表格数据
        const getData = () => {
            read('role', query).then(res => {
                tableData.value = res.data
                pageTotal.value = res.total || 50
            })
        }
        getData()

        // 查询操作
        const handleSearch = () => {
            query.page = 1
            getData()
        };
        // 分页导航
        const handlePageChange = (val) => {
            query.page = val
            getData()
        };

        // 删除操作
        const handleDelete = (index) => {
            // 二次确认删除
            ElMessageBox.confirm("确定要删除吗？", "提示", {
                type: "warning",
            })
                .then(() => {
                    del('role', {id:tableData.value[index]['id']}).then(response => {
                        tableData.value.splice(index, 1);
                        ElMessage.success("删除成功");
                    })
                })
                .catch(() => {});
        };

        // 表格编辑时弹窗和保存
        const editVisible = ref(false);
        let form = reactive({
            name: "",
            admin_menu_ids: "",
            id: null
        });
        let idx = -1;
        const checkedCities = ref([])
        const cityOptions = ref([])
        
        fetchData().then(res => {
            cityOptions.value = res.list
        })

        const handleEdit = (index, row) => {
            idx = index;
            Object.keys(form).forEach((item) => {
                form[item] = row[item];
            });
            editVisible.value = true;
            let arr = form.admin_menu_ids.split(',')
            arr.forEach( (i, key) => arr[key] = parseInt(i))
            checkedCities.value = arr
        }
        const saveEdit = () => {
            editVisible.value = false;
            
            if ( form.id && idx != -1 ) {
                Object.keys(form).forEach((item) => {
                    tableData.value[idx][item] = form[item];
                });
                tableData.value[idx]['admin_menu_ids'] = checkedCities.value.join(',');
                form.admin_menu_ids = checkedCities.value.join(',')
                update('role', form).then(res => {
                    ElMessage.success(`修改第 ${idx + 1} 行成功`);
                })
            } else {
                form.admin_menu_ids = checkedCities.value.join(',')
                save('role', form).then(res => {
                    getData()
                })
            }
        };
        const handleCreate = (index, row) => {
            form.id = null
            editVisible.value = true;
            checkedCities.value = []
            idx = -1
        }

        return {
            cityOptions,
            checkAll: false,
            checkedCities,
            menus: cityOptions,
            isIndeterminate: true,

            query,
            tableData,
            pageTotal,
            editVisible,
            form,
            handleSearch,
            handlePageChange,
            handleDelete,
            handleEdit,
            saveEdit,
            handleCreate,
        }
    },
   
    methods: {
        handleCheckAllChange(val) {
            this.checkedCities = val ? this.cityOptions : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.menus.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.menus.length;
        }
        
        
        
    }
        
    
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.gk_add {
    margin-right: 10px;

}
.gk_search {
    background: #999;
}
</style>
