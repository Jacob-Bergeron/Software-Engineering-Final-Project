import mysql from "mysql";

export const handler = async (event) => {
  

  let editRestaurant = (openTime, closeTime, id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "UPDATE All_Restaurants SET openTime = ?, closeTime = ? WHERE res_UUID = ?",
        [openTime, closeTime, id],
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
    const changes = await editRestaurant(event.openTime, event.closeTime, event.res_UUID);
    response = {
      statusCode: 200,
      result: {
          "res_UUID" : event.res_UUID
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

}
