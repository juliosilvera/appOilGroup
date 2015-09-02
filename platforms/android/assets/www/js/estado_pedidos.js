var db4 = window.openDatabase("Asesor", "1.0", "Asesor", 200000);

$asesor = 8;

$(function(){
    db4.transaction(queryAsesor);
});

function queryAsesor(tx)
{
    tx.executeSql('SELECT * FROM CodAsesor',[],function(tx, result){
        for (var i = 0; i < result.rows.length; i++)
                {
                    var row = result.rows.item(i);
                    $asesor = row['codAsesor'];
                }
        $.post("http://mobil.gotrade.com.ec/estado_pedidos", {cod_asesor: $asesor}, function(data, status){
                    $.each(data, function(i,v){
                        $("#tableBody").append("<tr><td>"+v['fecha']+"</td><td>"+v['codigo']+"</td><td>"+v['cliente']+"</td><td>"+v['estado']+"</td></tr>");
                    }).done(function(){
                        alert("Done");
                    }).fail(function(d, s, t){
                        alert("Error: " + t);
                    });
                });
    });

}


