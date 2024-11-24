import mysql from 'mysql'

export const handler = async (event) => {
    var pool = mysql.createPool({
        host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
        user: "cs3733",
        password: "database720$",
        database: "Tables4u"
    });


    let activeRestaurant = () => {
        
    }

    // this is what is returned to client
    const response = {
        statusCode: 200,
        result: {
            
        }
    }

    pool.end()      // close DB connections

    return response;
}