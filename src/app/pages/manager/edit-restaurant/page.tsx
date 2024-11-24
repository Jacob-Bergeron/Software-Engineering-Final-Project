'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React from 'react';
import axios from "axios";
import { modelInstance } from '../../../../model';
import { v4 as uuidv4 } from 'uuid';
import './style.css';

// all WEB traffic using this API instance. You should replace this endpoint with whatever
// you developed for the tutorial and adjust resources as necessary.
const instance = axios.create({
    baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/'
});

export default function editRestaurantPage() {
    const [redraw, forceRedraw] = React.useState(0)       // used to conveniently request redraw after model change

    // utility method (that can be passed around) for refreshing display in React
    const andRefreshDisplay = () => {
        forceRedraw(redraw + 1)
    }


    function editRestaurantTime() {

        let openTime = document.getElementById("openingTime") as HTMLInputElement
        let closeTime = document.getElementById("closingingTime") as HTMLInputElement

        // can't continue until loginRestaurant has been completed
        // let credentials 

            instance.post('/restaurant/editTime', {
                "openingTime": openTime.value, "closingTime": closeTime.value
            })
            .then(function (response) {


            })
            .catch(function (error) {
                console.log(error)
            })


    }

    modelInstance.getManager();




    return (
        <div>
            <div className="editRestaurant-page">
                <label>Opening Time </label>
                <input id="openingTime" type="text" placeholder="Enter Opening Time" />
                <label >Closing Time</label>
                <input id="closingTIme" type="text" placeholder="Enter Closing Time" />
                <button onClick={(e) => editRestaurantTime}>Submit Changes</button>
            </div>
        </div>
    );
}