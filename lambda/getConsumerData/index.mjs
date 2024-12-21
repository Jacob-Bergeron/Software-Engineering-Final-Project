import mysql from "mysql";

export const handler = async (event) => {
 

  let getCorrespondingRestaurant = (username) => {
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

  const ans = await getCorrespondingRestaurant(event.username);

  // this is what is returned to client
  const response = {
    statusCode: 200,
    result: {
      body: ans 
    },
  };

  pool.end(); // close DB connections

  return response;
};
