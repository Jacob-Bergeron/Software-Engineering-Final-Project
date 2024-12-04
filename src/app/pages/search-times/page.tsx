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


'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React, { useEffect, useState } from 'react';
import axios from "axios";

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
    const [resName, setResName] = React.useState("")

    // state to hold the returned data
    const [obj, setObj] = useState<any[]>([]);

    function apiCall() {
        instance.post('/consumerSearchTimes', {
            "restaurantName": resName, "date": dateInput
        }).then(function (response) {
            let status = response.data.statusCode

            //if successful in reaching database AND there is something in the payload coming to client
            if (status == 200 && response.data.result) {
                // set the objects into state
                setObj(response.data.result.body)
            }

        }).catch(function (error) {
            console.log(error)
        })

    }

    // Refreshes display anytime there is a change in [restaurants]
    useEffect(() => {
        andRefreshDisplay();
    }, [obj]);

    return (
        <div>
            <div>
                <h1>Search Times</h1>
            </div>

            <div>
                <label>Restaurant Name</label>
                <input onChange={(e) => setResName(e.target.value)} placeholder="input restaurant name" style={{ color: "black" }} />
            </div>

            <div>
                <label>Date</label>
                <input onChange={(e) => setDateInput(e.target.value)} placeholder="input date" style={{ color: "black" }} />
            </div>

            <button onClick={(e) => apiCall()}>Submit</button>

            <div>
                <h1>Available Times</h1>
                <ul>
                    {obj.map((obj) => (
                        <li key={obj.available_UUID}>
                            <p>Table: {obj.table_UUID}</p>
                            <p>Number of Seats: {obj.numSeats}</p>
                            <p>Start Time: {obj.start_time}</p>
                            <p>End Time: {obj.end_time}</p>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}