'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React from 'react'
import axios from "axios";
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

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
            <p>Tables4U</p>
          </div>
          <p>
              <Link href="/pages/browse-restaurants" className = "browseRestaurants-button">Browse Restaurants</Link>
          </p>
        </div>

        <div className = "signIn">
        <p>
            <Link href="/pages/login-page" className = "signIn-button">Sign In</Link>
        </p>
        </div>
    </div>
  );
}