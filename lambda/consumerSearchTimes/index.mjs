import mysql from 'mysql'

export const handler = async (event) => {
    

    // What do I want returned from this?
    // Need the time, table_id, and number of seats at the table

    // First check to see if restaurant is closed.
    // If open, we assume each table is opened from RESTAURANT from opening time to closing time - 1
    // Second check: look at reservations (aka consumer accounts) and only display times where 
    // there is NOT a reservation


    let checkIfClosed = (restaurantName, date) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Restaurant_Calendar WHERE res_UUID = ? AND date = ?",
            [restaurantName, date],(error,rows) =>{
                if(error) {return reject(error);}
                else{return resolve(rows);}
            });
        });
    };

    let getTables = (restaurantName) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT t.tableNumber, t.numSeats FROM TableInfo t JOIN All_Restaurants r ON r.res_UUID = t.res_UUID WHERE restaurantName = ? ORDER BY t.tableNumber",
            [restaurantName],(error,rows) =>{
                if(error) {return reject(error);}
                else{return resolve(rows);}
            });
        });
    };


    let findPotentialReservation = (resName,date,time)=>{
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Consumer_Accounts WHERE resName = ? AND date = ? AND bookingTime = ?",
            [resName,date,time],(error,rows) =>{
                if(error) {return reject(error);}
                else{return resolve(rows);}
            });
        });
    }



    const resCalendarValues = await checkIfClosed(event.resName, event.date)

    let response;

    // if Restaurant is closed on the given day
    if(resCalendarValues.length > 0){
        response = {
            statusCode: 400, 
            message: "Restaurant is closed today"
        }
    } 
     // ELSE check the reservations to see 
    else {
        try{
            const ans = await findPotentialReservation(event.resName, event.date, event.time)
            const tables = await getTables(event.resName)
            response = {
                statusCode: 200,
                result: {
                    reservations: ans,
                    returnedTables: tables
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
     }

    return response;
}