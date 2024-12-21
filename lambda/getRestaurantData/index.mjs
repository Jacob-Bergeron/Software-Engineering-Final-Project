import mysql from "mysql";

export const handler = async (event) => {
  

  let getRestaurantData = (res_UUID) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM All_Restaurants WHERE res_UUID = ?",
        [res_UUID],
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
    const ans = await getRestaurantData(event.res_UUID);
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
   
  pool.end(); // close DB connections

  return response;
};
