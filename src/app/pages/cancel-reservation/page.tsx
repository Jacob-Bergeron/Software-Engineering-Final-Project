'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React, { useEffect, useState } from 'react';
import axios from "axios";

const instance = axios.create({
    baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/'
});

/** 
 * Consumer can cancel their reservation up to 1 calendar before reservation
 * 
 * 
 * @returns 
 */

export default function cancelReservation() {

    // state variables 
    const [email, setEmail] = useState("")
    const [sixDigitCode, setSixDigitCode] = useState("")


    function apiCall(){

        instance.post("", {

        }).then(function(response){
            let status = response.data.statusCode

            //if successful in reaching database AND there is something in the payload coming to client
            if (status == 200 && response.data.result) {
                alert("Reservation has been deleted")
            }

        }).catch(function(error){
            console.log(error)
        })
    }


    return (
        <div>

            <div>
                <h1><u>Cancel Reservation</u></h1>
            </div>

            <div>
                <label>Email:</label>
                <input onChange={(e) => setEmail(e.target.value)} style={{ color: "black", textAlign: 'center' }}></input>
            </div>

            <div>
                <label>Six digit code:</label>
                <input onChange={(e) => setSixDigitCode(e.target.value)} style={{ color: "black", textAlign: 'center' }}></input>
            </div>

            <button style={{ background: "green", padding: 2 }} onClick={(e) => apiCall()}>Submit</button>


        </div>

    )
}