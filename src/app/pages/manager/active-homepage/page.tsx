'use client'                     // NEED THIS to be able to embed HTML in TSX file
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { modelInstance } from '../../../../model';
import './style.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';


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

    const [restaurantName, setrestaurantName] = React.useState("")
    const [address, setAddress] = React.useState("")
    const [startTime, setstartTime] = React.useState("")
    const [closeTime, setcloseTime] = React.useState("")
    const [res_UUID, setres_UUID] = React.useState("")
    const [closedDates, setClosedDates] = React.useState<any[]>([]);
    const [closeDate, setCloseDate] = useState("")
    const router = useRouter();
    


    //Get res_UUID
    useEffect(() => {
        const storedManagerID   = localStorage.getItem('managerID');
        if (storedManagerID) {
          const currentManager = JSON.parse(storedManagerID);
          setres_UUID(currentManager);
        }
      }, []);


    console.log(res_UUID)
    instance.post('/managerGetRestaurantData', {
        "res_UUID": res_UUID
      }).then(function (response) {
      let status = response.data.statusCode
  
  
      if (status == 200) {  

        setrestaurantName(response.data.result.body[0].restaurantName || "No Name")
        setAddress(response.data.result.body[0].address || "No Address")
        setstartTime(response.data.result.body[0].openTime || "null")
        setcloseTime(response.data.result.body[0].closeTime || "null")
      }
  
    }).catch(function (error) {
      console.log(error)
    })


    const deleteRestaurant = async () => {
      try{
        const response = await instance.post('/restaurant/delete', {
          res_UUID
        });
        if (response.status == 200){
          alert("Restaurant deleted.")
          router.push('/pages/login-page');
        } else{
          alert("Restaurant deletion failed!");
          andRefreshDisplay()        
        }
      } catch (err){
        // Handle and log network errors
        if (axios.isAxiosError(err)) {
          console.error("Axios Error:", err.message);
          console.error("Error Response:", err.response);
          console.error("Error Request:", err.request);
      } else {
          console.error("Unexpected Error:", err);
      }
      }
    }

    function getClosedDates(){
      instance.post('/restaurant/getClosedDates', {
        "res_UUID": res_UUID,
      }).then(function (response){
      if (response.status === 200) {
        console.log(response.data.body)
        setClosedDates(response.data.body);
        console.log("Closed dates data:", closedDates)
        
      } else {
        
        console.log("Error fetching closed dates");
      }
    }).catch (function(error) {
      
      console.error("Error fetching closed dates:", error);
    });
  };

    function reopenDate(dateInput : Date){
      const currentDate = new Date()
      if (currentDate <= new Date(dateInput)) {

        instance.post('/managerOpenDay', {
            "res_UUID" : res_UUID, "date" : dateInput
        }).then(function (response) {
            let status = response.data.statusCode

            //if successful in reaching database AND there is something in the payload coming to client
            if (status == 200 && response.data.result) {
                alert("Sucessfully re-opened day")
                getClosedDates()
            }
            else {
                alert("400 or invalid response")
            }

        }).catch(function (error) {
            console.log(error)
        })
    } else {
        alert("Cannot input current or past day")
    }
    }

    function closeFutureDate(){
      let dateInput = closeDate
      // if the dateInput is tomorrow or future 
      const currentDate = new Date()
      if (currentDate <= new Date(dateInput)) {

          instance.post('./managerCloseDay', {
              "res_UUID" : res_UUID, "date" : dateInput
          }).then(function (response) {
              let status = response.data.statusCode

              //if successful in reaching database AND there is something in the payload coming to client
              if (status == 200 && response.data.result) {
                  alert("Sucessfully closed day")
                  getClosedDates()
              }
              else {
                  alert("400 or invalid response")
              }

          }).catch(function (error) {
              console.log(error)
          })
      } else {
          alert("Cannot input current or past day")
      }
    }

    const goToAvailabilityPage = (res_UUID : string, restaurantName : string) => {
      localStorage.setItem('res_UUID', res_UUID);
      localStorage.setItem('restaurantName', restaurantName);
      router.push('/pages/administrator/view-restaurants/availability');    //navigate 
    }



    return(
      <div>
        <div className="active-restaurant">
              <label className="active-sign">ACTIVE</label>
              <div className="restaurant-info">
                  <label className="restaurant-name">Restaurant Name: {restaurantName}</label>
                  <label className="restaurant-address">Address: {address}</label>
                  <label className="restaurant-opentime">Opens at: {startTime}</label>
                  <label className="restaurant-closetime">Closes at: {closeTime}</label>
              </div>
              {/* Delete Table */}
            <div className="delete-restaurant">
              <button className="delete-button" onClick={deleteRestaurant}>Delete Restaurant?</button>
            </div>

          {/*Closed Days*/}
          <div className="closed-dates-active">
            <button className = "closedDatesButton" onClick={getClosedDates}>Get Closed Dates</button>
            <h2>Closed Dates:</h2>
            <ul>
              {closedDates.map((closedDates) => (
                  <li key={closedDates.date} className = "closed-date-item">
                    <p>{closedDates.date}</p>
                    <button className = "reopen-button" onClick={(e) => reopenDate(closedDates.date)}>Reopen</button>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className = "close-date">
              <p className = "close-dateLabel">Close Future Date</p>
              <input className = "close-dateInput" onChange={(e) => setCloseDate(e.target.value)} 
              style={{ color: "black", textAlign: 'center' }} placeholder="Enter Date (yyyy-mm-dd)"></input>
              <button className = "close-dateButton" onClick={closeFutureDate}>Submit</button>
          </div>

            <button className = "avalButton" onClick={ () => goToAvailabilityPage(res_UUID, restaurantName)}>Generate Availability Report</button>


        </div>
      </div >
    );
}