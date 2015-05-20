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
  socket.emit('informarNick', prompt("Cual es tu nick?: "), 'Lobby');
});

socket.on('informarCambioDeSala',function(username, room){
  socket.emit('iniciarSala',username, room);
});

socket.on('designarTipoJugador', function(data){
  gtipoJugador= data.tipoJugador;
  console.log(data);
  
  if(gtipoJugador==='Expectador'){

    document.getElementById('info').style.visibility='hidden';
    document.getElementById('infoExpectador').style.visibility='visible';
    document.getElementById("showSalaActual").innerHTML= data.sala;
    $document.getElementById("showNickJugador1").innerHTML= data.jugadorO + ' (O)';
    $document.getElementById("showNickJugador2").innerHTML=  data.jugadorX + ' (X)';
    llenarTablero(data.tablero);
  }
  else{
    document.getElementById("showSalaActual").innerHTML= data.sala;
    document.getElementById("showNickUser").innerHTML= data.username + ' ('+ data.tipoJugador + ')';
    document.getElementById("txt-resultado").innerHTML = data.texto;
    llenarTablero(data.tablero);
  }


});

socket.on('designarEnemigo', function(data){

    if(gtipoJugador=== 'X'){
      document.getElementById("showNickEnemy").innerHTML=  data.jugadores.O + ' (O)';
    }
    else if(gtipoJugador=== 'O'){
      document.getElementById("showNickEnemy").innerHTML=  data.jugadores.X + ' (X)';
    }

});

socket.on('actualizarJugadas', function (username, jugadas) {
  console.log(username);
  console.log(jugadas);
  llenarTablero(jugadas);
});


socket.on('Msje_Broadcast', function(data ){
  document.getElementById("txt-resultado").innerHTML = data.texto;
});

socket.on('Msje_Personal', function(data){
  document.getElementById("txt-resultado").innerHTML = data.texto;

});

socket.on('Ganador', function(data){
         var jugador= data;

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

        document.getElementById('infoExpectador').style.visibility='hidden';
        document.getElementById('tablero').style.visibility='hidden';
        document.getElementById('info').style.visibility='hidden';

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


        $('ul.dropdown-menu li').click(function (data) {

          var sala= this.id;
        //Salirse de la sala actual y entrar a otra
          socket.emit('cambiardeSala', sala, gtipoJugador);
          $("#selectorSala").val(sala);

          if(sala==="Lobby"){
            document.getElementById('tablero').style.visibility='hidden';
            document.getElementById('info').style.visibility='hidden';
          }

          else{
            document.getElementById('tablero').style.visibility='visible';
            document.getElementById('info').style.visibility='visible';

          }


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
