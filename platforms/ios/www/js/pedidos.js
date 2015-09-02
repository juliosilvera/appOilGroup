var db2 = window.openDatabase("Clientes", "1.0", "Clientes", 200000);
var db3 = window.openDatabase("Productos", "1.0", "Productos", 200000);

var asesor = 1;
var lista_productos = "";
var lista_productos1 = "";
var lista_productos2 = "";

$(function(){
    db2.transaction(queryDB);
    db3.transaction(queryDB2);
    $('#buscar').select2();
    
});

var fecha = "";
$.get("http://mobil.gotrade.com.ec/get_fecha", function(data, status){
	fecha = data;
});


//function will be called when an error occurred
function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

//function will be called when process succeed
function successCB() {
    alert("Encuesta Cargada!");
    window.open("ver_pedidos.html", "_self");
}

function successCB1() {
   
    
}

function carga(){
    db.transaction(populateDB,errorCB,successCB);
}


function queryDB(tx){
    tx.executeSql('SELECT * FROM Clientes WHERE asesor = ' + asesor,[],querySuccess,errorCB);
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
		    '<div id="collapse'+row['id']+'" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="'+familia.replace(/ /g, '_')+'">'+
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
	
	tx.executeSql('CREATE TABLE IF NOT EXISTS Pedidos (id INTEGER PRIMARY KEY AUTOINCREMENT, fecha TEXT, user TEXT, cod_asesor TEXT, cliente TEXT, codigo TEXT, local TEXT, email TEXT '+lista_productos+')');

	tx.executeSql('INSERT INTO Pedidos (fecha, user, cod_asesor, cliente, codigo, local, email '+lista_productos1+') VALUES ("'+fecha+'", "'+asesor+'", "'+asesor+'", "'+$("#cliente").val()+'", "'+$("#codigo").val()+'", "'+$("#local").val()+'", "'+$("#email").val()+'" '+lista_productos2+')');
		
}
