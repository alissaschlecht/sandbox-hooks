const http = require('http')
var qs = require('querystring')

const port = process.env.PORT || 1337

const messages = []

const server = http.createServer(function(req, res){
  // if req URL = ... , return func
  if (req.url === '/message' && req.method === 'GET') 
    return getMessages(req, res)
  if (req.url === '/message' && req.method === 'POST') 
    return postMessage(req, res)

  responseNotFound(req, res)
})

server.listen(port)
console.log(`Server listening on port ${port}`)

function getMessages(req, res){
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(messages))
}

function postMessage(req, res){
  let body = '';
  req.on('data', function (data) {
    body += data;

    if (body.length > 1e6)
      req.connection.destroy();
  })

  req.on('end', function () {
      const post = JSON.parse(body).message
      messages.push(post)

      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(messages))
  })



}

function responseNotFound(req, res){
  res.writeHead(404, {'Content-Type': 'text/plain'})
  res.end('Not Found')
}

// GET /message - return all messages
// POST /message - create new message
// PUT /message/:id - update message for message_id
// DELETE /message/:id - delete message for message_id