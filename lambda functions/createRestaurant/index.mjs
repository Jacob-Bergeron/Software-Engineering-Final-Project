import mysql from 'mysql'

export const handler = async (event) => {
    var pool = mysql.createPool({
        host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
        user: "c3733",
        password: "database720$",
        database: "Tables4u"
    });


    let createRestaurant = (id, name, address) => {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO All_Restaurants (id, name, address) VALUES (?, ?, ?) ", 
                [id, name, address], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }
    

    const res = await createRestaurant();

    const response = {
        statusCode: 200,
        result: {
            "name" : re
        }
    }

    pool.end()      // close DB connections

    return response;
}