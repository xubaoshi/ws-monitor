import * as React from 'react'
import { getTableData, db, tableName } from '../utils/db'
// import moment from 'moment'
import echarts from 'echarts'
import '../styles/chart.scss'
import moment = require('moment')
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
    this.setState(
      {
        list: arr
      },
      () => {
        this.generateCurrentDayData()
        this.generateLastWeekData()
        this.generateLastMonthData()
      }
    )
  }
  groupBy(array, f) {
    var groups = {}
    array.forEach(function(o) {
      var group = f(o)
      groups[group] = groups[group] || []
      groups[group].push(o)
    })
    return groups
  }
  generateCurrentDayData() {
    const { option } = this.state
    const currentDate = moment(new Date()).format('YYYY-MM-DD')
    const newOption = JSON.parse(JSON.stringify(option))

    db.table(tableName)
      .where('date')
      .equals(currentDate)
      .toArray()
      .then(arr => {
        const sorted = this.groupBy(arr, function(item) {
          return item.hh
        })
        for (let index = 0; index < 24; index++) {
          const key = index < 10 ? `0${index}` : index
          newOption.xAxis[0].data[index] = key
          newOption.series[0].data[index] = sorted[key] ? sorted[key].length : 0
        }
        const dayChart = echarts.init(document.getElementById('dayChart'))
        dayChart.setOption(newOption)
        this.setState({
          dayChart
        })
      })
    const dayChart = echarts.init(document.getElementById('dayChart'))
    dayChart.setOption(option)
    this.setState({
      dayChart
    })
  }
  generateLastWeekData() {
    const { option } = this.state
    const currentDate = moment(new Date())
    const newOption = JSON.parse(JSON.stringify(option))
    let dateX = [currentDate.format('YYYY-MM-DD')]
    for (let index = 0; index < 6; index++) {
      let preDate = currentDate.subtract(1, 'days')
      dateX.push(preDate.format('YYYY-MM-DD'))
    }
    dateX = dateX.reverse()
    const lastDate = moment(`${dateX[dateX.length - 1]} 00:00:00`).valueOf()

    db.table(tableName)
      .where('dateTime')
      .aboveOrEqual(lastDate)
      .toArray()
      .then(arr => {
        const sorted = this.groupBy(arr, function(item) {
          return item.date
        })
        newOption.xAxis[0].data = dateX
        dateX.forEach((item, index) => {
          newOption.series[0].data[index] = sorted[item]
            ? sorted[item].length
            : 0
        })
        const weekChart = echarts.init(document.getElementById('weekChart'))
        weekChart.setOption(newOption)
        this.setState({
          weekChart
        })
      })
  }
  generateLastMonthData() {
    const { option } = this.state
    const currentDate = moment(new Date())
    const newOption = JSON.parse(JSON.stringify(option))
    let dateX = [currentDate.format('YYYY-MM-DD')]
    for (let index = 0; index < 29; index++) {
      let preDate = currentDate.subtract(1, 'days')
      dateX.push(preDate.format('YYYY-MM-DD'))
    }
    dateX = dateX.reverse()
    const lastDate = moment(`${dateX[dateX.length - 1]} 00:00:00`).valueOf()

    db.table(tableName)
      .where('dateTime')
      .aboveOrEqual(lastDate)
      .toArray()
      .then(arr => {
        const sorted = this.groupBy(arr, function(item) {
          return item.date
        })
        newOption.xAxis[0].data = dateX
        dateX.forEach((item, index) => {
          newOption.series[0].data[index] = sorted[item]
            ? sorted[item].length
            : 0
        })
        const monthChart = echarts.init(document.getElementById('monthChart'))
        monthChart.setOption(newOption)
        this.setState({
          monthChart
        })
      })
  }
  render() {
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
