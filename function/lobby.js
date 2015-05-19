//Declaro dependencias
var socket = io.connect('http://localhost:8080');

//Declaro variables globales
var gSalas= {},
    gJugadores={},
    gRanking=[];

var controladorTablaSala= {

      vhtml: '',

      agregarLineaTabla: function(salas)
      		{
            var disponibles= salas.disponibles,
                index= salas.salas,
                participantes= salas.participantes,
                jugadores= salas.jugadores;


            for(var i=0; i<index.length ; i++){

                var sala= index[i];
      			     this.vhtml += "<tr>";
                 this.vhtml += "  <td>" + sala + "</td>";
                 this.vhtml += "  <td>" + disponibles[sala] + "</td>";
                 this.vhtml += ' <td><button type="submit" id="'+sala+'" class="btn btn-success flright btnSala">Entrar</button></td>';
            }

      			$("#tablaSalas").html(this.vhtml);
         }
    }

$(document).ready(function(){

  obtenerRanking();
  obtenerSalas();

  socket.on('connect', function(){
    socket.emit('agregarUsuario', prompt("Cual es tu nick?: "));
  });


  $(".btnSala").click(function (event) {

      //this.id -> es el numero de la sala que se quiere entrar
      console.log(this.id);
      var sala= this.id;
      socket.emit('cambiardeSala', sala);
  });

});



function obtenerRanking(){
    var urlTweet = 'http://localhost:8080/ranking';

    $.ajax({ url: urlTweet, type: 'GET', dataType: "json",
    success: function(resultData) {
        console.log(resultData);
    },
    error: function(xhr, status, error){
        console.log(xhr);
        console.log(status);
        console.log(error);
        console.log('Error send request');
    }
  });
}

function obtenerSalas(){
    var urlTweet = 'http://localhost:8080/salas';

    $.ajax({ url: urlTweet, type: 'GET', dataType: "json",
    success: function(resultData) {
      controladorTablaSala.agregarLineaTabla(resultData);

    },
    error: function(xhr, status, error){
        console.log(xhr);
        console.log(status);
        console.log(error);
        console.log('Error send request');
    }
  });
}
