'use client'; // This is necessary to use React hooks in Next.js 13 (for client-side rendering)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import './styles.css';

// Axios instance for API requests
const instance = axios.create({
    baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/'
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
    const [res_UUID, setRes_UUID] = useState(""); // State to hold restaurant UUID
    const [availability, setAvailability] = useState<Reservation[]>([]);  // State to hold restaurant/table data
    const [selectedTable, setSelectedTable] = useState<Reservation | null>(null);
    const [error, setError] = useState<string>('');  // State to hold any error messages

    useEffect(() => {
        // Retrieve the restaurant UUID from local storage when the component mounts
        const storedRes_UUID = localStorage.getItem('res_UUID');
        if (storedRes_UUID) {
            setRes_UUID(storedRes_UUID);
        } else {
            setError('Restaurant UUID is missing');
        }
    }, []);

    // Function to generate availability report with res_UUID
    const generateReport = (res_UUID: string) => {

        instance.post('/adminGetAvailability/', {
            "res_UUID": res_UUID
        }).then(function (response) {
            let status = response.data.statusCode
            
            if (status == 200 && response.data.body) {
                setAvailability(response.data.body)
            } else {
                alert("returned 400 OR returned nothing")
            }

        }).catch(function(error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 403) {
                    setError('Access denied. Please check your API key or permissions.');
                } else {
                    setError(`Axios error: ${error.message}`);
                }
                console.error("Axios Error:", error.message);
                console.error("Error Response:", error.response);
                console.error("Error Request:", error.request);
            } else {
                setError('Unexpected error occurred');
                console.error("Unexpected Error:", error);
            }
        })
 
    };

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
                        <button className="genbutton" onClick={() => generateReport(res_UUID)}>Generate Report</button>
                        {error && <p>{error}</p>}
                        <ul>
                        {availability.length > 0 ? (
                            availability.map((table, index) => (
                                <li key={index} onClick={() => setSelectedTable(table)}>
                                    <h3>{table.res_UUID}</h3>
                                    <p>Table {table.tableNumber}</p>
                                </li>
                            ))
                        ) : (
                            <p>No tables available.</p>
                        )}
                        </ul>
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
