# part3

#### Node基础

```js
// 导入Node内置的网络服务器
const http = require('http')

// createServer 方法来创建一个新的网络服务器。一个 事件处理程序 被注册到服务器上，
// 每当 HTTP 请求被发送到服务器的地址 http://localhost:3001，该程序就会被调用。
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```

Node 现在也支持使用 ES6 模块，但由于支持还 [不是很完善](https://nodejs.org/api/esm.html#modules-ecmascript-modules)，我们将坚持使用 CommonJS 模块。

#### Express

```js
const express = require("express")
const app = express()

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2022-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2022-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2022-05-30T19:20:14.298Z",
      important: true
    }
  ]

app.get('/', (req, resp) => {
    resp.send('<h1>Hello Node</h1>')
})

app.get('/api/notes', (req, resp) => {
    resp.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
```

