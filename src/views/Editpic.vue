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
                <el-table-column label="头像(查看大图)" align="center">
                    <template #default="scope">
                        <el-image class="table-td-thumb" :src="HOST+scope.row.photo" :preview-src-list="[HOST+scope.row.photo]">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="260" align="center">
                    <template #default="scope">
                        <el-button type="text" class="green" icon="el-icon-lx-copy" @click="copyPath(scope.$index, scope.row)">复制
                        </el-button>
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
        <el-dialog title="裁剪图片" v-model="editVisible" width="600px">
            <el-form label-width="70px">
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <vue-cropper ref="cropper" :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage"
                style="width: 100%; height: 400px"></vue-cropper>
            
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="crop-demo-btn" type="primary">选择图片
                        <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage" />
                    </el-button>
                    <el-button type="primary" @click="saveAvatar">上传并保存</el-button>
                </span>
            </template>

        </el-dialog>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { read,edit,save,update,del,fetchData, HOST,request} from "../api/index";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import avatar from "../assets/img/empty.jpg";
export default {
    name: "menu",
     components: {
        VueCropper,
    },
    setup() {
        
        const onSubmit = () => {};
        const imgSrc = ref(avatar);
        const cropImg = ref('');
        const cropper = ref(null);

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
            read('editp', query).then(res => {
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
                    del('editp', {id:tableData.value[index]['id']}).then(response => {
                        tableData.value.splice(index, 1);
                        ElMessage.success("删除成功");
                    })
                })
                .catch(() => {});
        };
        const copyPath = (a, b) => {
            function copyToClipboard(s){
               if(window.clipboardData){
                  window.clipboardData.setData('text',s);
               }else{
                  (function(s){
                     document.oncopy=function(e){
                        e.clipboardData.setData('text',s);
                        e.preventDefault();
                        document.oncopy=null;
                     }
                  })(s);
                  document.execCommand('Copy');
               }
            }
            copyToClipboard(HOST+b.photo)
            ElMessage.success("复制成功")
        }

        // 表格编辑时弹窗和保存
        const editVisible = ref(false);
        let form = reactive({
            id: '',
            name: "",
            photo: ""
          
        });
        let idx = -1;
    
        const setImage = (e) => {
            const file = e.target.files[0];
            if (!file.type.includes("image/")) {
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                editVisible.value = true;
                imgSrc.value = event.target.result;
                cropper.value && cropper.value.replace(event.target.result);
            };
            reader.readAsDataURL(file);
        };

        const handleEdit = (index, row) => {
            editVisible.value = true;
           
            Object.keys(form).forEach((item) => {
                form[item] = row[item];
            });
            
            imgSrc.value = HOST+form.photo+"?t="+new Date*1
            cropImg.value = imgSrc.value
            cropper.value && cropper.value.replace(cropImg.value);
         
            idx = index;
            
        }
     
        const handleCreate = (index, row) => {
            form.id = null
            editVisible.value = true;
        }


        const cropImage = () => {
            cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
        }

        const saveAvatar = () => {
            //将base64转换为文件
            let dataURLtoFile = (dataurl, filename) => { 
                let arr = dataurl.split(',')
                let mime = arr[0].match(/:(.*?);/)[1]
                let bstr = atob(arr[1])
                let n = bstr.length
                let u8arr = new Uint8Array(n)
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new File([u8arr], filename, { type: mime });
            }
            //调用
            var file = dataURLtoFile(cropImg.value, "thumb.png");
            var formData = new FormData();
            formData.append('thumb', file)
            request({url: 'upload/up_img', data: formData, method:'post', headerJson: false}).then(res => {
                form.photo = res.info
                if ( form.id ) {
                    update("editp", form).then(res => {
                        editVisible.value = false;
                        getData()
                    })
                } else {
                    save("editp", form).then(res => {
                        editVisible.value = false;
                        getData()
                    })
                }
            })
        };


        return {
            HOST,
            onSubmit,
            cropper,
            imgSrc,
            cropImg,
            setImage,
            cropImage,
            saveAvatar,

            copyPath,
            query,
            tableData,
            pageTotal,
            editVisible,
            form,
            handleSearch,
            handlePageChange,
            handleDelete,
            handleEdit,
            handleCreate,
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
.green {
    color: green;
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




.info {
    text-align: center;
    padding: 35px 0;
}
.info-image {
    position: relative;
    margin: auto;
    width: 100px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 50px;
    overflow: hidden;
}
.info-image img {
    width: 100%;
    height: 100%;
}
.info-edit {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
}
.info-edit i {
    color: #eee;
    font-size: 25px;
}
.info-image:hover .info-edit {
    opacity: 1;
}
.info-name {
    margin: 15px 0 10px;
    font-size: 24px;
    font-weight: 500;
    color: #262626;
}
.crop-demo-btn {
    position: relative;
}
.crop-input {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}
</style>
