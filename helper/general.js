import fs from "fs"
import { makeDb } from "../db-config.js";

const db = makeDb();


/**Function to store error in error log file */
export const storeError = async (error) => {
  console.log(error);
  const currentTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  const errorMessage = `${currentTime} - Error: ${error.stack}\n`;
  fs.appendFile("error.log", errorMessage, (err) => {
    if (err) console.error("Error writing to error log:", err);
  });
};


/** Returns true if record exists else false */
export const recordExist = async (table, field, value) => {
    if(!table || !field || !value) {
    throw new Error("Table, field or value is undefined or null");
    }
    const recordExistQuery = `SELECT * FROM ${table} WHERE ${field} = '${value}' AND deleted = 0`;
    const recordExist = await db.query(recordExistQuery);
    return recordExist.length > 0;
  };
  

  export const getRecord = async (table, field, value) => {
    if (!table || !field || !value) {
      throw new Error("Table, field or value is undefined or null");
    }
    const getQuery = `SELECT * FROM ${table} WHERE ${field} = '${value}' AND deleted = 0`;
    const record = await db.query(getQuery);
    return record;
  };
  


  