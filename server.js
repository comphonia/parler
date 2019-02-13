var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

var port = process.env.PORT || 3000

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))


var dbUrl = 'mongodb://user:password1@ds251849.mlab.com:51849/piechat'

var schema = new mongoose.Schema({ message: { type: String, default: null}})
var Message = mongoose.model("Message", schema , "messages")


app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=>{
        res.send(messages)
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body)

    message.save(err => {
        if (err)
            sendStatus(500)

        io.emit('message', req.body)
        res.sendStatus(200)
    })
})

io.on('connection', (socket) => {
    console.log('connected')
})

mongoose.connect(dbUrl, {
    useNewUrlParser: true
}, (err) => {
    console.log('Mongo db connected', err)
})

http.listen(port, console.log("App is listening on port", port))