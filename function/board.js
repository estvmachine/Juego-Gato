//Se ejecuta primero
var socket = io();

$(document).ready(function(){  

    $('#btn-send').click(function (event) {
        var fila = $("#fila").val();
        var col = $("#col").val();
        var jugador= $("#jugador").val();

       

        if(jugador==='Equis')
            jugador= 'X';
        else
            jugador='O';
        
        socket.emit('jugada', {fila: fila,
                               col : col,
                               jugador:jugador} );
       
    });
    
     socket.on('jugada activa', function(msg){
          //Dibujo un circulo en la posicion indicada: hay que descifrar msg-> fila y columna
         var fila = msg.fila,
             col= msg.col,
             jugador= msg.jugador;

         if(jugador==='X')
            $('#row'+fila + '-col'+col).html('<img style="height: 120px;width:120px; "src="../img/ink-x.png" />');
         else
            $('#row'+fila + '-col'+col).html('<img style="height: 120px;width:120px; "src="../img/ink-circle.png" />');
      
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

    socket.on('Sigan Jugando', function(msg){
        document.getElementById("txt-resultado").innerHTML = 'Sigan jugando';
    });

    socket.on('No hay Ganadores',function(){
        document.getElementById("txt-resultado").innerHTML = 'Se acabo el juego, no hay ganadores';
    });

    socket.on('Posicion invalida', function(){
        document.getElementById("txt-resultado").innerHTML = 'Posicion invalida, escoga otra';
       
    });

});


/****************************LIBRERIA********************************/
//Si esta fuera de document.ready, es parte de la libreria

//Esta funcion es para enviar mensajes a servidor
function send(fila, col, jugador){

    var urlTweet = 'http://localhost:8080/colocarJugada/' + fila + '/' + col + '/' + jugador;  

    $.ajax({ url: urlTweet, type: 'GET', dataType: "json", 
    success: function(resultData) {
       
        //Escribo mensaje en la pantalla 
        document.getElementById("txt-resultado").innerHTML = resultData;
   
    },
    error: function(xhr, status, error){
        console.log(xhr);
        console.log(status);
        console.log(error);
        console.log('Error send request');
    }
  });
}
