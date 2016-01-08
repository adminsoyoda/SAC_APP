
var syncServer = 'http://192.168.2.41:81/SAC/Sync';

var PROJECT_ID_GOOGLE = "994360885610";
var admPass = "sa";
var DATABASE_NAME="SAC_PRUEBA3";
var DATABASE_VERSION="1.0";
var DATABASE_DESCRIPTION="SAC Gestion Ventas Soyoda";
var DATABASE_SIZE=200000;

//-------------------------------------------------------------------------------------------------
//FUNCIONES BASE DE DATOS
function errorCB(err) { alert("Error processing SQL: " + err.code + " - " + err.name); }
function successCB() { }

function BDConsulta(sqlCommand, RESULTADO) {
    var db = window.openDatabase(DATABASE_NAME, DATABASE_VERSION, DATABASE_DESCRIPTION, DATABASE_SIZE);
    db.transaction(function (tx) {
        tx.executeSql(sqlCommand, [], function (tx, rs) {
            var result = [];
            for(var i = 0; i < rs.rows.length; i++) {
                var row = rs.rows.item(i)
            }
            RESULTADO(row);
        })
    }, errorCB, successCB);
}

function BDActualizacion(sqlCommand) {
    var db = window.openDatabase(DATABASE_NAME, DATABASE_VERSION, DATABASE_DESCRIPTION, DATABASE_SIZE);
    db.transaction(function (tx) { tx.executeSql(sqlCommand) }, errorCB, successCB);
}

function BDConsultaOBJ(sqlCommand, RESULTADO) {
    var db = window.openDatabase(DATABASE_NAME, DATABASE_VERSION, DATABASE_DESCRIPTION, DATABASE_SIZE);
    db.transaction(function (tx) {
        tx.executeSql(sqlCommand, [], function (tx, rs) {
            RESULTADO(rs);
        })
    }, errorCB, successCB);
}

function BDActualizacionObj(sqlCommand,Obj) {
    var db = window.openDatabase(DATABASE_NAME, DATABASE_VERSION, DATABASE_DESCRIPTION, DATABASE_SIZE);
    db.transaction(function(tx){
        for (objValue in Obj){
            tx.executeSql(sqlCommand,Obj[objValue]);
        }
    }, errorCB, successCB);    
}

 function BDActualizacionObjWithCallback(sqlCommand,Obj,callback){     
    var db = window.openDatabase(DATABASE_NAME, DATABASE_VERSION, DATABASE_DESCRIPTION, DATABASE_SIZE);
    db.transaction(function(tx){
       tx.executeSql(sqlCommand,Obj,callback);        
    }, errorCB, successCB);   
}


function SyncExeReady(CODIGOINTERNO,TIPOSYNC, RETORNO) {
    $("#loader_sys").show();
    var dataPost = {
        CODIGOINTERNO: CODIGOINTERNO
    };
    AjaxSAC(syncServer + "/" + TIPOSYNC, dataPost, true, function (callback) {
        $("#sync_sys").html(callback);
        $("#loader_sys").hide();
        RETORNO("OK");
        return true;
    });
}
                    

function SyncExe(CODIGOINTERNO,INISYNC, RETORNO) {
    $("#loader_sys").show();
    var dataPost = {
        CODIGOINTERNO: CODIGOINTERNO,
        INISYNC:INISYNC
    };
    AjaxSAC(syncServer + "/SyncExe", dataPost, true, function (callback) {
        $("#sync_sys").html(callback);
        $("#loader_sys").hide();
        RETORNO("OK");
        return true;
    });
}

function SyncProcess(loader) {
    var CODIGOINTERNO = '';
    var FECHAANT = '';
    
    if (loader) { $("#loader_sys").show(); }

    BDConsultaOBJ("SELECT * FROM APP_USUARIO;", function (obj) {
        for (var i = 0; i < obj.rows.length; i++) {
            var row = obj.rows.item(i);
            CODIGOINTERNO = row.IDUSERWEB;
        }
   
        var dataPost = {
            CODIGOINTERNO: CODIGOINTERNO,
            INISYNC: false
        };

        AjaxSAC(syncServer + "/SyncExe", dataPost, true, function (callback) {
            $("#sync_sys").html(callback);
            $("#loader_sys").hide();
            if (loader) {
                alert('Ok');
                contentPage('pages/main.html');
            }
            return true;
        });
    });
}

function SyncExeSendInfo(sqlCommand,table) {
    alert("Sincronizando...");
    BDConsultaOBJ(sqlCommand, function (obj) {
        var objString=""; 
        var result = [];
        for (var i=0;i<obj.rows.length;i++) {
            result.push(obj.rows.item(i));
        }
        objString = JSON.stringify(result, null, 2);
        var dataPost = {
            OBJECTDATA: objString,
            TABLE: table
        };
        AjaxSAC(syncServer + "/SyncDeviceInfo"+table, dataPost, true, function (callback) {
            alerta(callback);
            return true;
        });
    });
}
