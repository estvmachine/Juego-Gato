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

var board = [[false, false, false],[false, false, false],[false, false, false]];

function analizarTablero(row, col){
	board[row-1][col-1] =! board[row-1][col-1];
	return board[row-1][col-1];
}

app.get('/analizarTablero/:row/:col', function (req, res) {
	var resultado = analizarTablero(req.params.row,req.params.col);
	res.send(resultado);
});