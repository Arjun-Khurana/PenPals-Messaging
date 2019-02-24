var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const fetch = require('node-fetch');
const PORT = process.env.PORT || 3000;

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
	    	.then(body => {
	    		toSend = {
	    			original : {
	    				message : msg.text,
	    				language : msg.lang
	    			},
	    			translated : {
	    				message : body.translatedText,
	    				language : body.language
	    			},
	    			username : msg.username
	    		};
	    		io.emit('scooby', toSend);
	    		
	    		
	    	});
	    	
	});
});

http.listen(PORT, function()
{
	console.log('listening on ' + PORT);
});