'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React, { useEffect, useState } from 'react';
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
  const [openTimeInput, setOpenTimeInput] = React.useState("");
  const [closeTimeInput, setCloseTimeInput] = React.useState("");


  const [username, setUsername] = useState('');

useEffect(() => {
    const storedManagerData   
 = sessionStorage.getItem('managerData');
    if (storedManagerData) {
      const currentManager = JSON.parse(storedManagerData);
      setUsername(currentManager.username);
    }
  }, []);

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
  async function EditRestaurantTime() {


    try {
      const response = await instance.post('/restaurant/editTime', {
        "openTime": openTimeInput, "closeTime": closeTimeInput, "res_UUID": res_UUID
      });

      andRefreshDisplay()
      alert("success")
    }
    catch (error) {
      alert("error")
      console.log(error)
    }
  }


  async function ActiveRestaurant() {

    try {
      const response = await instance.post('/restaurant/activate', {
        "res_UUID": res_UUID
      });

      andRefreshDisplay()
    }
    catch (error) {
      console.log(error)
    }

  }

  async function retrieveTables(setTables: any) {
  instance
    .post('/restaurant/getTables', {
      res_UUID: res_UUID,
    })
    .then(function (response) {
      const status = response.data.statusCode;
      if (status === 200) {
        const tables = response.data.result.body;
        if (tables.length > 0) {
          
        } else {
          alert("No tables found.");
        }
      } else {
        alert("Failed to retrieve tables.");
      }

    })
    .catch(function (error) {
      alert("Error retrieving tables.");
      console.error(error);
    });
}

const TablesList = () => {
  

  return (
    <div>
      <h1>Tables</h1>
      
    </div>
  );
};




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
          {/* Restaurant Info Display */}
          <div className="restaurant-info">
            <label className="restaurant-name">Restaurant Name: {restaurantName}</label>
            <label className="restaurant-address">Address: {address}</label>
            <label className="restaurant-opentime">Opens at: {startTime}</label>
            <label className="restaurant-closetime">Closes at: {closeTime}</label>
          </div>
          {/* Change the Time */}
          <div className="time-edits">
            <label className="openTime-label">Opening Time </label>
            <input className="openTime-input" id="openingTime" type="text"
              value={openTimeInput} onChange={(e) => setOpenTimeInput(e.target.value)} placeholder="Enter Opening Time" />
            <label className="closeTime-label">Closing Time</label>
            <input className="closeTime-input" id="closingTime" type="text"
              value={closeTimeInput} onChange={(e) => setCloseTimeInput(e.target.value)} placeholder="Enter Closing Time" />
            <button className="submit-changes" onClick={EditRestaurantTime}>Submit Changes</button>
          </div>
          {/* Activate the Restaurant */}
          <div className="activate-outside">
            <button className="activate-button" onClick={ActiveRestaurant}>Activate Restaurant</button>
          </div>
          {/* Table Info*/ }
          <div className="table-info"> 
            <h1>table info</h1>
            <TablesList/>
          </div>
        </div>
      </div >
    );
  }
}

