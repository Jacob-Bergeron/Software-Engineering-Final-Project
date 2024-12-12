import mysql from "mysql";

export const handler = async (event) => {
  var pool = mysql.createPool({
    host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
    user: "cs3733",
    password: "database720$",
    database: "Tables4u",
  });

  let getConsumerData = (email) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM Consumer_Accounts WHERE email = ?",
        [email],
        (error, rows) => {
          if (error) {
            return reject(error);
          }
          return resolve(rows);
        }
      );
    });
  };
  
  let response;
  try {
    const ans = await getConsumerData(event.email)
    response = {
      statusCode: 200,
      result: {
          body : ans
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
