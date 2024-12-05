'use client'
import './style.css';
import { modelInstance } from '../../../model';
import Link from 'next/link';
import React, {Suspense, useState, useEffect} from 'react';
import axios from "axios";
import { useRouter } from 'next/navigation';


// all WEB traffic using this API instance. You should replace this endpoint with whatever
// you developed for the tutorial and adjust resources as necessary.
const instance = axios.create({
    baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/'
});

export default function findReservationPage() {
    const [redraw, forceRedraw] = React.useState(0)
    const router = useRouter();
    
    modelInstance.setConsumer("", "")


    const andRefreshDisplay = () => {
        forceRedraw(redraw + 1)
    }


    //Function that is called when 
    function findReservation() {
        //Get username and password
        let email = document.getElementById("email") as HTMLInputElement
        let sixDigitCode = document.getElementById("sixDigitCode") as HTMLInputElement



            instance.post('/findReservation', { // make lambda function
                "email": email.value, "sixDigitCode": sixDigitCode.value
            })
                // 'response' is the JSON that is returned from LAMBDA could be 200 or 400
                .then(function (response) {
                    let status = response.data.statusCode
                    // if success
                    if (status == 200) {
                        console.log(response.data.body)
                        // if the body has something in it 
                        if (response.data.result.body.length > 0) {
                            if (response.data.result.body[0].email == email.value && response.data.result.body[0].sixDigitCode == sixDigitCode.value) {
                                modelInstance.setConsumer(email.value, sixDigitCode.value);
                                sessionStorage.setItem('consumerData', JSON.stringify(modelInstance.getConsumer()));
                                router.push('/pages/reservation-information');

                            }
                        } else {
                            alert("invalid credentials")
                        }
                    }
                    // How would it work if there are multiple types of 400 error
                    else {
                        // display
                        alert("Database broke.")
                    }
                })
                // this is a 500 error 'catch' not a 400 error
                .catch(function (error) {
                    console.log(error)
                })
            // Set the manager credentials client side
        
    }


    //Html Elements
    return (
        <Suspense fallback={<div>Loading...</div>}>
        <div>
            <div className="login-page">
                <label className="email">Email </label>
                <input id="email" type="text" className="UsernameInput" placeholder="Enter Email" />
                <label className="sixDigitCode">Code </label>
                <input id="sixDigitCode" type="text" className="PasswordInput" placeholder="Enter 6-digit Code" />
                <button className="login-button" onClick={(e) => findReservation()}>Find Reservation</button>
            </div>
        </div>
        </Suspense>

    );


}