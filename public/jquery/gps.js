var TIMEOUT_SEARCH=15000;//milisegundos

    function objectGPS(){

    }

    objectGPS.prototype.getValuesFromPosition= function(show,flag,position){
        var coordenates={'latitude':position.coords.latitude,
                    'longitude':position.coords.longitude,
                    'latitude':position.coords.latitude,
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

    objectGPS.prototype.getCoordenates=function(callbackWithValues,callbackError,showAlert){
        var show=showAlert|| false;
        var self=this;
        var exitError=function(error){
                        if(show){
                            alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
                        }
                        callbackError(error);
                    };
        this.__getCoordenates(self,show,callbackWithValues,
                function(error) {
                    self.__getCoordenates(self,show,callbackWithValues,exitError,{},true);
                },{enableHighAccuracy:true,timeout:TIMEOUT_SEARCH},false);
    }
    
    objectGPS.prototype.__getCoordenates=function(self,show,callbackWithValues,callbackError,options,flag){
        var coordenates={};
        navigator.geolocation.getCurrentPosition(
                function(position) {
                    coordenates=self.getValuesFromPosition(show,flag,position);
                    callbackWithValues(coordenates);
                },callbackError,options);
        }

    objectGPS.prototype.showCoordenates=function(){
        this.getCoordenates(function(coordenates){

        },function(error) {

        },true);
    }


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

    function openSettings(enabled,message){
            if(!enabled){
                alert(message);
                cordova.exec(function(){},function(errx){alert(errx);} ,'GpsService', 'on',[{}]);
            }
        }; 

    objectGPS.prototype.continueGps=function(callbackIfTrue,callbackIfFalse){
        var pass=false;
        
        cordova.plugins.diagnostic.isLocationEnabled(
            function(enabled){
                pass=enabled;
                openSettings(enabled,"Active el GPS.Para continuar.";                
                cordova.exec(function(providerEnabled){
                    pass=providerEnabled;
                    openSettings(providerEnabled,"Configure el método de localización como: SOLO GPS");
                },function(errx){alert(errx);} ,'GpsService', 'provider_enabled',[{}]);       
                if (pass){
                    callbackIfTrue();
                }else{
                    callbackIfFalse();
                }         
            },
            function(error){
                alert(error);
                pass=false;
            });
        return pass;
    }