/*
Assumptions:
- The user knows all of the data related to their resservation to input
*/
/*
12/4 
- Lambda works
- API works
- GUI works
- Given following payload: ** make sure database is empty before trying

12/5 
- Updated lamda so that it sets the isBooked value in TableInfo

{
  "email": "test@gmail.com",
  "resName": "test",
  "date": "2024-12-25",
  "table_UUID": "table1",
  "timeStart": "1700",
  "numGuests": "5"
}

*/

//! 12/4 
//! Barely any testing done to this


'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React, { useEffect, useState } from 'react';
import axios from "axios";

const instance = axios.create({
    baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/'
});



export default function MakeReservation() {


    // state variables
    const [email, setEmail] = useState("")
    const [resName, setResName] = useState("")
    const [date, setDate] = useState("")
    const [table_UUID, setTable_UUID] = useState("")
    const [timeStart, setTimeStart] = useState("")
    const [numGuests, setNumGuests] = useState("")

    useEffect(() => {
        const storedreservationData = localStorage.getItem('reservationInfo');
        if (storedreservationData){
            const reservationData = JSON.parse(storedreservationData);
            setResName(reservationData.resName)
            setDate(reservationData.date)
            setTable_UUID(reservationData.table_UUID)
            setTimeStart(reservationData.startTime)
            setNumGuests(reservationData.numPeople)
        }
    })




    function apiCall() {
        const currentDate = new Date()
        // if the date that the consumer wants to search for is at least todays date
        // then they can try to make a reservation
        if (new Date(date) >= currentDate) {
            instance.post('/makeReservation', {
                "email": email, "resName": resName, "date": date, "table_UUID": table_UUID, "timeStart": timeStart, "numGuests": numGuests
            }).then(function (response) {
                let status = response.data.statusCode

                //if successful in reaching database AND there is something in the payload coming to client
                if (status == 200 && response.data.result) {
                    alert("Confirmation code is" + response.data.result.body)
                }
                else {
                    alert("400 or invalid response")
                }

            }).catch(function (error) {
                console.log(error)
            })
        } else {
            alert("cannot make reservation for past day")
        }

    }



    return (
        <div>

            <div>
                <h1><u>Make Reservation</u></h1>
            </div>

            <div>
                <label>Email:</label>
                <input onChange={(e) => setEmail(e.target.value)} style={{ color: "black", textAlign: 'center' }}></input>
            </div>

            <div>
                <label>Restaurant Name: {resName}</label>
                <input onChange={(e) => setResName(e.target.value)} style={{ color: "black", textAlign: 'center' }}></input>
            </div>

            <div>
                <label>Date:{date}</label>
                <input onChange={(e) => setDate(e.target.value)} style={{ color: "black", textAlign: 'center' }} ></input>
            </div>

            <div>
                <label>Table ID:{table_UUID}</label>
                <input onChange={(e) => setTable_UUID(e.target.value)} style={{ color: "black", textAlign: 'center' }}></input>
            </div>

            <div>
                <label>Start Time:{timeStart}</label>
                <input onChange={(e) => setTimeStart(e.target.value)} style={{ color: "black", textAlign: 'center' }}></input>
            </div>

            <div>
                <label>Number of Guests:{numGuests}</label>
                <input onChange={(e) => setNumGuests(e.target.value)} style={{ color: "black", textAlign: 'center' }}></input>
            </div>

            <button style={{ background: "green", padding: 2 }} onClick={(e) => apiCall()}>Submit</button>

        </div>
    )
}