var db2 = window.openDatabase("Clientes", "1.0", "Clientes", 200000);
var db3 = window.openDatabase("Productos", "1.0", "Productos", 200000);
var db4 = window.openDatabase("Asesor", "1.0", "Asesor", 200000);

$asesor = 0;
var lista_productos = "";
var lista_productos1 = "";
var lista_productos2 = "";

$(function(){
    db3.transaction(temp_pedidos,errorCB,successCB1);
    db4.transaction(queryAsesor);
    db2.transaction(queryDB);
    db3.transaction(queryDB2);
    db3.transaction(promociones);
    $('#buscar').select2();
    
});

var fecha = new Date();
var dd = fecha.getDate();
var mm = fecha.getMonth()+1;//January is 0, so always add + 1
var hh = fecha.getHours();
var min = fecha.getMinutes();

var yyyy = fecha.getFullYear();
if(dd<10){dd='0'+dd}
if(mm<10){mm='0'+mm}
if(hh<10){hh='0'+hh}
if(min<10){min='0'+min}
fecha = yyyy+'-'+mm+'-'+dd;
var hora = hh + ":" + min;

function temp_pedidos(tx){
    tx.executeSql('DROP TABLE IF EXISTS Temp_Pedidos');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Temp_Pedidos (id INTEGER PRIMARY KEY AUTOINCREMENT, producto TEXT, cantidad TEXT, precio TEXT, total TEXT, descripcion TEXT, envase TEXT, descuento TEXT)');

}



function queryAsesor(tx)
{
    tx.executeSql('SELECT * FROM CodAsesor',[],function(tx, result){
        for (var i = 0; i < result.rows.length; i++)
                {
                    var row = result.rows.item(i);
                    $asesor = row['codAsesor'];
                }
    });
}


//function will be called when an error occurred
function errorCB(err, t, v) {
    alert("Error processing SQL: "+err);
}

//function will be called when process succeed
function successCB() {
    alert("Pedido Guardado!");
    window.open("ver_pedidos.html", "_self");
}

function successCB1() {

}

function carga(){
    db.transaction(populateDB,errorCB,successCB);
}


function queryDB(tx){
    tx.executeSql('SELECT * FROM Clientes',[],querySuccess,errorCB);

}

function queryDB2(tx){

    tx.executeSql('SELECT * FROM Productos GROUP BY familia' ,[],querySuccess2,errorCB);
}

function querySuccess(tx, result){
    for (var i = 0; i < result.rows.length; i++)
    {
        var row = result.rows.item(i);
        $('#buscar').append('<option value="'+row['codigo']+' / '+row['lista_precios']+'">'+row['cliente']+' / '+row['codigo']+'</option>');
    }

}

function querySuccess2(tx, result){

    for (var i = 0; i < result.rows.length; i++)
    {
        var row = result.rows.item(i);
        populateProductos(row['familia']);
        var familia2 = row['familia'];
        var familia = familia2.replace("/", "-");
        $('#lista_productos').append('<div class="row"><div class="col-md-6">'+
            '<div class="panel panel-default">'+
            '<div class="panel-heading" role="tab" id="'+familia.replace(/ /g, '_')+'">'+
              '<h4 class="panel-title">'+
                '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse'+row['id']+'" aria-expanded="false" aria-controls="collapse'+row['id']+'">'+
                  familia +
                '</a>'+
              '</h4>'+
            '</div>'+
            '<div id="collapse'+row['id']+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="'+familia.replace(/ /g, '_')+'">'+
              '<div class="panel-body" >'+
              '<table class="table table-bordered" id="content_'+familia.replace(/ /g, '_')+'">'+
                '<tr>'+
                    '<th>'+
                        'DESCRIPCION'+
                    '</th>'+
                    '<th>'+
                        'ENVASE'+
                    '</th>'+
                    '<th>'+
                    'PRECIO'+
                    '</th>'+
                    '<th>'+
                    'CANTIDAD'+
                    '</th>'+
                    '<th>'+
                    'TOTAL'+
                    '</th>'+
                    '<th></th>'+
                '</tr>'+
                '</table>'+
              '</div>'+
            '</div>'+
          '</div>'+
          '</div></div>');
        
    }

}

