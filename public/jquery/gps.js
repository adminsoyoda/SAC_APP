

    function objectGPS(){

    }

    objectGPS.prototype.getCoordenates=function(callbackWithValues,callbackError,showAlert){
        var show=showAlert|| false;
        var self=this;
        var coordenates={};
        navigator.geolocation.getCurrentPosition(
                function(position) {
                    coordenates={'latitude':position.coords.latitude,
                    'longitude':position.coords.longitude,
                    'latitude':position.coords.latitude,
                    'accuracy':position.coords.accuracy,
                    'altitudeAccuracy':position.coords.altitudeAccuracy,
                    'heading':position.coords.heading,
                    'speed':position.coords.speed,
                    'timestamp':position.coords.timestamp};
                    if(show){
                        alert('Latitude: '          + position.coords.latitude          + '\n' +
                          'Longitude: '         + position.coords.longitude         + '\n' +
                          'Altitude: '          + position.coords.altitude          + '\n' +
                          'Accuracy: '          + position.coords.accuracy          + '\n' +
                          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                          'Heading: '           + position.coords.heading           + '\n' +
                          'Speed: '             + position.coords.speed             + '\n' +
                          'Timestamp: '         + position.timestamp                + '\n');
                    }
                    callbackWithValues(coordenates);
                },
                function(error) {
                    if(show){
                        alert('code: '    + error.code    + '\n' +
                          'message: ' + error.message + '\n');
                    }
                    callbackError(error);
                });
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
     
    objectGPS.prototype.continueGps=function(callbackIfTrue,callbackIfFalse){
        var pass=false;
        var errorPass=false;
        alert(1);
        while (!pass) {
            alert(2);
            cordova.plugins.diagnostic.isLocationEnabled(
                function(enabled){
                    alert(enabled);
                    pass=enabled;
                    if (!enabled){
                        alert("Active el GPS.Para continuar");
                        cordova.exec(
                        function(){

                        },
                        function(errx){
                        alert(errx);
                        } ,'GpsService', 'on',[{}]);    
                        pass=true;
                    } 
                },
                function(error){
                    alert(error);
                    pass=true;
                    errorPass=true;
                });
        }
        if (errorPass){
            return false;
        }
        if (pass){
            callbackIfTrue();
        }else{
            callbackIfFalse();
        }
        return true;
    }