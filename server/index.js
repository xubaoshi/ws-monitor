const Websocket = require('ws')
const wss = new Websocket.Server(
  {
    port: 8080,
    // 记录连接数
    clientTracking: true
  },
  () => {
    console.log('server start')
  }
)
wss.on('connection', client => {
  console.log('clients num:', wss.clients.size)
  client.send('connect established')
  console.log('connect established')
  client.on('message', msg => {
    console.log('server message:', msg)
    client.send(msg)
  })
  client.on('close', msg => {
    console.log('server closed')
  })
  client.on('error', msg => {
    console.log('server has error')
  })
  setTimeout(() => {
    client.emit('error', new Error('error occured'))
  }, 5000)
  setTimeout(() => {
    client.close()
  }, 10000)
})
