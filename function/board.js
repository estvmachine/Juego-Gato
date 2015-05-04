function send(row, col, jugador){
    var urlTweet = 'http://localhost:8080/analizarTablero/' + row + '/' + col;

    $.ajax({ url: urlTweet, type: 'GET', dataType: "json", 
    success: function(resultData) {
        document.getElementById("txt-resultado").innerHTML = resultData;
        if(jugador=== 'Equis')
            $('#row'+row + '-col'+col).html('<img style="height: 160px;width:160px; "src="../img/ink-x.png" />');
        else
            $('#row'+row + '-col'+col).html('<img style="height: 160px;width:160px; "src="../img/ink-circle.png" />');

    },
    error: function(xhr, status, error){
        console.log(xhr);
        console.log(status);
        console.log(error);
        console.log('Error send request');
    }
  });
}

$(document).ready(function(){
    $('#btn-send').click(function (event) {
        var row = $("#row").val();
        var col = $("#col").val();
        var jugador= $("#jugador").val();
        send(row, col, jugador)
    });
});