/*
12/6
- Lambda Works
- API Works
- Frontend Works

Payload: 
{
  "email": "test@gmail.com"
}
*/

'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React, { useEffect, useState } from 'react';
import axios from "axios";

const instance = axios.create({
    baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/'
});

export default function AdminCancelReservation() {

    // State Variables
    const [email, setEmail] = useState("")


    // API function call
    function adminCancelReservation() {
        instance.post("/adminCancelReservation", {
            "email": email
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
    }

    return (
        <div>
            <div>
                <h1>Cancel Reservation</h1>
            </div>

            <div>
                <label>Email:</label>
                <input onChange={(e) => setEmail(e.target.value)} style={{ color: "black", textAlign: 'center' }}></input>
            </div>

            <div>
                <button onClick={(e) => adminCancelReservation()} style={{ background: "green", padding: 2 }}>Submit</button>
            </div>
        </div>
    )
}