function populateProductos(familia){
    db3.transaction(function(tra){
            tra.executeSql('SELECT * FROM Productos WHERE familia =  "'+familia+'"',[],function(tra, result2){
                for (var j = 0; j < result2.rows.length; j++)
                {
                    var row = result2.rows.item(j);
                    var familia2 = row['familia'];
                    var familia = familia2.replace("/", "-");
                    $('#content_'+familia.replace(/ /g, '_')).append('<tr><td id="desc_'+row['sap']+'">'+row['descripcion']+'</td><td>'+row['envase']+'</td><td><select id="precio_'+row['sap']+'" class="form-control" style="width:100px"></select></td><td><input type="number" id="cantidad_'+row['sap']+'" value="0" class="form-cotrol" style="width:80px"></td><td><input type="text" id="calculo_'+row['sap']+'" readonly class="form-cotrol" style="width:80px"></td><td style="width:90px"><select id="descuentos_'+row['sap']+'" class="form-control"></select><input type="hidden" id="old_'+row['sap']+'"><input type="hidden" id="index_'+row['sap']+'"></td></tr>');
                }
            });
        });
}



$("#buscar").change(function(){
    $("#buscar option:selected").each(function(){
        var cliente1 = $(this).text();
        var cliente = cliente1.substring(0, cliente1.indexOf('/'));
        var value = $(this).val();
        var codigo = value.substring(0, value.indexOf('/'));
        var codigo1 = codigo.replace(/ /g, "");
        var lista = value.substring(value.indexOf('/') + 1, value.length);
        var l = lista.replace(/ /g, "");
        var user = "";
        $("#cliente").val(cliente);
        $("#codigo").val(codigo);
        $("#lista").val(lista);
        db3.transaction(function(tx){

            tx.executeSql('SELECT * FROM Descuentos', [], function(tx, result){
                for (var i = 0; i < result.rows.length; i++){
                    var row = result.rows.item(i);
                    tx.executeSql('SELECT * FROM Productos', [], function(tx, result1){
                        for(var j = 0; j < result1.rows.length; j++){
                            var row1 = result1.rows.item(j);
                            if(row['p' + row1['sap']] > 0)
                            {
                                var valores = "";
                                for(var h = 0; h < Number(row['p' + row1['sap']])+1; h++)
                                {
                                    valores = valores + '<option value="'+h+'">'+h+'%</option>';
                                }
                                $('#descuentos_'+row1['sap']).empty();
                                $('#descuentos_'+row1['sap']).append(valores);

                            }
                        }
                    });
                }
            });

            tx.executeSql('SELECT * FROM Productos', [], function(tx, result){
                for (var i = 0; i < result.rows.length; i++) 
                {
                    $row1 = result.rows.item(i);
                    if(l == "LE")
                    {
                        if($row1['LA'] > 0)
                        {
                            var precio_la = Number($row1['LA']);
                            $("#precio_" + $row1['sap']).append("<option value='"+precio_la.toFixed(2)+"'>"+precio_la.toFixed(2)+"</option>");
                        }
                        if($row1['MIX_LA_LE'] > 0)
                        {
                            var precio_mix_la_le = Number($row1['MIX_LA_LE']);
                           $("#precio_" + $row1['sap']).append("<option value='"+precio_mix_la_le.toFixed(2)+"'>"+precio_mix_la_le.toFixed(2)+"</option>");
                        }
                        if($row1['LE'] > 0)
                        {
                            var precio_le = Number($row1['LE']);
                            $("#precio_" + $row1['sap']).append("<option value='"+precio_le.toFixed(2)+"'>"+precio_le.toFixed(2)+"</option>");
                        }

                    }
                    else if(l == "LA")
                    {

                        if($row1['LA'] > 0)
                        {
                            var precio_la = Number($row1['LA']);
                            $("#precio_" + $row1['sap']).append("<option value='"+precio_la.toFixed(2)+"'>"+precio_la.toFixed(2)+"</option>");
                        }
                        if($row1['MIX_LA_LE'] > 0)
                        {
                            var precio_mix_la_le = Number($row1['MIX_LA_LE']);
                           $("#precio_" + $row1['sap']).append("<option value='"+precio_mix_la_le.toFixed(2)+"'>"+precio_mix_la_le.toFixed(2)+"</option>");
                        }

                    }else{

                        if($row1['LA'] > 0)
                        {
                            var precio_la = Number($row1['LA']);
                            $("#precio_" + $row1['sap']).append("<option value='"+precio_la.toFixed(2)+"'>"+precio_la.toFixed(2)+"</option>");
                        }
                        if($row1[l] > 0)
                        {
                            var precio_mix_la_le = Number($row1[l]);
                           $("#precio_" + $row1['sap']).append("<option value='"+precio_mix_la_le.toFixed(2)+"'>"+precio_mix_la_le.toFixed(2)+"</option>");
                        }


                    }

                    $("#old_" + $row1['sap']).val($row1['LA']);
                    $("#index_" + $row1['sap']).val('1');
                    calculos($row1['sap'], $row1['descripcion'], $row1['envase'], $row1['familia']);


                    
                }
            });

        });

        db2.transaction(function(tx){
            tx.executeSql('SELECT * FROM Clientes WHERE codigo = "'+codigo1+'"', [], function(tx, result){
                for (var i = 0; i < result.rows.length; i++)
                {
                    var row = result.rows.item(i);
                    $("#email").val(row['email']);
                    $("#email1").val(row['email']);
                }
            });
        });



    });
});



