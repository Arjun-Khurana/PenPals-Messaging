var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const fetch = require('node-fetch');

const URL = 'https://rocky-mesa-28651.herokuapp.com'

app.get('/', function(req, res)
{
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket)
{
	console.log('user connected');
	socket.on('disconnect', function()
	{
		console.log('user disconnected');
	});	
	socket.on('shaggy', function(msg)
	{
		headers={'Content-Type' : 'application/json'};
		fetch(URL, {method : 'POST', headers : headers, body : JSON.stringify({"language" : msg.lang, "text" : msg.text})})
	    	.then(res => res.json())
	    	.then(body => io.emit('scooby', body));
	    	
	});
});

http.listen(3000, function()
{
	console.log('listening on *:3000');
});