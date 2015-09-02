var db2 = window.openDatabase("Clientes", "1.0", "Clientes", 200000);
var db3 = window.openDatabase("Productos", "1.0", "Productos", 200000);
var db4 = window.openDatabase("Asesor", "1.0", "Asesor", 200000);

$asesor = 0;
var lista_productos = "";
var lista_productos1 = "";
var lista_productos2 = "";

$(function(){
    db4.transaction(queryAsesor);
    db2.transaction(queryDB);
    db3.transaction(queryDB2);
    db3.transaction(promociones);
    $('#buscar').select2();
    
});

var fecha = new Date();
var dd = fecha.getDate();
var mm = fecha.getMonth()+1;//January is 0, so always add + 1

var yyyy = fecha.getFullYear();
if(dd<10){dd='0'+dd}
if(mm<10){mm='0'+mm}
fecha = yyyy+'-'+mm+'-'+dd;

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
function errorCB(err) {
    alert("Error processing SQL: "+err.code);
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
        var familia = familia2.replace("/", "");
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
                    var familia = familia2.replace("/", "");
                    $('#content_'+familia.replace(/ /g, '_')).append('<tr><td id="desc_'+row['sap']+'">'+row['descripcion']+'<input type="hidden" id="old_'+row['sap']+'"></td><td>'+row['envase']+'</td><td><input type="text" id="precio_'+row['sap']+'" readonly class="form-cotrol"></td><td><input type="number" id="cantidad_'+row['sap']+'" value="0" class="form-cotrol"></td><td><input type="text" id="calculo_'+row['sap']+'" readonly class="form-cotrol"></td></tr>');
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
        if (lista == 'le') 
        {
            lista = "lista_le";
        }
        db3.transaction(function(tx){
            
            tx.executeSql('SELECT * FROM Productos', [], function(tx, result){
                for (var i = 0; i < result.rows.length; i++) 
                {
                    $row1 = result.rows.item(i);
                    $("#precio_" + $row1['sap']).val($row1[l]);
                    $("#old_" + $row1['sap']).val($row1[l]);
                    populateDescuentos($row1['sap'], l);

                    calculos($row1['sap'], $row1['descripcion'], $row1['envase']);

                    
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

function calculos(sap, desc, envase)
{
    $("#cantidad_" + sap).change(function(){
        var precio = $("#precio_" + sap).val();
        var old = $("#old_" + sap).val();
        var valor_descuento = $("#descuento").val();
        var descuento = Number(valor_descuento) + (Number(old) - Number(precio));
        var cantidad = $("#cantidad_" + sap).val();
        var multi = precio * cantidad;
        var sub_total = $("#sub_total").val();
        var suma_sub_total = Number(sub_total) + Number(multi);
        var iva = suma_sub_total * 0.12;
        var valor_total = suma_sub_total + iva;
        $("#calculo_" + sap).val(multi.toFixed(2));
        $("#sub_total").val(suma_sub_total.toFixed(2));
        $("#descuento").val(descuento.toFixed(2));
        $("#iva").val(iva.toFixed(2));
        $("#total").val(valor_total.toFixed(2));
        $("#content").append('<tr><td>'+desc+'</td><td>'+envase+'</td><td>'+precio+'</td><td>'+cantidad+'</td><td>'+multi.toFixed(2)+'</td></tr>');
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
    });
}

function populateDescuentos(sap, l)
{
    db3.transaction(function(tx){
        tx.executeSql('SELECT * FROM Descuentos WHERE desde <= "'+fecha+'" AND hasta >= "'+fecha+'" AND lista = "'+l+'"', [], function(tx, result){
            for(var j = 0; j < result.rows.length; j++)
            {
                var row = result.rows.item(j);
                var desc = row['p' + sap];
                var precio_old = $("#precio_" + sap).val();
                var porcentaje_desc = precio_old * (desc / 100);
                var precio_new = precio_old - porcentaje_desc;
                $("#old_" + sap).val(precio_old);
                $("#precio_" + sap).val(precio_new.toFixed(2));
                if (desc != 0) 
                    {
                        $("#desc_" + sap).empty();
                        $("#desc_" + sap).append('<b style="color:blue">Descuento del '+desc+'%</b>');
                    }

            }
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
                lista_productos = lista_productos + ", p" + row['sap'] + " TEXT";
                lista_productos1 = lista_productos1 + ", p" + row['sap'] + "";
                lista_productos2 = lista_productos2 + ', "' + $("#cantidad_" + row['sap']).val() + '"';
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

function promociones(tx){
    tx.executeSql('SELECT * FROM Promociones',[],function(tx, result){

        for (var i = 0; i < result.rows.length; i++)
        {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1;//January is 0, so always add + 1

            var yyyy = today.getFullYear();
            if(dd<10){dd='0'+dd}
            if(mm<10){mm='0'+mm}
            today = yyyy+'-'+mm+'-'+dd;

            var row = result.rows.item(i);

            if(row['desde'] <= today && row['hasta'] >= today)
            {
                alert("Existen Promociones vigentes " +row['promo']);
                if(row['familia'] == 1)
                {

                    $("#alerta").append("<b style='color:red'>"+row['promo']+"</b><br>");
                    if(row['familia_MOTORES_A_GASOLINA'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>MOTORES_A_GASOLINA "+row['familia_MOTORES_A_GASOLINA']+"</b><br>");
                    }
                    if(row['familia_MOTOS_FUERA_DE_BORDA'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>MOTOS_FUERA_DE_BORDA "+row['familia_MOTOS_FUERA_DE_BORDA']+"</b><br>");
                    }
                    if(row['familia_GRASA_AUTOMOTRIZ'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>GRASA_AUTOMOTRIZ "+row['familia_GRASA_AUTOMOTRIZ']+"</b><br>");
                    }
                    if(row['familia_HIDRAULICOS'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>HIDRAULICOS "+row['familia_HIDRAULICOS']+"</b><br>");
                    }
                    if(row['familia_MOTORES_A_DIESEL'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>MOTORES_A_DIESEL "+row['familia_MOTORES_A_DIESEL']+"</b><br>");
                    }
                    if(row['familia_TRANSMISION_AUTOMATICA'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>TRANSMISION_AUTOMATICA "+row['familia_TRANSMISION_AUTOMATICA']+"</b><br>");
                    }
                    if(row['familia_TRANSMISION_MECANICA_DIFERENCIAL'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>TRANSMISION_MECANICA_DIFERENCIAL "+row['familia_TRANSMISION_MECANICA_DIFERENCIAL']+"</b><br>");
                    }
                }
                if(row['envase'] == 1)
                {
                    $("#alerta").append("<b style='color:red'>"+row['promo']+"</b><br>");
                    if(row['envase_2_5_gal_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>2,5 gal "+row['envase_2_5_gal_']+"</b><br>");
                    }
                    if(row['envase_6X4_LBS_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>6X4 LBS "+row['envase_6X4_LBS_']+"</b><br>");
                    }
                    if(row['envase_BALDE_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>BALDE "+row['envase_BALDE_']+"</b><br>");
                    }
                    if(row['envase_CJ_121_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>CJ 121 "+row['envase_CJ_121_']+"</b><br>");
                    }
                    if(row['envase_CJ_41_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>CJ 41 "+row['envase_CJ_41_']+"</b><br>");
                    }
                    if(row['envase_CJ_61_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>CJ 61 "+row['envase_CJ_61_']+"</b><br>");
                    }
                    if(row['envase_TANQUE_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>TANQUE "+row['envase_TANQUE_']+"</b><br>");
                    }
                    if(row['envase_CJ_41'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>CJ 41 "+row['envase_CJ_41']+"</b><br>");
                    }
                }
                if(row['familia_envase'] == 1)
                {
                    $("#alerta").append("<b style='color:red'>"+row['promo']+"</b><br>");
                    if(row['familia_MOTORES_A_GASOLINA_envase_CJ_121_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>MOTORES_A_GASOLINA, envase CJ 121 "+row['familia_MOTORES_A_GASOLINA_envase_CJ_121_']+"</b><br>");
                    }
                    if(row['familia_MOTORES_A_GASOLINA_envase_CJ_41_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia MOTORES_A_GASOLINA, envase_CJ_41 "+row['familia_MOTORES_A_GASOLINA_envase_CJ_41_']+"</b><br>");
                    }
                    if(row['familia_MOTORES_A_GASOLINA_envase_CJ_61_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_MOTORES_A_GASOLINA, envase_CJ_61 "+row['familia_MOTORES_A_GASOLINA_envase_CJ_61_']+"</b><br>");
                    }
                    if(row['familia_MOTORES_A_GASOLINA_envase_TANQUE_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_MOTORES_A_GASOLINA, envase_TANQUE "+row['familia_MOTORES_A_GASOLINA_envase_TANQUE_']+"</b><br>");
                    }
                    if(row['familia_MOTORES_A_GASOLINA_envase_CJ_41'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_MOTORES_A_GASOLINA, envase_CJ_41 "+row['familia_MOTORES_A_GASOLINA_envase_CJ_41']+"</b><br>");
                    }
                    if(row['familia_MOTOS_FUERA_DE_BORDA_envase_CJ_121_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_MOTOS_FUERA_DE_BORDA, envase_CJ_121 "+row['familia_MOTOS_FUERA_DE_BORDA_envase_CJ_121_']+"</b><br>");
                    }
                    if(row['familia_MOTOS_FUERA_DE_BORDA_envase_CJ_61_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_MOTOS_FUERA_DE_BORDA, envase_CJ_61 "+row['familia_MOTOS_FUERA_DE_BORDA_envase_CJ_61_']+"</b><br>");
                    }
                    if(row['familia_GRASA_AUTOMOTRIZ_envase_6X4_LBS_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_GRASA_AUTOMOTRIZ, envase_6X4_LBS "+row['familia_GRASA_AUTOMOTRIZ_envase_6X4_LBS_']+"</b><br>");
                    }
                    if(row['familia_GRASA_AUTOMOTRIZ_envase_BALDE_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_GRASA_AUTOMOTRIZ, envase_BALDE "+row['familia_GRASA_AUTOMOTRIZ_envase_BALDE_']+"</b><br>");
                    }
                    if(row['familia_GRASA_AUTOMOTRIZ_envase_TANQUE_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_GRASA_AUTOMOTRIZ, envase_TANQUE "+row['familia_GRASA_AUTOMOTRIZ_envase_TANQUE_']+"</b><br>");
                    }
                    if(row['familia_HIDRAULICOS_envase_BALDE_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_HIDRAULICOS, envase_BALDE "+row['familia_HIDRAULICOS_envase_BALDE_']+"</b><br>");
                    }
                    if(row['familia_HIDRAULICOS_envase_TANQUE_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_HIDRAULICOS, envase_TANQUE "+row['familia_HIDRAULICOS_envase_TANQUE_']+"</b><br>");
                    }
                    if(row['familia_MOTORES_A_DIESEL_envase_2_5_gal_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_MOTORES_A_DIESEL, envase_2_5_gal "+row['familia_MOTORES_A_DIESEL_envase_2_5_gal_']+"</b><br>");
                    }
                    if(row['familia_MOTORES_A_DIESEL_envase_BALDE_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_MOTORES_A_DIESEL, envase_BALDE "+row['familia_MOTORES_A_DIESEL_envase_BALDE_']+"</b><br>");
                    }
                    if(row['familia_MOTORES_A_DIESEL_envase_CJ_121_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_MOTORES_A_DIESEL, envase_CJ_121 "+row['familia_MOTORES_A_DIESEL_envase_CJ_121_']+"</b><br>");
                    }
                    if(row['familia_MOTORES_A_DIESEL_envase_CJ_41_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_MOTORES_A_DIESEL, envase_CJ_41 "+row['familia_MOTORES_A_DIESEL_envase_CJ_41_']+"</b><br>");
                    }
                    if(row['familia_MOTORES_A_DIESEL_envase_CJ_61_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_MOTORES_A_DIESEL, envase_CJ_61 "+row['familia_MOTORES_A_DIESEL_envase_CJ_61_']+"</b><br>");
                    }
                    if(row['familia_MOTORES_A_DIESEL_envase_TANQUE_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_MOTORES_A_DIESEL, envase_TANQUE "+row['familia_MOTORES_A_DIESEL_envase_TANQUE_']+"</b><br>");
                    }
                    if(row['familia_TRANSMISION_AUTOMATICA_envase_BALDE_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_TRANSMISION_AUTOMATICA, envase_BALDE "+row['familia_TRANSMISION_AUTOMATICA_envase_BALDE_']+"</b><br>");
                    }
                    if(row['familia_TRANSMISION_AUTOMATICA_envase_CJ_121_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_TRANSMISION_AUTOMATICA, envase_CJ_121 "+row['familia_TRANSMISION_AUTOMATICA_envase_CJ_121_']+"</b><br>");
                    }
                    if(row['familia_TRANSMISION_AUTOMATICA_envase_TANQUE_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_TRANSMISION_AUTOMATICA, envase_TANQUE "+row['familia_TRANSMISION_AUTOMATICA_envase_TANQUE_']+"</b><br>");
                    }
                    if(row['familia_TRANSMISION_MECANICA_DIFERENCIAL_envase_BALDE_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_TRANSMISION_MECANICA_DIFERENCIAL, envase_BALDE "+row['familia_TRANSMISION_MECANICA_DIFERENCIAL_envase_BALDE_']+"</b><br>");
                    }
                    if(row['familia_TRANSMISION_MECANICA_DIFERENCIAL_envase_CJ_121_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_TRANSMISION_MECANICA_DIFERENCIAL, envase_CJ_121 "+row['familia_TRANSMISION_MECANICA_DIFERENCIAL_envase_CJ_121_']+"</b><br>");
                    }
                    if(row['familia_TRANSMISION_MECANICA_DIFERENCIAL_envase_CJ_41_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_TRANSMISION_MECANICA_DIFERENCIAL, envase_CJ_41 "+row['familia_TRANSMISION_MECANICA_DIFERENCIAL_envase_CJ_41_']+"</b><br>");
                    }
                    if(row['familia_TRANSMISION_MECANICA_DIFERENCIAL_envase_CJ_61_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_TRANSMISION_MECANICA_DIFERENCIAL, envase_CJ_61 "+row['familia_TRANSMISION_MECANICA_DIFERENCIAL_envase_CJ_61_']+"</b><br>");
                    }
                    if(row['familia_TRANSMISION_MECANICA_DIFERENCIAL_envase_TANQUE_'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>familia_TRANSMISION_MECANICA_DIFERENCIAL, envase_TANQUE "+row['familia_TRANSMISION_MECANICA_DIFERENCIAL_envase_TANQUE_']+"</b><br>");
                    }
                }
                if(row['producto'] == 1)
                {
                    $("#alerta").append("<b style='color:red'>"+row['promo']+"</b><br>");
                    if(row['producto_98HF24'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98HF24 "+row['producto_98HF24']+"</b><br>");
                    }
                    if(row['producto_98HC64'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98HC64 "+row['producto_98HC64']+"</b><br>");
                    }
                    if(row['producto_98BB06'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98BB06 "+row['producto_98BB06']+"</b><br>");
                    }
                    if(row['producto_110125'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_110125 "+row['producto_110125']+"</b><br>");
                    }
                    if(row['producto_98CL02'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98CL02 "+row['producto_98CL02']+"</b><br>");
                    }
                    if(row['producto_98CL01'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98CL01 "+row['producto_98CL01']+"</b><br>");
                    }
                    if(row['producto_110124'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_110124 "+row['producto_110124']+"</b><br>");
                    }
                    if(row['producto_98LE18'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98LE18 "+row['producto_98LE18']+"</b><br>");
                    }
                    if(row['producto_110126'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_110126 "+row['producto_110126']+"</b><br>");
                    }
                    if(row['producto_110123'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_110123 "+row['producto_110123']+"</b><br>");
                    }
                    if(row['producto_98LE19'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98LE19 "+row['producto_98LE19']+"</b><br>");
                    }
                    if(row['producto_110122'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_110122 "+row['producto_110122']+"</b><br>");
                    }
                    if(row['producto_110136'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_110136 "+row['producto_110136']+"</b><br>");
                    }
                    if(row['producto_98LE17'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98LE17 "+row['producto_98LE17']+"</b><br>");
                    }
                    if(row['producto_110114'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_110114 "+row['producto_110114']+"</b><br>");
                    }
                    if(row['producto_98HC76'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98HC76 "+row['producto_98HC76']+"</b><br>");
                    }
                    if(row['producto_98CL03'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98CL03 "+row['producto_98CL03']+"</b><br>");
                    }
                    if(row['producto_98CL04'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98CL04 "+row['producto_98CL04']+"</b><br>");
                    }
                    if(row['producto_110115'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_110115 "+row['producto_110115']+"</b><br>");
                    }
                    if(row['producto_98317C'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98317C "+row['producto_98317C']+"</b><br>");
                    }
                    if(row['producto_98AE47'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98AE47 "+row['producto_98AE47']+"</b><br>");
                    }
                    if(row['producto_98GM24'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98GM24 "+row['producto_98GM24']+"</b><br>");
                    }
                    if(row['producto_115058'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_115058 "+row['producto_115058']+"</b><br>");
                    }
                    if(row['producto_98092M'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98092M "+row['producto_98092M']+"</b><br>");
                    }
                    if(row['producto_98Q248'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98Q248 "+row['producto_98Q248']+"</b><br>");
                    }
                    if(row['producto_989459'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_989459 "+row['producto_989459']+"</b><br>");
                    }
                    if(row['producto_985997'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_985997 "+row['producto_985997']+"</b><br>");
                    }
                    if(row['producto_98HM03'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98HM03 "+row['producto_98HM03']+"</b><br>");
                    }
                    if(row['producto_98HM02'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98HM02 "+row['producto_98HM02']+"</b><br>");
                    }
                    if(row['producto_98Y611'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98Y611 "+row['producto_98Y611']+"</b><br>");
                    }
                    if(row['producto_98E325'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98E325 "+row['producto_98E325']+"</b><br>");
                    }
                    if(row['producto_98KJ22'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98KJ22 "+row['producto_98KJ22']+"</b><br>");
                    }
                    if(row['producto_98JJ11'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98JJ11 "+row['producto_98JJ11']+"</b><br>");
                    }
                    if(row['producto_116934'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_116934 "+row['producto_116934']+"</b><br>");
                    }
                    if(row['producto_118990'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_118990 "+row['producto_118990']+"</b><br>");
                    }
                    if(row['producto_98JA00'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98JA00 "+row['producto_98JA00']+"</b><br>");
                    }
                    if(row['producto_98JN55'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98JN55 "+row['producto_98JN55']+"</b><br>");
                    }
                    if(row['producto_98LE13'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98LE13 "+row['producto_98LE13']+"</b><br>");
                    }
                    if(row['producto_98GZ42'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98GZ42 "+row['producto_98GZ42']+"</b><br>");
                    }
                    if(row['producto_98JN57'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98JN57 "+row['producto_98JN57']+"</b><br>");
                    }
                    if(row['producto_98JN56'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98JN56 "+row['producto_98JN56']+"</b><br>");
                    }
                    if(row['producto_98HT42'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98HT42 "+row['producto_98HT42']+"</b><br>");
                    }
                    if(row['producto_98LE12'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98LE12 "+row['producto_98LE12']+"</b><br>");
                    }
                    if(row['producto_98HT43'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98HT43 "+row['producto_98HT43']+"</b><br>");
                    }
                    if(row['producto_98HT46'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98HT46 "+row['producto_98HT46']+"</b><br>");
                    }
                    if(row['producto_98HT45'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98HT45 "+row['producto_98HT45']+"</b><br>");
                    }
                    if(row['producto_98G347'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98G347 "+row['producto_98G347']+"</b><br>");
                    }
                    if(row['producto_98914D'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98914D "+row['producto_98914D']+"</b><br>");
                    }
                    if(row['producto_98277D'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98277D "+row['producto_98277D']+"</b><br>");
                    }
                    if(row['producto_98246D'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98246D "+row['producto_98246D']+"</b><br>");
                    }
                    if(row['producto_98FN88'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98FN88 "+row['producto_98FN88']+"</b><br>");
                    }
                    if(row['producto_98K942'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98K942 "+row['producto_98K942']+"</b><br>");
                    }
                    if(row['producto_98913D'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98913D "+row['producto_98913D']+"</b><br>");
                    }
                    if(row['producto_98218D'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98218D "+row['producto_98218D']+"</b><br>");
                    }
                    if(row['producto_98096R'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98096R "+row['producto_98096R']+"</b><br>");
                    }
                    if(row['producto_98892D'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98892D "+row['producto_98892D']+"</b><br>");
                    }
                    if(row['producto_98K921'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98K921 "+row['producto_98K921']+"</b><br>");
                    }
                    if(row['producto_98GY83'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98GY83 "+row['producto_98GY83']+"</b><br>");
                    }
                    if(row['producto_98K192'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98K192 "+row['producto_98K192']+"</b><br>");
                    }
                    if(row['producto_120000'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_120000 "+row['producto_120000']+"</b><br>");
                    }
                    if(row['producto_98HE54'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98HE54 "+row['producto_98HE54']+"</b><br>");
                    }
                    if(row['producto_98JD05'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98JD05 "+row['producto_98JD05']+"</b><br>");
                    }
                    if(row['producto_98HB92'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98HB92 "+row['producto_98HB92']+"</b><br>");
                    }
                    if(row['producto_98LE14'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98LE14 "+row['producto_98LE14']+"</b><br>");
                    }
                    if(row['producto_98GY97'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98GY97 "+row['producto_98GY97']+"</b><br>");
                    }
                    if(row['producto_98GY96'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98GY96 "+row['producto_98GY96']+"</b><br>");
                    }
                    if(row['producto_98HM25'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98HM25 "+row['producto_98HM25']+"</b><br>");
                    }
                    if(row['producto_98GZ02'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98GZ02 "+row['producto_98GZ02']+"</b><br>");
                    }
                    if(row['producto_98GY93'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98GY93 "+row['producto_98GY93']+"</b><br>");
                    }
                    if(row['producto_98GY94'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98GY94 "+row['producto_98GY94']+"</b><br>");
                    }
                    if(row['producto_98GY92'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98GY92 "+row['producto_98GY92']+"</b><br>");
                    }
                    if(row['producto_98456N'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98456N "+row['producto_98456N']+"</b><br>");
                    }
                    if(row['producto_98LE15'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98LE15 "+row['producto_98LE15']+"</b><br>");
                    }
                    if(row['producto_98HJ28'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98HJ28 "+row['producto_98HJ28']+"</b><br>");
                    }
                    if(row['producto_98HJ37'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98HJ37 "+row['producto_98HJ37']+"</b><br>");
                    }
                    if(row['producto_98447N'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98447N "+row['producto_98447N']+"</b><br>");
                    }
                    if(row['producto_98LE16'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98LE16 "+row['producto_98LE16']+"</b><br>");
                    }
                    if(row['producto_98G758'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98G758 "+row['producto_98G758']+"</b><br>");
                    }
                    if(row['producto_98K073'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98K073 "+row['producto_98K073']+"</b><br>");
                    }
                    if(row['producto_98HM26'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98HM26 "+row['producto_98HM26']+"</b><br>");
                    }
                    if(row['producto_98699D'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98699D "+row['producto_98699D']+"</b><br>");
                    }
                    if(row['producto_98887D'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98887D "+row['producto_98887D']+"</b><br>");
                    }
                    if(row['producto_98HL93'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98HL93 "+row['producto_98HL93']+"</b><br>");
                    }
                    if(row['producto_98HM00'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98HM00 "+row['producto_98HM00']+"</b><br>");
                    }
                    if(row['producto_98E338'] > 0)
                    {
                    $("#alerta").append("<b style='color:red'>producto_98E338 "+row['producto_98E338']+"</b><br>");
                    }


                }
            }
        }
    });
}