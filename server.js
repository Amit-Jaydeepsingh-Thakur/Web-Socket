const express = require('express');
const app = express();

app.use(express.static(__dirname + '/node_modules'));

var WebSocketServer = require('websocket').server;
var http = require('http');
var isName=false;
var messageR;

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(process.env.PORT || 8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            messageR = message.utf8Data;
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });

    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

    app.get('/',(req,res) => {
        res.status(200).render('server.pug',{
            messageR : messageR
        });
    });

    function sendData(){
        if(isName){
            connection.sendUTF(Math.random());
            isName = false;
        }
        else{
            connection.sendUTF("Hello");
            isName = true;
        }
        
        //setTimeout(sendData, 1000);
    }

    if(document. getElementById('sendData'). clicked == true)
    {
        alert("button was clicked");
        sendData();
    }
    
});