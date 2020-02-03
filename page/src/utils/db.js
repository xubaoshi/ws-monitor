import Dexie from 'dexie'
import moment from 'moment'

const dateBaseName = 'WebsocketDetectorDataBase'
const tableName = 'detectorInfo'

const createDb = () => {
  let database = new Dexie(dateBaseName)
  database.version(1).stores({
    [tableName]: '++id,date,dateTime,reason,type'
  })
  return database
}

let db = createDb()

const clearDb = () => {
  return db[tableName].clear()
}

const addTableData = data => {
  const date = moment(new Date())
  db[tableName].add({
    date: date.format('YYYY-MM-DD'),
    dateTime: date.valueOf(),
    hh: date.format('HH'),
    mm: date.format('MM'),
    ss: date.format('SS'),
    reason: data.reason,
    type: data.type,
    remark: JSON.stringify(data.remark)
  })
  const addDate = date.add(1, 'day')
  db[tableName].add({
    date: addDate.format('YYYY-MM-DD'),
    dateTime: addDate.valueOf(),
    hh: addDate.format('HH'),
    mm: addDate.format('MM'),
    ss: addDate.format('SS'),
    reason: data.reason,
    type: data.type,
    remark: JSON.stringify(data.remark)
  })
  const addDate4 = date.add(4, 'day')
  return db[tableName].add({
    date: addDate4.format('YYYY-MM-DD'),
    dateTime: addDate4.valueOf(),
    hh: addDate4.format('HH'),
    mm: addDate4.format('MM'),
    ss: addDate4.format('SS'),
    reason: data.reason,
    type: data.type,
    remark: JSON.stringify(data.remark)
  })
}

const getTableData = () => {
  return db.table(tableName).toArray()
}

export { createDb, clearDb, addTableData, getTableData }
