<template>
  <div class="fillcontain">
    <div>
      <el-form :inline="true" ref="search_data" :model="search_data">
        <el-form-item label="投标时间筛选:">
          <el-date-picker
            v-model="search_data.startTime"
            type="datetime"
            placeholder="选择开始时间"
          ></el-date-picker
          >--
          <el-date-picker
            v-model="search_data.endTime"
            type="datetime"
            placeholder="选择结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            icon="search"
            @click="onScreeoutMoney()"
            >筛选</el-button
          >
        </el-form-item>
        <el-form-item class="btnRight">
          <el-button
            type="primary"
            size="small"
            icon="view"
            @click="onAddMoney()"
            v-if="user.identity == 'manager'"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table
        v-if="tableData.length > 0"
        :data="tableData"
        max-height="450"
        border
        :default-sort="{ prop: 'date', order: 'descending' }"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="70"
        ></el-table-column>
        <el-table-column
          prop="date"
          label="创建时间"
          align="center"
          width="250"
          sortable
        >
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px"
              >{{ new Date(scope.row.date).getFullYear().toString()
              }}-{{ (new Date(scope.row.date).getMonth())+1 > 10 ? (new Date(scope.row.date).getMonth())+1 :  ('0'+((new Date(scope.row.date).getMonth())+1).toString()) 
              }}-{{ (new Date(scope.row.date).getDate()) > 10 ? (new Date(scope.row.date).getDate()) :  ('0'+((new Date(scope.row.date).getDate())).toString())
              }}{{" "}}{{(new Date(scope.row.date).getHours()) > 10 ? (new Date(scope.row.date).getHours()) :  ('0'+((new Date(scope.row.date).getHours())).toString())
              }} : {{ (new Date(scope.row.date).getMinutes()) > 10 ? (new Date(scope.row.date).getMinutes()) :  ('0'+((new Date(scope.row.date).getMinutes())).toString())
              }} : {{ (new Date(scope.row.date).getSeconds()) > 10 ? (new Date(scope.row.date).getMinutes()) :  ('0'+((new Date(scope.row.date).getMinutes())).toString())
              }}
            </span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="收支类型"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="describe"
          label="收支描述"
          align="center"
          width="180"
        ></el-table-column>
        <el-table-column prop="income" label="收入" align="center" width="170">
          <template slot-scope="scope">
            <span style="color: #00d053">{{ scope.row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expend" label="支出" align="center" width="170">
          <template slot-scope="scope">
            <span style="color: #f56767">- {{ scope.row.expend }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cash"
          label="账户现金"
          align="center"
          width="170"
        >
          <template slot-scope="scope">
            <span style="color: #4db3ff">{{ scope.row.cash }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
          width="220"
        ></el-table-column>
        <el-table-column
          prop="operation"
          align="center"
          label="操作"
          fixed="right"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="edit"
              size="small"
              @click="onEditMoney(scope.row)"
              v-if="user.identity == 'manager'"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="delete"
              size="small"
              v-if="user.identity == 'manager'"
              @click="onDeleteMoney(scope.row, scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              v-if="paginations.total > 0"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total"
              :current-page.sync="paginations.page_index"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            >
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <DialogFound
      :dialog="dialog"
      :form="form"
      @update="getProfile"
    ></DialogFound>
  </div>
</template>
<script>
import DialogFound from "../components/DialogFound";
export default {
  components: {
    DialogFound,
  },
  data() {
    return {
      tableData: [],
      allTabData: [],
      filterTableData: [],
      search_data: {
        startTime: "",
        endTime: "",
      },
      form: {
        type: "",
        desribe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: "",
      },
      dialog: {
        show: false,
        title: "",
        option: "edit",
      },
      // 分页组件数据传值
      paginations: {
        page_index: 1,
        total: 0,
        page_size: 5,
        page_sizes: [5, 10, 15, 20],
        layout: "total,sizes,prev,pager,next,jumper",
      },
    };
  },
  methods: {
    onEditMoney(row){
      this.dialog={
        show:true,
        title:"修改资金信息",
        option:"edit"
      };
      this.form={
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id
      }
    },
    handleCurrentChange(page){
      console.log(page);
      let sortnum = this.paginations.page_size *  (page-1);
      let table = this.allTabData.filter((item,index)=>{
        return index>=sortnum;
      })
      this.tableData = table.filter((item,index)=>{
        return index<this.paginations.page_size;
      })
    },
    handleSizeChange(page_size){
      console.log(page_size);
      this.paginations.page_index=1;
      this.paginations.page_size=page_size;
      this.tableData = this.allTabData.filter((item,index)=>{
        return index<page_size;
      })
    },
    onDeleteMoney(row, index){
      this.$axios.delete(`/api/profile/delete/${row._id}`).
      then(res=>{
        this.$message("删除成功");
        this.getProfile();  
      })
    },
    onScreeoutMoney() {
      if (!this.search_data.startTime || !this.search_data.endTime) {
        this.$message({
          type: "waring",
          message: "请选择时间区间",
        });
        this.getProfile();
        return;
      }

      const stime = this.search_data.startTime.getTime();
      const etime = this.search_data.endTime.getTime();

      this.allTabData = this.filterTableData.filter((item) => {
        let date = new Date(item.date);
        let time = date.getTime();
        return time >= stime && time <= etime;
      });

      this.setPaginations();
    },
    onAddMoney() {
      this.dialog = {
        show: true,
        title: "添加资金信息",
        option: "add",
      };
      this.form = {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: "",
      };
    },
    getProfile() {
      this.$axios("/api/profile").then((res) => {
        // console.log(res);
        this.allTabData = res.data;
        this.filterTableData = res.data;

        this.setPaginations();
      });
    },
    setPaginations() {
      this.paginations.total = this.allTabData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;
      this.tableData = this.allTabData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  created() {
    this.getProfile();
  },
};
</script>
<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>