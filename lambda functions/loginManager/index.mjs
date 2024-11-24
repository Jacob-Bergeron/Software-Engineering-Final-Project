import mysql from "mysql";

export const handler = async (event) => {
  var pool = mysql.createPool({
    host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
    user: "cs3733",
    password: "database720$",
    database: "Tables4u",
  });


  let loginManager = (username, password) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT Manager_Accounts WHERE username = ? AND password = ?", 
        [username, password],
        (error, rows) => {
          if (error) {
            return reject(error);
          }
          return resolve(rows);
        }
      );
    });
  }

  let credentials = loginManager(event.username, event.password)


  // this is what is returned to client
  const response = {
    statusCode: 200,
    result: {
        "id" : event.username,
        "openTime" : event.password,
    },
  };

  pool.end(); // close DB connections

  return response;
};
