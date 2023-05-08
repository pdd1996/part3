const express = require('express')
const app = express()

const persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: 040-123456
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: 39-44-5323523
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: 12-43-234345
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: 39-23-6423122
  }
]

app.get('/api/persons', (req, resp) => {
  resp.json(persons)
})

app.get('/api/info', (req, resp) => {
  const time = new Date()
  resp.send('phonebook has info 2 people, <br>' + time + 'starndard time')
})

app.get('/api/persons/:id', (req, resp) => {
  const id = Number(req.params.id)
  
  if(id) {
    const person = persons.find(person => person.id === id)
    resp.status(200).json(person)
  }

  if(!id) {
    return resp.status(404).end()
  }
})

const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})