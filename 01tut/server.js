// 1 - Node runs on a server - not in a browser (backend not frontend)
// 2 - The console is the terminal window
console.log('Hello World');

// 3 - Global object instead of window object
// console.log(global)

// 4 - Has Common Core Modules
// 5 - CommonJS modules instead of ES6 modules (require not import)
// 6 - Missing some JS APIs like fetch
const os = require('os')
const path = require('path')
// CUSTOM MODEL
const {add, subtract, multiply, divide } = require('./math')

console.log(os.type())
console.log(os.version())
console.log(os.homedir())

console.log(__dirname)
console.log(__filename)

console.log(path.dirname(__filename))
console.log(path.basename(__filename))
console.log(path.extname(__filename))

console.log(path.join(__dirname, 'math.js'))

console.log(path.parse(__filename))

console.log(add(2, 2))
console.log(subtract(2, 2))
console.log(multiply(2, 2))
console.log(divide(2, 2))
