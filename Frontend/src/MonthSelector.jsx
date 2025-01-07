import React, { useState } from "react";

const monthMapping = {
  "January": "01",
  "February": "02",
  "March": "03",
  "April": "04",
  "May": "05",
  "June": "06",
  "July": "07",
  "August": "08",
  "September": "09",
  "October": "10",
  "November": "11",
  "December": "12",
};

const MonthSelector = ({month,setMonth}) => {
   // default is March

  const handleMonthChange = (e) => {
    setMonth(e.target.value); // Set the numeric value to state
  };

  return (
    <label>
      Select Month:
      <select value={month} onChange={handleMonthChange}>
        {Object.entries(monthMapping).map(([monthName, monthValue]) => (
          <option key={monthValue} value={monthValue}>
            {monthName} {/* Display the month name */}
          </option>
        ))}
      </select>
    </label>
  );
};

export default MonthSelector;