import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ month }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
    .get(`http://localhost:5000/api/bar-chart?month=${month}`)

      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [month]);

  const chartData = {
    labels: data.map((item) => item.range),
    datasets: [
      {
        label: "Number of Items",
        data: data.map((item) => item.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Bar Chart: Number of Items in Price Ranges",
      },
    },
  };

  return (
    <div className="container my-4 mt-5" id="bar">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-center fs-3 ">Bar Chart</h5>
              <div style={{ height: "300px", width: "100%" }}>
                <Bar data={chartData} options={options} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;