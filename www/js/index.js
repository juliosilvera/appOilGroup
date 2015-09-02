var db = window.openDatabase("dbEncuestas", "1.0", "dbEncuestas", 65535);
var db1 = window.openDatabase("Clientes", "1.0", "Clientes", 65535);
var db3 = window.openDatabase("Productos", "1.0", "Productos", 65535);
var db4 = window.openDatabase("Asesor", "1.0", "Asesor", 65535);




document.getElementById("btnEncuestas").addEventListener("click", openEncuestas, false);

function openEncuestas() {
    window.open("encuestas.html", "_self");
}

$("#btnPedidos").click(function () {
    window.open("pedidos.html", "_self");
});

$asesor = 0;

$(function(){
    db4.transaction(checkAsesor);
    $("#guardarAsesor").hide();
    $("#cod_asesor").hide();
    db.transaction(queryEncuestas);
    db3.transaction(queryPedidos);
    db1.transaction(updateClientes,errorCB,successCB);
    db3.transaction(updateProductos,errorCB,successCB);
    db3.transaction(updateDescuentos,errorCB,successCB);
    db3.transaction(updatePromociones,errorCB,successCB);
});

function checkAsesor(tx)
{
    tx.executeSql('SELECT * FROM CodAsesor',[],itOk, addAsesor);
}

function addAsesor(tx, result){
    $("#guardarAsesor").show();
    $("#cod_asesor").show();
    $.get("http://mobil.gotrade.com.ec/app_check", function(data, status){
        $.each(data, function(i,v){
        $("#cod_asesor").append("<option value='"+v['cod_asesor']+"'>"+v['asesor']+"</option>");
        });

    })
    .done(function(data){

    })
    .fail(function(d, s, t){
    alert("Status: " + s + " THROW: " + t);
    });
}

function itOk(tx, result){

    for (var i = 0; i < result.rows.length; i++)
        {
            var row = result.rows.item(i);
            //alert(row['codAsesor']);
            $asesor = row['codAsesor'];
        }
    //db4.transaction(function(tx){
    //        tx.executeSql('DROP TABLE IF EXISTS CodAsesor');
    //    });
}

$("#guardarAsesor").click(function(){
        db4.transaction(function(tx){
            tx.executeSql('CREATE TABLE IF NOT EXISTS CodAsesor (id INTEGER, codAsesor TEXT)');
            tx.executeSql('INSERT INTO CodAsesor (id, codAsesor) VALUES (1, "'+$("#cod_asesor").val()+'")');
            $("#asesor").empty();
        })

});

//select all from Encuestas
function queryEncuestas(tx){
    tx.executeSql('SELECT * FROM Encuestas',[],pullEncuestas);
}

//select all from Pedidos
function queryPedidos(tx){
    tx.executeSql('SELECT * FROM Pedidos',[],pullPedidos);
}

//show amount of Encuestas
function pullEncuestas(tx, result){
    if (result.rows.length > 0) {
        var contador = result.rows.length;
        $("#alerta").append("<center><h3><span class='label label-warning'>Usted tiene "+contador+" clusterizaciones por enviar!</span></h3><hr /></center>");
        alert("Usted tiene "+contador+" clusterizaciones por enviar!");
    };
}

//show amount of Pedidos
function pullPedidos(tx, result){
    if (result.rows.length > 0) {
        var contador = result.rows.length;
        $("#alerta").append("<center><h3><span class='label label-warning'>Usted tiene "+contador+" Pedidos por enviar!</span></h3><hr /></center>");
        alert("Usted tiene "+contador+" Pedidos por enviar!");
    };
}

