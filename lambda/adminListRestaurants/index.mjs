import mysql from 'mysql'

export const handler = async (event) => {
    var pool = mysql.createPool({
        host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
        user: "cs3733",
        password: "database720$",
        database: "Tables4u"
    });

    //replace this with the new function for the adminDeleteRestaurant lambda function.
    let deleteRestaurant = (res_id, username, password) => {
        return new Promise((resolve,reject) => {
            if (username == "admin" && password == "password") {
                pool.query("DELETE FROM All_Restaraunts WHERE res_UUID = ?", 
                [ res_id, username, password], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows);
                })
            }  
        })
    }

    const ans = await deleteRestaurant(event.res_UUID, event.username, event.password)

    // this is what is returned to client
    const response = {
        statusCode: 200,
        result: {
            "res_UUID" : event.res_UUID
        }
    }

    //need to figure out how to return the table to the front-end. 
    //Could create another functionality to this lambda function?

    pool.end()      // close DB connections
    return response;
}