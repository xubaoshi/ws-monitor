import * as React from 'react'
export default class App extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      ws: null,
      ip: ''
    }
  }
  connect(url) {
    url = 'ws://127.0.0.1:8080/'
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
    if (event.code == 1000) {
      reason =
        'Normal closure, meaning that the purpose for which the connection was established has been fulfilled.'
    } else if (event.code == 1001) {
      reason =
        'An endpoint is "going away", such as a server going down or a browser having navigated away from a page.'
    } else if (event.code == 1002) {
      reason =
        'An endpoint is terminating the connection due to a protocol error'
    } else if (event.code == 1003) {
      reason =
        'An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).'
    } else if (event.code == 1004) {
      reason = 'Reserved. The specific meaning might be defined in the future.'
    } else if (event.code == 1005) {
      reason = 'No status code was actually present.'
    } else if (event.code == 1006) {
      reason =
        'The connection was closed abnormally, e.g., without sending or receiving a Close control frame'
    } else if (event.code == 1007) {
      reason =
        'An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).'
    } else if (event.code == 1008) {
      reason =
        'An endpoint is terminating the connection because it has received a message that "violates its policy". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.'
    } else if (event.code == 1009) {
      reason =
        'An endpoint is terminating the connection because it has received a message that is too big for it to process.'
    } else if (event.code == 1010) {
      // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
      reason =
        "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " +
        event.reason
    } else if (event.code == 1011) {
      reason =
        'A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.'
    } else if (event.code == 1015) {
      reason =
        "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified)."
    } else {
      reason = 'Unknown reason'
    }
    console.log(reason)
  }
  wsError(event) {
    console.log('server has error')
    console.log(event)
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
  render() {
    const { state } = this
    return (
      <div>
        <input
          type="text"
          value={state.ip}
          onChange={event => {
            this.handleChange(event)
          }}
        />
        <button
          onClick={() => {
            this.handleSend()
          }}
        >
          连接
        </button>
      </div>
    )
  }
}
