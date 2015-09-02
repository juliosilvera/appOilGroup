var db = window.openDatabase("dbEncuestas", "1.0", "dbEncuestas", 65535);
var db2 = window.openDatabase("Clientes", "1.0", "Clientes", 65535);

$(function(){
    db2.transaction(queryDB);
    $('#buscar').select2();
});



//function will be called when submit is pressed
$("#submit").click(function(){
    var valor_mix = $("#mix_sintetico").val() + $("#mix_multi_premium").val() + $("#mix_multi_standard").val() + $("#mix_transmision").val();
    var valor_formato = $("#formato_Mecanica").val() + $("#formato_Tecnicentro").val() + $("#formato_Repuestera").val() + $("#formato_Lubricadora").val() + $("#formato_Mayorista").val();
    var valor_elementos = $("#Exhibidor").val() + $("#Counter").val() + $("#Percha").val();
    if ($("#cliente").val() == "") {
        alert("Seleccione el Cliente");
    }
    else if ($("#local").val() == "") {
        alert("Falta Nombre del Local");
    }
    else if ($("#fosas").val() == "") {
        alert("Falta Cantidad de Fosas");
    }
    else if ($("#participacion").val() == "") {
        alert("Falta Participacion");
    }
    else if ($("#cantidad_marcas").val() == "") {
        alert("Falta Cantidad de Marcas");
    }
    else if ($("#no_empleados").val() == "") {
        alert("Falta Cantidad de Empleados");
    }
    else if ($("#volumen_venta").val() == "") {
        alert("Falta Volumen de Ventas");
    }
    else if ($("#referencia_credito").val() == "") {
        alert("Falta Referencia de Crédito");
    }
    else if ($("#segmento_clientes").val() == "") {
        alert("Falta Segmento de Clientes");
    }
    else if ($("#ubicacion").val() == "") {
        alert("Falta Ubicación");
    }
    else if ($("#trafico_clientes").val() == "") {
        alert("Falta Tráfico de Clientes");
    }
    else if ($("#imagen_externa").val() == "") {
        alert("Falta Imagen Externa");
    }
    else if ($("#oyl").val() == "") {
        alert("Falta L & O");
    }
    else if ($("#imagen_interna").val() == "") {
        alert("Falta Imagen Interna");
    }
    else if ($("#cantidad_referencias").val() == "") {
        alert("Falta Cantidad de Referencias");
    }
    else if ($("#tipo_venta").val() == "") {
        alert("Falta Tipo de Venta");
    }
    else if ($("#relacion_marca").val() == "") {
        alert("Falta Relación con la Marca");
    }
    else if (valor_mix <= 0) {
        alert("Seleccione al menos 1 Mix de Productos");
    }
    else if (valor_elementos <= 0) {
        alert("Seleccione al menos 1 Elemento de Exhibición");
    }
    else if (valor_formato <= 0) {
        alert("Seleccione al menos 1 Formato de Negocio");
    }
    else{
        carga();
    }
    
});

//create table and insert some record
function populateDB(tx) {

    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var fecha = d.getFullYear() + '/' +
        (month<10 ? '0' : '') + month + '/' +
        (day<10 ? '0' : '') + day;
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

    tx.executeSql('CREATE TABLE IF NOT EXISTS Encuestas (id INTEGER PRIMARY KEY AUTOINCREMENT,cliente TEXT,codigo TEXT,local TEXT,fecha TEXT,fosas TEXT,participacion TEXT,cantidad_marcas TEXT,mix_sintetico TEXT,mix_multi_premium TEXT,mix_multi_standard TEXT,mix_transmision TEXT,no_empleados TEXT,volumen_venta TEXT,referencia_credito TEXT,segmento_clientes TEXT,formato_Mecanica TEXT,formato_Tecnicentro TEXT,formato_Repuestera TEXT,formato_Lubricadora TEXT,formato_Mayorista TEXT,ubicacion TEXT,Exhibidor TEXT,Counter TEXT,Percha TEXT,trafico_clientes TEXT,imagen_externa TEXT,oyl TEXT,imagen_interna TEXT,cantidad_referencias TEXT,tipo_venta TEXT,relacion_marca TEXT,observaciones TEXT)');
    tx.executeSql('INSERT INTO Encuestas (cliente,codigo,local,fecha,fosas,participacion,cantidad_marcas,mix_sintetico,mix_multi_premium,mix_multi_standard,mix_transmision,no_empleados,volumen_venta,referencia_credito,segmento_clientes,formato_Mecanica,formato_Tecnicentro,formato_Repuestera,formato_Lubricadora,formato_Mayorista,ubicacion,Exhibidor,Counter,Percha,trafico_clientes,imagen_externa,oyl,imagen_interna,cantidad_referencias,tipo_venta,relacion_marca,observaciones) VALUES ("'+cliente+'","'+codigo+'","'+local+'","'+fecha+'","'+fosas+'","'+participacion+'","'+cantidad_marcas+'","'+mix_sintetico+'","'+mix_multi_premium+'","'+mix_multi_standard+'","'+mix_transmision+'","'+no_empleados+'","'+volumen_venta+'","'+referencia_credito+'","'+segmento_clientes+'","'+formato_Mecanica+'","'+formato_Tecnicentro+'","'+formato_Repuestera+'","'+formato_Lubricadora+'","'+formato_Mayorista+'","'+ubicacion+'","'+Exhibidor+'","'+Counter+'","'+Percha+'","'+trafico_clientes+'","'+imagen_externa+'","'+oyl+'","'+imagen_interna+'","'+cantidad_referencias+'","'+tipo_venta+'","'+relacion_marca+'","'+observaciones+'")');
}

