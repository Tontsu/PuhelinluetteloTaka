const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))

morgan.token('data', function getData (req) {
  return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))

persons = [
      { name: 'Arto Hellas', number: '040-123456', id: 1 },
      { name: 'Martti Tienari', number: '040-123456', id: 2 },
      { name: 'Arto Järvinen', number: '040-123456', id: 3 },
      { name: 'Lea Kutvonen', number: '040-123456', id: 4 }
    ]

app.get('/info', (req, res) => {
  date = new Date()
  res.send(
    '<p>puhelinluettelossa ' + persons.length + ' henkilön tiedot</p>' + date.toString())
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if(person) {
    res.json(person)
  }
  else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const person = req.body
  if (person.name  === undefined || person.number === undefined) {
    return res.status(400).json({ error: 'missing name or number' })
  }
  if (persons.find(p => p.name === person.name)) {
    return res.status(400).json({ error: 'name must be unique' })
  }
  person.id = Math.floor((Math.random() * 1000) + 1)
  persons = persons.concat(person)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
