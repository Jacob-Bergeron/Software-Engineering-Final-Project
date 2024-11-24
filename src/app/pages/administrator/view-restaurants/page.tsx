'use client'
import React from 'react';
import './styles.css';
import Image from 'next/image';
import myImage from './images/myImage.jpg';
import axios from "axios";
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

// all WEB traffic using this API instance. You should replace this endpoint with whatever
// you developed for the tutorial and adjust resources as necessary.
const instance = axios.create({
  baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/'
});

//add functions for export here

// HTML Elements
export default function Home() {
    const [redraw, forceRedraw] = React.useState(0)       // used to conveniently request redraw after model change
  
    // utility method (that can be passed around) for refreshing display in React
    const andRefreshDisplay = () => {
      forceRedraw(redraw + 1)
    }
  
    function createRestaurant() {
      let username = document.getElementById("username") as HTMLInputElement
      let password = document.getElementById("password") as HTMLInputElement
      let resName = document.getElementById("restaurant name") as HTMLInputElement
      let resAddress = document.getElementById("restaurant address") as HTMLInputElement
      let res_UUID = uuidv4();
      let man_UUID = uuidv4();
  
      // POST and payload to send to API gateway
      instance.post('/restaurant', {
        "username": username.value, "password": password.value, "res_UUID": res_UUID, // or res_UUID?
        "restaurantName": resName.value, "address": resAddress.value, "man_UUID" : man_UUID
      })
        .then(function (repsonse) { // just copying from calc example, 
  
          // Does anything else go in here?
  
          username.value = ''
          password.value = ''
          resName.value = ''
          resAddress.value = '';
          
          andRefreshDisplay()
        })
        .catch(function (error) {
          console.log(error)
        })
    }
return (
    <div>
       <div>
            <p>
                <Link href="/pages/login-page" className = "back-button">Back</Link>
            </p>
        </div>
        
      <div className="createRestaurant-page">
        <label className="Username">Username </label>
        <input id="username" type="text" className="UsernameInput" placeholder="Enter Username" />
        <label className="Password">Password </label>
        <input id="password" type="text" className="PasswordInput" placeholder="Enter Password" />
        <label>Restaurant Name</label>
        <input id="restaurant name" type="text" placeholder="Enter Restaurant Name" />
        <label>Street Address</label>
        <input id="restaurant address" type="text" placeholder="Enter address" />
        <button onClick={(e) => createRestaurant()}>create restaurant</button>
      </div>

      <div>
        <Image src={myImage} alt="Description of Image" className="image-class"/>  
      </div>
    </div>
  );
}