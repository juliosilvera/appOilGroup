var fosas = $("#fosas").val();
var observaciones_fosas = $("#observaciones_fosas").val();
var participacion = $("#participacion").val();
var observaciones_participacion = $("#observaciones_participacion").val();
var cantidad_marcas = $("#cantidad_marcas").val();
var observaciones_cantidad_marcas = $("#observaciones_cantidad_marcas").val();
var mix_productos = $("#mix_productos").val();
var observaciones_mix_productos = $("#observaciones_mix_productos").val();
var no_empleados = $("#no_empleados").val();
var observaciones_no_empleados = $("#observaciones_no_empleados").val();
var volumen_venta = $("#volumen_venta").val();
var observaciones_volumen_venta = $("#observaciones_volumen_venta").val();
var referencia_credito = $("#referencia_credito").val();
var observaciones_referencia_credito = $("#observaciones_referencia_credito").val();
var segmento_clientes = $("#segmento_clientes").val();
var observaciones_segmento_clientes = $("#observaciones_segmento_clientes").val();
var formato_negocio = $("#formato_negocio").val();
var observaciones_formato_negocio = $("#observaciones_formato_negocio").val();
var ubicacion = $("#ubicacion").val();
var observaciones_ubicacion = $("#observaciones_ubicacion").val();
var elementos_exhibicion = $("#elementos_exhibicion").val();
var observaciones_elementos_exhibicion = $("#observaciones_elementos_exhibicion").val();
var trafico_clientes = $("#trafico_clientes").val();
var observaciones_trafico_clientes = $("#observaciones_trafico_clientes").val();
var imagen_externa = $("#imagen_externa").val();
var observaciones_imagen_externa = $("#observaciones_imagen_externa").val();
var oyl = $("#oyl").val();
var observaciones_oyl = $("#observaciones_oyl").val();
var imagen_interna = $("#imagen_interna").val();
var observaciones_imagen_interna = $("#observaciones_imagen_interna").val();
var cantidad_referencias = $("#cantidad_referencias").val();
var observaciones_cantidad_referencias = $("#observaciones_cantidad_referencias").val();
var tipo_venta = $("#tipo_venta").val();
var observaciones_tipo_venta = $("#observaciones_tipo_venta").val();
var relacion_marca = $("#relacion_marca").val();
var observaciones_relacion_marca = $("#observaciones_relacion_marca").val();

tx.executeSql('INSERT INTO encuestas(fosas,observaciones_fosas,participacion,observaciones_participacion,cantidad_marcas,observaciones_cantidad_marcas, mix_productos,observaciones_mix_productos,no_empleados,observaciones_no_empleados,volumen_venta,observaciones_volumen_venta,referencia_credito,observaciones_referencia_credito, segmento_clientes,observaciones_segmento_clientes,formato_negocio,observaciones_formato_negocio,ubicacion,observaciones_ubicacion,elementos_exhibicion,observaciones_elementos_exhibicion, trafico_clientes,observaciones_trafico_clientes,imagen_externa,observaciones_imagen_externa,oyl,observaciones_oyl,imagen_interna,observaciones_imagen_interna,cantidad_referencias,observaciones_cantidad_referencias,tipo_venta,observaciones_tipo_venta,relacion_marca,observaciones_relacion_marca) VALUES ("","","","","","", "","","","","","","","", "","","","","","","","", "","","","","","","","","","","","","","")');

tx.executeSql('CREATE TABLE IF NOT EXISTS datos (id INTEGER PRIMARY KEY AUTOINCREMENT, fosas TEXT NOT NULL, observaciones_fosas TEXT NOT NULL, participacion TEXT NOT NULL, observaciones_participacion TEXT NOT NULL, cantidad_marcas TEXT NOT NULL, observaciones_cantidad_marcas TEXT NOT NULL, mix_productos TEXT NOT NULL, observaciones_mix_productos TEXT NOT NULL, no_empleados TEXT NOT NULL, observaciones_no_empleados TEXT NOT NULL, volumen_venta TEXT NOT NULL, observaciones_volumen_venta TEXT NOT NULL, referencia_credito TEXT NOT NULL, observaciones_referencia_credito TEXT NOT NULL, segmento_clientes TEXT NOT NULL, observaciones_segmento_clientes TEXT NOT NULL, formato_negocio TEXT NOT NULL, observaciones_formato_negocio TEXT NOT NULL, ubicacion TEXT NOT NULL, observaciones_ubicacion TEXT NOT NULL, elementos_exhibicion TEXT NOT NULL, observaciones_elementos_exhibicion TEXT NOT NULL, trafico_clientes TEXT NOT NULL, observaciones_trafico_clientes TEXT NOT NULL, imagen_externa TEXT NOT NULL, observaciones_imagen_externa TEXT NOT NULL, oyl TEXT NOT NULL, observaciones_oyl TEXT NOT NULL, imagen_interna TEXT NOT NULL, observaciones_imagen_interna TEXT NOT NULL, cantidad_referencias TEXT NOT NULL, observaciones_cantidad_referencias TEXT NOT NULL, tipo_venta TEXT NOT NULL, observaciones_fobservaciones_tipo_ventaosas TEXT NOT NULL, relacion_marca TEXT NOT NULL, observaciones_relacion_marca TEXT NOT NULL)');
tx.executeSql('INSERT INTO datos(fosas,observaciones_fosas,participacion,observaciones_participacion,cantidad_marcas,observaciones_cantidad_marcas, mix_productos,observaciones_mix_productos,no_empleados,observaciones_no_empleados,volumen_venta,observaciones_volumen_venta,referencia_credito,observaciones_referencia_credito, segmento_clientes,observaciones_segmento_clientes,formato_negocio,observaciones_formato_negocio,ubicacion,observaciones_ubicacion,elementos_exhibicion,observaciones_elementos_exhibicion, trafico_clientes,observaciones_trafico_clientes,imagen_externa,observaciones_imagen_externa,oyl,observaciones_oyl,imagen_interna,observaciones_imagen_interna,cantidad_referencias,observaciones_cantidad_referencias,tipo_venta,observaciones_tipo_venta,relacion_marca,observaciones_relacion_marca) VALUES ("","","","","","", "","","","","","","","", "","","","","","","","", "","","","","","","","","","","","","","")');