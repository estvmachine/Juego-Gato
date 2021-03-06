var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io')(server);

var port = 8080;
var usernames = {},
    rooms = ['Sala1'],
    salasLibres={'Sala1': true},
    maximoSalas= 5;


//Inicio estructura que contendra cada sala
var board = {'Sala1' :[
				[false, false, false],
				[false, false, false],
				[false, false, false]
			]};

var jugadas= {'Sala1': [
                  				['', '', ''],
                  				['', '', ''],
                  				['', '', '']
      			           ]
            };

var jugadaAnterior= {'Sala1': ''},
    participantes={ 'Sala1': [] },
    jugadores= {'Sala1': {'X': '', 'O':''} },
    existeganador={'Sala1': false};


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


function crearSala(nueva_sala){

    rooms.push(nueva_sala);
    salasLibres[nueva_sala]=true;

    board[nueva_sala]= [
                                  [false, false, false],
                                  [false, false, false],
                                  [false, false, false]
                                ];
    jugadas[nueva_sala]= [
                                        ['', '', ''],
                                        ['', '', ''],
                                        ['', '', '']
                                      ];
    jugadaAnterior[nueva_sala]='' ;
    participantes[nueva_sala]= [];
    jugadores[nueva_sala]= {'X': '', 'O':''};
    existeganador[nueva_sala]= false;

};

function limpiarSala(sala){

  salasLibres[sala]=true;

  board[sala]= [
                                [false, false, false],
                                [false, false, false],
                                [false, false, false]
                              ];
  jugadas[sala]= [
                                      ['', '', ''],
                                      ['', '', ''],
                                      ['', '', '']
                                    ];
  jugadaAnterior[sala]='' ;
  participantes[sala]= [];
  jugadores[sala]= {'X': '', 'O':''};
  existeganador[sala]= false;

}

io.on('connection', function(socket){
  /*************************************************************************/

  socket.on('informarNick',function(username){
    socket.username = username;
    usernames[username] = username;
  });

  socket.on('iniciarSala', function(username, room) {

        socket.room= room;

      /*  for(var i=1; i<=maximoSalas; i++){
            var nombre_sala='Sala'+i;

            if(salasLibres[nombre_sala]=== true){
                socket.room= nombre_sala;
                break;
            }
        }*/

        if(socket.room !== 'Lobby'){

          //socket.join(socket.room);
          socket.emit('Msje_Personal', { emisor: 'SERVER', texto: 'te haz conectado a la '+ socket.room });
          socket.broadcast.to(socket.room).emit('Msje_Broadcast', { texto: username + ' se ha conectado a la '+socket.room } );

          console.log('Jugadores en la '+socket.room + ' antes que ingrese '+socket.username+ ' '+ JSON.stringify(jugadores[socket.room]));
          if( participantes[socket.room].length === 0 && participantes[socket.room].indexOf(username)=== -1  ){
            participantes[socket.room].push(username);
            jugadores[socket.room].X= username;
            console.log(socket.username + 'es el jugador X en la '+socket.room);
            socket.emit('designarTipoJugador', {texto: 'Eres el jugador X', tipoJugador: 'X', sala: socket.room, username: username, tablero: jugadas[socket.room]});
          }
          else if( participantes[socket.room].length === 1 && participantes[socket.room].indexOf(username)=== -1  ){
            participantes[socket.room].push(username);
            jugadores[socket.room].O= username;
            console.log(socket.username + 'es el jugador O en la '+socket.room);

            salasLibres[socket.room]= false;
            console.log(salasLibres);

            socket.emit('designarTipoJugador', {texto: 'Eres el jugador O', tipoJugador: 'O', sala: socket.room, username: username, tablero: jugadas[socket.room] });
            io.sockets["in"](socket.room).emit('designarEnemigo', {jugadores: jugadores[socket.room] });
          }
          else {
            var jugadorX=jugadores[socket.room].X;
            var jugadorO=jugadores[socket.room].O;
            console.log(jugadores[socket.room]);
            socket.emit('designarTipoJugador', {texto: 'Eres expectador', tipoJugador: 'Expectador', sala: socket.room, username: username, jugadorX:jugadorX , jugadorO: jugadorO,tablero: jugadas[socket.room]  });
          }

        }
        else {
          socket.emit( 'Msje_Personal', { texto: 'Escoge una sala para empezar a jugar' });
        }


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

                //Verifico si es expectador
                if(jugador=== 'Expectador'){

                }
                else{
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
          					console.log(socket.room, jugadas_sala);
          					console.log(socket.room, tablero_sala);

                    io.sockets["in"](socket.room).emit('actualizarJugadas', socket.username, jugadas[socket.room]);

          				    //El mensaje se envia a cada jugador
          				    if(hayGanador === "No hay Ganadores"){
                      io.sockets["in"](socket.room).emit('Msje_Broadcast', { texto: 'No hay Ganadores'});
                      limpiarSala(socket.room);
          					}

          					else if(hayGanador === "Sigan Jugando"){
                      io.sockets["in"](socket.room).emit('Msje_Broadcast', { texto: 'Sigan Jugando'});
          					}

          					else if(hayGanador === "Gano Jugador X"){
                      io.sockets["in"](socket.room).emit('Ganador', 'X');
                      limpiarSala(socket.room);
          					}
          					else if(hayGanador === "Gano Jugador O"){
                      io.sockets["in"](socket.room).emit('Ganador','O');
                      limpiarSala(socket.room);
          					}
          				} //fin segundo else
                }
        			}//fin primer else

    });

    socket.on('cambiardeSala', function(newroom,tipoJugador) {
        var oldroom;
        oldroom = socket.room;
        socket.leave(socket.room);
        socket.join(newroom);
        socket.emit('Msje_Personal', {texto: 'te has conectado a la sala ' + newroom } );
        socket.broadcast.to(oldroom).emit('Msje_Broadcast', { texto: socket.username + ' ha dejado la sala'} );
        socket.room = newroom;
        socket.broadcast.to(newroom).emit('Msje_Broadcast', { texto: socket.username + ' se ha unido a la sala' });
        socket.emit('informarCambioDeSala',socket.username, newroom);

        if(tipoJugador=== 'X' ){
          jugadores[socket.room].X='';
          console.log('Se acaba de ir jugador X en la sala '+socket.room ,jugadores[socket.room]);
        }
        else if (tipoJugador=== 'O' ){
          jugadores[socket.room].O='';
          console.log('Se acaba de ir jugador O en la sala '+socket.room,jugadores[socket.room]);
        }
        else if (oldroom=== 'Lobby'){
          console.log('Jugador '+socket.username+ ' se unio a la '+newroom);
        }

    });

    socket.on('desconectar', function() {
        delete usernames[socket.username];
        io.sockets.emit('agregarUsuarios', usernames);
        socket.broadcast.emit('Msje_Broadcast', { texto: socket.username + ' se ha desconectado'});
        socket.leave(socket.room);
    });


});



server.listen(port);

for(var i=2; i <= maximoSalas; i++){
  crearSala('Sala'+i);
}
console.log(board);
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
