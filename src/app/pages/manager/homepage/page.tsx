'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React from 'react'
import axios from "axios";
import { modelInstance } from '../../../../model';
import './style.css';


// all WEB traffic using this API instance. You should replace this endpoint with whatever
// you developed for the tutorial and adjust resources as necessary.
const instance = axios.create({
  baseURL: 'https://q3l4c6o0hh.execute-api.us-east-2.amazonaws.com/initial/'
});

export default function managerHomePage() {
  const [isActive, setisActive] = React.useState(false);


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

  // therefore, the first thing that should be done is a POST for the 
  // restaurant data of the current manager that is logged in

  //Variables
  let currentManager = modelInstance.getManager()
  let username = currentManager?.username
  let res_uuid

  let restaurantName
  let address
  let activity = 0
  let startTime
  let closeTime

  // get the res_UUID from the manager database
  instance.post('getCorrespondingRestaurant', {
    "username": username
  }).then(function (response) {

    let status = response.data.status
    res_uuid = response.data.result.body[0].res_uuid

  }).catch(function (error) {
    console.log(error)
  })

  // get restaurant data from the All_Restaurants table
  instance.post('getRestaurantData', {
    "res_uuid": res_uuid
  }).then(function (response) {
    let status = response.data.status


    if (status == 200) {
      restaurantName = response.data.result.body[0].restaurantName
      address = response.data.result.body[0].address
      activity = response.data.result.body[0].isActive
      startTime = response.data.result.body[0].startTime || "null"
      closeTime = response.data.result.body[0].closeTime || "null"

      // change the display if the restaurant is active
      if (activity == 1) {
        setisActive(true)
      }
    }

  }).catch(function (error) {
    console.log(error)
  })
//alert(restaurantName);

// HTML
  if (isActive) {
    return (
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

  else {
    return (
      <div>
        <div className="inactive-restaurant">
          <label className="inactive-sign">INACTIVE</label>
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
}

