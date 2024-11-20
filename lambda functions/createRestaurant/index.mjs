import mysql from 'mysql'

export const handler = async (event) => {
    var pool = mysql.createPool({
        host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
        user: "c3733",
        password: "database720$",
        database: "Tables4u"
    });


    let createRestaurant = () => {
        return new Promise((resolve, reject) => {
            pool.query(, [], (error, value) => {
                if (error) { return reject(error); }
                // turns into array containing single value [ { num: 13 } ]
                let output = JSON.parse(JSON.stringify(value))
                
                // return first entry and grab its 'num' attribute
                return resolve(output[0].num);
            })
        })
    }
    
}