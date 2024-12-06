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

  const [isActive, setisActive] = React.useState(false);
  const [restaurantName, setrestaurantName] = React.useState(null)
  const [address, setAddress] = React.useState(null)
  const [startTime, setstartTime] = React.useState(null)
  const [closeTime, setcloseTime] = React.useState(null)
  const [res_UUID, setres_UUID] = React.useState(null)
  const [openTimeInput, setOpenTimeInput] = React.useState("");
  const [closeTimeInput, setCloseTimeInput] = React.useState("");
  const [tableNumberInput, setTableNumber] = React.useState("");
  const [numSeatsInput, setNumSeats] = React.useState("");
  const [username, setUsername] = useState("")
  const [obj, setObj] = useState<any[]>([]);
  const [isPopupVisible, setisPopupVisible] = React.useState(false)
  const [tableInfo, settableInfo] = React.useState("")
  const router = useRouter();


  useEffect(() => {
      const storedManagerData   
  = sessionStorage.getItem('managerData');
      if (storedManagerData) {
        const currentManager = JSON.parse(storedManagerData);
        setUsername(currentManager.username);
      }
    }, []);

  // get the res_UUID from the manager database
  instance.post('/getCorrespondingRestaurant', {
    "username": username
  }).then(function (response) {

    setres_UUID(response.data.result.body[0].res_UUID || "null")

    // get restaurant data from the All_Restaurants table
    instance.post('/managerGetRestaurantData', { 
      "res_UUID": res_UUID
    }).then(function (response) {
      let status = response.data.statusCode


      if (status == 200) {
        let activity = response.data.result.body[0].isActive

        setrestaurantName(response.data.result.body[0].restaurantName || "No Name")
        setAddress(response.data.result.body[0].address || "No Address")
        setstartTime(response.data.result.body[0].openTime || "null")
        setcloseTime(response.data.result.body[0].closeTime || "null")

        // change the display if the restaurant is active
        if (activity == 0) {
          setisActive(false)
        }
        else if (activity == 1){
          setisActive(true)
          console.log(res_UUID)
          localStorage.setItem('managerID', JSON.stringify(res_UUID));
          router.push('/pages/manager/active-homepage')
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

  async function createTable() {
    try {
      const response = await instance.post('/restaurant/createTable', {
        "res_UUID": res_UUID, "tableNumber" : tableNumberInput, "numSeats" : numSeatsInput, "table_UUID" : uuidv4()
      });
      alert("Successfuly Created Table")
      retrieveTables()
      andRefreshDisplay()
    }
    catch (error) {
      console.log(error)
    }

  }

  async function ActiveRestaurant() {

    try {
      const response = await instance.post('/restaurant/activate', {
        "res_UUID": res_UUID,
      });
      if( response.status == 200){
        alert("Restaurant Activated")
        andRefreshDisplay();
      }else{ 
        alert("Activation Failed")
        andRefreshDisplay();
      }
    }
    catch (error) {
      console.log(error)
    }

  }

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


  function retrieveTables() {
    if (!(res_UUID === null)){
      instance.post('/restaurant/getTables', {
        "res_UUID": res_UUID,
      }).then(function (response) {
        const status = response.data.statusCode;
        if (status === 200) {
          setObj(response.data.body)          
        } else {
          alert("Failed to retrieve tables.");
        }

      }).catch(function (error) {
        alert("Error retrieving tables.");
        console.error(error);
      });
  }
  else{
    alert("res_UUID is null")
  }
}

  function editTable(table_UUID : any){
    modelInstance.setTable(table_UUID,res_UUID);
    setisPopupVisible(true)
  }

  function closePopup() {
    setisPopupVisible(false);
  }

  const renderPopup = () => {
    if (!isPopupVisible) return null; 
    return (
      <div className="edit-tablePopup">
        <div>
          <button className = "close-edit-tablePopup-Button" onClick={closePopup}>Close</button>
        </div>

        <div>
        <input className="edit-tableInput" type="text"
              value={tableInfo} onChange={(e) => settableInfo(e.target.value)} placeholder="Enter New Number of Tables" />
        <button className = "edit-tableInputButton" onClick={submitEditTable}>Submit</button>
        </div>
      </div>
    );
  };

  function submitEditTable(){
    let table_UUID = modelInstance.getTable()?.table_UUID;
    if (parseInt(tableInfo,10) > 9 || parseInt(tableInfo,10) < 1){
      alert("Invalid seat number. (1-8) Required")
    }
    else{
    instance.post('/restaurant/editTable', {
      "table_UUID" : table_UUID, "numSeats" : tableInfo
    }).then(function (response) {
      const status = response.data.statusCode;
      if (status === 200) {
        andRefreshDisplay()
        closePopup()
        retrieveTables()
        alert("Successfully Edited Table")
      } else {
        alert("Failed to retrieve table.");
      }

    }).catch(function (error) {
      alert("Error retrieving table.");
      console.error(error);
    });
  }
  }

  // HTML
  
    return (
      <div>
        <div className="inactive-restaurant">
          {/* Signs */}
          <label className="inactive-sign">INACTIVE</label>
          <label className="changeTime-sign">Change Schedule</label>
          <label className="createTable-sign">Create Table</label>
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
          {/* Create Table */}
          <div className="create-table">
            <label className="tableNumber-label">Table Number</label>
            <input className="tableNumber-input" id="tableNumber" type="text"
              value={tableNumberInput} onChange={(e) => setTableNumber(e.target.value)} placeholder="Enter Table Number" />
            <label className="numSeats-label"> Number of Seats </label>
            <input className="numSeats-input" id="numSeats" type="text"
              value={numSeatsInput} onChange={(e) => setNumSeats(e.target.value)} placeholder="Enter Table Number" />
            <button className="createTable-button" onClick={createTable}>Create Table</button>
          </div>
          {/* Delete Restaurant */}
          <div className="delete-restaurant">
            <button className="delete-button" onClick={deleteRestaurant}>Delete Restaurant?</button>
          </div>
          {/* Activate the Restaurant */}
          <div className="activate-outside">
            <button className="activate-button" onClick={ActiveRestaurant}>Activate Restaurant</button>
          </div>
          {/* Table Info*/ }
          <div className = "view-tablesButton">
            <button className="view-tables" onClick={retrieveTables}>Click Here To View Tables</button>
          </div>


          <div className="table-info"> 
          <h1>Available Tables:</h1>
                <ul>
                    {obj.map((obj) => (
                        <li style={{ backgroundColor: 'gray', marginBottom: 8, padding: 3 }} key={obj.table_UUID}>
                            <p>Table: {obj.tableNumber}</p>
                            <p>Number of Seats: {obj.numSeats}</p>
                            <button className = "edit-tableButton" onClick={() => editTable(obj.table_UUID)}>Edit Table</button>
                        </li>
                    ))}

                </ul>
            
          </div>
          {/*Edit Table*/}
          {renderPopup()}



        </div>
      </div >
    );
  }

