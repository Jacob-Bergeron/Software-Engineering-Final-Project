import mysql from 'mysql'

export const handler = async (event) => {
    var pool = mysql.createPool({
        host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
        user: "cs3733",
        password: "database720$",
        database: "Tables4u",
        dateStrings: true
    });

    // What do I want returned from this?
    // Need the time, table_id, and number of seats at the table

    let getAvailableTimes = (restaurantName, date) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT t.date, t.timeStart, t.table_UUID, t.numSeats FROM All_Restaurants r JOIN TableInfo t ON r.res_UUID = t.res_UUID   WHERE r.restaurantName = ? AND t.date = ? AND t.isBooked = 0 ORDER BY t.timeStart",
            [restaurantName, date],(error,rows) =>{
                if(error) {return reject(error);}
                else{return resolve(rows);}
            });
        });
    };

    const ans = await getAvailableTimes(event.restaurantName, event.date)

    let response;
    try{
        const ans = await getAvailableTimes(event.restaurantName, event.date)
        response = {
            statusCode: 200,
            result: {
                body: ans
            }
        }
    } catch (error) {
        response = {
            statusCode : 400,
            error : error.message
        };
    } finally {
        pool.end()      // close DB connections
    }

    return response;
    
}