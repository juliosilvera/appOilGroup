var db = window.openDatabase("dbEncuestas", "1.0", "dbEncuestas", 200000);

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
        
        var postData = {
        fecha: row["fecha"],
        cliente: row["cliente"],
        codigo: row["codigo"],
        local: row["local"],
        fosas: row["fosas"],
        participacion: row["participacion"],
        cantidad_marcas: row["cantidad_marcas"],
        mix_sintetico: row["mix_sintetico"],
        mix_multi_premium: row["mix_multi_premium"],
        mix_multi_standard: row["mix_multi_standard"],
        mix_transmision: row["mix_transmision"],
        no_empleados: row["no_empleados"],
        volumen_venta: row["volumen_venta"],
        referencia_credito: row["referencia_credito"],
        segmento_clientes: row["segmento_clientes"],
        formato_Mecanica: row["formato_Mecanica"],
        formato_Tecnicentro: row["formato_Tecnicentro"],
        formato_Repuestera: row["formato_Repuestera"],
        formato_Lubricadora: row["formato_Lubricadora"],
        formato_Mayorista: row["formato_Mayorista"],
        ubicacion: row["ubicacion"],
        Exhibidor: row["Exhibidor"],
        Counter: row["Counter"],
        Percha: row["Percha"],
        trafico_clientes: row["trafico_clientes"],
        imagen_externa: row["imagen_externa"],
        oyl: row["oyl"],
        imagen_interna: row["imagen_interna"],
        cantidad_referencias: row["cantidad_referencias"],
        tipo_venta: row["tipo_venta"],
        relacion_marca: row["relacion_marca"],
        observaciones: row["observaciones"],
        };

        $.ajax({
            type: 'POST',
            data: postData,
            url: 'http://www.gotrade.com.ec/mobil/prueba.php',
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

