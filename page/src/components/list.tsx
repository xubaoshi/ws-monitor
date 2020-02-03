import * as React from 'react'
import { Table } from 'antd'
import { getTableData } from '../utils/db'
import moment = require('moment')
const Column = Table.Column

export default class List extends React.Component<any, any> {
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
    console.log(arr)
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
      <div className="link-wrap">
        <Table dataSource={list}>
          <Column
            title="date"
            dataIndex="dateTime"
            key="dateTime"
            render={data => {
              return moment(data).format('YYYY-HH-DD HH:mm:ss')
            }}
          ></Column>
          } />
          <Column title="type" dataIndex="type" key="type" />
          <Column title="reason" dataIndex="reason" key="reason" />
          <Column title="remark" dataIndex="remark" key="remark" />
        </Table>
      </div>
    )
  }
}
