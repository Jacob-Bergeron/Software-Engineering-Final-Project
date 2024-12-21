import mysql from 'mysql'

export const handler = async (event) => {
    

    let deleteAccount = (email, sixDigitCode) => {
        return new Promise((resolve,reject) => {
                pool.query("DELETE FROM Consumer_Accounts WHERE email = ? AND sixDigitCode = ?", 
                [email, sixDigitCode], (error, rows) => {
                    if (error) { return reject(error); }
                    return resolve(rows);
                })
        })
    }

    
    // this is what is returned to client
    try {
        const ans = await deleteAccount(event.email, event.sixDigitCode)
        const response = {
        statusCode: 200,
        result: {
            "email" : event.email,
            "sixDigitCode" : event.sixDigitCode
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