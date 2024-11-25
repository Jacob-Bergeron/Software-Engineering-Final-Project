'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React from 'react'
import axios from "axios";
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import './styles.css'

// all WEB traffic using this API instance. You should replace this endpoint with whatever
// you developed for the tutorial and adjust resources as necessary.
const instance = axios.create({
  baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/'
});


export default function Home() {



  return (
    <div>
        <div className = "browseRestaurants">
        <div className = "HomePage-Title">
            <p>ADMIN CONSOLE</p>
          </div>
          <p>
              <Link href="./view-restaurants" className = "browseRestaurants-button">View All Restaurants</Link>
          </p>
        </div>

        <div className = "signIn">
        <p>
            <Link href="./bonus-page" className = "signIn-button">Sign In</Link>
        </p>
        </div>

        <div className = "return">
        <p> 

        </p>
        </div>
    </div>
  );
}