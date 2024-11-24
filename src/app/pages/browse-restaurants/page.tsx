'use client'; // This is necessary to use React hooks in Next.js 13 (for client-side rendering)

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

// Axios instance for API requests
const instance = axios.create({
    baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/',
});

export default function BrowserRestaurantsPage() {
    const [restaurants, setRestaurants] = useState<any[]>([]);  // State to hold restaurant data
    const [error, setError] = useState<string>('');  // State to hold any error messages

    // Function to fetch active restaurants
    const listActiveRestaurants = async () => {

        try {
            // Send a GET request to the API to fetch active restaurants
            const response = await instance.get('/consumerListRestaurants'); 
            
            if (response.status === 200 && response.data.result) {
                // Store the restaurant data in state
                setRestaurants(response.data.result);
            } else {
                setError('No active restaurants found');
            }
        } catch (err) {
            // Handle and log network errors
            if (axios.isAxiosError(err)) {
                setError(`Axios error: ${err.message}`);
                console.error("Axios Error:", err.message);
                console.error("Error Response:", err.response); // This will give you the response object, if any
                console.error("Error Request:", err.request); // This will give you the request object, if any
            } else {
                // General error handling (non-Axios error)
                setError('Unexpected error occurred');
                console.error("Unexpected Error:", err);
            }
        }
    };

    // Use useEffect to fetch data when the component mounts
    useEffect(() => {
        listActiveRestaurants();
    }, []);  // Empty dependency array means this runs only once after the first render

    return (
        <div>
            <div className="browserestaurants">
            <div className="back-button-browse-restaurants">
                    <p>
                        <Link href="/" className="back-button">Back</Link>
                    </p>
                </div>
                <h2>Active Restaurants</h2>
                <div className="listActiveRestaurants">
                    {error && <p>{error}</p>} {/* Show error message if there was an issue */}
                    {restaurants.length > 0 ? (
                        <ul>
                            {restaurants.map((restaurant) => (
                                <li key={restaurant.res_UUID}>
                                    <h3>{restaurant.restaurantName}</h3>
                                    <p><strong>Address:</strong> {restaurant.address}</p>
                                    <p><strong>Open Time:</strong> {restaurant.openTime}</p>
                                    <p><strong>Close Time:</strong> {restaurant.closeTime}</p>
                                    <p><strong>Status:</strong> {restaurant.isActive ? 'Active' : 'Inactive'}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No active restaurants available.</p>
                    )}
                </div>

                
            </div>
        </div>
    );
}