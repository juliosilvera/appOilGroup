var db = window.openDatabase("Clientes", "1.0", "Clientes", 200000);
var db3 = window.openDatabase("Productos", "1.0", "Productos", 200000);

$(function(){
    db.transaction(populateDB,errorCB,successCB);
    db3.transaction(populateDB2,errorCB,successCB);
    db3.transaction(populateDB3,errorCB,successCB);
    db3.transaction(populateDB4,errorCB,successCB);

});

function populateDB(tx) {
    tx.executeSql('DROP TABLE IF EXISTS Clientes');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, codigo INTEGER, cliente TEXT, provincia TEXT, ciudad TEXT, tipo_negocio TEXT, lista_precios TEXT, asesor INTEGER, email TEXT)');
    $.get("http://mobil.gotrade.com.ec/get_clientes", function(data, status){
            $.each(data, function(i,v){
                db.transaction(function(tra){
                    tra.executeSql('INSERT INTO Clientes (id, codigo, cliente, provincia, ciudad, tipo_negocio, lista_precios, asesor, email) VALUES ('+v.id+', '+v.codigo+', "'+v.cliente+'", "'+v.provincia+'", "'+v.ciudad+'", "'+v.tipo_negocio+'", "'+v.lista_precios+'", '+v.asesor+', "'+v.email+'")');
                });
            });
        }).done(function(){
                  $("#status1").append('<h3><span class="label label-success">Datos de Clientes Actualizados</span></h3><hr />');
                  }).fail(function(xhr, textStatus, errorThrown){
                  alert("Falla al conectar con el Servidor!, Error: " + errorThrown);
                  });



} 

function populateDB2(tx) {
    tx.executeSql('DROP TABLE IF EXISTS Productos');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Productos (id INTEGER PRIMARY KEY AUTOINCREMENT, sap TEXT, descripcion TEXT, envase TEXT, ge TEXT, p54 TEXT, p56 TEXT, la TEXT, mix_la_le TEXT, lista_le TEXT, familia TEXT)');
    $.get("http://mobil.gotrade.com.ec/get_productos", function(data, status){
            $.each(data, function(i,v){
                db3.transaction(function(tra){
                    tra.executeSql('INSERT INTO Productos (id, sap, descripcion, envase, ge, p54, p56, la, mix_la_le, lista_le, familia) VALUES ('+v.id+', "'+v.sap+'", "'+v.descripcion+'", "'+v.envase+'", "'+v.ge+'", "'+v.p54+'", "'+v.p56+'", "'+v.la+'", "'+v.mix_la_le+'", "'+v.lista_le+'", "'+v.familia+'")'); 
                });
            });
        }).done(function(){
                  $("#status1").append('<h3><span class="label label-success">Datos de Productos Actualizados</span></h3><hr />');
                  }).fail(function(){
                  alert("Falla al conectar con el Servidor!, Error: " + errorThrown);
                  });

    
} 

function populateDB3(tx) {
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
        $("#status1").append('<h3><span class="label label-success">Datos de Descuentos Actualizados</span></h3><hr />');
        }).fail(function(){
        alert("Falla al conectar con el Servidor!, Error: " + errorThrown);
        });
    

    
} 

function populateDB4(tx) {
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
                   $("#status1").append('<h3><span class="label label-success">Datos de Promociones Actualizados</span></h3><hr />');
                  }).fail(function(){
                  alert("Falla al conectar con el Servidor!, Error: " + errorThrown);
                  });
    

    
} 

function populateDB5(tx) {
    tx.executeSql('DROP TABLE IF EXISTS Pedidos');
} 



//function will be called when an error occurred
function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

//function will be called when process succeed
function successCB() {

}

