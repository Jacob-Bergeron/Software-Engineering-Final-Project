/*
12/3
- Lambda function and API working with the following payload
- Does display on GUI, given this payload as well
    {
    "date" : "2024-12-25",
    "time" : "1700",
    "numPeople" : 4
    }
 */

//! 12/3 
//! Have not tested:
    //! Edge cases: guests == numSeatsAvailable
    //! Did not test if reservation later in same day would be valid -> 
//! Note: Pay attention to how data is structured in tables

/*
12/4
- Reworked the databases
- Have not verified edge cases
*/


'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { modelInstance } from '../../../model';
import MakeReservation from '../make-reservation/page';
import { table } from 'console';
import { Router } from 'react-router-dom';
import {useRouter} from 'next/navigation'

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

    // Refresh 
    const [redraw, forceRedraw] = React.useState(0)

    const andRefreshDisplay = () => {
        forceRedraw(redraw + 1)
    }

    // State Variables
    const [dateInput, setDateInput] = React.useState("")
    const [timeInput, setTimeInput] = React.useState("")

    // State to hold restaurant data
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [reservations, setReservations] = useState<any[]>([]);


    // get the current date when the code is called
    const [currentDate, setCurrentDate] = React.useState(new Date())
    const router = useRouter();

    /*
    function: searchAvailable()
    */
    function searchAvailable() {
        
        // AWS API Call
        instance.post('/consumerSearchRestaurants', {
            "date": dateInput, "time": timeInput
        }).then(function (response) {
            let status = response.data.statusCode

            //if successful in reaching database AND there is something in the payload coming to client
            if (status == 200 && response.data.result) {

                //loop through the indecies that are returned
                for (let i = 0; i < response.data.result.body.length; i++) {
                    // if the current date is after the dateInput
                    //! 12/3 Make sure that date types can be compared
                    //! vv I sense potential problems with this line vvv
                    if ((response.data.result.body[i].date) >= currentDate) {
                        alert("Can only search for future days!")
                    }
                    // else set the Restaurants into state
                    else {
                        setRestaurants(response.data.result.body)   
                        setReservations(response.data.result.reservations)   
                    }
                }
            }
            // if NOT successful in reaching database
            else {
                alert("Could not query")
            }

        }).catch(function (error) {
            console.log(error)
        })
    }



    function MakeReservation(resName : String, table_UUID : String, date : Date){
        modelInstance.setReservationInfo(table_UUID,date, 0,timeInput,resName);
        localStorage.setItem('reservationInfo', JSON.stringify(modelInstance.getReservationInfo()))
        router.push('/pages/make-reservation');
    }

    function SearchTimes(resName:any){
        modelInstance.setReservationInfo("","","","",resName)
        localStorage.setItem('searchTimeInfo', JSON.stringify(modelInstance.getReservationInfo()))
        router.push('/pages/search-times');
    }

    // Refreshes display anytime there is a change in [restaurants]
    useEffect(() => {
        andRefreshDisplay();
    }, [restaurants]);

    // Return
    return (
        <div>

            <div>
                <h1><u>Search Restaurants</u></h1>
            </div>

            <div>
                <label style={{ paddingRight: 3 }} >Date YYYY-MM-DD</label>
                <input onChange={(e) => setDateInput(e.target.value)} placeholder="Input date" style={{ color: "black" }} />
            </div>

            <div>
                <label style={{ paddingRight: 3 }}>Time</label>
                <input onChange={(e) => setTimeInput(e.target.value)} placeholder="Input time" style={{ color: "black" }} />
            </div>

            < button style={{ backgroundColor : 'green' }} onClick={(e) => searchAvailable()}>Submit</button>

            <div>
                <h1>Available Restaurants</h1>
                <ul>
                    {restaurants.map((restaurant) => ( 
                        <li key={restaurant.restaurantName} style={{ backgroundColor: 'lightblue', marginBottom: 8, padding: 3 }} >
                            <h3>Restaurant Name: {restaurant.restaurantName}</h3>
                            <h4>Address: {restaurant.address}</h4>
                            <button style={{ backgroundColor : 'green'}}onClick={(e) => MakeReservation(restaurant.restaurantName,restaurant.table_UUID,restaurant.date)}>Make a reservation</button>
                            <button style={{ backgroundColor : 'red'}} onClick={(e) => SearchTimes(restaurant.restaurantName)}>Search Times</button>
                        </li>

                    ))}
                </ul>
            </div>
        </div>
    )
}