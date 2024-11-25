import mysql from 'mysql'


export const handler = async (event) => {
    var pool = mysql.createPool({
        host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
        user: "cs3733",
        password: "database720$",
        database: "Tables4u"
    });


    let activateRestaurant = (res_UUID) => {
      return new Promise((resolve, reject) => {
          pool.query(
            "UPDATE All_Restaurants SET isActive = 1 WHERE res_UUID = ?",
            [res_UUID],
            (error, rows) => {
              if (error) {
                return reject(error);
              }
              return resolve(rows);
            }
          );
        });
  }


  let response; 
    // this is what is returned to client
    try{
        const activated = await activateRestaurant(event.res_UUID)
        response = {
            statusCode: 200,
            "message" : "successfully activated"
        };
    } catch(error){
        response ={
            statusCode : 400,
            message : "Internal Error",
            error : error.message
        };
    }

    pool.end()      // close DB connections
    return response;
}