import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Transactions = ({ month }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null); // State for handling errors
  const perPage = 10;

  // Effect to fetch transactions whenever search, month, or page changes
  useEffect(() => {
    fetchTransactions();
  }, [month, page, search]);

  // Function to fetch transactions based on filters
  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/transactions", {
        params: { month, page, perPage, search },
      });
      setTransactions(res.data.transactions);
      setTotal(res.data.total);
      setError(null); // Reset error state on successful fetch
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Error fetching transactions. Please try again later."); // Set error message
    }
  };

  // Handle changes in the search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value); // Update the search state as user types
    setPage(1); // Reset to first page on search
  };

  // Calculate total pages
  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="container mt-4">
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

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

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
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))} // Prevent going below page 1
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-primary"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} // Prevent going above total pages
          disabled={page === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Transactions;
