import mysql from 'mysql'

export const handler = async (event) => {


    let deleteRestaurant = (res_id) => {
        return new Promise((resolve,reject) => {
                pool.query("DELETE FROM All_Restaurants WHERE res_UUID = ?", 
                [ res_id], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows);
                })
        })
    }

    let deleteManager = (res_id) => {
        return new Promise((resolve,reject) => {
            pool.query("DELETE FROM Manager_Accounts WHERE res_UUID = ?",
                [ res_id], (error,rows) => {
                    if(error) {return reject(error);}
                    return resolve(rows);
                })
        })
    }

    
    // this is what is returned to client
    try {
        const ans = await deleteRestaurant(event.res_UUID)
        const a = await deleteManager(event.res_UUID)
        const response = {
        statusCode: 200,
        result: {
            "res_UUID" : event.res_UUID
        }}
        return response;
    } catch (error) {
        const response = {
            statusCode: 400,
            message: "Internal Error",
            error: error.message
        }
        return response;
    } finally {
        pool.end()
    }
}