import mysql from "mysql";

export const handler = async (event) => {
  var pool = mysql.createPool({
    host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
    user: "cs3733",
    password: "database720$",
    database: "Tables4u",
  });

  
  //! TODO: Pass the restaurant UUID to this method so that the SQL query can find it and add the information
  //! to the correct restaurant

  let editRestaurant = (openTime, closeTime, id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO All_Restaurants (openTime, closeTime) VALUES (?, ?) WHERE res_UUID = (?)", 
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

  const changes = await editRestaurant(event.openTime, event.closeTime,);

  // this is what is returned to client
  const response = {
    statusCode: 200,
    result: {
        "openTime" : event.openTime,
        "closeTime" : event.closeTime
    },
  };

  pool.end(); // close DB connections

  return response;
};
