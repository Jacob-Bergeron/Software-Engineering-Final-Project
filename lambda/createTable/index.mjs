import mysql from "mysql";

export const handler = async (event) => {
  var pool = mysql.createPool({
    host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
    user: "cs3733",
    password: "database720$",
    database: "Tables4u",
  });

  let createTable = (res_UUID,table_UUID,tableNumber,numSeats) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO TableInfo(res_UUID,table_UUID,tableNumber,numSeats) VALUES (?, ?, ?, ?)",
        [res_UUID,table_UUID,tableNumber,numSeats],
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
    const ans = await createTable(event.res_UUID, event.table_UUID, event.tableNumber, event.numSeats);
    response = {
      statusCode: 200,
      result: {
          "res_UUID" : event.res_UUID,
          "table_UUID" : event.table_UUID,
          "tableNumber" : event.tableNumber,
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
