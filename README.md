# Juego-Gato
Juego del Gato


##Inicializar proyecto

1. Descargar Node, y en la raiz del proyecto, ejecutar

	npm install 

2.Para iniciar servidor
	
	node server.js

3.En localhost:8080 se iniciará servidor.


##Qué se hizo

1. Se crea carpeta /img con imagenes para la 'equis' y 'circulo'
2. En server.js se agrega el Path para que detecte las imagenes
      app.use("/img", express.static(__dirname + '/img'));
3. En function/board.js, se agrega la logica para detectar cuando se agrega una 'equis' o 'circulo'
4. En view/index.html se agrega el tablero
5. En css/tablero.css se agrega el estilo para que el tablero tenga las proporciones que posee.