//Se ejecuta primero
var socket = io();

$(document).ready(function(){  

    $('#btn-send').click(function (event) {
        var fila = $("#fila").val();
        var col = $("#col").val();
        var jugador= $("#jugador").val();
        send(fila, col, jugador)   //Ejecuta este llamado a GET /analizarTablero/:row/:col/:jugador en SERVIDOR
        socket.emit('jugada gato', fila+'-'+col+'-'+jugador);  //Activando un evento a traves de SOCKET llama 'jugada dato'
    });
    
     socket.on('jugo x', function(msg){
          //Dibujo un circulo en la posicion indicada: hay que descifrar msg-> fila y columna
         var partes= msg.split('-');
         var fila = partes[0];
         var col= partes[1];

          $('#row'+fila + '-col'+col).html('<img style="height: 120px;width:120px; "src="../img/ink-x.png" />');
      
      });


      socket.on('jugo o', function(msg){ 
          //Dibujo un circulo en la posicion indicada: hay que descifrar msg-> fila y columna
         var partes= msg.split('-');
         var fila = partes[0];
         var col= partes[1];
          $('#row'+fila + '-col'+col).html('<img style="height: 120px;width:120px; "src="../img/ink-circle.png" />');
      })

});


/****************************LIBRERIA********************************/
//Si esta fuera de document.ready, es parte de la libreria

//Esta funcion es para enviar mensajes a servidor
function send(fila, col, jugador){

    //Esto espera servidor localhost:8080/colocarJugada/:fila/:col por metodo GET
    var urlTweet = 'http://localhost:8080/colocarJugada/' + fila + '/' + col + '/' + jugador;  

    $.ajax({ url: urlTweet, type: 'GET', dataType: "json", 
    success: function(resultData) {
        
        document.getElementById("txt-resultado").innerHTML = resultData;
        //console.log(resultData);
    
        if (resultData !== 'Posicion invalida' && resultData !== 'Ya hay ganador felicidades'){
            if(jugador === 'Equis')
                $('#row'+fila + '-col'+col).html('<img style="height: 120px;width:120px; "src="../img/ink-x.png" />');
            else

                $('#row'+fila + '-col'+col).html('<img style="height: 120px;width:120px; "src="../img/ink-circle.png" />');
        }
    },
    error: function(xhr, status, error){
        console.log(xhr);
        console.log(status);
        console.log(error);
        console.log('Error send request');
    }
  });
}
