import mysql from 'mysql'

export const handler = async (event) => {
    var pool = mysql.createPool({
        host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
        user: "c3733",
        password: "database720$",
        database: "Tables4u"
    });

    let logi = (auth, id, name, address) => {
        return new Promise((resolve, reject) => {
            pool.query("", 
                [id, name, address], (error, rows) => {
                if (error) { return reject(error); }
                return resolve(rows);
            })
        })
    }
}