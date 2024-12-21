import mysql from "mysql";

export const handler = async (event) => {
  


  let loginManager = (username, password) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM Manager_Accounts WHERE username = ? AND password = ?", 
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


  const credentials = await loginManager(event.username,event.password)
  
let response;
try {
  response = {
    statusCode: 200,
    result: {
        body : credentials
    },
  };
} catch(error)  {
  response = {
    statusCode: 400,
    message:"Could not retieve contents",
  }
}


  pool.end(); // close DB connections

  return response;
};