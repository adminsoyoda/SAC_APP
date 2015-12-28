

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