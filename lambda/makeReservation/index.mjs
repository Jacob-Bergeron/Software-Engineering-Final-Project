import mysql from "mysql";
import { v4 as uuidv4 } from 'uuid';

export const handler = async (event) => {
  var pool = mysql.createPool({
    host: "cs3733db.c5ia86k2epli.us-east-2.rds.amazonaws.com",
    user: "cs3733",
    password: "database720$",
    database: "Tables4u",
  });


  // First need to check that the desired reservation slot is available
  // Pass the table_UUID and check the TableInfo to see if the table is booked at that day and time

  let checkAvailability = (table_UUID, date, timeStart) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT isBooked FROM TableInfo WHERE table_UUID = ? AND date = ? AND timeStart = ? ",
        [table_UUID, date, timeStart],
        (error, rows) => {
          if (error) {
            return reject(error);
          }
          return resolve(rows);
        }
      );
    });
  };


  // If available
  let makeReservation = (consumer_UUID, email, sixDigitCode, resName, table_UUID, date, timeStart, numGuests) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO Consumer_Accounts (consumer_UUID, email, hasReservation, sixDigitCode, resName, table_UUID, date, bookingTime, numGuests) VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?)",
        [consumer_UUID, email, sixDigitCode, resName, table_UUID, date, timeStart, numGuests],
        (error, rows) => {
          if (error) {
            return reject(error);
          }
          return resolve(sixDigitCode);
        }
      );
    });
  };


  let response;

  let isBooked = await checkAvailability(event.table_UUID, event.date, event.timeStart)

  // if isBooked == 1 then we cannot make a reservation for that time
  if(isBooked == 1){
    response = {
      statusCode: 400,
      error: "Reservation already booked"
    }
    } else {
      try{
        let consumer_UUID = uuidv4() 
        let sixDigitCode = Math.floor(100000 + Math.random() * 900000)
        const ans = await makeReservation(consumer_UUID, event.email, sixDigitCode, event.resName, event.table_UUID, event.date, event.timeStart, event.numGuests);
        response = {
          statusCode: 200,
          result: {
            body: ans
          },
        };
      } catch(error){
        response = {
          statusCode : 400,
          error : error.message
        };
      }
    }

  pool.end(); // close DB connections

  return response;
};
