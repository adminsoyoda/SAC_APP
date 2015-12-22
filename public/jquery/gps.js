  

  function GPS(){
    this.positions={};
    this.state="none";
    this.message="ok";
    }

  GPS.prototype.updateLocationPositions = function() {
    GMaps.geolocate({
            success: function(position) {
              if (position.coords!=null){
                this.positions["latitude"]=position.coords.latitude;
                this.positions["longitude"]=position.coords.longitude;
                this.positions["accuracy"]=position.coords.accuracy;
                this.positions["altitude"]=position.coords.altitude;
                this.positions["altitudeAccuracy"]=position.coords.altitudeAccuracy;
                this.positions["heading"]=position.coords.heading;
              }
            
            },
            error: function(error) {
               this.state="error";
               this.message=error.message;
            },
            not_supported: function() {
               this.state="not_supported";
               this.message="Your browser does not support geolocation";
               this.positions={};
            },
            always: function() {
               this.state="done";
               this.message="ok";
      }
    });
  }


  GPS.prototype.getLocationPositions = function() {
    return this.positions;
  }

 
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