function calculos(sap, desc, envase, familia)
{

    $('#descuentos_'+ sap).change(function(){
        var valor_desc_actual = Number($(this).val()/100);
        var valor_precio_actual = Number($("#old_" + sap).val());
        var multiplicacion_descuento = valor_precio_actual * valor_desc_actual;
        var valor_final = valor_precio_actual - multiplicacion_descuento.toFixed(2);
        $("#precio_" + sap + " option:selected").val(valor_final.toFixed(2));
        $("#precio_" + sap + " option:selected").text(valor_final.toFixed(2));
    });

    $("#precio_" + sap).change(function(){
        $("#content").empty();
        $("#content").append('<tr><th>DESCRIPCION</th><th>ENVASE</th><th>PRECIO</th><th>CANTIDAD</th><th>TOTAL</th></tr>');
        $("#precio_" + sap + " option:nth-child("+$("#index_" + sap).val()+")").val($("#old_" + sap).val());
        $("#precio_" + sap + " option:nth-child("+$("#index_" + sap).val()+")").text($("#old_" + sap).val());
        $("#old_" + sap).val($("#precio_" + sap).val());
        $("#index_" + sap).val(Number($("#precio_" + sap + " option:selected").index())+1);
        $('#descuentos_'+ sap + " option:nth-child(1)").prop("selected", true);
        db3.transaction(function(tx){
            tx.executeSql('SELECT * FROM Temp_Pedidos WHERE producto = "'+sap+'"', [], function(tx, result){
                var cant = $("#cantidad_" + sap).val();
                var prec = $("#precio_" + sap).val();
                var old = $("#old_" + sap).val();
                var t = cant * prec;
                var o = cant * old;
                var d = o - t;
                var valor = (Math.round(t * 100) / 100).toFixed(2);
                $("#calculo_" + sap).val(valor);
                if(result.rows.length <= 0)
                {
                    tx.executeSql('INSERT INTO Temp_Pedidos (producto, cantidad, precio, total, descripcion, envase, descuento) VALUES ("'+sap+'", "'+cant+'", "'+prec+'", "'+t+'", "'+desc+'", "'+envase+'", "'+d+'")');
                }else{
                    if(cant > 0)
                    {
                    tx.executeSql('UPDATE Temp_Pedidos SET cantidad = "'+cant+'", precio = "'+prec+'", total = "'+t+'", descuento = "'+d+'" WHERE producto = "'+sap+'"');
                    }else{
                    tx.executeSql('DELETE FROM Temp_Pedidos WHERE producto = "'+sap+'"');
                    }
                }
            });
        });




        $sub_total = 0;
        $descuento = 0;

        db3.transaction(function(tx){
            tx.executeSql('SELECT SUM(total) FROM Temp_Pedidos', [], function(tx, result2){
                $sub_total = result2.rows.item(0)['SUM(total)'];
            });
            tx.executeSql('SELECT SUM(descuento) FROM Temp_Pedidos', [], function(tx, result2){
                $descuento = result2.rows.item(0)['SUM(descuento)'];
            });
        });


        db3.transaction(function(tx){
            tx.executeSql('SELECT * FROM Temp_Pedidos', [], function(tx, result){
                $desceunto2 = 0;
                for(var i = 0; i < result.rows.length; i++)
                {
                    var row = result.rows.item(i);
                    var precio = row['precio'];
                    var cantidad = row['cantidad'];
                    var multi = row['total'];
                    var valor_descuento = 0;
                    var descuento = $descuento;
                    var suma_sub_total = Number($sub_total);
                    var iva = suma_sub_total * 0.12;
                    var valor_total = suma_sub_total + iva;
                    $("#sub_total").val(suma_sub_total.toFixed(2));
                    $("#descuento").val(descuento.toFixed(2));
                    $("#iva").val(iva.toFixed(2));
                    $("#total").val(valor_total.toFixed(2));
                    $("#content").append('<tr><td>'+row['descripcion']+'</td><td>'+row['envase']+'</td><td>'+precio+'</td><td>'+cantidad+'</td><td>'+multi+'</td></tr>');
                    $("#pedido_corto").empty();
                    $("#pedido_corto").append('<h4>TOTALES</h4>'+
                        '<div class="row">'+
                        '<div class="col-md-12">'+
                        '<table class="table table-bordered">'+
                        '<tr>'+
                            '<td>'+
                                'Sub-Total'+
                            '</td>'+
                            '<td>'+
                                'Descuento'+
                            '</td>'+
                            '<td>'+
                                '12% IVA'+
                            '</td>'+
                            '<td>'+
                                'TOTAL'+
                            '</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td>'+
                                +suma_sub_total.toFixed(2)+
                            '</td>'+
                            '<td>'+
                                +descuento.toFixed(2)+
                            '</td>'+
                            '<td>'+
                                +iva.toFixed(2)+
                            '</td>'+
                            '<td>'+
                                +valor_total.toFixed(2)+
                            '</td>'+
                        '</tr>'+
                        '</table>'+
                        '</div>'+
                        '</div>');
                }
            });
        });

    });



    $("#cantidad_" + sap).change(function(){

        $("#content").empty();
        $("#content").append('<tr><th>DESCRIPCION</th><th>ENVASE</th><th>PRECIO</th><th>CANTIDAD</th><th>TOTAL</th></tr>');
        db3.transaction(function(tx){
            tx.executeSql('SELECT * FROM Temp_Pedidos WHERE producto = "'+sap+'"', [], function(tx, result){
                var cant = $("#cantidad_" + sap).val();
                var prec = $("#precio_" + sap).val();
                var old = $("#old_" + sap).val();
                var o = cant * old;
                var t = cant * prec;
                var d = o - t;
                var valor = (Math.round(t * 100) / 100).toFixed(2);
                $("#calculo_" + sap).val(valor);
                if(result.rows.length <= 0)
                {
                    tx.executeSql('INSERT INTO Temp_Pedidos (producto, cantidad, precio, total, descripcion, envase, descuento) VALUES ("'+sap+'", "'+cant+'", "'+prec+'", "'+t+'", "'+desc+'", "'+envase+'", "'+d+'")');
                    var fam = familia.replace("/", "");
                    var fam1 = fam.replace("  ", " ");
                    var fam2 = fam1.replace(/ /g, "_");
                    var enva = envase.replace(",", "_");
                    var enva1 = enva.replace("/", "");
                    var enva2 = enva1.replace(/ /g, "_");
                    var promo = $("#producto_" + sap).val();
                    var promo2 = $("#familia_" + fam2).val();
                    var promo3 = $("#envase_" + enva2).val();
                    var promo4 = $("#familia_" + fam2 + "_envase_" + enva2).val();
                    $("#producto_" + sap).val(promo - $("#cantidad_" + sap).val());
                    $("#familia_" + fam2).val(promo2 - $("#cantidad_" + sap).val());
                    $("#envase_" + enva2).val(promo3 - $("#cantidad_" + sap).val());
                    $("#familia_" + fam2 + "_envase_" + enva2).val(promo4 - $("#cantidad_" + sap).val());
                }else{
                    if(cant > 0)
                    {
                    tx.executeSql('UPDATE Temp_Pedidos SET cantidad = "'+cant+'", precio = "'+prec+'", total = "'+t+'", descuento = "'+d+'" WHERE producto = "'+sap+'"');
                    }else{
                    tx.executeSql('DELETE FROM Temp_Pedidos WHERE producto = "'+sap+'"');
                    }

                    for (var i = 0; i < result.rows.length; i++)
                    {
                        var row = result.rows.item(i);
                        var cantidad_guardada = row['cantidad'];
                        var fam = familia.replace("/", "");
                        var fam1 = fam.replace("  ", " ");
                        var fam2 = fam1.replace(/ /g, "_");
                        var enva = envase.replace(",", "_");
                        var enva1 = enva.replace("/", "");
                        var enva2 = enva1.replace(/ /g, "_");
                        var promo = $("#producto_" + sap).val();
                        var promo2 = $("#familia_" + fam2).val();
                        var promo3 = $("#envase_" + enva2).val();
                        var promo4 = $("#familia_" + fam2 + "_envase_" + enva2).val();
                        if($("#cantidad_" + sap).val() < cantidad_guardada)
                        {
                            var diferencia = cantidad_guardada - $("#cantidad_" + sap).val();
                            $("#producto_" + sap).val(Number(promo) + Number(diferencia));
                            $("#familia_" + fam2).val(Number(promo2) + Number(diferencia));
                            $("#envase_" + enva2).val(Number(promo3) + Number(diferencia));
                            $("#familia_" + fam2 + "_envase_" + enva2).val(Number(promo4) + Number(diferencia));
                        }
                        else
                        {
                            $("#producto_" + sap).val(promo - $("#cantidad_" + sap).val());
                            $("#familia_" + fam2).val(promo2 - $("#cantidad_" + sap).val());
                            $("#envase_" + enva2).val(promo3 - $("#cantidad_" + sap).val());
                            $("#familia_" + fam2 + "_envase_" + enva2).val(promo4 - $("#cantidad_" + sap).val());
                        }
                    }
                }
            });
        });


        $sub_total = 0;
        $descuento = 0;

        db3.transaction(function(tx){
            tx.executeSql('SELECT SUM(total) FROM Temp_Pedidos', [], function(tx, result2){
                $sub_total = result2.rows.item(0)['SUM(total)'];
            });
            tx.executeSql('SELECT SUM(descuento) FROM Temp_Pedidos', [], function(tx, result2){
                $descuento = result2.rows.item(0)['SUM(descuento)'];
            });
        });


        db3.transaction(function(tx){
            tx.executeSql('SELECT * FROM Temp_Pedidos', [], function(tx, result){
                for(var i = 0; i < result.rows.length; i++)
                {
                    var row = result.rows.item(i);
                    var precio = row['precio'];
                    var cantidad = row['cantidad'];
                    var multi = Number(row['total']);
                    var valor_descuento = 0;
                    var descuento = $descuento;
                    var suma_sub_total = Number($sub_total);
                    var iva = suma_sub_total * 0.12;
                    var valor_total = suma_sub_total + iva;
                    $("#sub_total").val(suma_sub_total.toFixed(2));
                    $("#descuento").val(descuento.toFixed(2));
                    $("#iva").val(iva.toFixed(2));
                    $("#total").val(valor_total.toFixed(2));
                    $("#content").append('<tr><td>'+row['descripcion']+'</td><td>'+row['envase']+'</td><td>'+precio+'</td><td>'+cantidad+'</td><td>'+multi.toFixed(2)+'</td></tr>');
                    $("#pedido_corto").empty();
                    $("#pedido_corto").append('<h4>TOTALES</h4>'+
                        '<div class="row">'+
                        '<div class="col-md-12">'+
                        '<table class="table table-bordered">'+
                        '<tr>'+
                            '<td>'+
                                'Sub-Total'+
                            '</td>'+
                            '<td>'+
                                'Descuento'+
                            '</td>'+
                            '<td>'+
                                '12% IVA'+
                            '</td>'+
                            '<td>'+
                                'TOTAL'+
                            '</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td>'+
                                +suma_sub_total.toFixed(2)+
                            '</td>'+
                            '<td>'+
                                +descuento.toFixed(2)+
                            '</td>'+
                            '<td>'+
                                +iva.toFixed(2)+
                            '</td>'+
                            '<td>'+
                                +valor_total.toFixed(2)+
                            '</td>'+
                        '</tr>'+
                        '</table>'+
                        '</div>'+
                        '</div>');
                }
            });
        });

    });


}


