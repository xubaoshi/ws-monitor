import * as React from 'react'
import { getTableData } from '../utils/db'
// import moment from 'moment'
import echarts from 'echarts'
import '../styles/chart.scss'
export default class Chart extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      dayChart: null,
      weekChart: null,
      monthChart: null,
      option: {
        tooltip: {
          show: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 40, 10, 10, 20]
          }
        ]
      }
    }
  }
  async componentDidMount() {
    this.update()
  }
  async update() {
    let arr = await getTableData()
    arr = arr.map((item, index) => {
      return {
        ...item,
        key: index
      }
    })
    this.setState({
      list: arr
    },() => {
      this.generateCurrentDayData()
      this.generateLastWeekData()
      this.generateLastMonthData()
    })
  }
  generateCurrentDayData() {
    const { option } = this.state
    const dayChart = echarts.init(document.getElementById('dayChart'))
    dayChart.setOption(option)
    this.setState({
      dayChart
    })
  }
  generateLastWeekData() {
    const { option } = this.state
    const weekChart = echarts.init(document.getElementById('weekChart'))
    weekChart.setOption(option)
    this.setState({
      weekChart
    })
  }
  generateLastMonthData() {
    const { option } = this.state
    const monthChart = echarts.init(document.getElementById('monthChart'))
    monthChart.setOption(option)
    this.setState({
      monthChart
    })
  }
  render() {
    const { list } = this.state
    return (
      <div className="chart-wrap">
        <div className="item">
          <div className="tit">本日统计</div>
          <div className="con">
            <div id="dayChart" className="chart"></div>
          </div>
        </div>
        <div className="item">
          <div className="tit">最近一周统计</div>
          <div className="con">
            <div id="weekChart" className="chart"></div>
          </div>
        </div>
        <div className="item">
          <div className="tit">最近一月统计</div>
          <div className="con">
            <div id="monthChart" className="chart"></div>
          </div>
        </div>
      </div>
    )
  }
}
