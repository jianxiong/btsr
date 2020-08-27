import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import http from 'http'
import socketIO from 'socket.io'
import { v4 as uuidv4 } from 'uuid'


const app = express()
const port = process.env.PORT || 5000;
const server = http.createServer(app)
const io = socketIO(server)

type Request = { 
  id: String
  username: String
  timestamp: Date
}

const requests: Request[] = []

app.use("/", express.static(__dirname + '/../../client/build/'))

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/help', (req, res) => {
  res.send(requests)
});

app.post('/help', (req, res) => {
  if (!req.body.username) {
    return res.sendStatus(400)
  }

  const currentIndex = requests.findIndex(request => {
    return request.username === req.body.username
  })
  if (currentIndex >= 0) {
    return res.status(200).send(requests[currentIndex])
  }

  const request = {
    id: uuidv4(),
    username: req.body.username,
    timestamp: new Date(),
  }

  requests.push(request)
  //io.emit('new', request)
  io.emit('current', requests)
  return res.status(200).send(request)
});

app.delete('/help/:id', (req, res) => {
  const currentIndex = requests.findIndex(request => {
    return request.id === req.params.id
  })

  if (currentIndex < 0) {
    return res.sendStatus(404)
  }

  const request = requests[currentIndex]
  requests.splice(currentIndex, 1)

  //io.emit('delete', request)
  io.emit('current', requests)

  return res.status(200).send(request)
})

io.on('connection', socket => {
  socket.emit('current', requests)
})

server.listen(port, () => console.log(`Listening on port ${port}`));