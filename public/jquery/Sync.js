
var syncServer = 'http://192.168.2.41:81/SAC/Sync';
//var syncServer = 'http://186.5.36.149:94/SAC/Sync';

var PROJECT_ID_GOOGLE = "994360885610";
var admPass = "sa";
var DATABASE_NAME="SAC";
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
        INISYNC:INISYNC,
        LOADER:INISYNC
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
            INISYNC: false,
            LOADER:loader
        };

        AjaxSAC(syncServer + "/SyncExe", dataPost, true, function (callback) {
            $("#sync_sys").html(callback);
            $("#loader_sys").hide();
            return true;
        });
    });
}

function SyncExeSendInfo(sqlCommand,table,loader) {
    if (loader) { $("#loader_sys").show(); }
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
            if (loader) {
                alerta(callback);
            }
            return true;
        });
    });
}


function SyncAppWebAll(TableSelect, ConditionSelect, TableAction, ConditionAction, Actions, Type, detailColum,alerta){
    var strAction="";
    if(Type=="APP"){
        BDConsultaOBJ(" SELECT * FROM "+TableSelect + ConditionSelect , function (obj){    
            for (var i = 0; i < obj.rows.length; i++) {        
                var row = obj.rows.item(i);     
                
                var actionStr = ((Actions == "INSERT") ? "INSERT INTO "+TableAction+" VALUES( " : "UPDATE " + TableAction + " SET "); 
                var regColum = detailColum.split("|");
                for (var j = 0; j < regColum.length; j++)
                {
                    if (Actions == "INSERT"){
                        actionStr = actionStr + ((j == 0) ? "'" : ",'") + ((row[regColum[j]]== null) ? '0': row[regColum[j]]) + "'";
                    }
                    else{
                        actionStr = actionStr + ((j == 0) ? "" : ",") + regColum[j] + "='"+ ((row[regColum[j]]==null) ? '0': row[regColum[j]] )+"'";
                    }
                }	
                actionStr = actionStr + ((Actions == "INSERT") ? " );" : " " + ConditionAction + ";");
                actionStr = actionStr + ((obj.rows.length > 1)? '|' : '') ;
                strAction=strAction+actionStr;
            }

            dataPost={     
		        STRACTION:strAction
		    }
		    AjaxSAC(syncServer+'/SyncAppWebExe', dataPost, true, function (callback) {
		        if(alerta){
		        	alert(callback);
		    	}
		    });
        });
    }else{
    	AjaxSAC(syncServer+'/SyncAppWebExe', dataPost, true, function (callback) {
    		
    		if(alerta){
		       	alert(callback);
		    }
	        
	        var regColum = callback.split("|");
            for (var i = 0; i < regColum.length; i++)
            {
            	BDActualizacion(regColum[i]);
            }
		});
    }
}
