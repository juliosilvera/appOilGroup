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
    //tx.executeSql('DROP TABLE IF EXISTS CodAsesor');
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
            var row = result.rows.item(0);
            //alert(row['codAsesor']);
            $asesor = row['codAsesor'];


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
    tx.executeSql('CREATE TABLE IF NOT EXISTS Clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, codigo TEXT, cliente TEXT, provincia TEXT, ciudad TEXT, lista_precios TEXT, asesor TEXT, email TEXT)');
    db4.transaction(function(tx){
        tx.executeSql('SELECT * FROM CodAsesor',[],function(tx, result){
            var row = result.rows.item(0);
            //alert(row['codAsesor']);
            var cod_asesor = row['codAsesor'];
            $.post("http://mobil.gotrade.com.ec/get_clientes", {asesor: cod_asesor}, function(data, status){
                        var count_clientes = 0;
                        $.each(data, function(i,v){
                            db1.transaction(function(tra){
                                count_clientes++;
                                tra.executeSql('INSERT INTO Clientes (id, codigo, cliente, provincia, ciudad, lista_precios, asesor, email) VALUES ('+v.id+', '+v.codigo+', "'+v.cliente+'", "'+v.provincia+'", "'+v.ciudad+'", "'+v.lista_precios+'", '+v.asesor+', "'+v.email+'")');
                                if(count_clientes == data.length)
                                {
                                    $("#status1").append('<center><h3><span class="label label-success">Datos de Clientes Actualizados</span></center></h3><hr />');
                                }
                            });
                        });

                    }).done(function(data){
                            console.log("Clientes descargados");
                            //alert(JSON.stringify(data));
                              }).fail(function(xhr, textStatus, errorThrown){
                              alert("Falla al conectar con el Servidor!, Error: " + errorThrown);
                              });

        });
    });
}

//Update table Productos
function updateProductos(tx) {
    tx.executeSql('DROP TABLE IF EXISTS Productos');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Productos (id INTEGER PRIMARY KEY AUTOINCREMENT, sap TEXT, descripcion TEXT, envase TEXT, ge TEXT, p54 TEXT, LA TEXT, MIX_LA_LE TEXT, LE TEXT, ALVAREZ TEXT, AUTOTEC TEXT, AUTODELTA TEXT, AUTOLIDER TEXT, AVILES TEXT, CINASCAR TEXT, CLEANEXPRESS TEXT, DAVILA TEXT, DINA TEXT, FAST_RENTA_C TEXT, FATOSLA TEXT, GARNER TEXT, GAS_MADRID TEXT, ITAL_MOVIMENTI TEXT, ITAL_LLANTA TEXT, LAVCA TEXT, LLANTA_BAJA TEXT, OJEDA TEXT, ONA TEXT, REYES TEXT, RODRIGUEZ TEXT, SAVREH TEXT, TALLERES_DE_SERVICIOS_AUTOM TEXT, TROYA TEXT, FREDY_CHAVEZ TEXT, PETROCEANO TEXT, MAYORISTAS TEXT, familia TEXT, desc_la TEXT, desc_mix_la_le TEXT)');
    $.get("http://mobil.gotrade.com.ec/get_productos", function(data, status){
            var count_pedidos = 0;
            $.each(data, function(i,v){
                db3.transaction(function(tra){
                    count_pedidos++;
                    tra.executeSql('INSERT INTO Productos (sap, descripcion, envase, ge, p54, LA, MIX_LA_LE, LE, ALVAREZ, AUTOTEC, AUTODELTA, AUTOLIDER, AVILES, CINASCAR, CLEANEXPRESS, DAVILA, DINA, FAST_RENTA_C, FATOSLA, GARNER, GAS_MADRID, ITAL_MOVIMENTI, ITAL_LLANTA, LAVCA, LLANTA_BAJA, OJEDA, ONA, REYES, RODRIGUEZ, SAVREH, TALLERES_DE_SERVICIOS_AUTOM, TROYA, FREDY_CHAVEZ, PETROCEANO, MAYORISTAS, familia) VALUES ("'+v.sap+'", "'+v.descripcion+'", "'+v.envase+'", "'+v.ge+'", "'+v.p54+'", "'+v.LA+'", "'+v.MIX_LA_LE+'", "'+v.LE+'", "'+v.ALVAREZ+'", "'+v.AUTOTEC+'", "'+v.AUTODELTA+'", "'+v.AUTOLIDER+'", "'+v.AVILES+'", "'+v.CINASCAR+'", "'+v.CLEANEXPRESS+'", "'+v.DAVILA+'", "'+v.DINA+'", "'+v.FAST_RENTA_C+'", "'+v.FATOSLA+'", "'+v.GARNER+'", "'+v.GAS_MADRID+'", "'+v.ITAL_MOVIMENTI+'", "'+v.ITAL_LLANTA+'", "'+v.LAVCA+'", "'+v.LLANTA_BAJA+'", "'+v.OJEDA+'", "'+v.ONA+'", "'+v.REYES+'", "'+v.RODRIGUEZ+'", "'+v.SAVREH+'", "'+v.TALLERES_DE_SERVICIOS_AUTOM+'", "'+v.TROYA+'", "'+v.FREDY_CHAVEZ+'", "'+v.PETROCEANO+'", "'+v.MAYORISTAS+'", "'+v.familia+'")');
                    if (count_pedidos == data.length)
                    {
                        $("#status1").append('<center><h3><span class="label label-success">Datos de Productos Actualizados</span></h3></center><hr />');
                    }
                });
            });

        }).done(function(){
                    console.log("Productos descargados");
                  }).fail(function(){
                  alert("Falla al conectar con el Servidor!, Error: " + errorThrown);
                  });


}

