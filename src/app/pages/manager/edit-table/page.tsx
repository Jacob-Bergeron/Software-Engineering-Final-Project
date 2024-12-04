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
    const [table_UUID, settable_UUID] = React.useState(null)
  
    const andRefreshDisplay = () => {
      forceRedraw(redraw + 1)
    }

    useEffect(() => {
        const storedtableData   
    = sessionStorage.getItem('tableData');
        if (storedtableData) {
          const tableData = JSON.parse(storedtableData);
          settable_UUID(tableData);
        }
      }, []);


return(
    <div>
        
    </div>
)
    





}
