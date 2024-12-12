'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React from 'react'
import axios from "axios";
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import './style.css';
import { useRouter } from 'next/navigation';

// all WEB traffic using this API instance. You should replace this endpoint with whatever
// you developed for the tutorial and adjust resources as necessary.
const instance = axios.create({
  baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/'
});


export default function Home() {
  const [redraw, forceRedraw] = React.useState(0)       // used to conveniently request redraw after model change
  const router = useRouter();


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
      "username": username.value, "password": password.value, "res_UUID": res_UUID,
      "restaurantName": resName.value, "address": resAddress.value, "man_UUID" : man_UUID
    })
      .then(function (response) { // just copying from calc example, 
        alert("Restaurant Successfully Created")
        router.push('/pages/login-page');
        
        alert("Manager credentials set.\tThank you for choosing Tables4U.")
        andRefreshDisplay()
      })
      .catch(function (error) {
        alert("Unable to Create Restaurnt")
        console.log(error)
        andRefreshDisplay()

      })
  }
  

  // HTML Elements
  return (
    <div>
       <div className = "back-button-create">
            <p>
                <Link href="/pages/login-page" className = "back-button">Back</Link>
            </p>
        </div>
        
      <div className="createRestaurant-page">
        <h1 className = "title">Create A Restaurant</h1>
        <label className="Username">Username </label>
        <input id="username" type="text" className="UsernameInput" placeholder="Enter Username" />
        <label className="Password">Password </label>
        <input id="password" type="text" className="PasswordInput" placeholder="Enter Password" />
        <label className = "restaurantName">Restaurant Name</label>
        <input className = "restaurantNameInput" id="restaurant name" type="text" placeholder="Enter Restaurant Name" />
        <label className = "address" >Street Address</label>
        <input className = "addressInput" id="restaurant address" type="text" placeholder="Enter address" />
        <button className = "createButton" onClick={(e) => createRestaurant()}>Create Restaurant</button>
      </div>
    </div>
  );
}