import React, { useState, useEffect } from "react";
import axios from "axios";

const Statistics = ({ month }) => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Fetch statistics data based on the month
    axios
      .get(`http://localhost:5000/api/statistics?month=${month}`)
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, [month]);

  return (
    <div className="container mt-5" id="statistics">
      <h2 className="text-center mb-4">Statistics</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Metric</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Sales</td>
                <td>${stats.totalSales || 0}</td>
              </tr>
              <tr>
                <td>Sold Items</td>
                <td>{stats.soldItems || 0}</td>
              </tr>
              <tr>
                <td>Unsold Items</td>
                <td>{stats.unsoldItems || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
