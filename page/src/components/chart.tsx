import * as React from 'react'
import { getTableData } from '../utils/db'

export default class Chart extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
  }
  async componentDidMount() {
    let arr = await getTableData()
    arr = arr.map((item, index) => {
      return {
        ...item,
        key: index
      }
    })
    this.setState({
      list: arr
    })
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
    })
  }
  render() {
    const { list } = this.state
    return (
      <div className="chart-wrap">
        <div>断链统计图表</div>
      </div>
    )
  }
}
