'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { modelInstance } from '../../../../model';
import './style.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';


// all WEB traffic using this API instance. You should replace this endpoint with whatever
// you developed for the tutorial and adjust resources as necessary.
const instance = axios.create({
  baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/'
});

export default function managerHomePage() {
    const [redraw, forceRedraw] = React.useState(0)
  
    const andRefreshDisplay = () => {
      forceRedraw(redraw + 1)
    }

    const [restaurantName, setrestaurantName] = React.useState("")
    const [address, setAddress] = React.useState("")
    const [startTime, setstartTime] = React.useState("")
    const [closeTime, setcloseTime] = React.useState("")
    const [res_UUID, setres_UUID] = React.useState("")

    //Get res_UUID
    useEffect(() => {
        const storedManagerID   = localStorage.getItem('managerID');
        if (storedManagerID) {
          const currentManager = JSON.parse(storedManagerID);
          setres_UUID(currentManager);
        }
      }, []);


    console.log(res_UUID)
    instance.post('/managerGetRestaurantData', {
        "res_UUID": res_UUID
      }).then(function (response) {
      let status = response.data.statusCode
  
  
      if (status == 200) {  

        setrestaurantName(response.data.result.body[0].restaurantName || "No Name")
        setAddress(response.data.result.body[0].address || "No Address")
        setstartTime(response.data.result.body[0].openTime || "null")
        setcloseTime(response.data.result.body[0].closeTime || "null")
      }
  
    }).catch(function (error) {
      console.log(error)
    })


    return(
            <div>
            <div className="active-restaurant">
            <label className="active-sign">ACTIVE</label>
            <div className="restaurant-info">
                <label className="restaurant-name">Restaurant Name: {restaurantName}</label>
                <label className="restaurant-address">Address: {address}</label>
                <label className="restaurant-opentime">Opens at: {startTime}</label>
                <label className="restaurant-closetime">Closes at: {closeTime}</label>
            </div>
            </div>





        </div >
    );
}