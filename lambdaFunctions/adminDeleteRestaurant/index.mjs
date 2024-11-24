import mysql from 'mysql'

export const handler = async (event) => {
    var pool = mysql.createPool({
        host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
        user: "cs3733",
        password: "database720$",
        database: "Tables4u"
    });

    //replace this with the function which lists all restaurants.
    let listAllRestaurants = () => {
        return new Promise((resolve,reject) => {
            pool.query("SELECT * FROM All_Restaurants", (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }

    const ans = await listAllRestaurants(event.username)

    // this is what is returned to client

    try {
        const restaurants = await listAllRestaurants();
        const response = {
            statusCode : 200,
            result : restaurants
        };
    } catch (error) {
        const response = {
            statusCode : 400,
            message : "Internal Error", //replace with desired error message.
            error : error.message
        };
    }
    pool.end();
    return response;
}