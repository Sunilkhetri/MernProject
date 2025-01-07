import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Transactions = ({ month }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 10;

  // Effect to fetch transactions whenever search, month, or page changes
  useEffect(() => {
    fetchTransactions();
  }, [month, page, search]);

  // Function to fetch transactions based on filters
  const fetchTransactions = () => {
    axios
      .get("http://localhost:5000/api/transactions", {
        params: { month, page, perPage, search },
      })
      .then((res) => {
        setTransactions(res.data.transactions);
        setTotal(res.data.total);
      })
      .catch((err) => console.error("Error fetching transactions:", err));
  };

  // Handle changes in the search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value); // Update the search state as user types
  };

  // Calculate total pages
  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="container mt-4 ">
      <h2 className="mb-3 text-center">Transactions</h2>
      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Title, Description, or Price"
          value={search}
          onChange={handleSearchChange} // Trigger fetch on input change
        />
      </div>

      {/* Transactions Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((txn, index) => (
                <tr key={index}>
                  <td>{txn._id || "N/A"}</td>
                  <td>{txn.title}</td>
                  <td>{txn.description}</td>
                  <td>${txn.price}</td>
                  <td>{txn.category}</td>
                  <td>{txn.sold ? "Yes" : "No"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No Transactions Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-primary"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-primary"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Transactions;