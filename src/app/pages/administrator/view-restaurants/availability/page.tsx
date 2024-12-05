'use client'; // This is necessary to use React hooks in Next.js 13 (for client-side rendering)

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import './styles.css';

// Axios instance for API requests
const instance = axios.create({
    baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/',
    timeout: 5000, // optional: establish a timeout for requests.
    // headers: {
    //    'x_api_key:' : 'XZERw16yF64AQcuycqQlP3VjcKgmRJpe4QOVjbvH'
    // }
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
    const [availability, setAvailability] = useState<Reservation[]>([]);  // State to hold restaurant/table data
    const [selectedTable, setSelectedTable] = useState<Reservation | null>(null);
    const [error, setError] = useState<string>('');  // State to hold any error messages

    const fetchReservations = async () => {
        try {
            const response = await instance.post('/adminDeleteReservation');
            const resultData = response.data.result || [];
            setAvailability(resultData);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(`Axios error: ${err.message}`);
            } else {
                setError('Unexpected error occurred');
            }
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleDelete = async (reservationId: string) => {
        // Handle delete reservation logic here
    };

    return (
        <div className="admin-report-util">
            <div className="back-button-format">
                <Link href="/pages/administrator/homepage" className="back-button">Back</Link>
            </div>
            <div className="admin-container">
                {/* Left Sector */}
                <div className="left-column">
                    <h2>Restaurants</h2>
                    <div className="restaurant-list">
                        {error && <p>{error}</p>}
                        {availability.length > 0 ? (
                            availability.map((table) => (
                                <div key={table.res_UUID} onClick={() => setSelectedTable(table)}>
                                    <h3>{table.res_UUID}</h3>
                                    <p>Table {table.tableNumber}</p>
                                </div>
                            ))
                        ) : (
                            <p>No restaurants available.</p>
                        )}
                    </div>
                </div>

                {/* Middle Sector */}
                <div className="middle-column">
                    {selectedTable ? (
                        <div>
                            <h2>Schedule for Table {selectedTable.tableNumber}</h2>
                            <ul>
                                {/* Time blocs should be generated dynamically */}
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
