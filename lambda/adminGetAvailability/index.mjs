let deleteRestaurant = (res_id, username, password) => {
    return new Promise((resolve, reject) => {
        if (username == "admin" && password == "password") {
            pool.query("SELECT table_UUID FROM TableInfo WHERE res_UUID = ?", 
            [ res_id, username, password], (error, rows) => {
                if (error) { 
                    return reject(error); 
                }
                
                // If the first query is successful, execute the second query
                pool.query("SELECT * FROM AvailabilityInfo WHERE table_UUID = ?", 
                [ res_id ], (error, result) => {
                    if (error) { 
                        return reject(error); 
                    }
                    
                    // Resolve with the result of the second query
                    return resolve(result);
                });
            });
        } else {
            return reject(new Error("unauthorized user"));
        }
    });
}