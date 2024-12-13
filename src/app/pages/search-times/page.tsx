/*
12/3
- Lambda function is working with following payload: 
- API is working as well
- GUI works as well with following payload
{
  "restaurantName" : "test",
  "date" : "2024-12-25"
}
*/
//! 12/3
//! Barely any testing done to this 

/*
12/4
- Updated this to work with the new data base
*/


'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { modelInstance } from '../../../model';
import { useRouter } from 'next/navigation'


const instance = axios.create({
    baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/'
});

export default function SearchTimes() {

    // Refresh 
    const [redraw, forceRedraw] = React.useState(0)

    const andRefreshDisplay = () => {
        forceRedraw(redraw + 1)
    }

    // state variables
    const [dateInput, setDateInput] = React.useState("")
    const [timeInput, setTimeInput] = React.useState("")
    const [resName, setResName] = React.useState("")
    const router = useRouter();


    // state to hold the returned data
    const [tables, setTables] = useState<any[]>([]);
    const [reservations, setReservations] = useState<any[]>([]);




    useEffect(() => {
        const storedSearchData = localStorage.getItem('searchTimeInfo');
        if (storedSearchData) {
            const searchData = JSON.parse(storedSearchData);
            setResName(searchData.resName)
        }
    })

    function apiCall() {
        instance.post('/consumerSearchTimes', {
            "resName": resName, "date": dateInput, "time": timeInput
        }).then(function (response) {
            let status = response.data.statusCode

            //if successful in reaching database AND there is something in the payload coming to client
            if (status == 200 && response.data.result) {
                // set the objects into state
                setTables(response.data.result.returnedTables)
                setReservations(response.data.result.returnedReservation)
            }
            else {
                alert("Could not query")
            }

        }).catch(function (error) {
            console.log(error)
        })
    }

    function isAvailable(table_UUID: String) {
        for (let i = 0; i < reservations.length; i++) {
            if (reservations[i].table_UUID == table_UUID) {
                return "No";
            }
        }
        return "Yes";
    }

    function MakeReservation(table_UUID: any, numSeats: number,) {
        modelInstance.setReservationInfo(table_UUID, dateInput, numSeats, timeInput, resName);
        localStorage.setItem('reservationInfo', JSON.stringify(modelInstance.getReservationInfo()))
        router.push('/pages/make-reservation');
    }

    return (
        <div >

            <div>
                <h1><u>Search Specific Restaurant</u></h1>
            </div>

            <div style={{ display: 'flex' }}>
                <label style={{ paddingRight: 3 }}>Restaurant Name:</label>
                {resName == "" ? (
                    <input onChange={(e) => setResName(e.target.value)} placeholder="input restaurant name" style={{ color: "black", textAlign: 'center' }} />
                ) : <p>{resName}</p>}

            </div>

            <div>
                <label style={{ paddingRight: 3 }}>Date YYYY-MM-DD</label>
                <input onChange={(e) => setDateInput(e.target.value)} placeholder="input date" style={{ color: "black", textAlign: 'center' }} />
            </div>

            <div>
                <label style={{ paddingRight: 3 }}>Time</label>
                <input onChange={(e) => setTimeInput(e.target.value)} placeholder="input time" style={{ color: "black", textAlign: 'center' }} />
            </div>

            <button style={{ background: "green", padding: 2 }} onClick={(e) => apiCall()}>Submit</button>

            <div>
                <h1>Available Tables:</h1>
                <ul>
                    {tables.map((table, index) => (
                        <li style={{ backgroundColor: 'lightblue', marginBottom: 8, padding: 3, color: 'black'}} key={index}>
                            <p>Table Number: {table.tableNumber}</p>
                            <p>Table ID: {table.table_UUID}</p>
                            <p>Number of Seats: {table.numSeats}</p>
                            <p>Available?: {isAvailable(table.table_UUID)}</p>
                            {isAvailable(table.table_UUID) == "Yes" ? <button onClick={(e) => MakeReservation(table.table_UUID, table.numSeats)} style={{background:"green"}}>Make a reservation</button> : <p> Already Reserved </p>}
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}