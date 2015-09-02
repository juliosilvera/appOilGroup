var db = window.openDatabase("dbEncuestas", "1.0", "dbEncuestas", 65535);

function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

//select all from SoccerPlayer
function queryDB(tx){

    tx.executeSql('SELECT * FROM Encuestas',[],querySuccess,errorCB);
}

function querySuccess(tx, result){

    for (var i = 0; i < result.rows.length; i++)
    {
        var row = result.rows.item(i);
        
        var postData = row;

        $.ajax({
            type: 'POST',
            data: postData,
            url: 'http://mobil.gotrade.com.ec/uploadClusterizacion',
            success: function(data){

            },
            error: function(data, t, s){
                alert(s);
            }
        });
    }
    alert("Clusterizaciones Enviadas");
    tx.executeSql('DROP TABLE IF EXISTS Encuestas');

}

$("form").submit(function(){
    db.transaction(queryDB);
    return false;
});

