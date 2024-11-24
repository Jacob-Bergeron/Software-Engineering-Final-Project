import mysql from 'mysql'

export const handler = async (event) => {
    var pool = mysql.createPool({
        host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
        user: "cs3733",
        password: "database720$",
        database: "Tables4u"
    });

    let getActiveRestaurants = () => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM All_Restaurants WHERE isActive=1",[],(error,rows) =>{
                if(error) {return reject(error);}
                else{return resolve(rows);}
            });
        });
    };

    // this is what is returned to client
    const response ={
        statusCode: 200,
        result: {
            "res_UUID" : event.res_UUID,
            "restaurantName" : event.restaurantName,
            "address" : event.address,
            "isActive" : event.isActive,
            "openTime" : event.openTime,
            "closeTime" : event.closeTime
        }
    }
    pool.end()      // close DB connections

    return response;
    
}
