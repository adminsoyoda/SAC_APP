

           
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


    function getVarsLocation(){
       var vars={};
       if (navigator.geolocation){
          navigator.geolocation.getCurrentPosition(function(position){
            vars["latitude"]=position.coords.latitude;
            vars["longitude"]=position.coords.longitude;  
          });
       }
       return vars;
    }