var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app);

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
	board[row-1][col-1] =! board[row-1][col-1];   //si ya hay jugada no puedo poner otra
	return board[row-1][col-1];
}

function colocarJugadas(row, col, jugada){
	if(jugada=== 'Equis')
		jugadas[row-1][col-1]= 'X';
	else
		jugadas[row-1][col-1]= 'O';

}

function comprobarSiHayGanador(){

	if(      (jugadas[0][0]=== 'X' || jugadas[0][0]=== 'O')
			&&    (jugadas[1][0]=== 'X' || jugadas[1][0]=== 'O') 
				&&    (jugadas[2][0]=== 'X' || jugadas[2][0]=== 'O')    
	  ){

		return true;

	}
	else 
		return false;                                             


}

app.get('/analizarTablero/:row/:col/:jugador', function (req, res) {

	//Resultado de colocar una jugada en tablero
	var resultado = analizarTablero(req.params.row,
									req.params.col,
									req.params.jugador);

	//Funcion que llena tabla de jugadas
	colocarJugadas(req.params.row,
				   req.params.col,
				   req.params.jugador);
	
	//Compruebo ganador
	var hayGanador= comprobarSiHayGanador();

	if(hayGanador)
		res.json('Hay un ganador');
	else
		res.send(resultado);  //La respuesta a si ya hay una jugada en esa parte del tablero


});