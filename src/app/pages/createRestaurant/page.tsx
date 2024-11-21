'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React from 'react'
import axios from "axios";

// all WEB traffic using this API instance. You should replace this endpoint with whatever
// you developed for the tutorial and adjust resources as necessary.
const instance = axios.create({
    baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com'
  });
  


export default function Home() {
    const [redraw, forceRedraw] = React.useState(0)       // used to conveniently request redraw after model change

    // utility method (that can be passed around) for refreshing display in React
    const andRefreshDisplay = () => {
        forceRedraw(redraw+1)
    }


    
    function createRestaurant(){
        let username = document.getElementById("username") as HTMLInputElement
        let password = document.getElementById("password") as HTMLInputElement
        let resName = document.getElementById("restaurant name") as HTMLInputElement
        let resAddress = document.getElementById("restaurant address") as HTMLInputElement

        // POST and payload to send to API gateway
        instance.post('/restaurant', {"username":username.value, "password":password.value, 
                                            "restaurantName":resName.value, "address": resAddress.value})
            .then(function(repsonse){ // just copying from calc example, what 

                // Does anything else go in here
                
                andRefreshDisplay()
            })
            .catch(function(error){
                console.log(error)
            })
      }
            


    // HTML Elements
    return (
      <div>
        <div className = "createRestaurant-page">
            <label className = "Username">Username </label>
            <input id="username" type="text" className = "UsernameInput" placeholder="Enter Username"/>
            <label className = "Password">Password </label>
            <input id="password" type="text" className = "PasswordInput" placeholder="Enter Password"/>
            <label>Restaurant Name</label>
            <input id="restaurant name" type="text" placeholder="Enter Restaurant Name"/>
            <label>Street Address</label>
            <input id="restaurant address"type="text" placeholder="Enter address"/>
            <button>create restaurant</button>
        </div>
      </div>
    );
  }