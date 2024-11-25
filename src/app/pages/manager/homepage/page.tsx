'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React from 'react'
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

// all WEB traffic using this API instance. You should replace this endpoint with whatever
// you developed for the tutorial and adjust resources as necessary.
const instance = axios.create({
  baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/'
});

export default function managerHomePage() {

  // On this manager home page: 
  // It will have 2 distinct looks:
    // If the restaurant is inactive
    // Or if the restaurant is active
      // if INACTIVE -> 
        // Should display options to edit
          // start/close time, number of tables, number of seats at each table
          // should have button to activate restaurant
      // if ACTIVE ->
        // should display options to edit
          // future closed/opened days

    // therefore, the first thing that should be done is a GET for the 
    // restaurant data of the current manager that is logged in

    // instance.get('/resource')
    // .then(function (response) {

    // })

  return (
    <div>
      <h1>
      welcome home 
      </h1>
    </div >
  );
}

