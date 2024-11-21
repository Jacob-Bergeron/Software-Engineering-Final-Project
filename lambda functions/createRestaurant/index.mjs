import mysql from 'mysql'

export const handler = async (event) => {
    var pool = mysql.createPool({
        host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
        user: "cs3733",
        password: "database720$",
        database: "Tables4u"
    });


    // async function
    let createRestaurant = (id, name, address) => {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO All_Restaurants (id, name, address) VALUES (?, ?, ?) ", 
                [id, name, address], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }
    
    // need to create authentication on client or server?

    const res = await createRestaurant(event.id, event.name, event.address);

    // this is what is returned to client
    const response = {
        statusCode: 200,
        result: {
            "id" : event.id,
            "name" : event.name,
            "address" : event.address
        }
    }

    pool.end()      // close DB connections

    return response;
}