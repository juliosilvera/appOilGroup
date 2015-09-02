document.addEventListener("deviceready", onDeviceReady, false);
var db = window.openDatabase("Productos", "1.0", "Productos", 65535);
//function will be called when device ready
function onDeviceReady(){

    db.transaction(queryDB);

}


//function will be called when an error occurred
function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

//select all from SoccerPlayer
function queryDB(tx){
    tx.executeSql('SELECT * FROM Pedidos',[],querySuccess,errorCB);

}

function querySuccess(tx, result){
    $('#encuestas').empty();
    for (var i = 0; i < result.rows.length; i++)
    {
        var row = result.rows.item(i);
        $('#encuestas').append('<div class="col-md-4"><p>'+row['id']+'</p><h3>'+row['cliente']+'</h3><p>'+row['fecha']+'</p></div><hr />');
        
    }

}

