'use client'; // This is necessary to use React hooks in Next.js 13 (for client-side rendering)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import './styles.css';

// Axios instance for API requests
const instance = axios.create({
    baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/',
    timeout: 5000, // Optional: establish a timeout for requests.
});

interface Reservation {
    res_UUID: string;
    tableNumber: number;
    timeStart: string;
    isReserved: boolean;
    seats: number;
    numReservees: number;
    email: string;
}

export default function AdminReportUtil() {
    const router = useRouter();
    const { res_UUID } = router.query; //extract restaurant UUID from URL params
    
    const [availability, setAvailability] = useState<Reservation[]>([]);  // State to hold restaurant/table data
    const [selectedTable, setSelectedTable] = useState<Reservation | null>(null);
    const [error, setError] = useState<string>('');  // State to hold any error messages

    // Function to generate availability report with res_UUID
    const generateReport = async (res_UUID: string) => {
        try {
            const response = await instance.get(`/adminGetAvailability/${res_UUID}`);
            console.log(response.data);

            let resultData;
            if (response.status === 200 && response.data.body) {
                const body = JSON.parse(response.data.body); // Parse the body if it's a string
                resultData = body.result;
            } else {
                resultData = response.data.result; // Fallback if the structure is different
            }

            if (resultData && resultData.length > 0) {
                setAvailability(resultData); // Store the restaurant data in state
            } else {
                setError('No tables at this location.');
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 403) {
                    setError('Access denied. Please check your API key or permissions.');
                } else {
                    setError(`Axios error: ${err.message}`);
                }
                console.error("Axios Error:", err.message);
                console.error("Error Response:", err.response);
                console.error("Error Request:", err.request);
            } else {
                setError('Unexpected error occurred');
                console.error("Unexpected Error:", err);
            }
        }
    };

    useEffect(() => {
        if (res_UUID) {
            generateReport(res_UUID as string); 
        } 
    }, [res_UUID]);

    const handleDelete = async (reservationId: string) => { 
        // Handle delete reservation logic here 
    };

    return (
        <div className="admin-report-util">
            <div className="back-button-format">
                <Link href="/pages/administrator/view-restaurants" className="back-button">Back</Link>
            </div>
            <div className="admin-container">
                {/* Left Sector */}
                <div className="left-column">
                    <h2>Restaurants</h2>
                    <div className="restaurant-list">
                        <button className="genbutton" onClick={() => generateReport('restaurantUUID')}>Generate Report</button>
                        {error && <p>{error}</p>}
                        {availability.length > 0 ? (
                            availability.map((table) => (
                                <div key={table.res_UUID} onClick={() => setSelectedTable(table)}>
                                    <h3>{table.res_UUID}</h3>
                                    <p>Table {table.tableNumber}</p>
                                </div>
                            ))
                        ) : (
                            <p>No tables available.</p>
                        )}
                    </div>
                </div>

                {/* Middle Sector */}
                <div className="middle-column">
                    {selectedTable ? (
                        <div>
                            <h2>Schedule for Table {selectedTable.tableNumber}</h2>
                            <ul>
                                {[5, 6, 7, 8, 9].map((time) => (
                                    <li key={time} className={selectedTable.isReserved ? 'reserved' : 'available'}>
                                        {time}:00
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>Select a table to view its schedule</p>
                    )}
                </div>

                {/* Right Sector */}
                <div className="right-column">
                    {selectedTable && selectedTable.isReserved ? (
                        <div>
                            <h2>Reservation Details</h2>
                            <p><strong>Seats:</strong> {selectedTable.seats}</p>
                            <p><strong>Email:</strong> {selectedTable.email}</p>
                            <p><strong>Seats Filled:</strong> {(selectedTable.numReservees / selectedTable.seats) * 100}%</p>
                            <button onClick={() => handleDelete(selectedTable.res_UUID)}>Delete this reservation?</button>
                        </div>
                    ) : (
                        <p>No reservation details to display</p>
                    )}
                </div>
            </div>
        </div>
    );
}
