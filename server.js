var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io')(server);

var port = 8080;
var existeganador = false;

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

var board = [
				[false, false, false],
				[false, false, false],
				[false, false, false]
			];

var jugadas= [
				['', '', ''],
				['', '', ''],
				['', '', '']
			];

var jugadores={X: '', O: ''};

var jugadaAnterior='';


/*
*row: Fila
*col:Columna
*jugada: Puede ser X ó O, pero como string
*/
function analizarTablero(row, col,jugada){
	if (board [row-1][col-1] === false)
		return "Posicion recien llena";
	else
		return "Posicion ya ocupada";

}

function colocarJugadas(row, col, jugada){

	console.log(jugada);
	if (board [row-1][col-1] === false){
		//Ocupo posicion del tablero
		board[row-1][col-1]  =  true;

		if(jugada === 'X'){
			jugadas[row-1][col-1]= 'X';
			return "Turno de Jugador O";
		}
		else{
			jugadas[row-1][col-1]= 'O';
			return "Turno Jugador X"
		}
	}
	else
		return "Posicion invalida"
}


function comprobarSiHayGanador(){

	if(      ((jugadas[0][0]=== 'X' )	&&    (jugadas[1][0]=== 'X') 	&&    (jugadas[2][0]=== 'X'))
		||   ((jugadas[0][0]=== 'X' )	&&    (jugadas[0][1]=== 'X') 	&&    (jugadas[0][2]=== 'X'))
		||   ((jugadas[0][0]=== 'X' )	&&    (jugadas[1][1]=== 'X') 	&&    (jugadas[2][2]=== 'X'))
		||   ((jugadas[1][0]=== 'X' )	&&    (jugadas[1][1]=== 'X') 	&&    (jugadas[1][2]=== 'X'))
		||   ((jugadas[2][0]=== 'X' )	&&    (jugadas[2][1]=== 'X') 	&&    (jugadas[2][2]=== 'X'))
		||   ((jugadas[0][1]=== 'X' )	&&    (jugadas[1][1]=== 'X') 	&&    (jugadas[2][1]=== 'X'))
		||   ((jugadas[0][2]=== 'X' )	&&    (jugadas[1][2]=== 'X') 	&&    (jugadas[2][2]=== 'X'))
		||   ((jugadas[0][2]=== 'X' )	&&    (jugadas[1][1]=== 'X') 	&&    (jugadas[2][0]=== 'X'))
	  ){
		existeganador = true;
		return "Gano Jugador X";
	}

	if(      ((jugadas[0][0]=== 'O' )	&&    (jugadas[1][0]=== 'O') 	&&    (jugadas[2][0]=== 'O'))
		||   ((jugadas[0][0]=== 'O' )	&&    (jugadas[0][1]=== 'O') 	&&    (jugadas[0][2]=== 'O'))
		||   ((jugadas[0][0]=== 'O' )	&&    (jugadas[1][1]=== 'O') 	&&    (jugadas[2][2]=== 'O'))
		||   ((jugadas[1][0]=== 'O' )	&&    (jugadas[1][1]=== 'O') 	&&    (jugadas[1][2]=== 'O'))
		||   ((jugadas[2][0]=== 'O' )	&&    (jugadas[2][1]=== 'O') 	&&    (jugadas[2][2]=== 'O'))
		||   ((jugadas[0][1]=== 'O' )	&&    (jugadas[1][1]=== 'O') 	&&    (jugadas[2][1]=== 'O'))
		||   ((jugadas[0][2]=== 'O' )	&&    (jugadas[1][2]=== 'O') 	&&    (jugadas[2][2]=== 'O'))
		||   ((jugadas[0][2]=== 'O' )	&&    (jugadas[1][1]=== 'O') 	&&    (jugadas[2][0]=== 'O'))
	  ){
		existeganador = true;
		return "Gano Jugador O";

	}

	if(    (board[0][0]=== true )	&&    (board[0][1]=== true) 	&&    (board[0][2]=== true) &&
		   (board[1][0]=== true )	&&    (board[1][1]=== true) 	&&    (board[1][2]=== true) &&
		   (board[2][0]=== true )	&&    (board[2][1]=== true) 	&&    (board[2][2]=== true)

	  ){

		return "No hay Ganadores";

	}
    else
    	return "Sigan Jugando"
}

io.on('connection', function(socket){

	//Asignacion de jugadores
	if( jugadores.X === ''){
		jugadores.X= socket.id;
		socket.emit('Designar', {texto: 'Eres el jugador X', jugador: 'X'});
	}
	else if(jugadores.O === ''){
		jugadores.O= socket.id;
		socket.emit('Designar', {texto: 'Eres el jugador O', jugador: 'O'});
	}
	else{
		socket.emit( 'Msje_Personal', { texto: 'Sala llena' });
	}

	//Jugada de los jugadores registrados
	if(jugadores.X === socket.id ||  jugadores.O === socket.id ){

		socket.on('jugada', function(msg){

			if (existeganador === true)
					socket.emit('Msje_Personal', {texto:'Ya hay ganador felicidades'});
			else {

				//Resultado de colocar una jugada en tablero
				var fila = msg.fila,
		        	col= msg.col,
		        	jugador= msg.jugador;

		        console.log(board[fila-1][col-1]);

		        if(board[fila-1][col-1]=== true ){
		        	socket.emit( 'Msje_Personal', { texto: 'Posicion invalida'});
		        }

		        else if(jugadaAnterior=== jugador){

		        	socket.emit('Msje_Personal', {texto:'Espera tu turno'});
		        }

				else{
		        	//Evaluo jugadaAnterior con la jugada actual
		        	jugadaAnterior= jugador;

		        	//Funcion que llena tabla de jugadas
					var comprobacionjugadas = colocarJugadas(fila,
												    col,
												    jugador);

					//Compruebo ganador
					var hayGanador= comprobarSiHayGanador();
					console.log(jugadas);
					console.log(board);


					io.emit('jugada activa', {     tablero: jugadas,
                                         fila: fila,
					                               col : col,
					                               jugador:jugador});

				    //El mensaje se envia a cada jugador
				    if(hayGanador === "No hay Ganadores"){
						io.emit('Msje_Broadcast', { texto: 'No hay Ganadores'});
					}

					else if(hayGanador === "Sigan Jugando"){
						io.emit('Msje_Broadcast', { texto: 'Sigan Jugando'});
					}

					else if(hayGanador === "Gano Jugador X"){
						io.emit('Ganador', 'X');
					}
					else if(hayGanador === "Gano Jugador O"){
						io.emit('Ganador','O');
					}
				} //fin segundo else


			}//fin primer else
		});
	}


});
