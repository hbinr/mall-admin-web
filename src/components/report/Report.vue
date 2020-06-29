<template>
  <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
  <div id="main"
       style="width: 750px;height:400px;"></div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data () {
    return {
      // 图表数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted () {
    this.handleReport()
  },
  methods: {
    async handleReport () {
      // 1. 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      // 2. 指定图表的配置项和数据
      const { data: res } = await this.$http.get('/reports/type/1')
      console.log('res: ', res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取报表数据失败')
      }
      // 将两个对象合并
      const option = _.merge(this.options, res.data)
      // 3. 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
