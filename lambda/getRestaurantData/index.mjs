import mysql from "mysql";

export const handler = async (event) => {
  var pool = mysql.createPool({
    host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
    user: "cs3733",
    password: "database720$",
    database: "Tables4u",
  });

  let getRestaurantUUID = (username) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT res_UUID FROM Manager_Accounts WHERE username = ?",
        [username],
        (error, rows) => {
          if (error) {
            return reject(error);
          }
          return resolve(rows);
        }
      );
    });
  };
<<<<<<< Updated upstream
let response;

  // this is what is returned to client
  try{
    const ans = await getRestaurantData(event.username);
    response = {
      statusCode: 200,
      result: {
        body: ans 
      },
    }
  } catch(error){
    response = {
      statusCode : 400,
      message : "Internal Error",
      error : error.message
    };
  }
   
=======

  const ans = await getRestaurantData(event.username);

  // this is what is returned to client
  const response = {
    statusCode: 200,
    result: {
      body: ans 
    },
  };

>>>>>>> Stashed changes
  pool.end(); // close DB connections

  return response;
};

