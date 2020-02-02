import * as React from 'react'
export default class App extends React.Component {
  componentDidMount() {
    const url = 'ws://127.0.0.1:8080/'
    const ws = new WebSocket(url)
    ws.onopen = function() {
      console.log('server connected')
    }
    ws.onmessage = msg => {
      console.log('server message:', msg)
    }
    ws.onclose = () => {
      console.log('server closed')
    }
    ws.onerror = () => {
      console.log('server has error')
    }
  }
  render() {
    return <div>Hello</div>
  }
}
