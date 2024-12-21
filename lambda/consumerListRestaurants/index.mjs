import mysql from 'mysql';

export const handler = async (event) => {
    

    // Function to fetch active restaurants
    let getActiveRestaurants = () => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM All_Restaurants WHERE isActive=1", (error, rows) => {
                if (error) {
                    return reject(error); // Reject if there is a MySQL error
                } else {
                    return resolve(rows); // Resolve with the data from the query
                }
            });
        });
    };

    let response = {}; // Initialize response variable

    try {
        // Fetch the list of active restaurants from the database
        const activeRestaurants = await getActiveRestaurants();
        
        // If we get results from the database, return them
        response = {
            statusCode: 200,
            body: JSON.stringify({
                result: activeRestaurants, // Send the results of the query
            }),
        };

    } catch (error) {
        // Handle errors if the query fails
        response = {
            statusCode: 400,
            body: JSON.stringify({
                message: "Failed to fetch active restaurants",
                error: error.message, // Send the error message if something goes wrong
            }),
        };
    }

    // Close the database connection pool
    pool.end();

    return response;  // Return the response object
};