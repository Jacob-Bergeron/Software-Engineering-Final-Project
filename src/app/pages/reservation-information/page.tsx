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

export default function res_infoPage() {
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


    const cancelReservation = async () => { // lambda function works but not on page implementation
        try{
            const response = await instance.post('/cancelReservation', {
                email : "email"
            });
            if (response.status == 200){
                alert("Reservation Canceled");
                router.push('/pages/find-reservation');
            }
            else{
                alert("Cancelation failed");
                andRefreshDisplay()
            }
        } catch (err){
            if (axios.isAxiosError(err)) {
                console.error("Axios Error:", err.message);
                console.error("Error Response:", err.response);
                console.error("Error Request:", err.request);
            } else {
                console.error("Unexpected Error:", err);
            }
        }
    }


    //Html Elements
    return (
        <Suspense fallback={<div>Loading...</div>}>
        <div>
            <div className="restaurant-info">
            <label className="name">Email: {email}</label>
            <label className="name">Restaurant Name: {resName}</label>
            <label className="name">Date: {date}</label>
            <label className="name">Time: {bookingTime}</label>
            <label className="name">Number of Guests: {numGuests}</label>
            </div>

            <div className="cancel-reservation">
                <button className="cancel-button" onClick={cancelReservation}>Cancel Reservation?</button>
            </div>
        </div>
        </Suspense>

    );


}