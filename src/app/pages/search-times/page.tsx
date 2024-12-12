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
    const [resName, setResName] = React.useState("")
    const router = useRouter();


    // state to hold the returned data
    const [obj, setObj] = useState<any[]>([]);



    useEffect(() => {
        const storedSearchData = localStorage.getItem('searchTimeInfo');
        if (storedSearchData) {
            const searchData = JSON.parse(storedSearchData);
            setResName(searchData.resName)
        }
    })

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
            else {
                alert("Could not query")
            }

        }).catch(function (error) {
            console.log(error)
        })

    }

    function MakeReservation(table_UUID: any, numSeats: any, timeStart: any) {
        modelInstance.setReservationInfo(table_UUID, dateInput, numSeats, timeStart, resName);
        localStorage.setItem('reservationInfo', JSON.stringify(modelInstance.getReservationInfo()))
        router.push('/pages/make-reservation');
    }

    return (
        <div >

            <div>
                <h1><u>Search Times</u></h1>
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

            <button style={{ background: "green", padding: 2 }} onClick={(e) => apiCall()}>Submit</button>

            <div>
                <h1>Available Times:</h1>
                <ul>
                    {obj.map((obj, index) => (
                        <li style={{ backgroundColor: 'lightblue', marginBottom: 8, padding: 3 }} key={index}>
                            <p>Table ID: {obj.table_UUID}</p>
                            <p>Number of Seats: {obj.numSeats}</p>
                            <p>Time Available: {obj.timeStart}</p>
                            <button onClick={(e) => MakeReservation(obj.table_UUID, obj.numSeats, obj.timeStart)}>MakeReservation</button>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}