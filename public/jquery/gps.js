 var values={};

  var wingps=function(position){
      var coords=position.coords;
      values["latitude"]=(coords.latitude); 
      values["altitude"]=(coords.altitude);    
      values["longitude"]=(coords.longitude);      
      alert(values["latitude"]+";"+values["longitude"]+";"+values["altitude"]);
  };

  var failgps=function(e){
      alert(e);
  };



function getgpsvalues(location,CallbackWithValues){
  location.getCurrentPosition(function(position){
    wingps(position);
    Callback(values);
  },failgps); 
    
}
        //  
 
/*var vars_position={};
           
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

function onSuccessGEO(position) {
    vars_position={'latitude'          : position.coords.latitude,
          'longitude'         : position.coords.longitude         ,
          'altitude'          : position.coords.altitude          ,
          'accuracy'          : position.coords.accuracy         ,
          'altitude Accuracy' : position.coords.altitudeAccuracy  ,
          'heading'           : position.coords.heading          ,
          'speed'             : position.coords.speed             ,
          'timestamp'         : new Date(position.timestamp)     };
             alert("Latitude: " + position.coords.latitude);
            alert("Longitude: " + position.coords.longitude);    
}

// onError Callback receives a PositionError object
//
function onErrorGEO(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}



    function getVarsLocation(){
      navigator.geolocation.getCurrentPosition(function(position) {
  onSuccessGEO( position.coords.latitude);
});
      return 1; 
    }*/
