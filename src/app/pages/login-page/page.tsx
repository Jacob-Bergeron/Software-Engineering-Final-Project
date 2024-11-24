'use client'
import './style.css';
import { modelInstance } from '../../../model';
import Link from 'next/link';
import React from 'react';
import axios from "axios";


// all WEB traffic using this API instance. You should replace this endpoint with whatever
// you developed for the tutorial and adjust resources as necessary.
const instance = axios.create({
    baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/'
  });

export default function loginpage() {
    const [isManager, setisManager] = React.useState(false);
    const [redraw, forceRedraw] = React.useState(0)      

  
    const andRefreshDisplay = () => {
        forceRedraw(redraw + 1)
    }

    //Switch
    const handleToggleChanged = () => {
        setisManager(!(isManager))
    }

    //Function that is called when 
    function login(){
        //Get username and password
        let username = document.getElementById("username") as HTMLInputElement
        let password = document.getElementById("password") as HTMLInputElement

        //Admin login section
        if (!(isManager)){
            if (username.value == 'admin' && password.value == 'password'){
                //Successful admin login
                window.location.href = '/pages/administrator/homepage';
            }
        }
        //Manager login section
        else if(isManager){
            //Finish
            instance.post('/resource',{
                "username": username.value, "password": password.value
            })
            .then(function (response){
                  
                
            })
            .catch(function(error){
                console.log(error)
            })
            modelInstance.setManager(username.value, password.value);

        }
        

    }   










    //Html Elements
    return (
        <div>
        <div className = "login-page">
            
            <div className="toggle-switch">
                <label>
                <div className="switch">
                    <input type="checkbox" id="toggle" checked={isManager} onChange={handleToggleChanged}/>
                    <div className="slider">
                        <span id = "slider-text">{isManager ? "Manager" : "Admin"}</span>
                    </div>
                </div>
                </label>
            </div>

            <label className = "Username">Username </label>
            <input id = "username" type="text" className = "UsernameInput" placeholder="Enter Username"/>
            <label className = "Password">Password </label>
            <input id = "password" type="text" className = "PasswordInput" placeholder="Enter Password"/>
            <button className = "login-button" onClick={(e) => login()}>Sign In</button>
            <label className = "register">Don't Have A Restaurant?</label>
            <p>
                <Link href="/pages/manager/create-restaurant" className = "register-button">Create Restaurant</Link>
            </p>
        </div>
        <div>
        
        </div>

        <div className = "back-button-login">
            <p>
                <Link href="/" className = "back-button">Back</Link>
            </p>
        </div>
        
        </div>

    );


}