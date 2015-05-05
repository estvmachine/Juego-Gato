//Se ejecuta primero
$(document).ready(function(){  
    $('#btn-send').click(function (event) {
        var fila = $("#fila").val();
        var col = $("#col").val();
        var jugador= $("#jugador").val();
        console.log('Aprete el boton', fila, col, jugador);
        send(fila, col, jugador)
    });
});


/****************************LIBRERIA********************************/
//Si esta fuera de document.ready, es parte de la libreria

//Esta funcion es para enviar mensajes a servidor
function send(fila, col, jugador){

    //Esto espera servidor localhost:8080/analizarTablero/:fila/:col por metodo GET
    var urlTweet = 'http://localhost:8080/analizarTablero/' + fila + '/' + col + '/' + jugador;  

    $.ajax({ url: urlTweet, type: 'GET', dataType: "json", 
    success: function(resultData) {
        
        document.getElementById("txt-resultado").innerHTML = resultData;
        //console.log(resultData);
        if(jugador=== 'Equis')
            $('#row'+fila + '-col'+col).html('<img style="height: 160px;width:160px; "src="../img/ink-x.png" />');
        else
            $('#row'+fila + '-col'+col).html('<img style="height: 160px;width:160px; "src="../img/ink-circle.png" />');

    },
    error: function(xhr, status, error){
        console.log(xhr);
        console.log(status);
        console.log(error);
        console.log('Error send request');
    }
  });
}
