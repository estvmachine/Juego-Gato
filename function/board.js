//Declaro dependencias
var socket = io();


//Declaro variables globales
var gtipoJugador='',
    gnickUsuario='',
    gtablero= [
            ['', '', ''],
    				['', '', ''],
    				['', '', '']
    			];

$(document).ready(function(){

    $('#tablero').hide();

    $('.cuadro').click(function (event) {

        var partes= (this.id).split('-'),
            fila = partes[0].replace('fila',''),
            col = partes[1].replace('col',''),
            jugador= gtipoJugador;

        socket.emit('jugada', {fila: fila,
                               col : col,
                               jugador:jugador} );

    });

     socket.on('jugada activa', function(msg){
         var jugadas= msg.tablero;
         llenarTablero(jugadas);
    });


    socket.on('Ganador', function(msg){
         var jugador= msg;

         if(jugador==='X'){
            document.getElementById("txt-resultado").innerHTML = 'Gano jugador X';
            alert('Gano X');
         }
         else{
            document.getElementById("txt-resultado").innerHTML = 'Gano jugador O';
            alert('Gano O');
         }

    });

    socket.on('Designar', function(msg){
        document.getElementById("txt-resultado").innerHTML = msg.texto;

        gtipoJugador= msg.jugador;

    });

    socket.on('Msje_Broadcast', function(msg){
        document.getElementById("txt-resultado").innerHTML = msg.texto;
    });

    socket.on('Msje_Personal', function(msg){
        document.getElementById("txt-resultado").innerHTML = msg.texto;

    });


});


/****************************LIBRERIA********************************/
//Si esta fuera de document.ready, es parte de la libreria

//Esta funcion es para enviar mensajes a servidor
function llenarTablero(arrayJugadas){

    console.log(arrayJugadas);

    for(var posfila=0; posfila<3 ; posfila++){
      for(var poscol=0; poscol<3 ; poscol++){

          if(gtablero[posfila][poscol] !== arrayJugadas[posfila][poscol]){

              if(arrayJugadas[posfila][poscol]==='X'){
                 $('#fila'+ (posfila+1) + '-col'+ (poscol+1)  ).html('<img style="height: 120px;width:120px; "src="../img/ink-x.png" />');
               }

              else{
                $('#fila'+ (posfila+1) + '-col'+ (poscol+1)  ).html('<img style="height: 120px;width:120px; "src="../img/ink-circle.png" />');
              }
          }
      }
    }

    gtablero= arrayJugadas;
}
