var http = require('http'),
	dispatcher = require('httpdispatcher'),
	WebSocketServer = require('ws').Server

dispatcher.setStatic('static');
var port = 1337;
var adminWS = [ ];

var notify = function(req, res) {
	for(c in adminWS) 
		adminWS[c].send(JSON.stringify({ 
			id: req.connection.remoteAddress,
			userAgent: req.headers['user-agent'],
			time: (new Date()).getTime(),
			name: "Hello_from_WS"
		}));
}

dispatcher.onGet("/homepage", function(req, res) {
	res.end("<h1>Homepage</h1");
	notify(req, res);
});

var server = http.createServer(function (req, res) {
	dispatcher.dispatch(req, res);
});
server.listen(port, '127.0.0.1');
console.log("server listening on port "+ port);

var wss = new WebSocketServer({server:server});
wss.on('connection', function(ws) {
	adminWS.push(ws);
	console.log("client connected "+ ws._socket.remoteAddress);
	console.log("client connected "+ ws._socket.remotePort);
});


