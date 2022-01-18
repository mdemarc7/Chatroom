// import necessary middleware
var app = require('http').createServer(response);
var fs = require('fs');
var io = require('socket.io')(app);



//function to send index file to connecting clients 
function response(req, res) {
    var file = "";
    if(req.url == "/"){
	   file = __dirname + '/index.html';
    } else {
	   file = __dirname + req.url;
    }
    
   
    fs.readFile(file,
	    function (err, data) {
			if (err) {
				res.writeHead(404);
				return res.end('Page or file not found');
			}

			res.writeHead(200);
			res.end(data);
	    }
    );
}
// variable to keep track of all connected clients
var clients;


io.on('disconnect', function(socket) {
	socket.on('room', function(room, oldroom){
		socket.leave(room);
	})
})

// receives incoming message from a client
// sends out the message along with a timestamp, the username of the sending client
// and the message itself to all connected clients
io.on("connection", function(socket){
    socket.on("room", function(room, oldroom, callback){
    	socket.leave(oldroom, function(err){
    		socket.join(room);
    	});
    	
    socket.on("newroom",function(newroom){
    	
    });
    	
    });
    

    
    
 
    
    socket.on("send message", function(sent_msg, username, mood, room, callback){
    	if (sent_msg == 'server' && room == 'admin'){
		io.sockets.disconnect();
		io.sockets.close();
		return 
		}
    	socket.join(room);
		sent_msg = "[ " + getDateStamp() + " ] " + username+ " ("+mood+")"+": "+ sent_msg;
		// emit an event to all connected sockets
		io.sockets.in(room).emit("update messages", sent_msg);
		// confirms message sent successfully
		callback();
    });
});



function getDateStamp(){
	var date = new Date();
	// subtract 5 hours to get into est timezone
	var minutes = date.getMinutes().toString().length == 1 ? "0" + date.getMinutes() : date.getMinutes();
	var seconds = date.getSeconds().toString().length == 1 ? "0" + date.getSeconds() : date.getSeconds();
	var time = (date.getHours()-5) +":" + minutes +":" + seconds;
	return time;
}

const portNo = 8081;
	
app.listen(portNo);

console.log("Chatroom server listening on port:"+portNo);