//function will be called when an error occurred
function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}

//function will be called when process succeed
function successCB() {
    alert("Encuesta Cargada!");
    window.open("ver_encuestas.html", "_self");
}

function carga(){
    db.transaction(populateDB,errorCB,successCB);
}


$("#mix_sintetico").click(function(){
    if($(this).prop("checked")){
    $("#mix_sintetico").val("1");
    }else{
    $("#mix_sintetico").val("0");
    }

});
$("#mix_multi_premium").click(function(){
    if($(this).prop("checked")){
    $("#mix_multi_premium").val("1");
    }else{
    $("#mix_multi_premium").val("0");
    }

});
$("#mix_multi_standard").click(function(){
    if($(this).prop("checked")){
    $("#mix_multi_standard").val("1");
    }else{
    $("#mix_multi_standard").val("0");
    }

});
$("#mix_transmision").click(function(){
    if($(this).prop("checked")){
    $("#mix_transmision").val("1");
    }else{
    $("#mix_transmision").val("0");
    }
});
$("#formato_Mecanica").click(function(){
    if($(this).prop("checked")){
    $("#formato_Mecanica").val("1");
    }else{
    $("#formato_Mecanica").val("0");
    }

});
$("#formato_Tecnicentro").click(function(){
    if($(this).prop("checked")){
    $("#formato_Tecnicentro").val("1");
    }else{
    $("#formato_Tecnicentro").val("0");
    }

});
$("#formato_Repuestera").click(function(){
    if($(this).prop("checked")){
    $("#formato_Repuestera").val("1");
    }else{
    $("#formato_Repuestera").val("0");
    }

});
$("#formato_Lubricadora").click(function(){
    if($(this).prop("checked")){
    $("#formato_Lubricadora").val("1");
    }else{
    $("#formato_Lubricadora").val("0");
    }

});
$("#formato_Mayorista").click(function(){
    if($(this).prop("checked")){
    $("#formato_Mayorista").val("1");
    }else{
    $("#formato_Mayorista").val("0");
    }

});
$("#Exhibidor").click(function(){
    if($(this).prop("checked")){
    $("#Exhibidor").val("1");
    }else{
    $("#Exhibidor").val("0");
    }

});
$("#Counter").click(function(){
    if($(this).prop("checked")){
        $("#Counter").val("1");
        }else{
        $("#Counter").val("0");
        }

});
$("#Percha").click(function(){
    if($(this).prop("checked")){
    $("#Percha").val("1");
    }else{
    $("#Percha").val("0");
    }

});


function queryDB(tx){
    tx.executeSql('SELECT * FROM Clientes',[],querySuccess,errorCB);
}

function querySuccess(tx, result){

    for (var i = 0; i < result.rows.length; i++)
    {
        var row = result.rows.item(i);
        $('#buscar').append('<option value="'+row['codigo']+'">'+row['cliente']+' / '+row['codigo']+'</option>');
    }

}

$("#buscar").change(function(){
    $("#buscar option:selected").each(function(){
        var cliente1 = $(this).text();
        var cliente = cliente1.substring(0, cliente1.indexOf('/'))
        var codigo = $(this).val();
        $("#cliente").val(cliente);
        $("#codigo").val(codigo);
    });
});


