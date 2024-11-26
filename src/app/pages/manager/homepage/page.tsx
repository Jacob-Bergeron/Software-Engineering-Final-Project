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
  const [redraw, forceRedraw] = React.useState(0)

  const andRefreshDisplay = () => {
    forceRedraw(redraw + 1)
  }

  const [isActive, setisActive] = React.useState(false);
  const [restaurantName, setrestaurantName] = React.useState(null)
  const [address, setAddress] = React.useState(null)
  const [startTime, setstartTime] = React.useState(null)
  const [closeTime, setcloseTime] = React.useState(null)
  const [res_UUID, setres_UUID] = React.useState(null)



  const queryParams = new URLSearchParams(window.location.search);
  const managerString = queryParams.get('manager');
  const manager = managerString ? JSON.parse(decodeURIComponent(managerString)) : null;


  //Variables
  let currentManager = manager;
  let username = currentManager?.username

  let activity = 0

  // get the res_UUID from the manager database
  instance.post('/getCorrespondingRestaurant', {
    "username": username
  }).then(function (response) {

    setres_UUID(response.data.result.body[0].res_UUID)

    // get restaurant data from the All_Restaurants table
    instance.post('/managerGetRestaurantData', {
      "res_UUID": res_UUID
    }).then(function (response) {
      let status = response.data.statusCode


      if (status == 200) {
        activity = response.data.result.body[0].isActive

        setrestaurantName(response.data.result.body[0].restaurantName || "No Name")
        setAddress(response.data.result.body[0].address || "No Address")
        setstartTime(response.data.result.body[0].openTime || "null")
        setcloseTime(response.data.result.body[0].closeTime || "null")

        // change the display if the restaurant is active
        if (activity == 1) {
          setisActive(true)
        }
      }

    }).catch(function (error) {
      console.log(error)
    })

  }).catch(function (error) {
    console.log(error)
  })



  // REACT COMPONENTS
  function EditRestaurantTime() {
    let openTimeInput = document.getElementById("openingTime") as HTMLInputElement
    let closeTimeInput = document.getElementById("closingingTime") as HTMLInputElement

    instance.post('/restaurant/editTime', {
      "openingTime": openTimeInput.value, "closingTime": closeTimeInput.value
    })
      .then(function (response) {


        andRefreshDisplay()
      })
      .catch(function (error) {
        console.log(error)
      })
  }


  function ActiveRestaurant() {
    instance.post('/activateRestaurant', {
      "res_UUID": res_UUID
    })
      .then(function (response) {

      })
      .catch(function (error) {
        console.log(error)
      })
  }

  function RetrieveTables() {
    instance.post('/', {
      "res_UUID": res_UUID
    }).then(function (response) {
      let status = response.data.statusCode

      if (status == 200) {
        
      }


    }).catch(function (error) {
      console.log(error)
    })
  }

  function TablesList(props:any) {
    if(!props.tables) return <div>No tables to display</div>
    return (
    <ul>
      {
      // list of tables
      }
    </ul>
    )
  }




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
          {/* Signs */}
          <label className="inactive-sign">INACTIVE</label>
          <label className="changeTime-sign">Change Schedule</label>
          {/* Signs */}
          <div className="restaurant-info">
            <label className="restaurant-name">Restaurant Name: {restaurantName}</label>
            <label className="restaurant-address">Address: {address}</label>
            <label className="restaurant-opentime">Opens at: {startTime}</label>
            <label className="restaurant-closetime">Closes at: {closeTime}</label>
          </div>
          <div className="time-edits">
            <label className="openTime-label">Opening Time </label>
            <input className="openTime-input" id="openingTime" type="text" placeholder="Enter Opening Time" />
            <label className="closeTime-label">Closing Time</label>
            <input className="closeTime-input" id="closingTime" type="text" placeholder="Enter Closing Time" />
            <button className="submit-changes" onClick={(e) => EditRestaurantTime}>Submit Changes</button>
          </div>
          <div className="activate">
            <button className="active-button" onClick={(e) => ActiveRestaurant()}>Activate</button>
          </div>
        </div>

        <TablesList ></TablesList>
      </div>
            

    );
  }
}

