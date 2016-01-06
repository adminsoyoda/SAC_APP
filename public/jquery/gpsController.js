	BDActualizacion("CREATE TABLE IF NOT EXISTS orden_venta(ID INTEGER PRIMARY KEY AUTOINCREMENT,DESCRIPCION TEXT,LATITUD float8,LONGITUD float8,PRECISION float8)");
	BDActualizacion("CREATE TABLE IF NOT EXISTS APP_GPS_REGISTRO(ID INTEGER PRIMARY KEY AUTOINCREMENT,ESTADO CHAR(1) not null,LATITUD float8,LONGITUD float8,PRECISION float8,SENTENCIA TEXT)");
	
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

    var objGps=new objectGPS(true);

    /*var onBeforeUnload = function(event) {
    	event.stopPropagation();
        alert("No puede cerrar la aplicacion hasta que los trabajos terminen!!");          
        return false;     
    };

    setInterval(function(){  
    	var onbeforeunloadFunction=null;
    	if (objGps.getStatusRecords()!=0) {
    		onbeforeunloadFunction=onBeforeUnload;        
     	}
     	window.onbeforeunload=onbeforeunloadFunction;     	
    }, 500);*/
