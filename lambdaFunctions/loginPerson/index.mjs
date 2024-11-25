import mysql from "mysql";

export const handler = async (event) => {
  var pool = mysql.createPool({
    host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
    user: "cs3733",
    password: "database720$",
    database: "Tables4u",
  });

  const loginManager = (username, password) => {
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
  };

  try {
    // Directly use event.username and event.password
    const { username, password } = event;

    if (!username || !password) {
      throw new Error("Missing username or password");
    }

    const result = await loginManager(username, password);

    // Create response based on the query result
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        success: result.length > 0,
        message: result.length > 0 ? "Login successful" : "Invalid credentials",
      }),
    };

    return response;
  } catch (error) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({
        message: "Internal Error",
        error: error.message,
      }),
    };
    return response;
  } finally {
    pool.end();
  }
};
