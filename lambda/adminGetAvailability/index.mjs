import mysql from 'mysql';

export const handler = async (event) => {
    const pool = mysql.createPool({
        host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
        user: "cs3733",
        password: "database720$",
        database: "Tables4u"
    });

    const adminGetAvailability = async (res_UUID) => {
        try {
            // First query
            const tableInfo = await new Promise((resolve, reject) => {
                pool.query("SELECT * FROM TableInfo WHERE res_UUID = ?", [res_UUID], (error, rows) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(rows);
                });
            });

            // Second query
            const calendarInfo = await new Promise((resolve, reject) => {
                pool.query("SELECT date FROM Restaurant_Calendar WHERE res_UUID = ?", [res_UUID], (error, rows) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(rows);
                });
            });

            return { tableInfo, calendarInfo };
        } catch (error) {
            throw error;
        }
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
