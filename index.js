const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

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
  Person
    .find({})
    .then(persons => {
      res.send('<p>puhelinluettelossa ' + persons.length + ' henkilön tiedot</p>' + date.toString())
    })
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(Person.format))
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
  .findById(req.params.id)
  .then(person => {
    if (person) {
      res.json(Person.format(person))
    }
    else {
      res.status(404).end()
    }
  })
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  const person = new Person({
    name: body.name,
    number: body.number
  })
  if (person.name  === undefined || person.number === undefined) {
    return res.status(400).json({ error: 'missing name or number' })
  }
  Person
  .find({ name: person.name })
  .then(p => {
    if(p.length !== 0) {
      res.status(400).send({ error: 'name must be unique'})
    }
    else {
      person
      .save()
      .then(savedPerson => {
        res.json(Person.format(savedPerson))
      })
    }
  })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person
    .findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      res.status(400).send({ error: 'malformatted id' })
    })

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
