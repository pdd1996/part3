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
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
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