import mysql from "mysql";

export const handler = async (event) => {
  

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
