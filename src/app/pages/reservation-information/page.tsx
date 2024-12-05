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

export default function loginpage() {
    const [redraw, forceRedraw] = React.useState(0)
    

    const andRefreshDisplay = () => {
        forceRedraw(redraw + 1)
    }

    const [cons_UUID, setcons_UUID] = React.useState(null)

    const [resName, setRestaurantName] = React.useState(null)
    const [bookingTime, setBookingTime] = React.useState(null)
    const [numGuests, setNumGuests] = React.useState(null)
    const [date, setDate] = React.useState(null)

    const [email, setEmail] = useState("")
    const router = useRouter()


    useEffect(() =>{
        const storedConsumerData 
        = sessionStorage.getItem('consumerData');
        if(storedConsumerData) {
            const currentConsumer = JSON.parse(storedConsumerData);
            setEmail(currentConsumer.email);
        }
    }, [])

    
    // get the cons_UUID from the consumer database
    instance.post('/getConsumerData', {
        "email" : email
    }).then(function (response){
        setcons_UUID(response.data.result.body[0].cons_UUID || "null")      
        
        let status = response.data.statusCode

        if (status == 200){
            setRestaurantName(response.data.result.body[0].resName || "No Name")
            setBookingTime(response.data.result.body[0].bookingTime || "No Time")
            setDate(response.data.result.body[0].date || "No Date")
            setNumGuests(response.data.result.body[0].numGuests || 0)
        }            
        }).catch(function (error) {
            console.log(error)
        })

       


    //Html Elements
    return (
        <Suspense fallback={<div>Loading...</div>}>
        <div>
            <div className="restaurant-info">
            <label className="name">Restaurant Name: {resName}</label>
            <label className="date">Date: {date}</label>
            <label className="time">Time: {bookingTime}</label>
            <label className="numberGuests">Number of Guests: {numGuests}</label>
          </div>
        </div>
        </Suspense>

    );


}