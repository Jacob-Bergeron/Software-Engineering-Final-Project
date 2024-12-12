'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import './styles.css';

// Axios instance for API requests
const instance = axios.create({
    baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/',
    timeout: 5000, //optional: establish a timeout for requests.
    // headers: {
    //    'x_api_key:' : 'XZERw16yF64AQcuycqQlP3VjcKgmRJpe4QOVjbvH'
    // }
});

//interface struct to store data returned by the lambda function and enforce data conformity
interface Reservation {
    res_UUID: string;
    tableNumber: number;
    timeStart: string;
    isReserved: boolean;
    seats: number;
    numReservees: number;
    email: string;
    date: string;
}

export default function AdminReportUtil() {
    const [res_UUID, setRes_UUID] = useState(""); 
    const [restaurantName, setRestaurantName] = useState("");
    const [availability, setAvailability] = useState<Reservation[]>([]); 
    const [selectedTable, setSelectedTable] = useState<Reservation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [date, setDate] = useState<string>('');  

    useEffect(() => {
        //retrieve the restaurant UUID from local storage
        const storedRes_UUID = localStorage.getItem('res_UUID');
        const storedRestaurantName = localStorage.getItem('restaurantName');
        if (storedRes_UUID && storedRestaurantName) {   //need this statement to get around an error in line 40, 
            setRes_UUID(storedRes_UUID);                //since the UUID cannot technically be null in order to 
            setRestaurantName(storedRestaurantName);    //be consistent with inputs of functions.
        } else {
            setError('Navigate to the previous page and select a restaurant.'); //no res_UUID stored b/c user navigated here by pasting URL.
        }
    }, []);

    //function to generate availability report from res_UUID and date
    const generateReport = (res_UUID: string, date: string) => {
        if (!date) {
            setError('Please enter a date');
            return;
        }
        //lambda call, probably easier to do multiple lambdas instead of only 1.
        instance.post('/adminGetAvailability/', {
            res_UUID: res_UUID,
            date: date
        }).then(function (response) {
            let status = response.data.statusCode
            
            if (status === 200 && response.data.body) {
                setAvailability(response.data.body);
            } else {
                alert("Generation failed!");
            }

        }).catch(function (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 403) {
                    setError('Error 403');
                } else {
                    setError(`Axios error: ${error.message}`);
                }
                console.error("Axios Error:", error.message);
                console.error("Error Response:", error.response);
                console.error("Error Request:", error.request);
            } else {
                setError('Unexpected error occurred');
                console.error("Unexpected exception:", error);
            }
        });
    };

    //handleClick functions used to give buttons multiple functionalities.
    const handleTableClick = (table: Reservation) => {
        setSelectedTable(table);
    };
    
    //TODO: call the adminDeleteReservation lambda function in ordr to expunge chosen reservation from database
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
                    <h2>Tables at {restaurantName}</h2>
                    <div className="table-list">
                        <input 
                            type="text" 
                            placeholder="YYYY/MM/DD" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                        />
                        <button 
                            className="genbutton" 
                            onClick={() => generateReport(res_UUID, date)} 
                            disabled={!date}  // Disable button if date is not entered
                        >
                            Generate Report
                        </button>
                        {error && <p>{error}</p>}
                        <ul>
                            {availability.length > 0 ? (
                                availability.map((table, index) => (
                                    <li key={index} onClick={() => handleTableClick(table)}>
                                        <div className="tableBox">
                                            <h3>Table #{table.tableNumber}</h3>
                                            <button className="selectTableButton">View Schedule</button>
                                        </div>
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
                            <h3>Reservations for Table {selectedTable.tableNumber} on {date}</h3>
                            <ul>
                                {availability
                                    .filter(res => res.tableNumber === selectedTable.tableNumber && res.date === date)
                                    .map((res, index) => (
                                        <li key={index}>
                                            <div className="timebloc">
                                                <h3>Date: {res.date}</h3>
                                                <h3>Time: {res.timeStart}</h3>
                                            </div>
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