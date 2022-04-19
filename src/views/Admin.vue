<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 菜单
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
           <!-- <div class="Topname"></div> -->
           <!-- 下拉选择框 -->
          <!--  <div class="Topxzk">
            <el-button type="primary" @click="handleSearchtt">添加</el-button>  
           </div> -->
            <div class="handle-box">
                <el-button type="primary" @click="handleSearchtt">添加</el-button>
            </div>
           <!-- 表格1 -->
            <el-table  :data="Userlist.data" element-loading-text="正在查询中。。。" row-key="id" border fit highlight-current-row>
                <el-table-column prop="xh" label="序号" width="55" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名"  align="center"></el-table-column>
                <el-table-column prop="name" label="姓名"  align="center"></el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template #default="scope">
                        <el-image class="table-td-thumb" :src="scope.row.thumb" :preview-src-list="[scope.row.thumb]">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="电话"  align="center"></el-table-column>
                <el-table-column prop="role" label="角色"  align="center"></el-table-column>

                 <!-- <el-table-column label="角色" width="180" align="center">
                        <template #default="scope">

                            <div v-if="scope.row.role===1">超管</div>
                            <div v-if="scope.row.role===1">超管</div>

                            <div v-if="scope.row.role===2">销售</div>
                            <div v-if="scope.row.role===3">客服</div>
                        </template>
                  </el-table-column> -->
                <el-table-column prop="value" label="状态" align="center">
                   <template #default="scope">
                      <div>
                        {{ !scope.row.status?'正常':'禁用' }}
                      </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="primary" size="mini" @click="handleSearch(scope.row.id)">操作</el-button>
                        <el-button type="danger" size="mini" @click="handdelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            
            <div class="pagination">
                <!-- <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination> -->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage1"
                    :page-size="listQuery.limit"
                    layout="total, prev, pager, next"
                    :total="Userlist.count">
                </el-pagination>
            </div>
           <!--  -->
           <el-dialog title="" v-model="dialogFormVisible" width="30%">
                <el-form label-width="70px">
                    <el-form-item label="用户名">
                        <el-input v-model="Userdata.username"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input v-model="Userdata.name"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input v-model="Userdata.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input type="password" v-model="Userdata.password"></el-input>
                    </el-form-item>

                    
                    <el-form-item label="头像">
                        <el-upload 
                          name="thumb"
                          action="http://server.zxhl.com.cn/upload/up_img"
                          :limit="1"
                          :on-exceed="handleExceed"
                          :on-success="handleAvatarSuccess"
                          :before-remove="beforeRemove"
                          :on-remove="handleRemove"
                         >
                         <el-col><el-avatar
                            :src="imageUrl"
                            ></el-avatar></el-col>
                          <el-button>上传图片</el-button>

                        </el-upload>
                    </el-form-item>
                </el-form>
                <div>
                    <div class="customer" > 
                       <div style="width: 55px;">角色</div>
                       <el-select v-model="Userdata.role" placeholder="请选择">
                          <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                          </el-option>
                        </el-select>
                    </div>
                    <div class="customer" > 
                       <div style="width: 55px;">状态</div>
                       <el-switch
                        v-model="status"
                        active-color="#13ce66"
                        :active-text="zhengchang"
                       
                        @click="xuanz"
                        inactive-color="#ff4949">
                      </el-switch>
                      <div style="width: 55px;"></div>
                    </div>
                </div>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="saveEdit">确 定</el-button>
                    </span>
                </template>
            </el-dialog>
           <!--  -->
        </div>
    </div>
</template>

