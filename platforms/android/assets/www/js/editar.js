var db = window.openDatabase("dbEncuestas", "1.0", "dbEncuestas", 65535);
var db2 = window.openDatabase("Clientes", "1.0", "Clientes", 65535);

var asesor = 1;

$("#mix_sintetico").click(function(){
	if ($("#mix_sintetico").val() == 1) {
		$("#mix_sintetico").val("0");
	}else{
		$("#mix_sintetico").val("1");
	}
    
});

$("#mix_multi_premium").click(function(){
    if ($("#mix_multi_premium").val() == 1) {
		$("#mix_multi_premium").val("0");
	}else{
		$("#mix_multi_premium").val("1");
	}
});

$("#mix_multi_standard").click(function(){
    if ($("#mix_multi_standard").val() == 1) {
		$("#mix_multi_standard").val("0");
	}else{
		$("#mix_multi_standard").val("1");
	}
});

$("#mix_transmision").click(function(){
    if ($("#mix_transmision").val() == 1) {
		$("#mix_transmision").val("0");
	}else{
		$("#mix_transmision").val("1");
	}
});

$("#formato_Mecanica").click(function(){
    if ($("#formato_Mecanica").val() == 1) {
		$("#formato_Mecanica").val("0");
	}else{
		$("#formato_Mecanica").val("1");
	}
});

$("#formato_Tecnicentro").click(function(){
    if ($("#formato_Tecnicentro").val() == 1) {
		$("#formato_Tecnicentro").val("0");
	}else{
		$("#formato_Tecnicentro").val("1");
	}
});

$("#formato_Repuestera").click(function(){
    if ($("#formato_Repuestera").val() == 1) {
		$("#formato_Repuestera").val("0");
	}else{
		$("#formato_Repuestera").val("1");
	}
});
$("#formato_Lubricadora").click(function(){
    if ($("#formato_Lubricadora").val() == 1) {
		$("#formato_Lubricadora").val("0");
	}else{
		$("#formato_Lubricadora").val("1");
	}
});
$("#formato_Mayorista").click(function(){
    if ($("#formato_Mayorista").val() == 1) {
		$("#formato_Mayorista").val("0");
	}else{
		$("#formato_Mayorista").val("1");
	}
});
$("#Exhibidor").click(function(){
    if ($("#Exhibidor").val() == 1) {
		$("#Exhibidor").val("0");
	}else{
		$("#Exhibidor").val("1");
	}
});
$("#Counter").click(function(){
    if ($("#Counter").val() == 1) {
		$("#Counter").val("0");
	}else{
		$("#Counter").val("1");
	}
});
$("#Percha").click(function(){
    if ($("#Percha").val() == 1) {
		$("#Percha").val("0");
	}else{
		$("#Percha").val("1");
	}
});

var baseUrl = (window.location).href;
$idParameter = baseUrl.substring(baseUrl.lastIndexOf('=') + 1);


$(function(){
	db.transaction(queryDB);
	db2.transaction(queryDB2);
})

$("#submit").click(function(){
    db.transaction(populateDB,errorCB,successCB2);
});

//function will be called when an error occurred
function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

//function will be called when process succeed
function successCB() {
    alert("funca!");
    
}

function successCB2() {
    alert("Encuesta Cargada!");
    window.open("ver_encuestas.html", "_self");
}

function queryDB(tx){
    tx.executeSql('SELECT * FROM Encuestas WHERE id = ' + $idParameter,[],querySuccess,errorCB);
}

function querySuccess(tx, result){
	var row = result.rows.item(0);
    $("#cliente").val(row['cliente']);
    $("#codigo").val(row['codigo']);
    $("#local").val(row['local']);
	$("#fosas").val(row['fosas']);
	$("#participacion").val(row['participacion']);
    $("#cantidad_marcas").val(row['cantidad_marcas']);
    $("#no_empleados").val(row['no_empleados']);
    $("#volumen_venta").val(row['volumen_venta']);
    $("#referencia_credito").val(row['referencia_credito']);
    $("#segmento_clientes").val(row['segmento_clientes']);
    $("#ubicacion").val(row['ubicacion']);
    $("#trafico_clientes").val(row['trafico_clientes']);
    $("#imagen_externa").val(row['imagen_externa']);
    $("#oyl").val(row['oyl']);
    $("#imagen_interna").val(row['imagen_interna']);
    $("#cantidad_referencias").val(row['cantidad_referencias']);
    $("#tipo_venta").val(row['tipo_venta']);
    $("#relacion_marca").val(row['relacion_marca']);
    $("#observaciones").val(row['observaciones']);

    if (row['mix_sintetico'] == "1") {
    	$("#mix_sintetico").attr("checked", true);
    	$("#mix_sintetico").val("1");
    };
    if (row['mix_multi_premium'] == "1") {
    	$("#mix_multi_premium").attr("checked", true);
    	$("#mix_multi_premium").val("1");
    };
    if (row['mix_multi_standard'] == "1") {
    	$("#mix_multi_standard").attr("checked", true);
    	$("#mix_multi_standard").val("1");
    };
    if (row['mix_transmision'] == "1") {
    	$("#mix_transmision").attr("checked", true);
    	$("#mix_transmision").val("1");
    };
    if (row['formato_Mecanica'] == "1") {
    	$("#formato_Mecanica").attr("checked", true);
    	$("#formato_Mecanica").val("1");
    };
    if (row['formato_Tecnicentro'] == "1") {
    	$("#formato_Tecnicentro").attr("checked", true);
    	$("#formato_Tecnicentro").val("1");
    };
    if (row['formato_Repuestera'] == "1") {
    	$("#formato_Repuestera").attr("checked", true);
    	$("#formato_Repuestera").val("1");
    };
    if (row['formato_Lubricadora'] == "1") {
    	$("#formato_Lubricadora").attr("checked", true);
    	$("#formato_Lubricadora").val("1");
    };
    if (row['formato_Mayorista'] == "1") {
    	$("#formato_Mayorista").attr("checked", true);
    	$("#formato_Mayorista").val("1");
    };
    if (row['Exhibidor'] == "1") {
    	$("#Exhibidor").attr("checked", true);
    	$("#Exhibidor").val("1");
    };
    if (row['Counter'] == "1") {
    	$("#Counter").attr("checked", true);
    	$("#Counter").val("1");
    };
    if (row['Percha'] == "1") {
    	$("#Percha").attr("checked", true);
    	$("#Percha").val("1");
    };


}

