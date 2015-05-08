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
	if (board [row-1][col-1] === false){
		//Ocupo posicion del tablero
		board[row-1][col-1]  =  true;

		if(jugada === 'Equis'){
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

app.get('/colocarJugada/:row/:col/:jugador', function (req, res) {
	if (existeganador === true)
		res.json('Ya hay ganador felicidades');
	else {
		//Resultado de colocar una jugada en tablero
		var fila= req.params.row,
			col= req.params.col,
			jugador= req.params.jugador;

		//Funcion que llena tabla de jugadas
		var comprobacionjugadas = colocarJugadas(fila,
									    col,
									    jugador);

		//Compruebo ganador
		var hayGanador= comprobarSiHayGanador();
		console.log(jugadas);
		console.log(board);


		if (comprobacionjugadas === "Posicion invalida"){
			res.json('Posicion invalida');
			}

		else {
			console.log(hayGanador);
			//Emito un socket para dibujar jugada en Tablero
			if(jugador==='Equis')
	    		io.emit('jugada activa', fila + '-'+ col + '-'+jugador);  //Aca estoy enviando fila-col
	    	else
	    		io.emit('jugada activa', fila + '-'+ col + '-'+jugador);   //Aca estoy enviando fila-col
	 		 
	    	//El mensaje se envia a cada jugador
	    	if(hayGanador === "No hay Ganadores"){
				res.json('No hay Ganadores');
				io.emit('No hay Ganadores');
			}

			else if(hayGanador === "Sigan Jugando"){
				res.json('Sigan Jugando');
			}

			else if(hayGanador === "Gano Jugador X"){
				res.json('Gano Jugador X');
				io.emit('Ganador', 'X');
			}
			else if(hayGanador === "Gano Jugador O"){
				res.json('Gano Jugador O');
				io.emit('Ganador','O');
			}


		

		}
	}
});


