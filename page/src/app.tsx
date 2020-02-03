import * as React from 'react'
import { Input, Tabs } from 'antd'
import { clearDb, addTableData } from './utils/db'
const Search = Input.Search
const TabPane = Tabs.TabPane
import Chart from './components/chart'
import List from './components/list'
import './styles/app.scss'
export default class App extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      ws: null,
      ip: '',
      currentTab: '0'
    }
  }
  update() {
    this.refs.list.update()
    this.refs.chart.update()
  }
  connect(url) {
    // url = 'ws://127.0.0.1:8080/'
    clearDb().then(() => {
      this.update()
    })
    const ws = new WebSocket(url)
    // readyState
    // 0：没有连接或正在连接
    // 1: 连接成功
    // 2: 关闭连接
    // 3. 连接关闭
    ws.onopen = event => {
      this.wsOpen(event)
    }
    ws.onmessage = msg => {
      this.wsMessage(msg)
    }
    ws.onclose = event => {
      this.wsClose(event)
    }
    ws.onerror = event => {
      this.wsError(event)
    }
    this.setState({
      ws
    })
  }
  wsOpen(event) {
    const { state } = this
    console.log('server connected, readyState:', this.state.ws.readyState)
    state.ws.send(
      JSON.stringify({
        ip: state.ip
      })
    )
  }
  wsMessage(msg) {
    console.log(
      'server message:',
      msg,
      ' readyState:',
      this.state.ws.readyState
    )
  }
  wsClose(event) {
    let reason = ''
    const reasonMap = {
      1000: 'Normal closure, meaning that the purpose for which the connection was established has been fulfilled.',
      1001: 'An endpoint is "going away", such as a server going down or a browser having navigated away from a page.',
      1002: 'An endpoint is terminating the connection due to a protocol error',
      1003: 'An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).',
      1004: 'Reserved. The specific meaning might be defined in the future.',
      1005: 'No status code was actually present.',
      1006: 'The connection was closed abnormally, e.g., without sending or receiving a Close control frame',
      1007: 'An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).',
      1008: 'An endpoint is terminating the connection because it has received a message that "violates its policy". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.',
      1009: 'An endpoint is terminating the connection because it has received a message that is too big for it to process.',
      1010:
        "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " +
        event.reason,
      1011: 'A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.',
      1015: "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified)."
    }
    reason = reasonMap[event.code] || 'Unknown reason'
    addTableData({
      reason,
      type: 'close',
      remark: event
    }).then(() => {
      this.update()
    })
  }
  wsError(event) {
    console.log('server has error')
    console.log(event)
    addTableData({
      reason: '',
      type: 'close',
      remark: event
    }).then(() => {
      this.update()
    })
  }
  handleSend() {
    const { state } = this
    if (!state.ip) {
      return
    }
    state.ws && state.ws.close()
    this.connect(state.ip)
  }
  handleChange(event) {
    this.setState({
      ip: event.target.value
    })
  }
  handleTabChange(val) {
    this.setState({
      currentTab: val
    })
  }
  render() {
    const { state } = this
    return (
      <div className="wrap">
        <div className="search">
          <Search
            placeholder="请输入 ip"
            enterButton="连接"
            value={state.ip}
            size="large"
            onChange={event => {
              this.handleChange(event)
            }}
            onSearch={() => {
              this.handleSend()
            }}
          />
        </div>
        <div className="tab">
          <Tabs
            activeKey={state.currentTab}
            onChange={val => {
              this.handleTabChange(val)
            }}
          >
            <TabPane tab="连接信息" key="0">
              <List ref="list" />
            </TabPane>
            <TabPane tab="断连统计图表" key="1">
              <Chart ref="chart" />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
