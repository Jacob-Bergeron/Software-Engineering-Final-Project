'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React, { useEffect, useState } from 'react';
import axios from "axios";

const instance = axios.create({
    baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/'
});


/*
Component: SearchRestaurants
What it does:
  - Takes in 3 parameters (future date, time, number of people)
  - searches databases to find restaurants that satisify the 3 parameters
  - returns (and displays?) those restaurants 
*/
export default function SearchRestaurants() {

    // State Variables
    const [futureDateInput, setDateInput] = React.useState("")
    const [timeInput, setTimeInput] = React.useState("")
    const [peopleInput, setPeopleInput] = React.useState('')

    // get the current date when the code is called
    const [date, setDate] = React.useState(new Date().getDate())
  

    //! TODO: Implement API and Lambda 
    // AWS API Call
    instance.post('/consumerSearchRestaurants', {
        "currentDate": date, "futureDate": futureDateInput, "time": timeInput, "numPeople": peopleInput
    }).then(function (response) {
        let status = response.data.statusCode
        
        //if successful in reaching database
        if(status == 200){

        }
        // if NOT successful in reahing database
        else{
            alert("Could not query")
        }

    }).catch(function (error) {
        console.log(error)
    })


    // Return
    return (
        <div>

            <div>
                <h1>Search Restaurants</h1>
            </div>

            <div>
                <label>Date</label>
                <input id="dateID" onChange={(e) => setDateInput(e.target.value)} placeholder="Input date" />
            </div>

            <div>
                <label>Time</label>
                <input id="timeID" onChange={(e) => setTimeInput(e.target.value)} placeholder="Input time" />
            </div>

            <div>
                <label>Number of People</label>
                <input id="peopleID" onChange={(e) => setPeopleInput(e.target.value)} placeholder="Input number of people" />
            </div>

            <button>Submit</button>

            <div>
                <h1>Available Restaurants</h1>
            </div>
        </div>
    )
}