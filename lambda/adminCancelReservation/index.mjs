import mysql from 'mysql'

export const handler = async (event) => {
    

    // Restaurant needs to be active
    // Restaurant needs to have open tables
    // Table need to be availble at given time 
    // Table needs to be able to hold at least given amount of people

    let getAvailableRestaurants = (date, time, numPeople) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT r.res_UUID, r.restaurantName, t.table_UUID, t.date FROM All_Restaurants r JOIN TableInfo t ON r.res_UUID = t.res_UUID WHERE r.isActive = 1 AND t.date = ? AND t.timeStart = ? AND t.isBooked = 0 AND t.numSeats >= ?",
            [date,time,numPeople ],(error,rows) =>{
                if(error) {return reject(error);}
                else{return resolve(rows);}
            });
        });
    };


    let response;

    try{
        const ans = await getAvailableRestaurants(event.date, event.time, event.numPeople)
        // this is what is returned to client
        response = {
            statusCode: 200,
            result: {
                body:ans
            }
        }
    } catch (error){
        response = {
            statusCode : 400,
            error : error.message
          };
    }
    pool.end()      // close DB connections

    return response;
    
}