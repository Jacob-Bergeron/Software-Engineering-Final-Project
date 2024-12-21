import mysql from "mysql";

export const handler = async (event) => {
  

  let getConsumerData = (email) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM Consumer_Accounts WHERE email = ?",
        [email],
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
  try {
    const ans = await getConsumerData(event.email)
    response = {
      statusCode: 200,
      result: {
          body : ans
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
