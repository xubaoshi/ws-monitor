import Dexie from 'dexie'
import moment from 'moment'

const dateBaseName = 'WebsocketDetectorDataBase'
const tableName = 'detectorInfo'

// db[tableName]
//   .add({
//     date: moment(new Date()).format('YYYY-MM-DD'),
//     dateTime: new Date().getTime(),
//     reason: 'close test',
//     type: 'close'
//   })
//   .then(() => {
//     db.table(tableName)
//       .toArray()
//       .then(arr => {
//         console.log(arr)
//       })
//   })

// db[tableName]
//   .add({
//     date: moment(new Date()).format('YYYY-MM-DD'),
//     dateTime: new Date().getTime(),
//     reason: 'error test',
//     type: 'error'
//   })
//   .then(() => {
//     db.table(tableName)
//       .toArray()
//       .then(arr => {
//         console.log(arr)
//       })
//   })

const db = new Dexie(dateBaseName)
db.version(1).stores({
  [tableName]: '++id,date,dateTime,reason,type'
})

const clearDb = () => {
  Dexie.delete('WebsocketDetectorDataBase')
}

const addTableData = data => {
  const date = moment(new Date())
  db[tableName].add({
    date: date.format('YYYY-MM-DD'),
    dateTime: new Date().getTime(),
    hh: date.format('HH'),
    mm: date.format('MM'),
    ss: date.format('SS'),
    reason: data.reason,
    type: data.type,
    remark: JSON.stringify(data.remark)
  })
}

const getTableData = data => {
  const date = moment(new Date())
  return db.table(tableName).toArray()
}

export default {
  db,
  tableName,
  clearDb,
  addTableData,
  getTableData
}
