import mysql from "mysql";

export const handler = async (event) => {
  


  // Do we just delete the row when we reopen a specific day? 
  let openDay = (res_UUID, date) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "DELETE FROM Restaurant_Calendar WHERE res_UUID = ? AND date = ? AND isClosed = 1",
        [res_UUID, date],
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
    const ans = await openDay(event.res_UUID, event.date);

    // Potential Errors:
    // Nothing for the query to delete when it tries
    if (ans.affectedRows == 0){
      response = {
        statusCode: 400,
        "message" : "Restaurant is not closed on given day"
      }
    }
    else {
      response = {
        statusCode: 200,
        result: {
            body : ans
        },
      };
    }
  } 
  
  catch {
    response = {
      statusCode: 400, 
      error: error.message
    }
  }

  pool.end(); // close DB connections

  return response;
};