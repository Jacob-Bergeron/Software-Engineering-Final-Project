import mysql from 'mysql'

export const handler = async (event) => {
    var pool = mysql.createPool({
        host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
        user: "cs3733",
        password: "database720$",
        database: "Tables4u"
    });

    //replace this with the new function for the adminDeleteRestaurant lambda function.
    let listAllRestaurants = () => {
        return new Promise((resolve,reject) => {
            pool.query("SELECT * FROM All_Restaurants", (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

    let response; //define response outside of the try-catch

    try {
        const data = await listAllRestaurants();    //retrieve al data in the table.
        response = {
            statusCode : 200,
            result : data
        };
    } catch (error) {
        response = {
            statusCode : 400,
            message : "Internal Error",
            error : error.message
        };
    } finally {
        pool.end(); //terminate database connection
    }

    return response;
}
