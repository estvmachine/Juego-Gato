var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io')(server);

var port = 8080;
server.listen(port);

console.log("Node.js está corriendo en el puerto " + port);

//Path de los CSS que utilizarán para el estilo de la página
app.use("/css", express.static(__dirname + '/css'));

//Path de los Scripts o Framework de Javascript
//que se utilizarán para el funcionamiento de la página
app.use("/js", express.static(__dirname + '/js'));

//Path de funciones en Javascript que podrían utilizar
app.use("/function", express.static(__dirname + '/function'));

//Path de imagenes
app.use("/img", express.static(__dirname + '/img'));

//Routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/view/index.html');
});

var usernames = {},
    rooms = ['Lobby'];


//Inicio estructura que contendra cada sala
var board = {'Lobby' :[
				[false, false, false],
				[false, false, false],
				[false, false, false]
			]};

var jugadas= {'Lobby': [
      				['', '', ''],
      				['', '', ''],
      				['', '', '']
      			]};

var jugadaAnterior= {'Lobby': ''},
    participantes={ 'Lobby': [] },
    jugadores= {'Lobby': {'X': '', 'O':''} };
    existeganador={'Lobby': false};


/*
*row: Fila
*col:Columna
*jugada: Puede ser X ó O, pero como string
*/
function analizarTablero(row, col,jugada, sala){
	 var tablero_sala= board[sala];

  if (tablero_sala[row-1][col-1] === false)
		return "Posicion recien llena";
	else
		return "Posicion ya ocupada";

}

function colocarJugadas(row, col, jugada, sala){
  var tablero_sala= board[sala],
      jugadas_sala= jugadas[sala];

	if (tablero_sala[row-1][col-1] === false){
		//Ocupo posicion del tablero
    tablero_sala[row-1][col-1]  =  true;

		if(jugada === 'X'){
      jugadas_sala[row-1][col-1]= 'X';
			return "Turno de Jugador O";
		}
		else{
      jugadas_sala[row-1][col-1]= 'O';
			return "Turno Jugador X"
		}
	}
	else
		return "Posicion invalida"
}


function comprobarSiHayGanador(sala){
  var tablero_sala= board[sala],
      jugadas_sala= jugadas[sala];

	if(      ((jugadas_sala[0][0]=== 'X' )	&&    (jugadas_sala[1][0]=== 'X') 	&&    (jugadas_sala[2][0]=== 'X'))
		||   ((jugadas_sala[0][0]=== 'X' )	&&    (jugadas_sala[0][1]=== 'X') 	&&    (jugadas_sala[0][2]=== 'X'))
		||   ((jugadas_sala[0][0]=== 'X' )	&&    (jugadas_sala[1][1]=== 'X') 	&&    (jugadas_sala[2][2]=== 'X'))
		||   ((jugadas_sala[1][0]=== 'X' )	&&    (jugadas_sala[1][1]=== 'X') 	&&    (jugadas_sala[1][2]=== 'X'))
		||   ((jugadas_sala[2][0]=== 'X' )	&&    (jugadas_sala[2][1]=== 'X') 	&&    (jugadas_sala[2][2]=== 'X'))
		||   ((jugadas_sala[0][1]=== 'X' )	&&    (jugadas_sala[1][1]=== 'X') 	&&    (jugadas_sala[2][1]=== 'X'))
		||   ((jugadas_sala[0][2]=== 'X' )	&&    (jugadas_sala[1][2]=== 'X') 	&&    (jugadas_sala[2][2]=== 'X'))
		||   ((jugadas_sala[0][2]=== 'X' )	&&    (jugadas_sala[1][1]=== 'X') 	&&    (jugadas_sala[2][0]=== 'X'))
	  ){
		existeganador[sala] = true;
		return "Gano Jugador X";
	}

	if(      ((jugadas_sala[0][0]=== 'O' )	&&    (jugadas_sala[1][0]=== 'O') 	&&    (jugadas_sala[2][0]=== 'O'))
		||   ((jugadas_sala[0][0]=== 'O' )	&&    (jugadas_sala[0][1]=== 'O') 	&&    (jugadas_sala[0][2]=== 'O'))
		||   ((jugadas_sala[0][0]=== 'O' )	&&    (jugadas_sala[1][1]=== 'O') 	&&    (jugadas_sala[2][2]=== 'O'))
		||   ((jugadas_sala[1][0]=== 'O' )	&&    (jugadas_sala[1][1]=== 'O') 	&&    (jugadas_sala[1][2]=== 'O'))
		||   ((jugadas_sala[2][0]=== 'O' )	&&    (jugadas_sala[2][1]=== 'O') 	&&    (jugadas_sala[2][2]=== 'O'))
		||   ((jugadas_sala[0][1]=== 'O' )	&&    (jugadas_sala[1][1]=== 'O') 	&&    (jugadas_sala[2][1]=== 'O'))
		||   ((jugadas_sala[0][2]=== 'O' )	&&    (jugadas_sala[1][2]=== 'O') 	&&    (jugadas_sala[2][2]=== 'O'))
		||   ((jugadas_sala[0][2]=== 'O' )	&&    (jugadas_sala[1][1]=== 'O') 	&&    (jugadas_sala[2][0]=== 'O'))
	  ){
		existeganador[sala] = true;
		return "Gano Jugador O";

	}

	if(    (tablero_sala[0][0]=== true )	&&    (tablero_sala[0][1]=== true) 	&&    (tablero_sala[0][2]=== true) &&
		   (tablero_sala[1][0]=== true )	&&    (tablero_sala[1][1]=== true) 	&&    (tablero_sala[1][2]=== true) &&
		   (tablero_sala[2][0]=== true )	&&    (tablero_sala[2][1]=== true) 	&&    (tablero_sala[2][2]=== true)

	  ){

		return "No hay Ganadores";

	}
    else
    	return "Sigan Jugando"
}


