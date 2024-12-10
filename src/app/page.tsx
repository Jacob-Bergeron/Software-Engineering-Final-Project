'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React from 'react'
import Link from 'next/link';

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
          <p>
            <Link href='/pages/search-restaurants' className="searchRestaurants-button">Search Restaurants</Link>
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
