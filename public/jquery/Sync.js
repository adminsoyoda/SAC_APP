
var syncServer = 'http://192.168.2.41:81/SAC/Sync';

var PROJECT_ID_GOOGLE = "994360885610";
var admPass = "sa";
var DATABASE_NAME="SAC_PRUEBA";
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
                    

function SyncExe(CODIGOINTERNO, RETORNO) {
    $("#loader_sys").show();
    var dataPost = {
        CODIGOINTERNO: CODIGOINTERNO,
        IDGOOGLE: registerId
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
    var IDGOOGLE = '';
    
    if (loader) { $("#loader_sys").show(); }

    BDConsultaOBJ("SELECT * FROM APP_USUARIO;", function (obj) {
        for (var i = 0; i < obj.rows.length; i++) {
            var row = obj.rows.item(i);
            CODIGOINTERNO = row.IDUSERWEB;
            IDGOOGLE = row.IDGOOGLE;
        }

        var dataPost = {
            CODIGOINTERNO: CODIGOINTERNO,
            IDGOOGLE: IDGOOGLE
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
    BDConsultaOBJ(sqlCommand, function (obj) {
        var result = [];
        var numRow = 0;
        while (obj.isValidRow()){
            result[numRow] = {};
            var numField = 0;
            while (obj.field(numField)) {
                result[numRow][obj.fieldName(numField)] = obj.field(numField);
                numField++;
            }
            obj.next();
            numRow++;
        }

        alert(result.length);
        alert(result);

        var dataPost = {
            OBJECTDATA: result,
            TABLE: table
        };
        AjaxSAC(syncServer + "/SyncReciveDeviceInfo", dataPost, true, function (callback) {
            RETORNO(callback);
            return true;
        });
    });
    
}