//Update Table Clientes
function updateClientes(tx) {
    tx.executeSql('DROP TABLE IF EXISTS Clientes');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, codigo INTEGER, cliente TEXT, provincia TEXT, ciudad TEXT, tipo_negocio TEXT, lista_precios TEXT, asesor INTEGER, email TEXT)');
    $.post("http://mobil.gotrade.com.ec/get_clientes", {asesor: $asesor}, function(data, status){
            $.each(data, function(i,v){
                db1.transaction(function(tra){
                    tra.executeSql('INSERT INTO Clientes (id, codigo, cliente, provincia, ciudad, tipo_negocio, lista_precios, asesor, email) VALUES ('+v.id+', '+v.codigo+', "'+v.cliente+'", "'+v.provincia+'", "'+v.ciudad+'", "'+v.tipo_negocio+'", "'+v.lista_precios+'", '+v.asesor+', "'+v.email+'")');
                });
            });

        }).done(function(){
                $("#status1").append('<center><h3><span class="label label-success">Datos de Clientes Actualizados</span></center></h3><hr />');
                  }).fail(function(xhr, textStatus, errorThrown){
                  alert("Falla al conectar con el Servidor!, Error: " + errorThrown);
                  });



}

//Update table Productos
function updateProductos(tx) {
    tx.executeSql('DROP TABLE IF EXISTS Productos');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Productos (id INTEGER PRIMARY KEY AUTOINCREMENT, sap TEXT, descripcion TEXT, envase TEXT, ge TEXT, p54 TEXT, p56 TEXT, la TEXT, mix_la_le TEXT, lista_le TEXT, familia TEXT)');
    $.get("http://mobil.gotrade.com.ec/get_productos", function(data, status){
            $.each(data, function(i,v){
                db3.transaction(function(tra){
                    tra.executeSql('INSERT INTO Productos (id, sap, descripcion, envase, ge, p54, p56, la, mix_la_le, lista_le, familia) VALUES ('+v.id+', "'+v.sap+'", "'+v.descripcion+'", "'+v.envase+'", "'+v.ge+'", "'+v.p54+'", "'+v.p56+'", "'+v.la+'", "'+v.mix_la_le+'", "'+v.lista_le+'", "'+v.familia+'")');
                });
            });
        }).done(function(){
                  $("#status1").append('<center><h3><span class="label label-success">Datos de Productos Actualizados</span></h3></center><hr />');
                  }).fail(function(){
                  alert("Falla al conectar con el Servidor!, Error: " + errorThrown);
                  });


}

//Update table Descuentos
function updateDescuentos(tx) {
    tx.executeSql('DROP TABLE IF EXISTS Descuentos');
    $.get("http://mobil.gotrade.com.ec/get_descuentos", function(data, status){
            $.each(data, function(i,v){
                var keys1 = $.map(v, function(v, k){ return k + " TEXT"; });

                db3.transaction(function(tx){
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Descuentos ('+keys1+')');
                });
                var keys = $.map(v, function(v, k){ return k; });
                var values = $.map(v, function(v, k){ return '"' + v + '"'; });

                db3.transaction(function(tx){
                    tx.executeSql('INSERT INTO Descuentos ('+keys+') VALUES ('+values+')');
                });
            });
        }).done(function(){
        $("#status1").append('<center><h3><span class="label label-success">Datos de Descuentos Actualizados</span></h3></center><hr />');
        }).fail(function(){
        alert("Falla al conectar con el Servidor!, Error: " + errorThrown);
        });



}

//Update table Promociones
function updatePromociones(tx) {
    tx.executeSql('DROP TABLE IF EXISTS Promociones');
    $.get("http://mobil.gotrade.com.ec/get_promociones", function(data, status){
            $.each(data, function(i,v){
                var keys1 = $.map(v, function(v, k){ return k + " TEXT"; });

                db3.transaction(function(tx){
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Promociones ('+keys1+')');
                });
                var keys = $.map(v, function(v, k){ return k; });
                var values = $.map(v, function(v, k){ return '"' + v + '"'; });

                db3.transaction(function(tx){
                    tx.executeSql('INSERT INTO Promociones ('+keys+') VALUES ('+values+')');
                });
            });
        }).done(function(){
                   $("#status1").append('<center><h3><span class="label label-success">Datos de Promociones Actualizados</span></h3></center><hr />');
                  }).fail(function(){
                  alert("Falla al conectar con el Servidor!, Error: " + errorThrown);
                  });



}

//Drop table Pedidos
function borrarPedidos(tx) {
    tx.executeSql('DROP TABLE IF EXISTS Pedidos');
}



//function will be called when an error occurred
function errorCB(err) {
    console.log("Error processing SQL: "+err.code);
}

//function will be called when process succeed
function successCB() {
    console.log("Funca");
}



