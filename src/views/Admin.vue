<template>
    <div class="Sales_list">
       <div class="Topname"></div>
       <!-- 下拉选择框 -->
       <div class="Topxzk">
        <el-button type="primary" @click="handleSearchtt">添加</el-button>
       </div>
       <!-- 表格1 -->
        <div class="biaoge1">
             <el-table  :data="Userlist.data" element-loading-text="正在查询中。。。" row-key="id" border fit highlight-current-row>
             <el-table-column prop="xh" label="序号" width="55" align="center"></el-table-column>
             <el-table-column prop="user_name" label="用户名"  align="center"></el-table-column>
             <el-table-column prop="real_name" label="姓名"  align="center"></el-table-column>
             <el-table-column prop="phone" label="电话"  align="center"></el-table-column>
             <el-table-column label="角色" width="180" align="center">
                    <template #default="scope">
                        <div v-if="scope.row.role===1">超管</div>
                        <div v-if="scope.row.role===2">销售</div>
                        <div v-if="scope.row.role===3">客服</div>
                    </template>
              </el-table-column>
             <el-table-column prop="value" label="状态" align="center">
               <template #default="scope">
                  <div>
                    {{ scope.row.lock===0?'正常':'禁用' }}
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
        </div>
        <div class="pagination">
                <!-- <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination> -->
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage1"
                        :page-size="10"
                        layout="total, prev, pager, next"
                        :total="Userlist.count">
                        </el-pagination>
            </div>
       <!--  -->
       <el-dialog title="" v-model="dialogFormVisible" width="30%">
            <el-form label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="Userdata.user_name"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="Userdata.real_name"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="Userdata.phone"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="Userdata.password"></el-input>
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
</template>

<script >
import { indexlist,adminread,newusers,newusersxg,deletesc} from "../api/index";
export default {
   data(){
        return {
            options: [
            {
                id: '1',
                label: '超管'
            }, {
                id: '2',
                label: '销售'
            }, { 
                id: '3',
                label: '客服'
            }],
            value: '',
            status: true,
            zhengchang:'正常',
            currentPage1: 1,
            dialogFormVisible:false,
            form:{},
            Userlist:[],
            panduan:'',
            arrr:{},
            detailsdata: '',
            listQuery:{
                user_name:'',
                field:'',
                keyword:'',
                limit:10,
                page:1
            },
            Userdata:{
                user_name:'',
                password:'',
                real_name:'',
                phone:'',
                role:'',
                lock:'',
            }
        }
    },
    created(){
      //this.getList()
     },
    methods:{
        handleSearchtt(){
            this.dialogFormVisible = true
            this.panduan = 1
            this.Userdata = {
                user_name:'',
                password:'',
                real_name:'',
                phone:'',
                role:'',
                lock:'',
            }
        },
        // 删除 
        handdelete(res){ 
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(res)
                this.delete(res)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
              });          
            });
        },
        delete(res){
            var arrr={id:res}
        deletesc(arrr).then(response => {
            this.getList()
            this.$message({
            type: 'success',
            message: '删除成功!'});
        })},
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
                this.Userdata.lock=0
            }else if(this.status==false){
                this.Userdata.lock=1
            }
            newusers(this.Userdata).then(response => {
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
                this.Userdata.lock=0
            }else if(this.status==false){
                this.Userdata.lock=1
            }
            newusersxg(this.Userdata).then(response => {
        
            if(response.code==200){
                this.dialogFormVisible=false
                this.getList()
            }else{
                this.$notify.error({
                title: '失败',
                message: response.msg})
            }
        })},
        handleSearch(res){
            this.dialogFormVisible=true
            this.panduan=2
            console.log(res)
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
            this.listQuery.user_name=localStorage.getItem("ms_username")
            indexlist(this.listQuery).then(response => {
                this.Userlist=response
                for(var i=0; this.Userlist.data.length>i;i++){
                    this.Userlist.data[i].xh=( this.listQuery.page-1)* this.listQuery.limit+(i+1)
                }
            })
            .catch(() => {
              this.Userlist = []
              // this.listLoading = false
            })
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.listQuery.page=val
            this.getList()
        },
        // 获取详情
        details(ind){
            var arrr={user_id:ind}
            adminread(arrr).then(response => {
            
                this.Userdata={
                    id:response.data.id,
                    user_name:response.data.user_name,
                    password:response.data.password,
                    real_name:response.data.real_name,
                    phone:response.data.phone,
                    role:response.data.role,
                    lock:response.data.lock,
                }
                this.Userdata.role=this.Userdata.role.toString()
                if(this.Userdata.lock==1){
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
.Sales_list{
    width: 100%;
    min-height: 800px;
    background: #fff;
    border-radius: 10px;
}
.Topname{
  padding: 15px;
}
.Topxzk{
  padding: 15px;  
}
.biaoge1{
    width: 98%;
    margin: 0 auto;
}
.customer{
    width: 250px;
    display: flex;
    align-items: center;
    margin-right: 40px;
    margin-left: 20px;
    margin-bottom: 30px;
}
</style>