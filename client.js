var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();
var messageR;
var messageS;

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
            messageR = message.utf8Data;
        }
    });
    
    function sendNumber() {
        if (connection.connected) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            connection.sendUTF(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }


    function sendData(){
        if(messageR=="Hello"){
            console.log("What is your name!!!");
        }
        else{
            console.log("Your name is :-"+" "+messageR);
            connection.sendUTF("Please tell me about yourself!!");
        }

        setTimeout(sendData,1000);
    };
    //sendNumber();
    sendData();
});

client.connect('ws://localhost:8080/', 'echo-protocol');