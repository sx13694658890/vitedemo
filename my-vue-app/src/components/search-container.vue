<template>
  <div class="search-container">
    niohao
    <el-row class="bn-row" type="flex" justify="end" v-if="dataSetting.length > 0">
      <el-button v-if="isReset" @click="onReset">重置</el-button>
      <el-button @click="onSearch" type="primary" plain>{{isPreview ? '预览' : '查询'}}</el-button>
    </el-row>
    <div class="filter-container" :class="{'dialog-container': type === 2}" v-if="dataSetting.length > 0">
      <div class="filter-item" :class="{'two-row': setting.type === 'datetimerange' || setting.type === 'daterange' || setting.type === 'timerange' || setting.type === 'inputArea'}" v-for="(setting, index) in dataSetting" :key="index">
        <span :class="{'label': !isPreview }">{{`${setting.label}：` || '未填写参数：'}}</span>
        <!-- 基本输入框 -->
        <el-input
          v-if="setting.type === 'input'"
          class="input"
          v-model.trim="dataForm[setting.key]"
          :placeholder="setting.placeholder || '请输入'"
          clearable
          @keyup.enter.native="onSearch()"
        ></el-input>
        <!-- 查询值的范围 -->
        <div class="inputArea" v-if="setting.type === 'inputArea'">
          <el-input
            v-model.trim="dataForm[setting.key1]"
            :placeholder="setting.placeholder || '请输入'"
            clearable
            @keyup.enter.native="onSearch()"
            ></el-input>
          <span class="middle">-</span>
          <el-input
            v-model.trim="dataForm[setting.key2]"
            :placeholder="setting.placeholder || '请输入'"
            clearable
            @keyup.enter.native="onSearch()"
            ></el-input>
        </div>
        <!-- 基本选择框 -->
        <el-select
          v-else-if="setting.type === 'select'"
          class="input"
          v-model="dataForm[setting.key]"
          :placeholder="setting.placeholder || '请选择'"
          :clearable="setting.selectClearable ? false : true"
          @change="e=>onChangeSelect(setting.key)"
        >
          <el-option
            v-for="(option) in setting.options.list"
            :label="option[setting.options.label]"
            :value="option[setting.options.value]"
            :key="option[setting.options.value]"
          ></el-option>
        </el-select>
        <!-- 时间选择范围 -->
        <el-time-picker
          v-else-if="setting.type === 'timerange'"
          class="input"
          is-range
          v-model="dataForm[setting.key]"
          :range-separator="(setting.placeholder && setting.placeholder[1]) || '至'"
          :start-placeholder="(setting.placeholder && setting.placeholder[0]) || '开始时间'"
          :end-placeholder="(setting.placeholder && setting.placeholder[2]) || '结束时间'"
          clearable
        ></el-time-picker>
        <!-- 日期范围 -->
        <el-date-picker
          v-else-if="setting.type === 'daterange'"
          class="input"
          v-model="dataForm[setting.key]"
          type="daterange"
          :default-time="['00:00:00', '23:59:59']"
          :range-separator="(setting.placeholder && setting.placeholder[1]) || '至'"
          :start-placeholder="(setting.placeholder && setting.placeholder[0]) || '开始日期'"
          :end-placeholder="(setting.placeholder && setting.placeholder[2]) || '结束日期'"
          clearable
          :picker-options="pickerOptionsHandle"
        ></el-date-picker>
        <!-- 时间日期选择范围 -->
        <el-date-picker
          v-else-if="setting.type === 'datetimerange'"
          class="input"
          v-model="dataForm[setting.key]"
          type="datetimerange"
          :default-time="['00:00:00', '23:59:59']"
          :range-separator="(setting.placeholder && setting.placeholder[1]) || '至'"
          :start-placeholder="(setting.placeholder && setting.placeholder[0]) || '开始日期时间'"
          :end-placeholder="(setting.placeholder && setting.placeholder[2]) || '结束日期时间'"
          :value-format="setting.valueFormat || 'yyyy-MM-dd HH:mm:ss'"
          :picker-options="setting.pickerOptions || ''"
          clearable
        ></el-date-picker>
        <!-- 时间选择 -->
        <el-time-picker
          v-else-if="setting.type === 'time'"
          class="input"
          v-model="dataForm[setting.key]"
          :placeholder="setting.placeholder || '选择时间'"
          clearable
        ></el-time-picker>
        <!-- 日期选择 -->
        <el-date-picker
          v-else-if="setting.type === 'date'"
          class="input"
          v-model="dataForm[setting.key]"
          type="date"
          :placeholder="setting.placeholder || '选择日期'"
          :picker-options="setting.pickerOptions || ''"
          clearable
        ></el-date-picker>
        <!-- 时间日期选择 -->
        <el-date-picker
          v-else-if="setting.type === 'datetime'"
          class="input"
          v-model="dataForm[setting.key]"
          type="datetime"
          :placeholder="setting.placeholder || '选择时间日期'"
          clearable
        ></el-date-picker>
         <!-- 联动搜索 -->
        <el-cascader
          v-else-if="setting.type === 'cascader'"
          class="input"
          v-model="dataForm[setting.key]"
          :placeholder="setting.placeholder || '可进行输入内容进行选择'"
          clearable
          filterable
          :options="setting.parentId === 0 ? setting.options : setting.options.children"
          @change="handleItemChange"
        >
        </el-cascader>
        <!-- 自定义 -->
        <slot
          v-else
          :name="`custom-filter-${setting.key}`"
          :setting="setting"
          :dataForm="dataForm"
          @search="onSearch"
        ></slot>
      </div>
    </div>
    <!-- 按钮栏插槽 -->
    <el-row class="bn-row" type="flex" justify="end">
      <slot name="button-group"></slot>
    </el-row>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    props: {
      dataSetting: { // 表单设置
        type: Array,
        default: []
      },
      dataForm: { // 表单数据源
        type: Object,
        default: {}
      },
      type: {
        type: Number,
        default: 1 // 1.普通页面 2.弹窗搜索栏
      },
      isReset: {
        type: Boolean,
        default: true
      },
      isPreview: {
        type: Boolean,
        default: false
      },
      queryType: {
        type: Number,
        default: 0 // 用户统计 0.日 1.周 1.月
      }
    },
    mounted() {
      // console.log(this.dataSetting,'dataSetting');
      // console.log(this.dataForm,'dataForm');
    },
    computed: {
      // 单独对用户统计注册时间控制筛选做处理
      pickerOptionsHandle() {
        let _this = this
        let dateRange = ''
        let days = ''
        let weeks = ''
        let months = ''
        let times = ''
        return {
          disabledDate(time) {
            let oDate = new Date(time);
            let year = oDate.getFullYear()
            // leapYear 判断选择日期年份为闰年还是平年
            let leapYear1= year % 4 == 0;
            let leapYear2= year % 100 != 0;
            let leapYear3= year % 400 == 0;
            switch (_this.queryType) {
              // 0 日
              case 0:
                dateRange = 86400000 * 60; // 时间范围只能选择60天
                days = moment().subtract(60, 'd').format('YYYY-MM-DD');
                times = new Date(days) // 获取选中的日期
                break;
              // 1 周
              case 1:
                dateRange = 86400000 * 7 * 12; // 时间范围只能选择12周
                 weeks = moment().subtract(12, 'w').format('YYYY-MM-DD');
                 times = new Date(weeks)
                break;
              // 2 月
              case 2:
                dateRange = ( leapYear1 && leapYear2 ) || leapYear3 ? 366*86400000 : 365*86400000; // 时间范围只能选择12月
                months = moment().subtract(12, 'M').format('YYYY-MM-DD');
                times = new Date(months)
                break;
              default:
            }
            let curSelectTime = new Date(_this.minDate).getTime()
            let before = curSelectTime - dateRange
            let after = curSelectTime + dateRange
            let timeTamp = times.getTime()  // 将选中的时间转成时间戳
            if(isNaN(curSelectTime)){
              return time.getTime() > Date.now() || time.getTime() < timeTamp;
            } else {
              return time.getTime() > after || time.getTime() < before || time.getTime() > Date.now()
            }
          },
          onPick({ maxDate, minDate }) {
            if (!maxDate) {
              _this.minDate = minDate
            }
          }
        }
      }
    },
    methods: {
      // 重置回调
      onReset () {
        this.$emit('search', null)
      },
      // 查询回调
      onSearch () {
        this.$emit('search', this.dataForm)
      },

      // 级联搜索回调
      handleItemChange () {
        this.$emit('change', this.dataForm)
      },
      // 选择下拉框，触发回调函数
      onChangeSelect(key){
        this.$emit('onChangeSelect', this.dataForm,key)
      }
    }
  }
</script>
<style scoped >
 .search-container .filter-container .filter-item .two-row{
    width: 40%;
  }
  .inputArea {
    display: flex;
    width: 100%;
  }
  .middle {
    display: inline-block;
    text-align: center;
    width: 10%;
    line-height: 35px;
  }
</style>

