var TIMEOUT_SEARCH=15000;//milisegundos

    /**objeto gps**/
    function objectGPS(registerDb){
        var registerDataBase=registerDb|| false;
        this.registerDb=registerDataBase;
        if(this.registerDb){
            BDActualizacion("CREATE TABLE IF NOT EXISTS APP_GPS_REGISTRO(ID INTEGER PRIMARY KEY AUTOINCREMENT,ESTADO CHAR(1) not null,LATITUD float8,LONGITUD float8,PRECISION float8,SENTENCIA TEXT)");
        }
    }

    /**obtener valores de objeto posicion,retorno un diccionario**/
    objectGPS.prototype.getValuesFromPosition= function(show,flag,position){
        var coordenates={'latitude':position.coords.latitude,
                    'longitude':position.coords.longitude,
                    'accuracy':position.coords.accuracy,
                    'altitudeAccuracy':position.coords.altitudeAccuracy,
                    'heading':position.coords.heading,
                    'speed':position.coords.speed,
                    'timestamp':position.coords.timestamp,
                    'flag':flag
                };
        if(show){
            alert('Latitude: '          + position.coords.latitude          + '\n' +
                          'Longitude: '         + position.coords.longitude         + '\n' +
                          'Altitude: '          + position.coords.altitude          + '\n' +
                          'Accuracy: '          + position.coords.accuracy          + '\n' +
                          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                          'Heading: '           + position.coords.heading           + '\n' +
                          'Speed: '             + position.coords.speed             + '\n' +
                          'Timestamp: '         + position.timestamp                + '\n'+
                          'Flag: '         + flag                + '\n');
            }
        return coordenates;
    }

    /**obtener las coordenadas ,busqueda por precion alta caso contrario precion baja**/
    objectGPS.prototype.getCoordenates=function(callbackWithValues,callbackError,showAlert,updateSQL){
        var show=showAlert|| false;
        var updateSQLSentence=updateSQL|| null;
        var self=this;
        var exitError=function(error){
                        if(show){
                            alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
                        }
                        callbackError(error);
                    };
        this.executeGPSSearch(self,show,callbackWithValues,
                function(error) {
                    self.executeGPSSearch(self,show,callbackWithValues,exitError,{},true,updateSQLSentence);
                },{enableHighAccuracy:true,timeout:TIMEOUT_SEARCH},false,updateSQLSentence);
    }
    
    /**ejecucino de metodos para obtener las coordenadas**/
    objectGPS.prototype.executeGPSSearch=function(self,show,callbackWithValues,callbackError,options,flag,updateSQLSentence){
        var coordenates={};
        navigator.geolocation.getCurrentPosition(
                function(position) {
                    coordenates=self.getValuesFromPosition(show,flag,position);
                    if (self.registerDb){
                        BDActualizacionObjWithCallback("INSERT INTO APP_GPS_REGISTRO(ESTADO,LATITUD,LONGITUD,PRECISION,SENTENCIA)VALUES(?,?,?,?,?)",['P',coordenates["latitude"],coordenates["longitude"],coordenates["accuracy"],updateSQLSentence],
                        function(tx,results){
                        });                    
                    }
                    callbackWithValues(coordenates);
                },callbackError,options);
        }

    /**mostrar coordenadas mendiante un alert**/
    objectGPS.prototype.showCoordenates=function(){
        this.getCoordenates(function(coordenates){

        },function(error) {

        },true,null);
    }

    /**verifica si el gps esta activo**/
    objectGPS.prototype.isGpsActive=function(){
        var value=false;
        cordova.plugins.diagnostic.isLocationEnabled(
            function(enabled){
                value=enabled;            
            }, 
            function(error){
                value=false;
            }); 
        return value;
    }

    /**ejecuta si y solo si .el gps esta activo**/
    objectGPS.prototype.continueGps=function(callbackIfTrue,callbackIfFalse){
        var pass=false;
        cordova.plugins.diagnostic.isLocationEnabled(
            function(enabled){
                pass=enabled;
                if (!enabled){
                    alert("Active el GPS.Para continuar.");
                    cordova.exec(function(){
                    },function(errx){alert(errx);} ,'GpsService', 'on',[{}]);  
                    callbackIfFalse();
                    return false;  
                }
                if (enabled){
                    cordova.exec(function(providerEnabled){
                    pass=providerEnabled["value"];
                        if (!pass){
                            alert("Configure el método de  localización como 'SOLO GPS'.");
                            cordova.exec(function(){},function(errx){alert(errx);} ,'GpsService', 'on',[{}]);  
                            callbackIfFalse();
                            return false;  
                        }
                    },function(errx){alert(errx);} ,'GpsService', 'provider_enabled',[{}]);  
                }
                callbackIfTrue();
                return true;
            },
            function(error){
                alert(error);
                pass=false;
            });
        return pass;
    }

   function updateGPSinObjects(){
        var COLUMNS=["ID","ESTADO","LATITUD","LONGITUD","PRECISION"];
         var db = window.openDatabase(DATABASE_NAME, DATABASE_VERSION, DATABASE_DESCRIPTION, DATABASE_SIZE);
         db.transaction(function(tx){
            tx.executeSql("SELECT ID,ESTADO,LATITUD,LONGITUD,PRECISION,SENTENCIA FROM APP_GPS_REGISTRO WHERE ESTADO='P' AND SENTENCIA IS NOT NULL", [], function(tx,results){
                for (var i=0; i< results.rows.length; i++) {
                    var row=results.rows.item(i);
                    var sql=row["SENTENCIA"];
                    var ACTIVE_ID=row["ID"];
                    for (objValue in COLUMNS){
                        var FIELD_REPLACE="{"+COLUMNS[objValue]+"}";
                        var VALUE_REPLACE=row[COLUMNS[objValue]];
                        while (sql.indexOf(FIELD_REPLACE)!== -1){
                           sql=sql.replace(FIELD_REPLACE,VALUE_REPLACE);
                        }                        
                    }
                    tx.executeSql(sql,[],function(tx,results){
                        tx.executeSql("UPDATE APP_GPS_REGISTRO set ESTADO=? WHERE ID=?", ['F',ACTIVE_ID]);
                    });                    
                }

         });
        },function(error){
            alert(error);
        });
    }

