import mysql from 'mysql';

export const handler = async (event) => {
    

    const getClosedDates = (res_UUID) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM Restaurant_Calendar WHERE res_UUID = ? AND isClosed = 1", [res_UUID], (error, rows) => {
                if (error) {
                    return reject(error);
                }
                return resolve(rows);
            });
        });
    };

    try {
        const closedDays = await getClosedDates(event.res_UUID);
        const response = {
            statusCode: 200,
            body: JSON.stringify(closedDays) 
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