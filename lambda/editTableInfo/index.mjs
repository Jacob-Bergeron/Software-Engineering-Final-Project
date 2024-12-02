import mysql from "mysql";

export const handler = async (event) => {
  var pool = mysql.createPool({
    host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
    user: "cs3733",
    password: "database720$",
    database: "Tables4u",
  });

  let editTableInfo = (table_UUID,numSeats) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "UPDATE TableInfo SET numSeats = ? WHERE table_UUID = ?",
        [table_UUID,numSeats],
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

  // this is what is returned to client
  try{
    const changes = await editTableInfo(event.table_UUID, event.numSeats);
    response = {
      statusCode: 200,
      result: {
        "table_UUID" : event.table_UUID,
        "numSeats" : event.numSeats
          },
    };
  } catch(error){
    response = {
      statusCode : 400,
      message : "Internal Error",
      error : error.message
    };
  }

  pool.end(); // close DB connections

  return response;
};
