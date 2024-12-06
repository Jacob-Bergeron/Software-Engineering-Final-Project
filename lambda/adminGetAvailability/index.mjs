import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
        user: "cs3733",
        password: "database720$",
        database: "Tables4u"
    });

    const adminGetAvailability = (res_id) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM TableInfo WHERE res_UUID = ?", [res_id], (error, rows) => {
                if (error) {
                    return reject(error);
                }
                return resolve(rows);
            });
        });
    };

    try {
        const availabilityData = await adminGetAvailability(event.res_id);
        const response = {
            statusCode: 200,
            body: availabilityData
        };
        return response;
    } catch (error) {
        const response = {
            statusCode: 400,
            message: "Internal Error",
            error: error.message
        };
        return response;
    } finally {
        pool.end();
    }
};