$("#buscar").change(function(){
    $("#buscar option:selected").each(function(){
        var cliente = $(this).text();
        var codigo = $(this).val();
        $("#cliente").val(cliente);
        $("#codigo").val(codigo);
    });
});

function queryDB2(tx){
    tx.executeSql('SELECT * FROM Clientes WHERE asesor = ' + asesor,[],querySuccess2,errorCB);
}

function querySuccess2(tx, result){

    for (var i = 0; i < result.rows.length; i++)
    {
        var row = result.rows.item(i);
        $('#buscar').append('<option value="'+row['codigo']+'">'+row['cliente']+'</option>');
    }

}



function populateDB(tx) {
    var cliente = $("#cliente").val();
    var codigo = $("#codigo").val();
    var local = $("#local").val();
    var fosas = $("#fosas").val();
    var participacion = $("#participacion").val();
    var cantidad_marcas = $("#cantidad_marcas").val();
    var mix_sintetico = $("#mix_sintetico").val();
    var mix_multi_premium = $("#mix_multi_premium").val();
    var mix_multi_standard = $("#mix_multi_standard").val();
    var mix_transmision = $("#mix_transmision").val();
    var no_empleados = $("#no_empleados").val();
    var volumen_venta = $("#volumen_venta").val();
    var referencia_credito = $("#referencia_credito").val();
    var segmento_clientes = $("#segmento_clientes").val();
    var formato_Mecanica = $("#formato_Mecanica").val();
    var formato_Tecnicentro = $("#formato_Tecnicentro").val();
    var formato_Repuestera = $("#formato_Repuestera").val();
    var formato_Lubricadora = $("#formato_Lubricadora").val();
    var formato_Mayorista = $("#formato_Mayorista").val();
    var ubicacion = $("#ubicacion").val();
    var Exhibidor = $("#Exhibidor").val();
    var Counter = $("#Counter").val();
    var Percha = $("#Percha").val();
    var trafico_clientes = $("#trafico_clientes").val();
    var imagen_externa = $("#imagen_externa").val();
    var oyl = $("#oyl").val();
    var imagen_interna = $("#imagen_interna").val();
    var cantidad_referencias = $("#cantidad_referencias").val();
    var tipo_venta = $("#tipo_venta").val();
    var relacion_marca = $("#relacion_marca").val();
    var observaciones = $("#observaciones").val();
    tx.executeSql('UPDATE Encuestas SET cliente = "'+cliente+'", codigo = "'+codigo+'", local = "'+local+'", fosas = "'+fosas+'", participacion = "'+participacion+'", cantidad_marcas = "'+cantidad_marcas+'", mix_sintetico = "'+mix_sintetico+'", mix_multi_premium = "'+mix_multi_premium+'", mix_multi_standard = "'+mix_multi_standard+'", mix_transmision = "'+mix_transmision+'", no_empleados = "'+no_empleados+'", volumen_venta = "'+volumen_venta+'", referencia_credito = "'+referencia_credito+'", segmento_clientes = "'+segmento_clientes+'", formato_Mecanica = "'+formato_Mecanica+'", formato_Tecnicentro = "'+formato_Tecnicentro+'", formato_Repuestera = "'+formato_Repuestera+'", formato_Lubricadora = "'+formato_Lubricadora+'", formato_Mayorista = "'+formato_Mayorista+'", ubicacion = "'+ubicacion+'", Exhibidor = "'+Exhibidor+'", Counter = "'+Counter+'", Percha = "'+Percha+'", trafico_clientes = "'+trafico_clientes+'", imagen_externa = "'+imagen_externa+'", oyl = "'+oyl+'", imagen_interna = "'+imagen_interna+'", cantidad_referencias = "'+cantidad_referencias+'", tipo_venta = "'+tipo_venta+'", relacion_marca = "'+relacion_marca+'", observaciones = "'+observaciones+'" WHERE id = 1');
}