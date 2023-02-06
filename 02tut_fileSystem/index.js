const fs = require('fs') // NO async / await
const fsPromises = require('fs').promises // YES async / await
const path = require('path')

// Node execute operations asinchronously, so the log Hello can be the first log instead of second and so on

const fileOps = async () => {
  try {
    const data = await fsPromises.readFile(
      path.join(__dirname, 'starter.txt'),
      'utf8'
    )
    console.log(data)

    //delete file
    await fsPromises.unlink(path.join(__dirname, 'starter.txt'))

    await fsPromises.writeFile(path.join(__dirname, 'promiseWrite.txt'), data)

    await fsPromises.appendFile(
      path.join(__dirname, 'promiseWrite.txt'),
      '\n\nAppend text'
    )

    await fsPromises.rename(
      path.join(__dirname, 'promiseWrite.txt'),
      path.join(__dirname, 'promiseComplete.txt')
    )

    const newData = await fsPromises.readFile(
      path.join(__dirname, 'promiseComplete.txt'),
      'utf8'
    )
    console.log(newData)
  } catch (error) {
    console.error(error)
  }
}

fileOps()

// fs.readFile(path.join(__dirname, 'starter.txt'), 'utf8', (err, data) => {
//   if (err) throw err
//   console.log(data)
// })

console.log('Hello....')

//create new file reply.txt with the text 'Nice to meet you'
// fs.writeFile(path.join(__dirname, 'reply.txt'), 'Nice to meet you', (err) => {
//   if (err) throw err
//   console.log('Write complete')

//   //append text in a existing file, but if the file doesn't exists, it will be created a new one.
//   //it will be better to put appendFile inside the callback of writeFile, so we can be quiet that the file will be created first and then modified with appendFile and not the other way around
//   // \n = line break (va a capo)

//   fs.appendFile(
//     path.join(__dirname, 'reply.txt'),
//     '\n\nThis will be appended',
//     (err) => {
//       if (err) throw err
//       console.log('Append complete')

//       fs.rename(
//         path.join(__dirname, 'reply.txt'),
//         path.join(__dirname, 'newReply.txt'),
//         (err) => {
//           if (err) throw err
//           console.log('Rename complete')
//         }
//       )
//     }
//   )
// })

// exit on uncaught errors
// process.on('uncaughtException', (err) => {
//   console.error(`There was an uncaught error: ${err}`)
//   process.exit(1)
// })
