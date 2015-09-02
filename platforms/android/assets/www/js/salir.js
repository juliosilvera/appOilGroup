var db = window.openDatabase("dbEncuestas", "1.0", "dbEncuestas", 65535);
var db3 = window.openDatabase("Productos", "1.0", "Productos", 65535);

function exitFromApp()
 {
    navigator.app.exitApp();
 }
 $(function(){
	db.transaction(queryEncuestas);
	db3.transaction(queryPedidos);
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