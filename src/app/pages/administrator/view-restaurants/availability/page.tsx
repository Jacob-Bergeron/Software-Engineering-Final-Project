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



export default function AdminReportUtil() {
    const [res_UUID, setRes_UUID] = useState(""); 
    const [restaurantName, setRestaurantName] = useState("");
    const [obj, setObj] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [date, setDate] = useState<string>('');
    const [openTime, setOpenTime] = useState("") 
    const [closeTime, setCloseTime] = useState("") 
    const [times, setTimes] = useState<number[]>([]);
    const [availableTimes, setAvailableTimes] = useState<number[]>([]);
    const [reservationTime, setReservationTime] = useState("")
    const [selectedTable_UUID, setSelectedTable_UUID] = useState("")
    const [selectedTable, setSelectedTable] = useState(false)
    const [isReserved, setIsReserved] = useState(false)
    const [seatsFilled, setSeatsFilled] = useState("")
    const [numSeats, setNumSeats] = useState("")
    const [tableNumber, setTableNumber] = useState("")
    const [consumer_UUID, setConsumer_UUID] = useState("")

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

        let arr = [];
        for (let i = parseInt(openTime, 10); i < parseInt(closeTime, 10); i+=100){
            arr.push(i)
        }
        setTimes(arr)
        setAvailableTimes(arr)
    }, []);

    //function to generate availability report from res_UUID and date
    const generateReport = (res_UUID: string) => {
        instance.post('/adminGetAvailability', {
            "res_UUID": res_UUID,
        }).then(function (response) {
            const status = response.data.statusCode;
            if (status === 200) {
              setObj(response.data.body.tableInfo)    
            } else {
              alert("Failed to retrieve tables.");
            }
        }).catch(function (error) {
            alert("Error retrieving tables.");
            console.error(error);
        });
    };

    
    //handleClick functions used to give buttons multiple functionalities.
    const handleTableClick = (table_UUID: any, tableNumber: any, numSeats : any) => {
        setSelectedTable_UUID(table_UUID)
        setNumSeats(numSeats)
        setTableNumber(tableNumber)

        instance.post('/getRestaurantTimes', {
            "res_UUID": res_UUID,
        }).then(function (response) {
            const status = response.data.statusCode;
            if (status === 200) {
                
              setCloseTime(response.data.data[0].closeTime)  
              setOpenTime(response.data.data[0].openTime)  
            } else {
              alert("Failed to retrieve tables.");
            }
    
        }).catch(function (error) {
            alert("Error retrieving tables.");
            console.error(error);
        });
        let arr = [];
        for (let i = parseInt(openTime, 10); i < parseInt(closeTime, 10); i+=100){
            arr.push(i)
        }
        setTimes(arr)
        setAvailableTimes(arr)
        setSelectedTable(true)
    
    };
    
    //TODO: call the adminDeleteReservation lambda function in ordr to expunge chosen reservation from database
    const handleDelete = async () => {
        instance.post('/adminCancelReservation',{
            "consumer_UUID" : consumer_UUID
        }).then(function (response) {
            let status = response.data.statusCode

            //if successful in reaching database AND there is something in the payload coming to client
            if (status == 200 && response.data.result) {
                alert("Reservation Canceled");
            } else {
                alert("Cancelation failed");
            }

        }).catch(function (error) {
            console.log(error)
        })
    };

    const viewReservation = async (time: number) => {
        instance.post('/getReservationData', {
            "table_UUID": selectedTable_UUID, "resName" : res_UUID, "date" : date
        }).then(function (response) {
            const status = response.data.statusCode;
            if (status === 200) {
                setReservationTime(response.data.data[0].bookingTime)
                setSeatsFilled(response.data.data[0].numGuests)
                setConsumer_UUID(response.data.data[0].consumer_UUID)
            } else {
              alert("Failed to retrieve tables.");
            }
    
        }).catch(function (error) {
            alert("Error retrieving tables.");
            console.error(error);
        });

        if (parseInt(reservationTime,10) == time){
            setIsReserved(true)
        }
    }

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
                            className="genbutton" onClick={() => generateReport(res_UUID)}>Generate Report
                        </button>{error && <p>{error}</p>}
                        <ul>
                            {obj.map((obj) => (
                                <li style={{ backgroundColor: 'lightgray', marginBottom: 8, padding: 3 }} key={obj.table_UUID}>
                                    <div className="tableBox">
                                            <h3>Table #{obj.tableNumber}</h3>
                                            <button  className="selectTableButton" onClick={() => handleTableClick(obj.table_UUID, obj.tableNumber, obj.numSeats)} >View Schedule</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Middle Sector */}
                <div className="middle-column">
                    {selectedTable ? (
                        <div>
                            <h3> Schedule for table #{tableNumber} <br></br>on {date}</h3>
                            <ul>
                                {availableTimes.map((time, index) => { 
                                    return ( 
                                        <li key={index}> 
                                            <button className="selectTimeblocButton" 
                                            onClick={() => viewReservation(time)}>
                                                <h3>Time: {time}</h3>
                                            </button>
                                        </li>
                                    );
                                })} 
                            </ul>
                        </div>
                    ) : (
                        <p>Select a table to view its schedule</p>
                    )}
                </div>

                {/* Right Sector */}
                <div className="right-column">
                    {selectedTable && isReserved ? (
                        <div>
                            <h2><u>Reservation Details</u></h2>
                            <p><strong>Time: </strong> {reservationTime}</p>
                            <p><strong>Seats:</strong> {numSeats}</p>
                            <p><strong>Seats Filled:</strong> {seatsFilled}</p>
                            <p><strong>Available Seats: </strong>{+seatsFilled - +numSeats}</p>
                            <button className="deleteResButton" onClick={() => handleDelete()}>Delete this reservation?</button>
                        </div>

                        

                    ) : (
                        <p>No reservation details to display</p>
                    )}
                    
                </div>
            </div>
        </div>
    );
}