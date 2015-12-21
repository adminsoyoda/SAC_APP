
var syncServer = 'http://186.5.36.149:94/SAC/Sync';
var PROJECT_ID_GOOGLE = "994360885610";
var admPass = "sa";

//-------------------------------------------------------------------------------------------------
//FUNCIONES BASE DE DATOS
function errorCB(err) { alert("Error processing SQL: " + err.code + " - " + err.name); }
function successCB() { }

function BDConsulta(sqlCommand, RESULTADO) {
    var db = window.openDatabase("SAC", "1.0", "SAC Gestion Ventas Soyoda", 200000);
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
    var db = window.openDatabase("SAC", "1.0", "SAC Gestion Ventas Soyoda", 200000);
    db.transaction(function (tx) { tx.executeSql(sqlCommand) }, errorCB, successCB);
}

function BDConsultaOBJ(sqlCommand, RESULTADO) {
    var db = window.openDatabase("SAC", "1.0", "SAC Gestion Ventas Soyoda", 200000);
    db.transaction(function (tx) {
        tx.executeSql(sqlCommand, [], function (tx, rs) {
            RESULTADO(rs);
        })
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
        CODIGOINTERNO: CODIGOINTERNO
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

