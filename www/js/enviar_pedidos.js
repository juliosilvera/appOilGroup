var db = window.openDatabase("Productos", "1.0", "Productos", 200000);

function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

//select all from SoccerPlayer
function queryDB(tx){

    tx.executeSql('SELECT * FROM Pedidos',[],querySuccess,errorCB);
}

function querySuccess(tx, result){

    for (var i = 0; i < result.rows.length; i++)
    {
        var row = result.rows.item(i);
        
        var postData = row;
        $.ajax({
            type: 'POST',
            data: postData,
            url: 'http://localhost/oilgroup/public/uploadPedidos',
            success: function(data){

            },
            error: function(data, t, s){
                alert(s);
            }
        });

    }
    alert("Pedidos Enviados");
    tx.executeSql('DROP TABLE IF EXISTS Pedidos');

}

$("form").submit(function(){
    db.transaction(queryDB);
    return false;
});

