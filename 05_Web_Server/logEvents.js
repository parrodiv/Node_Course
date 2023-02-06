const { format } = require('date-fns')
const { v4: uuid } = require('uuid')

const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message, fileName) => {
  const dateTime = format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`
  console.log(logItem)
  try {
    if (!fs.existsSync('./logs')) {
      await fsPromises.mkdir('./logs')
    }
    // will create or append on an existing file
    await fsPromises.appendFile(path.join(__dirname, 'logs', fileName), logItem)
  } catch (error) {
    console.error(error)
  }
}

module.exports = logEvents