io.on('connection', function(socket){
  /*************************************************************************/

  socket.on('agregarUsuario', function(username) {
        socket.username = username;
        socket.room = 'Lobby';
        usernames[username] = username;
        socket.join('Lobby');
        socket.emit('Msje_Personal', { emisor: 'SERVER', texto: 'te haces conectado al Lobby' });
        socket.broadcast.to('Lobby').emit('Msje_Broadcast', 'SERVER', username + ' se ha conectado a esta sala');
        socket.emit('actualizarSalas', rooms, 'Lobby');

        if(participantes['Lobby'].length === 0  && participantes['Lobby'].indexOf(username)=== -1 ){
          participantes['Lobby'].push(username);
          jugadores['Lobby'].X= username;
          socket.emit('designarTipoJugador', {texto: 'Eres el jugador X', tipoJugador: 'X', sala: socket.room, username: username});
        }
        else if(participantes['Lobby'].length === 1 && participantes['Lobby'].indexOf(username)=== -1 ){
          participantes['Lobby'].push(username);
          jugadores['Lobby'].O= username;
          socket.emit('designarTipoJugador', {texto: 'Eres el jugador O', tipoJugador: 'O', sala: socket.room, username: username});
          io.sockets["in"](socket.room).emit('designarEnemigo', {jugadores: jugadores[socket.room] });
        }
        else{
          socket.emit( 'Msje_Personal', { texto: 'Sala llena' });
        }

    });

    socket.on('crearSala', function(room) {
        rooms.push(room);
        socket.emit('actualizarSalas', rooms, socket.room);
    });


    socket.on('realizarJugada', function(data) {

        			if (existeganador[socket.room] === true)
        					socket.emit('Msje_Personal', {texto:'Ya hay ganador felicidades'});
        			else {

        				//Resultado de colocar una jugada en tablero
        				var fila = data.fila,
        		        	col= data.col,
        		        	jugador= data.jugador,
                      tablero_sala= board[socket.room],
                      jugadas_sala= jugadas[socket.room];

        		        if(tablero_sala[fila-1][col-1]=== true ){
        		        	socket.emit( 'Msje_Personal', { texto: 'Posicion invalida'});
        		        }

        		        else if(jugadaAnterior[socket.room]=== jugador){

        		        	socket.emit('Msje_Personal', {texto:'Espera tu turno'});
        		        }

        				else{
        		        	//Evaluo jugadaAnterior con la jugada actual
        		        	jugadaAnterior[socket.room]= jugador;

        		        	//Funcion que llena tabla de jugadas
        					var comprobacionjugadas = colocarJugadas(fila,
        												    col,
        												    jugador,
                                    socket.room);

        					//Compruebo ganador
        					var hayGanador= comprobarSiHayGanador(socket.room);
        					console.log(jugadas_sala);
        					console.log(tablero_sala);

                  io.sockets["in"](socket.room).emit('actualizarJugadas', socket.username, jugadas[socket.room]);

        				    //El mensaje se envia a cada jugador
        				    if(hayGanador === "No hay Ganadores"){
                    io.sockets["in"](socket.room).emit('Msje_Broadcast', { texto: 'No hay Ganadores'});
        					}

        					else if(hayGanador === "Sigan Jugando"){
                    io.sockets["in"](socket.room).emit('Msje_Broadcast', { texto: 'Sigan Jugando'});
        					}

        					else if(hayGanador === "Gano Jugador X"){
                    io.sockets["in"](socket.room).emit('Ganador', 'X');
        					}
        					else if(hayGanador === "Gano Jugador O"){
                    io.sockets["in"](socket.room).emit('Ganador','O');
        					}
        				} //fin segundo else


        			}//fin primer else

    });

    socket.on('cambiardeSala', function(newroom) {
        var oldroom;
        oldroom = socket.room;
        socket.leave(socket.room);
        socket.join(newroom);
        socket.emit('Msje_Personal', {texto: 'te has conectado a la sala ' + newroom } );
        socket.broadcast.to(oldroom).emit('Msje_Broadcast', { texto: socket.username + ' ha dejado la sala'} );
        socket.room = newroom;
        socket.broadcast.to(newroom).emit('Msje_Broadcast', { texto: socket.username + ' se ha unido a la sala' });
        socket.emit('actualizarSalas', rooms, newroom);

    });

    socket.on('desconectar', function() {
        delete usernames[socket.username];
        io.sockets.emit('agregarUsuarios', usernames);
        socket.broadcast.emit('Msje_Broadcast', { texto: socket.username + ' se ha desconectado'});
        socket.leave(socket.room);
    });





});
