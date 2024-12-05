import mysql from 'mysql'

export const handler = async (event) => {
    var pool = mysql.createPool({
        host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
        user: "cs3733",
        password: "database720$",
        database: "Tables4u"
    });

    let deleteAccount = (email) => {
        return new Promise((resolve,reject) => {
                pool.query("DELETE FROM Consumer_Accounts WHERE email = ?", 
                [email], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows);
                })
        })
    }

    
    // this is what is returned to client
    try {
        const ans = await deleteAccount(event.email)
        const response = {
        statusCode: 200,
        result: {
            "email" : event.email
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