<script >
import { read,edit,save,update,del,removeImg } from "../api/index";
export default {
   data(){
        return {
            imageUrl: '',
            options: [],
            value: '',
            status: true,
            zhengchang:'正常',
            currentPage1: 1,
            dialogFormVisible:false,
            form:{},
            Userlist: [],
            panduan:'',
            arrr:{},
            detailsdata: '',
            listQuery:{
                username:'',
                field:'',
                keyword:'',
                limit:10,
                page:1
            },
            Userdata:{
                username:'',
                password:'',
                name:'',
                phone:'',
                role:'',
                status:'',
            }
        }
    },
    created(){
        this.getRole()
        this.getList()
    },
    methods:{
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        // beforeRemove(file, fileList) {
        //     return this.$confirm(`确定移除 ${ file.name }？`);
        // },
        handleRemove(file, fileList) {
            removeImg({thumb:this.imageUrl}).then(response => {
                this.imageUrl = ''
            })

            //return this.$confirm(`确定移除 ${ file.name }？`);
        },
        
        handleAvatarSuccess(res, file) {
            this.imageUrl = "http://server.zxhl.com.cn/"+file.response.info;
            console.log(this.imageUrl)
        },

        handleSearchtt(){
            this.imageUrl = ''
            this.dialogFormVisible = true
            this.panduan = 1
            this.Userdata = {
                username:'',
                password:'',
                name:'',
                phone:'',
                role:'',
                status:'',
            }
        },
        // 删除 
        handdelete(res){ 
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delete(res)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
              });
            });
        },
        delete(res){
            console.log('enrer')
            var arrr={id:res}
        del('admin', arrr).then(response => {
            this.getList()
            this.$message({
            type: 'success',
            message: '删除成功!'});
        })
        },
        // 确认按钮
        saveEdit(){
            if (this.panduan==1) {
                this.newqqq()
            }else if (this.panduan==2) {
                this.newxg()
            }
        },
        // 新增
        newqqq(){
            if(this.status==true){
                this.Userdata.status=0
            }else if(this.status==false){
                this.Userdata.status=1
            }
            this.Userdata.img = this.imageUrl
            this.Userdata.admin_role_id = this.Userdata.role
            save(this.Userdata).then(response => {
            if(response.code==200){
                this.dialogFormVisible=false
                this.getList()
            }else{
                this.$notify.error({
                title: '失败',
                message: response.msg})
            }
        })},
        
        // 修改
        newxg(){
            if(this.status==true){
                this.Userdata.status=0
            }else if(this.status==false){
                this.Userdata.status=1
            }
            this.Userdata.img = this.imageUrl
            update('admin', this.Userdata).then(response => {
                if(response.code==200){
                    this.dialogFormVisible=false
                    this.getList()
                }else{
                    this.$notify.error({
                    title: '失败',
                    message: response.msg})
                }
            })
        },
        handleSearch(res){
            this.imageUrl = ''
            this.dialogFormVisible=true
            this.panduan=2
            this.details(res)
        },
        xuanz(){
            if(this.status==true){
                this.zhengchang='正常'
            }else if(this.status==false){
                this.zhengchang='禁用'
            }
        },
        getList(){
            this.listQuery.username=localStorage.getItem("ms_username")
            read('admin', this.listQuery).then(response => {
                this.Userlist=response
                this.Userlist.count = response.total

                for(var i=0; this.Userlist.data.length>i;i++){
                    this.Userlist.data[i].xh=( this.listQuery.page-1)* this.listQuery.limit+(i+1)
                    this.Userlist.data[i].role = response.data[i].role
                    this.Userlist.data[i].phone = response.data[i].phone
                    this.Userlist.data[i].name = response.data[i].name
                    this.Userlist.data[i].username = response.data[i].username
                    this.Userlist.data[i].thumb = "http://server.zxhl.com.cn/"+response.data[i].img

                }
            })
            .catch(() => {
              this.Userlist = []
              // this.listLoading = false
            })
        },
        handleCurrentChange(val) {
            this.listQuery.page=val
            this.getList()
        },
        //获取角色列表
        async getRole() {
            await read('role', {page:1,limit:10e8-1}).then(response => {
                for (var i = 0; i < response.data.length; i++) {
                    this.options.push({
                        id: response.data[i].id,
                        label: response.data[i].name
                    })
                }
            })
            .catch(() => {
              this.Userlist = []
              // this.listLoading = false
            })
        },
        // 获取详情
        details(ind){
            var arrr={id:ind}
            edit('admin', arrr).then(response => {
                this.Userdata={
                    id:response.id,
                    username:response.username,
                    password:response.password,
                    name:response.name,
                    phone:response.phone,
                    role:response.admin_role_id,
                    status:response.status,
                }

                this.imageUrl = "http://server.zxhl.com.cn/"+response.img
                //this.Userdata.role=this.Userdata.role.toString()
                if(this.Userdata.status==1){
                    this.status=false
                }else{
                   this.status=true 
                }
                if(this.status==true){
                    this.zhengchang='正常'
                }else if(this.status==false){
                   this.zhengchang='禁用'
                }
            }).catch(() => {
              this.detailsdata = []
              // this.listLoading = false
            })
        }
    }
};
</script>

<style scoped>
/*.Sales_list{
    width: 100%;
    min-height: 800px;
    background: #fff;
    border-radius: 10px;
}*/
/*.Topname{
  padding: 15px;
}
.Topxzk{
  padding: 15px;  
}
.biaoge1{
    width: 98%;
    margin: 0 auto;
}*/
.handle-box {
    margin-bottom: 20px;
}
.customer{
    width: 250px;
    display: flex;
    align-items: center;
    margin-right: 40px;
    margin-left: 20px;
    margin-bottom: 30px;
}
 
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

/deep/ .el-upload {
        display: inline;
        text-align: center;
        cursor: pointer;
        outline: 0;
    }
 
 .table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}  

</style>