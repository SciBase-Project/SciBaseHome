$(document).ready(function(){
  	var socket = io();
 	io.on('connection', function(socket){
		console.log("Connected");
		socket.on('chat message', function(msg){
			$('#messages').append($('<li>').text(msg));
		});
	});
});