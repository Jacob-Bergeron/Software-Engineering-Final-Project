import mysql from "mysql";

export const handler = async (event) => {
  var pool = mysql.createPool({
    host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
    user: "cs3733",
    password: "database720$",
    database: "Tables4u",
  });


  let findReservation = (email, sixDigitCode) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM Consumer_Accounts WHERE email = ? AND sixDigitCode = ?", 
        [email, sixDigitCode],
        (error, rows) => {
          if (error) {
            return reject(error);
          }
          return resolve(rows);
        }
      );
    });
  }


const credentials = await findReservation(event.email,event.sixDigitCode)
  
let response;
try {
  response = {
    statusCode: 200,
    result: {
        body : credentials
    },
  };
} catch(error)  {
  response = {
    statusCode: 400,
    message:"Could not retieve contents",
  }
}


  pool.end(); // close DB connections

  return response;
};