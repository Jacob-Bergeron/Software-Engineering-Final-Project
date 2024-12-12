import mysql from 'mysql'


export const handler = async (event) => {
    var pool = mysql.createPool({
        host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
        user: "cs3733",
        password: "database720$",
        database: "Tables4u"
    });


    let deleteTable = (table_UUID) => {
      return new Promise((resolve, reject) => {
          pool.query(
            "DELETE FROM TableInfo WHERE table_UUID = ?",
            [table_UUID],
            (error, rows) => {
              if (error) {
                return reject(error);
              }
              return resolve(rows);
            }
          );
        });
  }


  let response; 
    // this is what is returned to client
    try{
        const deleted = await deleteTable(event.table_UUID)
        response = {
            statusCode: 200,
            "message" : "successfully deleted"
        };
    } catch(error){
        response ={
            statusCode : 400,
            message : "Internal Error",
            error : error.message
        };
    }

    pool.end()      // close DB connections
    return response;
}