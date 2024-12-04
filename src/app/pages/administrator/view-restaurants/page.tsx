'use client'; // This is necessary to use React hooks in Next.js 13 (for client-side rendering)

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import './styles.css';

// Axios instance for API requests
const instance = axios.create({
    baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/',
    timeout: 5000, //optional: establish a timeout for requests.
    //headers: {
    //    'x_api_key:' : 'XZERw16yF64AQcuycqQlP3VjcKgmRJpe4QOVjbvH'
    //}
});

export default function adminViewRestaurants() {
    const [restaurants, setRestaurants] = useState<any[]>([]);  // State to hold restaurant data
    const [error, setError] = useState<string>('');  // State to hold any error messages
    const [redraw, forceRedraw] = React.useState(0)


    const andRefreshDisplay = () => {
        forceRedraw(redraw + 1)
    }

    const adminUsername = 'admin';
    const adminPassword = 'password';

    // Function to fetch active restaurants
    const listAll = async () => { //deleted async so I can try something
        try {
            // Send a GET request to the API to fetch active restaurants
            
            const response = await instance.get('/adminListRestaurants');
            console.log(response.data);
                
            // Check if there is a body and parse it if necessary
            let resultData;
            if (response.status === 200 && response.data.body) {
                const body = JSON.parse(response.data.body); // Parse the body if it's a string
                resultData = body.result;
            } else {
                resultData = response.data.result; // Fallback if the structure is different
            }
    
            if (resultData && resultData.length > 0) {
                setRestaurants(resultData); // Store the restaurant data in state
            } else {
                setError('No restaurants found');
            }
        } catch (err) {
            // Handle and log network errors
            if (axios.isAxiosError(err)) {
                setError(`Axios error: ${err.message}`);
                console.error("Axios Error:", err.message);
                console.error("Error Response:", err.response);
                console.error("Error Request:", err.request);
            } else {
                setError('Unexpected error occurred');
                console.error("Unexpected Error:", err);
            }
        }
    };

    // Function to delete restaurants [admin]
    const deleteRestaurant = async (res_UUID: string) => {
        try {
            const response = await instance.post('/adminDeleteRestaurant', {
                res_UUID
            });
            if (response.status === 200) {
                setRestaurants((prevRestaurants) =>
                    prevRestaurants.filter(restaurant => restaurant.res_UUID !== res_UUID)
                );
                alert("Restaurant deleted.")
                andRefreshDisplay()
            } else {
                setError("Restaurant deletion failed!");
                alert("Restaurant deletion failed!");
            }
        } catch (err) {
            // Handle and log network errors
            if (axios.isAxiosError(err)) {
                setError(`Axios error: ${err.message}`);
                console.error("Axios Error:", err.message);
                console.error("Error Response:", err.response);
                console.error("Error Request:", err.request);
            } else {
                setError('Unexpected error occurred');
                console.error("Unexpected Error:", err);
            }
        }
    }
    


    // Use useEffect to fetch data when the component mounts
    useEffect(() => {
        listAll();
    }, []);  // Empty dependency array means this runs only once after the first render
    return (
        <div>
            <div className = "back-button-format">
                    <Link href="/pages/administrator/homepage" className="back-button">Back</Link>
            </div>
            <div className="browserestaurants">
            
                <div className="listAll">
                <div className="adminHeader">Restaurants</div>
                    {error && <p>{error}</p>} {/* Show error message if there was an issue */}
                    {restaurants.length > 0 ? (
                        <ul>
                            {restaurants.map((restaurant) => (
                                <li key={restaurant.res_UUID}>
                                    <h3><strong> Restaurant Name: </strong>{restaurant.restaurantName}</h3>
                                    <p><strong>Address:</strong> {restaurant.address}</p>
                                    <p><strong>Open Time:</strong> {restaurant.openTime}</p>
                                    <p><strong>Close Time:</strong> {restaurant.closeTime}</p>
                                    <p><strong>Active?:</strong> {restaurant.isActive}</p>
                                    
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No restaurants available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}