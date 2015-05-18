//Declaro dependencias
var socket = io.connect('http://localhost:8080');


//Declaro variables globales
var gtipoJugador='',
    gnickUsuario='',
    gtablero= [
            ['', '', ''],
    				['', '', ''],
    				['', '', '']
    			];


socket.on('connect', function(){
  socket.emit('agregarUsuario', prompt("Cual es tu nick: "));
});

socket.on('Designar', function(msg){
  document.getElementById("txt-resultado").innerHTML = msg.texto;
  gtipoJugador= msg.jugador;
});

socket.on('actualizarJugadas', function (username, jugadas) {
  console.log(username);
  console.log(jugadas);
  llenarTablero(jugadas);
});


socket.on('actualizarSalas', function (rooms, current_room) {
  $('#rooms').empty();
    $.each(rooms, function(key, value) {
       if(value == current_room){
           $('#rooms').append('<div>' + value + '</div>');
       }
       else {
           $('#rooms').append('<div><a href="#" onclick="cambiardeSala(\''+value+'\')">' + value + '</a></div>');
       }
    });
});

function cambiardeSala(room){
  socket.emit('cambiardeSala', room);
}

socket.on('Msje_Broadcast', function(data ){
  document.getElementById("txt-resultado").innerHTML = data;
});

socket.on('Msje_Personal', function(msg){
  document.getElementById("txt-resultado").innerHTML = msg.texto;

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

//Funcionalidad de elementos de la pagina

$(document).ready(function(){

        //$('#tablero').hide();

        $('.cuadro').click(function (event) {

            var partes= (this.id).split('-'),
                fila = partes[0].replace('fila',''),
                col = partes[1].replace('col',''),
                jugador= gtipoJugador;


            socket.emit('realizarJugada', {fila: fila,
                                   col : col,
                                   jugador:jugador} );

        });

        $('#roombutton').click(function(){
           var name = $('#roomname').val();
           $('#roomname').val('');
           socket.emit('crearSala', name)
        });

    });


/****************************LIBRERIA********************************/
//Si esta fuera de document.ready, es parte de la libreria

//Esta funcion es para enviar mensajes a servidor
function llenarTablero(arrayJugadas){

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
