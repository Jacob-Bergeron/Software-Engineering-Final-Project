'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React from 'react'


import Link from 'next/link';


export default function Home() {
  return (
    <div>
        <div className = "browseRestaurants">
          <p>
              <Link href="/pages/browserestaurantspage" className = "browseRestaurants-button">Browse Restaurants</Link>
          </p>

          <div className = "HomePage-Title">
            <p>Tables4U</p>
          </div>

        </div>


        <div className = "signIn">
        <p>
            <Link href="/pages/loginpage" className = "signIn-button">Sign In</Link>
        </p>
        </div>
    </div>
  );
}
