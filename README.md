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

后端服务器的主要目的是向前端提供 JSON 格式的原始数据

#### Express

```js
const express = require("express")
// 创建一个存储在 app 变量中的 Express 应用
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

// 第一个 request 参数包含 HTTP 请求的所有信息
// 第二个 response 参数用于定义如何对请求进行响应
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

#### REST

|   URL    |  verb  | functionality                                                |
| :------: | :----: | :----------------------------------------------------------- |
| notes/10 |  GET   | fetches a single resource                                    |
|  notes   |  GET   | fetches all resources in the collection                      |
|  notes   |  POST  | creates a new resource based on the request data             |
| notes/10 | DELETE | removes the identified resource                              |
| notes/10 |  PUT   | replaces the entire identified resource with the request data |
| notes/10 | PATCH  | replaces a part of the identified resource with the request data |

```js
const express = require("express")
const app = express()

// 如果没有 json-parser，body 属性将是未定义的。json-parser 的功能是将请求的 JSON 数据转化为 JavaScript 对象，然后在调用路由处理程序之前将其附加到 request 对象的 body 属性。
app.use(express.json())

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

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if(note) {
    response.json(note)
  }

  if(!note) {
    response.status(404).end()
  }
  
})

app.delete('/api/notes/:id', (req, resp) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)
  resp.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body
  console.log(note)
  response.json(note)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
```

如果头中没有正确的值，服务器将不能正确地解析数据。它甚至不会尝试猜测数据的格式，因为有 [大量](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) 潜在的 *Content-Typees*。

#### PostMan - Post

![image-20230508155620784](./README-IMG/post.PNG)

```js
const express = require("express")
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

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

  // 定义事件处理程序，处理向 / 发送的 HTTP 请求
app.get('/', (req, resp) => {
   // 参数是一个字符串，Express 自动将 Content-Type 头的值设置为 text/html。响应的状态代码默认为 200
    resp.send('<h1>Hello Node</h1>')
})

app.get('/api/notes', (req, resp) => {
    resp.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  // get one  -> find
  const note = notes.find(note => note.id === id)

  if(note) {
    response.json(note)
  }

  if(!note) {
    response.status(404).end()
  }
  
})

app.delete('/api/notes/:id', (req, resp) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)
  resp.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0

  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if(!body.content) {
      // 注意，调用 return 是至关重要的，因为否则代码会执行到最后，错误的笔记会被保存到应用中。
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
      // 在服务器上生成时间戳比在浏览器中生成时间戳更好，因为我们不能相信运行浏览器的主机有正确的时钟设置。现在，date 属性的生成是由服务器完成的。
    date: new Date(),
    id: generateId()
  }
 
  notes.concat(note)

  response.json(note)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
```

#### app.use(express.json())

json-parser 从请求中获取原始数据，这些数据存储在 request 对象中，将其解析为一个 JavaScript 对象，并将其作为一个新的属性 body 分配给 request 对象。

#### morgan - 日志中间件

```js
const express = require('express')
const fs = require('fs')
const morgan = require('morgan')
const path = require('path')
var uuid = require('node-uuid')
// var rfs = require('rotating-file-stream')

morgan.token('id', function getId (req) {
  return req.id
})

const app = express()

// var accessLogStream = rfs.createStream("file.log", {
//   size: "10M", // rotate every 10 MegaBytes written
//   interval: "1d", // rotate daily
//   compress: "gzip", // compress rotated files
//   path: path.join(__dirname, 'log')
// });
// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

function assignId (req, res, next) {
  req.id = uuid.v4()
  next()
}

app.use(assignId)
app.use(morgan(':id :method :url :response-time'))

app.use(express.json())
app.use(requestLogger)
// app.use(morgan('combined', { stream: accessLogStream }))

// log only 4xx and 5xx responses to console
app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}))

// log all requests to access.log
app.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}))


let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
  
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

![fullstack content](https://fullstackopen.com/static/6f33425b60b49278d57df7e62f81a32c/db910/101.png)

与在开发环境中运行应用时不同，现在所有东西都在同一个节点/express-backend中，该节点在localhost:3001中运行。当浏览器进入页面时，文件*index.html*被渲染。这导致浏览器获取React应用的产品版本。一旦开始运行，它就从localhost:3001/api/notes这个地址获取json-data。

#### 调试

当bug发生时，*最糟糕的策略*是继续写代码。这将保证你的代码很快就会出现更多的bug，而调试它们将更加困难。丰田生产系统中的[停止和修复](http://gettingtolean.com/toyota-principle-5-build-culture-stopping-fix/)原则在这种情况下也是非常有效的。

#### mongo.js

```js
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.0xuryjj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is Easy',
  date: new Date(),
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})

// SRYRxo0Ak45Rgrhp
```

