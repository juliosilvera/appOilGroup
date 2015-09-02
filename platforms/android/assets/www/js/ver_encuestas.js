document.addEventListener("deviceready", onDeviceReady, false);
var db = window.openDatabase("dbEncuestas", "1.0", "dbEncuestas", 65535);
//function will be called when device ready
function onDeviceReady(){

    db.transaction(queryDB);
}


//function will be called when an error occurred
function errorCB(err) {
    
}

//select all from SoccerPlayer
function queryDB(tx){
    tx.executeSql('SELECT * FROM Encuestas',[],querySuccess,errorCB);
}

function querySuccess(tx, result){
    $('#encuestas').empty();
    for (var i = 0; i < result.rows.length; i++)
    {
        var row = result.rows.item(i);
        $('#encuestas').append('<div class="col-md-4"><p>'+row['id']+'</p><h3>'+row['cliente']+'</h3><p>'+row['fecha']+'</p></div><div class="col-md-4"><a href="editar.html?id='+row['id']+'">Editar</a></div><hr />');
    }

}

