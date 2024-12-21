import mysql from 'mysql'

export const handler = async (event) => {
   

    // Problem description: For a specific day, a consumer can see which restaurants have an
    // available table for a given time (day and time must be in future)

    // Requirements: 
    // Restaurant needs to be active
    // Restaurant needs to have at least 1 open table for the given date and time

    // Return:
    // Return the name of the restaurant(s) with at least one available table at the given date and time 

    let getActiveAndOpenRestaurants = (date) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT DISTINCT r.restaurantName, r.address FROM All_Restaurants r JOIN TableInfo t ON t.res_UUID = r.res_UUID LEFT JOIN Restaurant_Calendar c ON c.res_UUID = r.res_UUID AND c.date = ? WHERE c.date IS NULL AND r.isActive = 1 ",
            [date],(error,rows) =>{
                if(error) {return reject(error);}
                else{return resolve(rows);}
            });
        });
    };

    let findPotentialReservation = (date,time)=>{
        return new Promise((resolve, reject) => {
            pool.query("SELECT a.consumer_UUID, a.email, a.resName, a.table_UUID, a.date, a.bookingTime, a.numGuests FROM Consumer_Accounts a LEFT JOIN All_Restaurants r ON r.restaurantName = a.resName WHERE date = ? AND bookingTime = ?",
            [date,time],(error,rows) =>{
                if(error) {return reject(error);}
                else{return resolve(rows);}
            });
        });
    }


    let response;

    try{
        const ans = await getActiveAndOpenRestaurants(event.date)
        const res = await findPotentialReservation(event.date, event.time)
        // this is what is returned to client
        response = {
            statusCode: 200,
            result: {
                body:ans,
                reservations: res
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