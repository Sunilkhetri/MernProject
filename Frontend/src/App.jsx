import React, { useState, useEffect } from "react";
import Transactions from "./Transactions";
import Statistics from "./Statistics";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import MonthSelector from "./MonthSelector";
import './App.css'

const App = () => {
  const [month, setMonth] = useState("01");
  

  return (
    <div>
      <h1>Product Dashboard</h1>
      <MonthSelector month={month} setMonth={setMonth}/>
      
      <Transactions month={month} />
      <Statistics month={month} />
      <BarChart month={month} />
      <PieChart month={month} />
     
    </div>
  );
};

export default App;