$("#enviar").click(function(){
    if ($("#local").val() == "") 
    {
        alert("Falta Nombre de Local");
    }
    else if ($("#email").val() == "") 
    {
        alert("Falta Email del Cliente");
    }
    else if ($("#email1").val() != $("#email2").val()) 
    {
        alert("En la confirmación del Email, los emails no coinciden");
    }
    else
    {
        
        db3.transaction(cargarListas,errorCB,successCB1);
    }
});

function cargarListas(tx){
    tx.executeSql('SELECT * FROM Productos', [], function(tx, result){
            for (var i = 0; i < result.rows.length; i++)
            {
                var row = result.rows.item(i);
                lista_productos = lista_productos + ", p" + row['sap'] + " TEXT, precio_" + row['sap'] + " TEXT";
                lista_productos1 = lista_productos1 + ", p" + row['sap'] + ", precio_" + row['sap'] + "";
                lista_productos2 = lista_productos2 + ', "' + $("#cantidad_" + row['sap']).val() + '", "' + $("#precio_" + row['sap']).val() + '"';
            }
        });
        db3.transaction(guardarPedido,errorCB,successCB);
}

function guardarPedido(tx){
    var lista = $("#lista").val();
    tx.executeSql('CREATE TABLE IF NOT EXISTS Pedidos (id INTEGER PRIMARY KEY AUTOINCREMENT, fecha TEXT, user TEXT, cod_asesor TEXT, cliente TEXT, codigo TEXT, lista_precios TEXT, local TEXT, email TEXT, observaciones TEXT '+lista_productos+')');

    tx.executeSql('INSERT INTO Pedidos (fecha, user, cod_asesor, cliente, codigo, lista_precios, local, email, observaciones '+lista_productos1+') VALUES ("'+fecha+'", "", "'+$asesor+'", "'+$("#cliente").val()+'", "'+$("#codigo").val()+'", "'+lista.replace(/ /g, "")+'", "'+$("#local").val()+'", "'+$("#email").val()+'", "'+$("#observaciones").val()+'" '+lista_productos2+')');

}

