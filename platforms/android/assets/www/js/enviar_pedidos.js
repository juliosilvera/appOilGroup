var db = window.openDatabase("Productos", "1.0", "Productos", 65535);

function errorCB(err) {
    alert("Tablas vacias, genere pedido para poder enviar!");
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
            url: 'http://mobil.gotrade.com.ec/uploadPedidos',
            success: function(data){

            },
            error: function(data, t, s){
                alert("Data: " + data + ", Throw: " + t + ", Error: " + s);
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

