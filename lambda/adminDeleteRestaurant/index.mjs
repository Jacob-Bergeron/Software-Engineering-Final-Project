import mysql from 'mysql'

export const handler = async (event) => {
    

    //replace this with the new function for the adminDeleteRestaurant lambda function.
    let deleteRestaurant = (res_id, username, password) => {
        return new Promise((resolve,reject) => {
            if (username == "admin" && password == "password") {
                pool.query("DELETE FROM All_Restaurants WHERE res_UUID = ?", 
                [ res_id, username, password], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows);
                })
            } else {
                return reject(new Error("unauthorized user"));
            }
        })
    }

    let deleteManager = (res_id, username, password) => {
        return new Promise((resolve,reject) => {
            if(username=="admin" && password=="password"){
            pool.query("DELETE FROM Manager_Accounts WHERE res_UUID = ?",
                [ res_id], (error,rows) => {
                    if(error) {return reject(error);}
                    return resolve(rows);
                })
            } else {
                return reject(new Error("unauthorized user"));}
        })
    }

    
    // this is what is returned to client
    try {
        const ans = await deleteRestaurant(event.res_UUID, event.username, event.password)
        const a = await deleteManager(event.res_UUID, event.username, event.password)
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