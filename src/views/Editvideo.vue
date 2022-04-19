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
                        <el-image class="table-td-thumb" :src="HOST+scope.row.thumb" :preview-src-list="[HOST+scope.row.thumb]">
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
        <el-dialog title="裁剪图片" v-model="editVisible" width="600px" @close='closeDialog'>
            <el-form label-width="70px">
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            
            
            <video id="video" controls :src=fileUrl 
                style="width: 100%; height: 100%; object-fit: fill">
            </video>

            <el-form label-width="70px">
                
                <el-form-item label="上传进度">
                    <el-progress :percentage="percentage" color="blue" class="progress"></el-progress>
                    <div> {{progressInfo}} </div>
                </el-form-item>
            </el-form>
         
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="crop-demo-btn" type="primary">选择视频
                        <input class="crop-input" type="file" name="image"  @change="setImage" />
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
            read('editv', query).then(res => {
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
                    del('editv', {id:tableData.value[index]['id']}).then(response => {
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
            copyToClipboard(HOST+b.video)
            ElMessage.success("复制成功")
        }

        // 表格编辑时弹窗和保存
        const editVisible = ref(false);
        let form = reactive({
            id: null,
            name: "",
            thumb: "",
            video: "",
          
        });
        let idx = -1;
    
        const fileUrl = ref("")


        let fileObj = null;
        const setImage = (e) => {
            const file = e.target.files[0];
            fileObj = file
            var url = null;
            if (window.createObjectURL != undefined) { // basic
                url = window.createObjectURL(file);
            } else if (window.URL != undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file);
            }
            fileUrl.value = url
        };

        const handleEdit = (index, row) => {
            editVisible.value = true;
           
            Object.keys(form).forEach((item) => {
                form[item] = row[item];
            });

            fileUrl.value = HOST+form.video
            
            console.log(form)
            //idx = index;
        }
     
        const handleCreate = (index, row) => {
            form.id = null
            editVisible.value = true;
        }


        var xhr;//异步请求对象
        var ot; //时间
        var oloaded;//大小
        const progressInfo = ref()
        const percentage = ref()
        //上传进度实现方法，上传过程中会频繁调用该方法
        function progressFunction(evt) { 
            // event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
            if(evt.lengthComputable) {
                percentage.value = Math.round(evt.loaded / evt.total * 100)
            }
         
            var time = 0
            var nt = new Date().getTime(); //获取当前时间
            var pertime = (nt - ot) / 1000; //计算出上次调用该方法时到现在的时间差，单位为s
            ot = new Date().getTime(); //重新赋值时间，用于下次计算
            var perload = evt.loaded - oloaded; //计算该分段上传的文件大小，单位b 
            oloaded = evt.loaded; //重新赋值已上传文件大小，用以下次计算
         
            //上传速度计算
            var speed = perload / pertime; //单位b/s
            var bspeed = speed;
            var units = 'b/s'; //单位名称
            if(speed / 1024 > 1) {
              speed = speed / 1024;
              units = 'k/s';
            }
            if(speed / 1024 > 1) {
                speed = speed / 1024;
                units = 'M/s';
            }
            speed = speed.toFixed(1);
            //剩余时间
            var resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
            time = '上传速度：' + speed + units + ',剩余时间：' + resttime + 's';
            
            progressInfo.value = time
            if (bspeed == 0) progressInfo.value = '上传已取消';
        }
        //上传成功响应
        function uploadComplete(evt) {
            //服务断接收完文件返回的结果 注意返回的字符串要去掉双引号
            if (evt.target.responseText) {
                let ret = JSON.parse(evt.target.responseText)
                form.thumb = ret.thumb
                form.video = ret.video
               
                if ( form.id ) {
                    update('editv', form).then(response => {
                        fileObj = null
                        editVisible.value = false;
                        getData()
                        ElMessage.success("更新成功");
                    })
                } else {
                    save('editv', form).then(response => {
                        fileObj = null
                        editVisible.value = false;
                        getData()
                        ElMessage.success("添加成功");
                    })
                }
                
            }else{
                ElMessage.warning("上传失败！");
            }
        }
        //上传失败
        const uploadFailed = (evt) => {
            ElMessage.warning("上传失败！");
        }

        const saveAvatar = () => {
            if ( !fileObj ) {
                if ( form.id ) {
                    update('editv', form).then(response => {
                        editVisible.value = false;
                        getData()
                        ElMessage.success("更新成功");
                    })
                } else {
                    save('editv', form).then(response => {
                        editVisible.value = false;
                        getData()
                        ElMessage.success("添加成功");
                    })
                }
                return ;
            }

            var url = HOST+"upload/up_video"; // 接收上传文件的后台地址 
            let formData = new FormData(); // FormData 对象
            formData.append("video", fileObj); // 文件对象 
            xhr = new XMLHttpRequest(); // XMLHttpRequest 对象
            xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
            xhr.onload = uploadComplete; //请求完成
            xhr.onerror = uploadFailed; //请求失败
            xhr.upload.onprogress = progressFunction; //【上传进度调用方法实现】
            xhr.upload.onloadstart = function() { //上传开始执行方法
              ot = new Date().getTime(); //设置上传开始时间
              oloaded = 0; //设置上传开始时，以上传的文件大小为0
            };
            xhr.send(formData); //开始上传，发送form数据
        }
        
        const pauseVideo = () => {
            let video = document.getElementById('video')
            if ( !video.paused ) {
                video.pause()
            }
        }

        const closeDialog = () => {
            pauseVideo()
        }

        
        return {
            fileUrl,
            closeDialog,
            percentage,
            progressInfo,

            HOST,
     
            setImage,
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
.progress {
    margin-top: 10px;
}
</style>
