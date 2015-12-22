
var vars_position={};
           
 function getLocation(){
       if (navigator.geolocation){
                navigator.geolocation.getCurrentPosition(showPosition);
       }
       return null;
    }

        function showPosition(position)
        {
            alert("Latitude: " + position.coords.latitude);
            alert("Longitude: " + position.coords.longitude);           
        }

var onSuccess = function(position) {
    vars_position={'latitude: '          : position.coords.latitude,
          'longitude'         : position.coords.longitude         ,
          'altitude'          : position.coords.altitude          ,
          'accuracy'          : position.coords.accuracy         ,
          'altitude Accuracy' : position.coords.altitudeAccuracy  ,
          'heading'           : position.coords.heading          ,
          'speed'             : position.coords.speed             ,
          'timestamp'         : new Date(position.timestamp)     };
};

function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}



    function getVarsLocation(){
       navigator.geolocation.getCurrentPosition(onSuccess, onError);
       return vars_position;
    }

     