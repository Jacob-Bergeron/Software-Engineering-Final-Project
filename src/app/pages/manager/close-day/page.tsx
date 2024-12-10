/*
12/6 
Assumptions: 
- Manager must input the restaurant UUID
*/

//! Future iteration could use session/local storage to know restaurant name ahead of time



'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React, { useEffect, useState } from 'react';
import axios from "axios";

const instance = axios.create({
    baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/'
});



export default function CloseDay() {


    // state variables
    const [resUUID, setResUUID] = useState("")
    const [dateInput, setDateInput] = useState("")


    // API Call 
    /*
    - Check to make sure that the dateInput is not the current day or past day
    */
    function apiCall() {

        // if the dateInput is tomorrow or future 
        const currentDate = new Date()
        if (currentDate <= new Date(dateInput)) {

            instance.post('./managerCloseDay', {
                "res_UUID" : resUUID, "date" : dateInput
            }).then(function (response) {
                let status = response.data.statusCode

                //if successful in reaching database AND there is something in the payload coming to client
                if (status == 200 && response.data.result) {
                    alert("Sucessfully closed day")
                }
                else {
                    alert("400 or invalid response")
                }

            }).catch(function (error) {
                console.log(error)
            })
        } else {
            alert("Cannot input current or past day")
        }

    }



    return (
        <div>

            <div>
                <h1><u>Close Future Day</u></h1>
            </div>

            <div>
                <label>Restaurant UUID:</label>
                <input onChange={(e) => setResUUID(e.target.value)} style={{ color: "black", textAlign: 'center' }}></input>
            </div>

            <div>
                <label>Date:</label>
                <input onChange={(e) => setDateInput(e.target.value)} style={{ color: "black", textAlign: 'center' }} ></input>
            </div>


            <button style={{ background: "green", padding: 2 }} onClick={(e) => apiCall()}>Submit</button>

        </div>
    )
}