$("#email").change(function(){
$("#email1").val($("#email").val());
});

function promociones(tx)
{
    tx.executeSql('SELECT * FROM Promociones',[],function(tx, result){
        for (var i = 0; i < result.rows.length; i++)
        {

            var row = result.rows.item(i);
            alert("Existen promociones vigentes: " + row['promo']);
            $.each( row, function( key, value ) {
              if(value > 0)
              {
                if(key != "id" && key != "familia" && key != "envase" && key != "familia_envase" && key != "producto")
                {
                    var key1 = key.replace(/_/g, " ");
                    if(key.indexOf('producto') > -1)
                    {
                        key1 = key1.substring(9, 16);
                        db3.transaction(function(tr){
                            tr.executeSql('SELECT * FROM Productos WHERE sap = "'+key1+'"', [], function(tr, result2){
                                for(var j = 0; j < result2.rows.length; j++)
                                {
                                    var r = result2.rows.item(j);
                                    $("#" + key1).empty();
                                    $("#" + key1).append(r['descripcion']);
                                }
                            });
                        });
                    }
                    $("#alerta1").append(''+
                    '<tr>'+
                    '<td id="'+key1+'">'+key1+'</td>'+
                    '<td><input type="text" id="promo_'+key+'" class="form-control" value="'+value+'" readonly></td>'+
                    '<td><input type="text" id="'+key+'" class="form-control" value="'+value+'" readonly></td>'+
                    '</tr>'+
                    '');
                }
              }
            });
        }
    });
}