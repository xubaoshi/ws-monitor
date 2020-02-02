const Websocket = require('ws')
const wss = new Websocket.Server(
  {
    port: 8080
  },
  () => {
    console.log('server start')
  }
)
const clients = []
wss.on('connection', client => {
  clients.push(client)
  client.send('connect established')
  setTimeout(() => {
    console.log(client.push())
  }, 2000)

  client.on('message', msg => {
    console.log('server message:', msg)
    client.send(msg)
  })
  client.on('close', msg => {
    console.log('server closed')
  })
})