//Update table Descuentos
function updateDescuentos(tx) {
    tx.executeSql('DROP TABLE IF EXISTS Descuentos');
    $.get("http://mobil.gotrade.com.ec/get_descuentos", function(data, status){
            var count_desc = 0;
            $.each(data, function(i,v){
                var keys1 = $.map(v, function(v, k){ return k + " TEXT"; });

                db3.transaction(function(tx){
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Descuentos ('+keys1+')');
                });
                var keys = $.map(v, function(v, k){ return k; });
                var values = $.map(v, function(v, k){ return '"' + v + '"'; });

                db3.transaction(function(tx){
                    count_desc++;
                    tx.executeSql('INSERT INTO Descuentos ('+keys+') VALUES ('+values+')');
                    if(count_desc == data.length)
                    {
                        $("#status1").append('<center><h3><span class="label label-success">Datos de Descuentos Actualizados</span></h3></center><hr />');
                    }
                });
            });

        }).done(function(){
        console.log("Descuentos descargados");
        }).fail(function(){
        alert("Falla al conectar con el Servidor!, Error: " + errorThrown);
        });



}

//Update table Promociones
function updatePromociones(tx) {
    tx.executeSql('DROP TABLE IF EXISTS Promociones');
    $.get("http://mobil.gotrade.com.ec/get_promociones", function(data, status){
            var count = 0;
            $.each(data, function(i,v){
                var keys1 = $.map(v, function(v, k){ return k + " TEXT"; });

                db3.transaction(function(tx){
                    tx.executeSql('CREATE TABLE IF NOT EXISTS Promociones ('+keys1+')');
                });
                var keys = $.map(v, function(v, k){ return k; });
                var values = $.map(v, function(v, k){ return '"' + v + '"'; });

                db3.transaction(function(tx){
                    count++;
                    tx.executeSql('INSERT INTO Promociones ('+keys+') VALUES ('+values+')');
                    if(count == data.length)
                    {
                        $("#status1").append('<center><h3><span class="label label-success">Datos de Promociones Actualizados</span></h3></center><hr />');
                    }
                });
            });

        }).done(function(){
                    console.log("promociones descargadas");
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
    alert("Error processing SQL: "+err.code);
}

//function will be called when process succeed
function successCB() {
    console.log("Funca");
}


